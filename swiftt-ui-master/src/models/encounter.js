import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { resourceModel } from './common';
import { queryOne, applyAction, queryEncounterDiagnoses } from '../services/encounters';

export default modelExtend(resourceModel, {

  namespace: 'encounter',

  state: {
    modalVisible: false,
    triageCategoryVisible: false,
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryOne, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data,
            },
          });
        }
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
    *closeVisit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { encounterId: payload.id, actionType: 'CLOSE' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *openVisit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { encounterId: payload.id, actionType: 'RE_OPEN' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *changeTriageCategory({ payload }, { call, put }) {
      yield put({ type: 'hideTriageCategoryAssignmentModal' });
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { encounterId: payload.id, actionType: 'CHANGE_TRIAGE_CATEGORY', triageCategory: payload.triageCategory });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *initiateDischarge({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { encounterId: payload.id, actionType: 'INITIATE_DISCHARGE' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *submitDischargeSummary({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, Object.assign({}, {...payload}, { actionType: 'SUBMIT_DISCHARGE_SUMMARY' }));
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *discharge({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { encounterId: payload.id, actionType: 'DISCHARGE' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {
    hideModal(state) {
      return { ...state, diagnosisModalVisible: false };
    },
    showTriageCategoryAssignmentModal(state, action) {
      return { ...state, ...action.payload, triageCategoryVisible: true };
    },
    hideTriageCategoryAssignmentModal(state) {
      return { ...state, triageCategoryVisible: false };
    },
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
  },
});
