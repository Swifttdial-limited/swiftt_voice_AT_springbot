import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from './common';
import {
  queryOne,
  update,
  applyAction,
  addRole,
  removeRole,
  createUserSpecialization,
  updateUserSpecialization,
  removeUserSpecialization,
} from '../services/users';

export default modelExtend(resourceModel, {

  namespace: 'user',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/system-administration/user/view/:publicId').exec(location.pathname);
        if (match) {
          dispatch({ type: 'query', payload: { publicId: match[1] } });
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOne, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data,
          },
        });
      } else {
        throw data;
      }
    },
    *update({ payload }, { select, call, put }) {
      try {
        if (payload.userType === 'PATIENT')
          yield put({ type: 'patient/hideEditModal' });
        else {
          yield put({ type: 'hideModal' });
        }

        yield put({ type: 'showLoading' });
        const data = yield call(update, payload);
        if (data) {
          if (payload.userType === 'PATIENT')
            yield put({ type: 'patient/query', payload: { id: payload.patientId } });
          else {
            yield put({ type: 'query', payload: { publicId: data.publicId } });
          }
        }
      } catch (e) {
        yield put({ type: 'queryFailure', payload: { httpStatus: e.httpStatus, message: e.userMessage } });
      }
    },
    *applyAction({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(applyAction, payload);
        if (data) {
          yield put({ type: 'query', payload: { publicId: data.publicId } });
        }
      } catch (e) {
        console.log('Update failed. ', e);
      }
    },
    *addRole({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(addRole, payload);
        if (data) {
          yield put({ type: 'query', payload: { publicId: payload.userPublicId } });
        }
      } catch (e) {
        console.log('Update failed. ', e);
      }
    },
    *removeRole({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(removeRole, payload);
        yield put({ type: 'query', payload: { publicId: payload.userPublicId } });
      } catch (e) {
        console.log('Update failed. ', e);
      }
    },
    *addSpecialization({ payload }, { select, call, put }) {
      try {
        const data = yield call(createUserSpecialization, payload);
      } catch (e) {
        console.log('Update failed. ', e);
      }
    },
    *updateSpecialization({ payload }, { select, call, put }) {
      try {
        const data = yield call(updateUserSpecialization, payload);
      } catch (e) {
        console.log('Update failed');
      }
    },
    *removeSpecialization({ payload }, { select, call, put }) {
      try {
        yield call(removeUserSpecialization, payload);
      } catch (e) {
        console.log('Update failed. ', e);
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
});
