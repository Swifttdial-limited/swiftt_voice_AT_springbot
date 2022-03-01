import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';

import { applyActions, queryOne } from '../../services/wards/admissions';

export default modelExtend(resourceModel, {

  namespace: 'admission',

  state: {
    admissionRequestProcessingModalVisible: false,
    bedAssignmentModalVisible: false,
    modalType: 'create',
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
    *processRequest({ payload }, { call, put }) {
      yield put({ type: 'hideAdmissionRequestProcessingModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyActions, payload);
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
    *assignBed({ payload }, { call, put }) {
      yield put({ type: 'hideBedAssignmentModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyActions, payload);
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
    showAdmissionRequestProcessingModal(state, action) {
      return { ...state, ...action.payload, admissionRequestProcessingModalVisible: true };
    },
    hideAdmissionRequestProcessingModal(state) {
      return { ...state, admissionRequestProcessingModalVisible: false };
    },
    showBedAssignmentModal(state, action) {
      return { ...state, ...action.payload, admissionRequestProcessingModalVisible: true };
    },
    hideBedAssignmentModal(state) {
      return { ...state, bedAssignmentModalVisible: false };
    },
  },
});
