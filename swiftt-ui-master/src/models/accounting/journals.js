import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import modelExtend from 'dva-model-extend';
import { notification } from 'antd';
import { collectionModel } from '../common';

import {
  create,
  queryManualEntries,
  queryManualEntryLines,
  queryTrialBalanceReport
} from '../../services/accounting/journals';

export default modelExtend(collectionModel, {

  namespace: 'journals',

  state: {
    journalsSaveLoading: false,
    importModalVisible: false,
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryManualEntries, parse(payload));
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
    *create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(create, payload);

        var notificationMessage = 'Journal saved';
        var notificationDescription = 'Journal entry saved successfully';

        if (payload.transactionType === 'PATIENT_DEPOSIT') {
          notificationMessage = 'Patient Deposit';
          notificationDescription = 'Deposit received successfully';
          yield put(routerRedux.push('/billing/deposits'));
        } else if (payload.transactionType === 'REFUND') {
          notificationMessage = 'Refund';
          notificationDescription = 'Refund issued successfully';
          yield put(routerRedux.push('/accounts/customer-refunds'));
        } else if (payload.transactionType === 'VENDOR_PAYMENT') {
          notificationMessage = 'Vendor Payment';
          notificationDescription = 'Vendor payment created successfully';
          yield put(routerRedux.push('/accounts/vendors-bills-and-payments/vendor-payments'));
        } else {
          yield put(routerRedux.push('/accounts/journals'));
        }

        notification.success({
          message: notificationMessage,
          description: notificationDescription,
        });
      } catch (e) {
        yield put({ type: 'queryFailure ' });
      }
    },
    *queryTrialBalance({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryTrialBalanceReport, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccessReport',
            payload: data,
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *fetchJournalEntryLines({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryManualEntryLines, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              [payload.id]: {
                list: [...data.content],
                pagination: {
                  current: data.number,
                  total: data.totalElements,
                  pageSize: data.numberOfElements,
                },
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
    showImportModal(state, action) {
      return { ...state, ...action.payload, importModalVisible: true };
    },
    hideImportModal(state) {
      return { ...state, importModalVisible: false };
    },
    querySuccess(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
    querySuccessReport(state, { payload }) {
      const { entries } = payload;
      return {
        ...state,
        list: entries,
        loading: false,
        success: true,
        errorMessage: {},
        pagination: {
          ...state.pagination,
        },
      };
    },
  },
});
