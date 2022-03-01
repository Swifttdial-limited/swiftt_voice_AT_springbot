import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { resourceModel } from './common';
import {
  queryPatientPreferences,
  updatePatientPreferences,
} from '../services/patient';

export default modelExtend(resourceModel, {

  namespace: 'patientPreferences',

  state: {},

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryPatientPreferences, parse(payload));
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
            errorMessage: error.responseJSON ? error.responseJSON : {},
          },
        });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(updatePatientPreferences, payload);
        if (data) {
          yield put({ type: 'query', payload: { patientId: payload.patientId} });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
  },

  reducers: {},

});
