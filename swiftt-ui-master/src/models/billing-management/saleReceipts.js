import modelExtend from 'dva-model-extend';
import { message, notification } from 'antd';
import { parse } from 'qs';
import { collectionModel } from '../common';
import { queryCustomerReceipts } from '../../services/billing-management/bills';
import { routerRedux } from 'dva/router';


export default modelExtend(collectionModel, {

  namespace: 'saleReceipts',

  state: {
  },

  subscriptions: {},

  effects: {
    *fetchReceipts({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryCustomerReceipts, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: { current: data.number, total: data.totalElements },
            ...payload,
          },
        });
        //Set the active visit encounter clicked
        yield put({ type: 'cashPayments/handeleActiveEncounter', activeVisit: payload.visitId });
      }
    },
    *fetchReceipt({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryCustomerReceipts, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: data.content,
            pagination: { current: data.number, total: data.totalElements },
            ...payload,
          },
        });
        yield put({ type: 'cashPayments/handeleActiveEncounter', activeVisit: payload.visitId });
      }
    },
  },
});
