import modelExtend from 'dva-model-extend';
import { message, notification } from 'antd';
import { parse } from 'qs';
import { collectionModel } from '../common';
import { queryBills, postRequestToBills, queryInvoices, queryCustomerReceipts } from '../../services/billing-management/bills';
import { routerRedux } from 'dva/router';


export default modelExtend(collectionModel, {

  namespace: 'cashPayments',

  state: {
    modalVisible: false,
    postBillingBtnLoading: false,
    isRecorded: false,
    activeVisit: {},
    encounterType: "UNPROCESSED",
    processedEncounters: [],
    unprocessedEncounters: [],
  },
  subscriptions: {},

  effects: {
    *fetchEncounterBills({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryBills, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            unprocessedEncounters: data.content,
            pagination: { current: data.number, total: data.totalElements },
            ...payload,
          },
        });
      }
    },
    *fetchEncounterReceipts({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryBills, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            processedEncounters: data.content,
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
    tabChange(state, { payload }) {
      return { ...state, ...payload };
    },
    handeleActiveEncounter(state, { activeVisit }) {
      return { ...state, activeVisit }
    }
  },
});
