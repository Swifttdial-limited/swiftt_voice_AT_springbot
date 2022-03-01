import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import { createDeduction, queryDeductions, updateDeduction, removeDeduction } from '../../services/catalogue/prices';

export default modelExtend(collectionModel, {

  namespace: 'price_deductions',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryDeductions, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.content,
              pagination: { current: data.number, total: data.totalElements },
            },
          });
        }
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(removeDeduction, { id: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Cannot delete price deduction');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(createDeduction, payload);
        if (data) {
          yield put({ type: 'query', payload: { id: payload.id } });
        }
      } catch (e) {
        console.log('Cannot create price deduction');
      }
    },
  },

  reducers: {
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },

});
