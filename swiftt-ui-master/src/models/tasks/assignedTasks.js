import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';

import { collectionModel } from '../common';
import { query } from '../../services/requests';

export default modelExtend(collectionModel, {

  namespace: 'assignedTasks',

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
              list: data.content,
              pagination: { current: data.number, total: data.totalElements },
            },
          });
        }
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {},

});
