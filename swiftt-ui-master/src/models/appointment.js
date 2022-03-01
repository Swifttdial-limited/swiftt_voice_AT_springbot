import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { resourceModel } from './common';
import { queryOne, applyAction, remove, update } from '../services/appointments';

export default modelExtend(resourceModel, {

  namespace: 'appointment',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryOne, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data
            },
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(remove, { id: payload });
      if (data) {
        if (data.visit) {
          payload = { visitId: data.visit.id };
        } else {
          payload = { patientId: data.patient.id };
        }
        yield put({ type: 'query', payload });
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data) {
        if (data.visit) {
          payload = { visitId: data.visit.id };
        } else {
          payload = { patientId: data.patient.id };
        }
        yield put({ type: 'query', payload });
      }
    },
    *confirm({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'CONFIRM' });
        //yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *claim({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'CLAIM' });
        yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *unclaim({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'UNCLAIM' });
        yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *start({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        payload.actionType = 'START';

        yield call(applyAction, payload);
        yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *complete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'COMPLETE' });
        yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *cancel({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'CANCEL' });
        //yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *miss({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'MISSED' });
        yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *reschedule({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'RESCHEDULE' });
        yield put({ type: 'appointments/query' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
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
