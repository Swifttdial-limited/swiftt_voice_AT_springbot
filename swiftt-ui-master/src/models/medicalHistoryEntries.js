import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from './common';
import {
  createMedicalHistoryEntry,
  queryMedicalHistoryEntries,
  updateMedicalHistory,
  removeMedicalHistory
} from '../services/patient';

export default modelExtend(collectionModel, {

  namespace: 'medicalHistoryEntries',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryMedicalHistoryEntries, parse(payload));
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
        console.log('Cannot get medical history entries');
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(removeMedicalHistory, payload);
        yield put({ type: 'query', payload: { patientId: payload.patientId } });
      } catch (e) {
        console.log('Cannot delete medical history entry');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(createMedicalHistoryEntry, payload);
        if (data) {
          yield put({ type: 'query', payload: { patientId: payload.patientId } });
        }
      } catch (error) {
        console.log('Cannot create medical history entry');
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(updateMedicalHistory, payload);
        if (data) {
          yield put({ type: 'query', payload: { patientId: payload.patientId} });
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
