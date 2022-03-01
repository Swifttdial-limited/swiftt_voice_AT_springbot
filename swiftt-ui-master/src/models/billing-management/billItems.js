import modelExtend from 'dva-model-extend';
import { message, notification } from 'antd';
import { collectionModel } from '../common';

import { queryVisitBillItems, postActions, getSalesReceipts, printInvoicePdf } from '../../services/billing-management/bills';
import { applyAction } from '../../services/encounters';
import { base64ToArrayBuffer } from '../../utils/utils'



export default modelExtend(collectionModel, {

  namespace: 'billItems',

  state: {
    modalVisible: false,
    receipt: {
      activeReferenceId: '',
    },
  },

  subscriptions: {},

  effects: {
    *fetchVisitBillItems({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryVisitBillItems, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            activeVisitId: payload.visitId,
            [payload.visitId]: [...data.content],
            pagination: { current: data.number, total: data.totalElements },
          },
        });
        yield put({ type: 'cashPayments/handeleActiveEncounter',  activeVisit:  payload.visitId });
      }
    },
    *payments({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(postActions, payload);
        yield put({ type: 'hideLoading' });
        notification.success({
          message: 'Success ',
          description: 'Payment was received successful',
        });
        yield put({ type: 'bills/fetchBills', payload }); //RELOAD VISISTS
        yield put({ type: 'hideModal' });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *generateInvoices({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        console.log('model generateInvoices');
        yield call(applyAction, payload);
        console.log("payload =>>", payload);
        yield put({ type: 'hideLoading' });
        notification.success({
          message: 'Success ',
          description: 'Invoice processed successful',
        });

        yield put({ // get processed encounters visits
          type: 'bills/fetchBills',
          payload: {
            billPaymentType: 'CREDIT',
            billItemStatus: 'PENDING_INVOICE_PAYMENT',
            isRecorded: true,
          },
        });

        yield put({ // get visit invoices for the visit
          type: 'invoices/fetchByReferenceId',
          payload: {
            sourceReferenceId: payload.encounterId,
            billPaymentType: 'CREDIT',
            isRecorded: true,
            activeVisitKey: payload.encounterId,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *printInvoice({ payload }, { call, put }){
      const data = yield call(printInvoicePdf, payload);
      console.log(data);
        var blob = new Blob([base64ToArrayBuffer(data)], { type: 'application/pdf' });
        // var   url = window.URL.createObjectURL(blob);
      
      //Create a Blob from the PDF Stream
    // const file = new Blob(
      // [response.data], 
      // {type: 'application/pdf'});
    //Build a URL from the file`
    const fileURL = URL.createObjectURL(blob);
    //Open the URL on new Window
    window.open(fileURL);
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false, billingBtnLoading: false };
    },
  },
});
