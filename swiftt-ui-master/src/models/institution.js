import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { resourceModel } from './common';
import { create, queryOne, update, queryMyInstitution } from '../services/institutions';

export default modelExtend(resourceModel, {

  namespace: 'institution',

  state: {},

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
              data,
            },
          });
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
    *queryMyInstitution({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryMyInstitution);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data,
            },
          });
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
    *updateMyInstitution({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(update, payload);
      if (data) {
        yield put({ type: 'queryMyInstitution' });
      }
    },
  },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    queryFailure(state, action) {
      return { ...state, loading: false, success: false };
    },
  },

});
