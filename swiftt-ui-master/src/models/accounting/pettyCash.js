import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import modelExtend from 'dva-model-extend';
import { notification } from 'antd';
import { collectionModel } from '../common';

import { create, queryPettyCashEntries, queryPettyCashLines } from '../../services/accounting/journals';

export default modelExtend(collectionModel, {

  namespace: 'pettyCash',

  state: {
    journalsSaveLoading: false,
  },

  subscriptions: {},

  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryPettyCashEntries, parse(payload));
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
    * create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(create, payload);
        notification.success({
          message: 'Petty cash processed ',
          description: `Your ${payload.transactionReference}  was created successful.`,
        });
        yield put(routerRedux.push('/accounts/petty-cash'));

      } catch (e) {
        console.log(e);
        yield put({ type: 'queryFailure ' });
      }
    },
    * fetchBankingEntryLines({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryPettyCashLines, parse(payload));
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
    querySuccess(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
    querySuccessReport(state, { payload }) {
      const { creditTotal, debitTotal, entries } = payload;
      return {
        ...state,
        list: entries,
        creditTotal,
        debitTotal,
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
