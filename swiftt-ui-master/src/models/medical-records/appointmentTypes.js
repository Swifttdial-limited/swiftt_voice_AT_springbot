import modelExtend from 'dva-model-extend';

import { collectionModel } from '../common';

import { create, remove, update, query } from '../../services/medical-records/appointmentTypes';
import { parse } from 'qs';

export default modelExtend(collectionModel, {

  namespace: 'appointmentTypes',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(query, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.content,
              pagination: { current: data.number, total: data.totalElements },
            },
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(remove, { id: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Cannot delete appointment type');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data) {
        yield put({ type: 'query' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        console.log('Update failed');
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
