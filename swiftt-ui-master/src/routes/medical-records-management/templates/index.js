import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TemplatesList from '../../../components/medical-records-management/templates/List';
import TemplatesSearch from '../../../components/medical-records-management/templates/Search';

@connect(({ templates, loading }) => ({
  templates,
  loading: loading.effects['templates/query'],
}))
class TemplatesManagementView extends PureComponent {

  static propTypes = {
    templates: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'templates/query' });
  }

  render() {
    const { templates, dispatch } = this.props;
    const { loading, list, pagination, success } = templates;

    const templateSearchProps = {
      onSearch(fieldsValue) {
        const payload = {};
        if (fieldsValue.keyword.length > 0) {
          if (fieldsValue.field === 'name') { payload.searchParam = fieldsValue.keyword; }
        }

        dispatch({
          type: 'templates/query',
          payload,
        });
      },
    };

    const templateListProps = {
      dataSource: list,
      loading,
      pagination,
      onPageChange(page) {
        dispatch({ type: 'templates/query',
          payload: {
            page: page.current,
            size: page.pageSize,
          },
        });
      },
      onDeleteItem(id) {
        dispatch({ type: 'templates/delete', payload: id });
      },
      onEditItem(item) {
        dispatch({
          type: 'accounts/showAccountModal',
          payload: {
            accountModalType: 'update',
            currentItem: item,
          },
        });
      },
    };

    return (
      <PageHeaderLayout
        title="Templates"
        content="Form pages are used to collect or verify information from users. Basic forms are common to form scenes with fewer data items."
      >
        <div className="content-inner">
          <Row>
            <Col>
              <TemplatesSearch {...templateSearchProps} />
              <TemplatesList {...templateListProps} />
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default TemplatesManagementView;
