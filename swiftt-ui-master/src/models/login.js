import { routerRedux } from 'dva/router';

import { login } from '../services/app';
import { applyAction } from '../services/profile';
import { setAuthority } from '../utils/authority';

export default {

  namespace: 'login',

  state: {
    loading: false,
    status: undefined,
    currentUser: {
      notifyCount: 2,
    },
  },

  effects: {
    *authentication({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const response = yield call(login, payload);
        if (response) {
          yield put({
            type: 'changeAuthenticationStatus',
            payload: Object.assign({}, { username: payload.username, password: payload.password }, response),
          });

          if (response.access_token) {

            if(response.roles.length == 1) {
              yield put({
                type: 'authorization',
                payload: { username: payload.username, password: payload.password, role: response.roles[0].publicId }
              });
            } else if(response.roles.length == 0) {
              // TODO crickets?? what do we do with a user who has no role
            } else {
              yield put(routerRedux.push('/authentication/authorization'));
            }

          }
        }
        yield put({ type: 'hideLoading' });
      } catch (e) {
        yield put({ type: 'hideLoading' });
      }
    },
    *authorization({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(login, payload);

      setTimeout(() => {
        //dispatch({ type: 'logout' })
      }, response.expires_in * 1000);

      yield put({
        type: 'changeAuthorizationStatus',
        payload: response,
      });

      // Login successfully
      if (response.access_token) {
        // Login success after permission changes to admin or user
        // The refresh will automatically redirect to the home page

        if (!response.forcePasswordReset) {
          yield put(routerRedux.push('/'));
          yield put({ type: 'institution/queryMyInstitution' });
        } else {
          yield put(routerRedux.push('/authentication/password-reset'));
        }

        yield put({ type: 'hideLoading' });
      }
    },
    *forcedPasswordReset({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, payload);

        // do not redirect if theres an error
        yield put(routerRedux.push('/'));
        yield put({ type: 'hideLoading' });
      } catch (e) {
        console.log('Update failed. ', e);
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);

        // add the parameters in the url
        //urlParams.searchParams.set('redirect', pathname);

        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        sessionStorage.removeItem('o_t');
        sessionStorage.removeItem('current_user');
        sessionStorage.setItem('antd-pro-authority', 'guest');
        yield put(routerRedux.push('/authorization'));
        // Login out after permission changes to admin or user
        // The refresh will automatically redirect to the login page
        yield put({
          type: 'changeAuthenticationStatus',
          payload: {
            status: false,
            loading: false,
            currentUser: {},
            currentAuthority: 'guest',
          },
        });
      }
    },
  },

  reducers: {
    showLoading(state, action) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    changeAuthenticationStatus(state, { payload }) {
      setAuthority(JSON.stringify(payload.authorities));
      return {
        ...state,
        status: payload.status,
        currentUser: {
          username: payload.username,
          password: payload.password,
          fullName: payload.fullName,
          roles: payload.roles,
          token: payload.access_token,
        },
      };
    },
    changeAuthorizationStatus(state, { payload }) {
      setAuthority(JSON.stringify(payload.authorities));
      sessionStorage.setItem('o_t', payload.access_token);
      const currentUser = {
        department: payload.roles[0].department,
        fullName: payload.fullName,
        u_pid: payload.publicId,
        role: payload.roles[0].name,
      };
      sessionStorage.setItem('current_user', JSON.stringify(currentUser));
      return {
        ...state,
        status: payload.status,
        currentUser: {
          ...state.currentUser,
          password: undefined,
          username: undefined,
          department: payload.roles[0].department,
          role: payload.roles[0].name,
        },
      };
    },
  },
};
