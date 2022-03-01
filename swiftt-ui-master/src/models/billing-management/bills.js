import modelExtend from 'dva-model-extend';
import { message, notification } from 'antd';
import { parse } from 'qs';
import { collectionModel } from '../common';
import { queryBills, postRequestToBills, queryInvoices, queryCustomerReceipts } from '../../services/billing-management/bills';
import { routerRedux } from 'dva/router';


export default modelExtend(collectionModel, {

  namespace: 'bills',

  state: {
    modalVisible: false,
    postBillingBtnLoading: false,
    isRecorded: false,
    activeVisitKey: '',
    activeVisit: {},
  },

  subscriptions: {},

  effects: {
    *postRequestItemToBills({ payload }, { call, put }) { // billing v2
      yield put({ type: 'showLoading' });
      yield call(postRequestToBills, payload);
      notification.success({
        message: 'Success ',
        description: 'Request Items were billed successful',
      });
      yield put({
        type: 'requestItems/query',
        payload: {
          id: payload.requestId,
        },
      });
      yield put({
        type: 'querySuccess',
        payload: {},
      });
    },
    *fetchBills({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryBills, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: { current: data.number, total: data.totalElements },
            ...payload,
          },
        });
      }
    },
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
      }
    },
    // todo move this to invoice model and remodel the view logic for processing and invoice
    *fetchInvoices({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryInvoices, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: { current: data.number, total: data.totalElements },
            billItemStatus: 'PROCESSED',
            isRecorded: true,
          },
        });
      }
    },
    *handleBillingView({ payload }, { call, put }) {
      yield put({
        type: 'querySuccess',
        payload,
      })
    }
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
