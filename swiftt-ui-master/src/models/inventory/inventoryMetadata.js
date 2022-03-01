import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import { query, applyAction } from '../../services/inventory/inventoryMetadata';

export default modelExtend(collectionModel, {

  namespace: 'inventoryMetadata',

  state: {},

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
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
    },
    *fetchBalancesAndCost({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, payload);
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {},

});
