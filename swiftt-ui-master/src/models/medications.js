import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from './common';
import { createMedication, queryMedications, updateMedication, deleteMedication } from '../services/encounters';

export default modelExtend(collectionModel, {

  namespace: 'medications',

  state: {
    modalVisible: false,
    modalType: 'create',
    medicationType: '',
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryMedications, parse(payload));
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
        console.log(e);
        yield put({ type: 'queryFailure' });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(deleteMedication, payload);
        yield put({ type: 'query', payload });
      } catch (e) {
        console.log('Cannot delete medication');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(createMedication, payload);
        if (data) {
          yield put({ type: 'query', payload: { encounterId: payload.encounterId } });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(updateMedication, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
  },

  reducers: {},

});
