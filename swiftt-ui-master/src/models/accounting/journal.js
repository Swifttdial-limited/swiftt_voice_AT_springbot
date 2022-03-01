import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import modelExtend from 'dva-model-extend';
import { notification } from 'antd';
import { collectionModel } from '../common';

import { create, queryManualEntries, queryTrialBalanceReport } from '../../services/accounting/journals';

export default modelExtend(collectionModel, {

  namespace: 'journal',

  state: {
    journalsSaveLoading: false,
  },

  subscriptions: {},

  effects: {
    * queryJournalLines({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryManualEntries, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              [payload.referenceId]: [...data.content],
              pagination: { current: data.number,
                total: data.totalElements,
                pageSize: data.numberOfElements,
              },
            },
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
  },
});
