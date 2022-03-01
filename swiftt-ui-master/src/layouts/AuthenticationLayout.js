import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon, Spin } from 'antd';

import GlobalFooter from '../components/GlobalFooter';
import styles from './AuthenticationLayout.less';
import logo from '../assets/syhos-logo.jpg';
import { getRoutes } from '../utils/utils';
import Particles from 'react-particles-js';

const copyright = <div>Copyright <Icon type="copyright" /> 2019</div>;

@connect(({ login, loading }) => ({
  login,
  loading: loading.effects['login/loading']
}))
class AuthenticationLayout extends PureComponent {

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Syhos';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Syhos`;
    }
    return title;
  }
  render() {
    const { login, routerData, match } = this.props;

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.content}>
          <Particles
            params={{
                particles: {
                  number: {
                    value: 10,
                    density: {
                      enable: true,
                      value_area: 800,
                    },
                  },
                  color: {
                    value: '#9347a3',
                  },
                  shape: {
                    type: 'circle',
                    opacity: 0.20,
                    stroke: {
                      width: 0,
                      color: '#9347a3',
                    },
                    polygon: {
                      nb_sides: 5,
                    },
                    image: {
                      src: 'img/github.svg',
                      width: 100,
                      height: 100,
                    },
                  },
                  opacity: {
                    value: 0.30,
                    random: false,
                    anim: {
                      enable: false,
                      speed: 1,
                      opacity_min: 0.12,
                      sync: false,
                    },
                  },
                  size: {
                    value: 6,
                    random: true,
                    anim: {
                      enable: false,
                      speed: 40,
                      size_min: 0.08,
                      sync: false,
                    },
                  },
                  line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#9347a3',
                    opacity: 0.30,
                    width: 1.3,
                  },
                  move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                      enable: false,
                      rotateX: 600,
                      rotateY: 1200,
                    },
                  },
                },
                interactivity: {
                  detect_on: 'canvas',
                  events: {
                    onhover: {
                      enable: true,
                      mode: 'repulse',
                    },
                    onclick: {
                      enable: true,
                      mode: 'push',
                    },
                    resize: true,
                  },
                  modes: {
                    grab: {
                    distance: 400,
                      line_linked: {
                        opacity: 1,
                      },
                    },
                    bubble: {
                      distance: 400,
                      size: 40,
                      duration: 2,
                      opacity: 8,
                      speed: 3,
                    },
                    repulse: {
                      distance: 200,
                      duration: 0.4,
                    },
                    push: {
                      particles_nb: 4,
                    },
                    remove: {
                      particles_nb: 2,
                    },
                  },
                },
              }}
            style={{
                width: '100%',
                position: 'fixed',
              }}
          />
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
          </div>
          <div className={styles.container}>
            <Spin spinning={login.loading} delay={500} tip="Loading....">
              <Switch>
                {getRoutes(match.path, routerData).map(item =>
                  (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  )
                )}
                <Redirect exact from="/authentication" to="/authentication/login" />
              </Switch>
            </Spin>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default AuthenticationLayout;
