import modelExtend from 'dva-model-extend';
import { message, notification } from 'antd';
import { resourceModel } from '../common';


import {
  queryInvoiceDetails,
} from '../../services/billing-management/invoices';
import { applyAction } from '../../services/encounters';

export default modelExtend(resourceModel, {

  namespace: 'invoiceItems',

  state: {
    modalVisible: false,
    receipt: {
      activeReferenceId: '',
    },
  },

  subscriptions: {},

  effects: {
    *fetchInvoiceDetails({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryInvoiceDetails, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            activeReferenceId: payload.customerInvoiceId,
            data
          },
        });
      }
    },
  },
  reducers: {
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false, billingBtnLoading: false };
    },
  },
});
