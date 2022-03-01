import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { collectionModel } from './common';

import { getRequestItems, getRequestItemsByEncounter } from '../services/requests';

export default modelExtend(collectionModel, {

  namespace: 'requestItems',

  state: {
    activeEncounterId: null,
  },

  subscriptions: {},

  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(getRequestItems, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              [payload.id]: [...data.content],
            },
          }
          );
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
    *queryByEncounter({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(getRequestItemsByEncounter, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              activeEncounterId: payload.encounterId,
              list: data.content,
              pagination: { current: data.number, total: data.totalElements, defaultPageSize: data.size },
            },
          }
          );
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
  },

  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
  },
});
