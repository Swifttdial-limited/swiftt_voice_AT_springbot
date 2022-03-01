import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from './common';
import { query, update } from '../services/patient';

export default modelExtend(resourceModel, {

  namespace: 'patient',

  state: {
    modalVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/patient/view/:id').exec(location.pathname);
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } });
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(query, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data,
            },
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure ' });
      }
    },
    *update({ payload }, { select, call, put }) {
      try {
        yield put({ type: 'hideModal' });
        yield put({ type: 'showLoading' });
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        yield put({ type: 'queryFailure', payload: { httpStatus: e.httpStatus, message: e.userMessage } });
      }
    },
  },

  reducers: {
    showEditModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideEditModal(state) {
      return { ...state, modalVisible: false };
    },
  },
});
