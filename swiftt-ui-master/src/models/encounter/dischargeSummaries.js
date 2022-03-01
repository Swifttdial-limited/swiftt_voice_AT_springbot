import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import { queryDischargeSummaries } from '../../services/encounters';

export default modelExtend(collectionModel, {

  namespace: 'dischargeSummaries',

  state: {},

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryDischargeSummaries, parse(payload));
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
