import modelExtend from 'dva-model-extend';
import { message, notification } from 'antd';
import { parse } from 'qs';
import { resourceModel } from '../common';
import { queryCustomerReceipt } from '../../services/billing-management/bills';
import { routerRedux } from 'dva/router';


export default modelExtend(resourceModel, {

  namespace: 'saleReceipt',

  state: {
    modalVisible: false,
    receiptId: null,
  },

  subscriptions: {},

  effects: {
    *fetchReceipt({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryCustomerReceipt, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data
          },
        });
        yield put({ type: 'showReceipt' });
        yield put({ type: 'setCurrentReceipt', payload });
      }
    },
  },
  reducers: {
    showReceipt(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideReceipt(state) {
      return { ...state, modalVisible: false };
    },
    setCurrentReceipt(state, { payload }) {
      return {
        ...state,
        receiptId: payload.saleReceiptId,
      };
    },
  }
});
