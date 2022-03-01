import React from 'react';
import { routerRedux, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import dynamic from 'dva/dynamic';

import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);

  const AuthenticationLayout = routerData['/authentication'].component;
  const BasicLayout = routerData['/'].component;

  return (
    <LocaleProvider locale={enUS}>
      <ConnectedRouter history={history}>
        <Switch>

          <AuthorizedRoute
            path="/authentication"
            render={props => <AuthenticationLayout {...props} />}
          />

          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority="LOGIN_AUTHORIZED"
            redirectPath="/authentication"
          />

        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
