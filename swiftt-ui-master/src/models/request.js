import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from './common';

import { queryOne, updateRequestItems, applyAction } from '../services/requests';

export default modelExtend(resourceModel, {

  namespace: 'request',

  state: {
    modalVisible: false,
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
    *updateRequestItems({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(updateRequestItems, payload);
        if (data) {
          yield put({ type: 'query', payload: { patientId: payload.patientId } });
        }
      } catch (error) {
        yield put({
          type: 'queryFailure',
          payload: {
            errorMessage: error.responseJSON ? error.responseJSON : 'Ooopss!',
          },
        });
      }
    },
    *getRequestItemDetails({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(getRequestItemDetails, payload);
        if (data) {
          yield put({ type: 'query', payload });
        }
      } catch (error) {
        yield put({
          type: 'queryFailure',
          payload: {
            errorMessage: error.responseJSON ? error.responseJSON : 'Ooopss!',
          },
        });
      }
    },
    *claim({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'CLAIM' });
        yield put({ type: 'tasks/query' });
        yield put({ type: 'task/query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *unclaim({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'UNCLAIM' });
        yield put({ type: 'tasks/query' });
        yield put({ type: 'task/query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *markAsCompleted({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, actionType: 'COMPLETE' });
        yield put({ type: 'assignedTasks/query', payload: { assigned: true } });
        yield put({ type: 'query' ,payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
  },
});
