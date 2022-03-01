import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from './common';
import { create, query, update } from '../services/institutions';

export default modelExtend(collectionModel, {

  namespace: 'institutions',

  state: {},

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
              institutionDetails: data.content[0] ? data.content[0] : {},
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'queryFailure',
          payload: {
            errorMessage: error.responseJSON ? error.responseJSON : 'Ooopss!',
          },
        });
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data) {
        yield put({ type: 'query' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(update, payload);
      if (data) {
        yield put({ type: 'query' });
      }
    },
  },

  reducers: {},

});
