import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import {
  createEncounterDiagnosis,
  queryEncounterDiagnoses,
  deleteEncounterDiagnosis,
} from '../../services/encounters';

export default modelExtend(collectionModel, {

  namespace: 'encounterDiagnoses',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {},

  effects: {
    *fetchEncounterDiagnoses({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryEncounterDiagnoses, parse(payload));
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
    *createDiagnosis({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      const data = yield call(createEncounterDiagnosis, payload);
      if (data) {
        yield put({ type: 'fetchEncounterDiagnoses', payload: { encounterId: payload.encounterId } });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(deleteEncounterDiagnosis, payload);
        yield put({ type: 'fetchEncounterDiagnoses', payload: { encounterId : payload.encounterId } });
      } catch (e) {
        console.log('Cannot delete diagnosis');
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
