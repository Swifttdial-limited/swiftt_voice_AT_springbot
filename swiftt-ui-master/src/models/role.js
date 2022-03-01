import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from './common';

import { queryOne, applyAction } from '../services/roles';

export default modelExtend(resourceModel, {

  namespace: 'role',

  state: {
    modalVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/system-administration/role/view/:publicId').exec(location.pathname);
        if (match) {
          dispatch({ type: 'query', payload: { publicId: match[1] } });
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryOne, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data,
            },
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure ' });
      }
    },
    *applyAction({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const id = yield select(({ role }) => role.data.publicId);
      const updateData = { payload, publicId: id };
      try {
        const data = yield call(applyAction, updateData);
        if (data) {
          yield put({ type: 'query', payload: { publicId: data.publicId } });
        }
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
    showEditModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideEditModal(state) {
      return { ...state, modalVisible: false };
    },
  },
});
