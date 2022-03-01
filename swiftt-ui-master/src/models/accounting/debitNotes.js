import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import modelExtend from 'dva-model-extend';
import { notification } from 'antd';
import { collectionModel } from '../common';

import {
  query,
  queryCreditNoteEntryLines
} from '../../services/accounting/debitNotes';

export default modelExtend(collectionModel, {

  namespace: 'debitNotes',

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
              pagination: {
                current: data.number,
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
