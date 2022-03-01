import { queryNotices } from '../services/api';
import { login, userInfo, logout } from '../services/app';
import { parse } from 'qs';

// console.log(sessionStorage.getItem('berrAdminSiderFoldRight') == null ? 'false' : sessionStorage.getItem('berrAdminSiderFoldRight'));

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    authenticated: false,
    authorized: false,
    loading: false,
    lock: false,
    user: {},
    loginButtonLoading: false,
    menuPopoverVisible: false,
    siderFold: sessionStorage.getItem('berrAdminSiderFold') === 'true',
    siderFoldRight: sessionStorage.getItem('berrAdminSiderFoldRight') == null ? 'false' : sessionStorage.getItem('berrAdminSiderFoldRight'),
    menuTheme: 'jungle_green',
    headerTheme: 'header_brillant_azure',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(sessionStorage.getItem('navOpenKeys') || '[]'), // The sidebar menu opens the keys
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    // APP MODEL

    *login({ payload }, { call, put }) {
      yield put({ type: 'showLoginButtonLoading' });

      try {
        const data = yield call(login, parse(payload));
        if (data.access_token) {
          yield put({
            type: 'loginSuccess',
            payload: {
              user: {
                username: payload.username,
                password: payload.password,
                roles: data.roles,
                token: data.access_token,
              },
            },
          });
        }
      } catch (e) {
        yield put({ type: 'loginFail' });
      }
    },
    *authorization({ payload }, { call, put }) {
      yield put({ type: 'showLoginButtonLoading' });

      try {
        const data = yield call(login, parse(payload));
        if (data.access_token) {
          // create setTimout that will fire logout action to automatically log out user when token expires
          console.log(`Create automatic timeout here ${data.expires_in}`);
          setTimeout(() => {
            console.log('Oyaa');// dispatch({ type: 'logout' })
          }, data.expires_in);

          yield put({
            type: 'authorizationSuccess',
            payload: {
              department: data.roles[0].department,
              permissions: data.authorities,
              token: data.access_token,
            },
          });
          yield put({ type: 'institutions/query' });
        }
      } catch (e) {
        yield put({ type: 'loginFail' });
      }
    },
    *queryUser({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(userInfo, parse(payload));
      if (data.success) {
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: data.username,
            },
          },
        });
      }
      yield put({ type: 'hideLoading' });
    },
    *logout({ payload }, { call, put }) {
      const data = yield call(logout, parse(payload));
      if (data.success) {
        yield put({ type: 'logoutSuccess' });
      }
    },
    *switchSider({ payload }, { put }) {
      yield put({ type: 'handleSwitchSider' });
    },
    *switchSiderRight({ payload }, { put }) {
      yield put({ type: 'handleSwitchSiderRight' });
    },
    *changeTheme({ payload }, { put }) {
      // console.log(payload.theme);
      yield put({ type: 'handleChangeTheme', payload: { theme: payload.theme } });
    },
    *changeThemeHeader({ payload }, { put }) {
      // console.log(payload.theme);
      yield put({ type: 'handleChangeThemeHeader', payload: { theme: payload.theme } });
    },
    *changeBodyBackground({
      payload,
    }, { put }) {
      yield put({ type: 'handleBodyBackground', payload });
    },
    *changeSignUp({
      payload,
    }, { put }) {
      yield put({ type: 'handleSignUp' });
    },
    *changeNavbar({
      payload,
    }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showNavbar' });
      } else {
        yield put({ type: 'hideNavbar' });
      }
    },
    *switchMenuPopver({ payload }, { put }) {
      yield put({ type: 'handleSwitchMenuPopver' });
    },
    *switchMenuPopverRight({ payload }, { put }) {
      yield put({ type: 'handleSwitchMenuPopverRight' });
    },
  },


  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    // App Model
    loginSuccess(state, action) {
      sessionStorage.setItem('o_t', action.payload.token);
      return {
        ...state,
        ...action.payload,
        authenticated: true,
        loginButtonLoading: false,
      };
    },
    authorizationSuccess(state, action) {
      sessionStorage.setItem('o_t', action.payload.token);
      return {
        ...state,
        ...action.payload,
        authenticated: true,
        authorized: true,
        user: {
          department: action.payload.department,
          permissions: action.payload.permissions,
        },
        loginButtonLoading: false,
      };
    },
    logoutSuccess(state) {
      return {
        ...state,
        authenticated: false,
      };
    },
    loginFail(state) {
      return {
        ...state,
        authenticated: false,
        loginButtonLoading: false,
      };
    },
    showLoginButtonLoading(state) {
      return {
        ...state,
        loginButtonLoading: true,
      };
    },
    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false,
      };
    },
    handleSwitchSider(state) {
      sessionStorage.setItem('berrAdminSiderFold', !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },
    handleSwitchSiderRight(state) {
      sessionStorage.setItem('berrAdminSiderFoldRight', !state.siderFoldRight);
      return {
        ...state,
        siderFoldRight: !state.siderFoldRight,
      };
    },
    handleChangeTheme(state, action) {
      sessionStorage.setItem('berrAdminMenuTheme', action.payload.theme);
      return {
        ...state,
        menuTheme: action.payload.theme,
      };
    },
    handleChangeThemeHeader(state, action) {
      sessionStorage.setItem('berrAdminHeaderTheme', action.payload.theme);
      return {
        ...state,
        headerTheme: action.payload.theme,
      };
    },
    handleBodyBackground(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    handleSignUp(state) {
      return {
        ...state,
        SignUp: !state.SignUp,
      };
    },
    showNavbar(state) {
      return {
        ...state,
        isNavbar: true,
      };
    },
    hideNavbar(state) {
      return {
        ...state,
        isNavbar: false,
      };
    },
    handleSwitchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      };
    },
    handleNavOpenKeys(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
