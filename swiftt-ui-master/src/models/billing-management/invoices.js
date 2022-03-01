import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';

import {
  queryInvoices,
  queryInvoiceDetails,
  queryVisitInvoices,
} from '../../services/billing-management/invoices';
import { message } from 'antd';

export default modelExtend(collectionModel, {

  namespace: 'invoices',

  state: {
    activeVisitId: '',
  },

  subscriptions: {},

  effects: {
    
    *fetchByReferenceId({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryVisitInvoices, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            activeVisitId: payload.visitId,
            [payload.visitId]: [...data.content],
            pagination: { current: data.number, total: data.totalElements },
          },
        });
      }
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
  },
});
