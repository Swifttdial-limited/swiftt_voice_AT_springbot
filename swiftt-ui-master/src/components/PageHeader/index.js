import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Tabs } from 'antd';
import classNames from 'classnames';
import styles from './index.less';


const { TabPane } = Tabs;

function getBreadcrumb(breadcrumbNameMap, url) {
  let breadcrumb = {};
  Object.keys(breadcrumbNameMap).forEach((item) => {
    if (pathToRegexp(item).test(url)) {
      breadcrumb = breadcrumbNameMap[item];
    }
  });
  return breadcrumb;
}

export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };
  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      routerLocation: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  };
  // Generated according to props
  conversionFromProps= () => {
    const {
      breadcrumbList, linkElement = 'a',
    } = this.props;
    return (
      <Breadcrumb className={styles.breadcrumb}>
        {breadcrumbList.map(item => (
          <Breadcrumb.Item key={item.title}>
            {item.href ? (createElement(linkElement, {
          [linkElement === 'a' ? 'href' : 'to']: item.href,
        }, item.title)) : item.title}
          </Breadcrumb.Item>
      ))}
      </Breadcrumb>
    );
  }
  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { linkElement = 'a' } = this.props;
    // Convert the path to an array
    const pathSnippets = routerLocation.pathname.split('/').filter(i => i);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = (index !== pathSnippets.length - 1) && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            currentBreadcrumb.name,
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    // Add home breadcrumbs to your head
    extraBreadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        {createElement(linkElement, {
        [linkElement === 'a' ? 'href' : 'to']: '/' }, 'Home')}
      </Breadcrumb.Item>
    );
    return (
      <Breadcrumb className={styles.breadcrumb}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  }
  /**
   * ???????????????????????????
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // ???????????? routes ??? params ??????
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
        />
      );
    }
    // ?????? location ?????? ?????????
    // Generate breadcrumbs based on location
    if (location && location.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  }
  // ??????Breadcrumb ?????????
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return (last || !route.component)
      ? <span>{route.breadcrumbName}</span>
      : createElement(linkElement, {
        href: paths.join('/') || '/',
        to: paths.join('/') || '/',
      }, route.breadcrumbName);
  }

  render() {
    const {
      title, logo, action, content, extraContent,
      tabList, className, tabActiveKey,
    } = this.props;
    const clsString = classNames(styles.pageHeader, className);

    let tabDefaultValue;
    if (tabActiveKey !== undefined && tabList) {
      tabDefaultValue = tabList.filter(item => item.default)[0] || tabList[0];
    }
    const breadcrumb = this.conversionBreadcrumbList();
    const activeKeyProps = {
      defaultActiveKey: tabDefaultValue && tabDefaultValue.key,
    };
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }

    return (
      <div className={clsString}>
        {breadcrumb}
        <div className={styles.detail}>
          {logo && <div className={styles.logo}>{logo}</div>}
          <div className={styles.main}>
            <div className={styles.row}>
              {title && <h1 className={styles.title}>{title}</h1>}
              {action && <div className={styles.action}>{action}</div>}
            </div>
            <div className={styles.row}>
              {content && <div className={styles.content}>{content}</div>}
              {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
            </div>
          </div>
        </div>
        {
          tabList &&
          tabList.length && (
            <Tabs
              className={styles.tabs}
              {...activeKeyProps}
              onChange={this.onChange}
            >
              {
                tabList.map(item => <TabPane tab={item.tab} key={item.key} />)
              }
            </Tabs>
          )
        }
      </div>
    );
  }
}
