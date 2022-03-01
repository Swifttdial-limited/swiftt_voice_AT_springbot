import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { resourceModel } from '../common';
import { update, query } from '../../services/inventory/inventoryPreferences';

export default modelExtend(resourceModel, {

  namespace: 'inventoryPreferences',

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
              data,
            },
          });
        }
      } catch (error) {
        yield put({
          type: 'queryFailure',
          payload: {
            errorMessage: error.responseJSON ? error.responseJSON : {},
          },
        });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
  },

  reducers: {},

});
