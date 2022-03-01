import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import {
  createMedicalSupply,
  queryMedicalSupplies,
  updateMedicalSupply,
  deleteMedicalSupply
} from '../../services/encounters';

export default modelExtend(collectionModel, {

  namespace: 'medicalSupplies',

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
        const data = yield call(queryMedicalSupplies, parse(payload));
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
        yield call(deleteMedicalSupply, payload);
        yield put({ type: 'query', payload });
      } catch (e) {
        console.log('Cannot delete medication');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(createMedicalSupply, payload);
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
        const data = yield call(updateMedicalSupply, payload);
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
