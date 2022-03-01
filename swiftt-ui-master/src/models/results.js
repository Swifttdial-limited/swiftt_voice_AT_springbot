import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from './common';

import { getRequestItemsByEncounter } from '../services/requests';
import { getRequestItemTemplates, getVisitInvestigationsResults } from '../services/medical-records/templates';

export default modelExtend(resourceModel, {

  namespace: 'results',

  state: {
    request: {},
    requestItems: {},
    resultTemplates: {},
  },

  subscriptions: {},

  effects: {
    * fetchRequestItems({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      // save active request
      yield put({ type: 'saveActiveRequest', payload: { request: { ...payload } } });
      const data = yield call(getRequestItemsByEncounter, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            requestItems: { ...data },
          },
        }
        );
      }
    },
    * queryTemplateResults({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(getRequestItemTemplates, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              resultTemplates: {
                list: data.content,
                pagination: { current: data.number, total: data.totalElements },
              },
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
    * queryVisitTemplateResults({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(getVisitInvestigationsResults, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              encounterId: payload.id ? payload.id : null,
              list: data.content,
              pagination: { current: data.number, total: data.totalElements },
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
    saveActiveRequest(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
    querySuccess(state, { payload }) {
      return { ...state, loading: false, ...payload, success: true };
    },
  },
});
