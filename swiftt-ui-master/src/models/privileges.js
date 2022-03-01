import modelExtend from 'dva-model-extend';

import { collectionModel } from './common';

import { create, remove, update, query } from '../services/privileges';
import { parse } from 'qs';

export default modelExtend(collectionModel, {

  namespace: 'privileges',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(query, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.content,
              pagination: { current: data.number, total: data.totalElements },
            },
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {},

});
