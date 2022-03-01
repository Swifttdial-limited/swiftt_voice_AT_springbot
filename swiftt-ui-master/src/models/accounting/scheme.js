import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import { queryOne } from '../../services/accounting/schemes';

export default modelExtend(resourceModel, {

  namespace: 'scheme',

  state: {
    modalVisible: false,
  },

  subscriptions: {},

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
