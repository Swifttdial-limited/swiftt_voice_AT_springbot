import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from './common';
import { create, query, queryPatientsCount } from '../services/patients';

export default modelExtend(collectionModel, {

  namespace: 'patients',

  state: {
    newPatientsToday: [],
    importModalVisible: false,
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(query, parse(payload));
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
    *queryPatientsCount({ payload }, { call, put }) {
      const data = yield call(queryPatientsCount, parse(payload));

      if (data && data.success) {
        yield put({ type: 'queryPatientsCountSuccess', payload: { newPatientsToday: data.data } });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(remove, { id: payload });
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              total: data.page.total,
              current: data.page.current,
            },
          },
        });
      }
    },
    *create({ payload }, { call, put }) {
      try {
        const data = yield call(create, payload);
        if (data) {
          yield put({ type: 'patient/query', payload: { id: data.id } });
          yield put({ type: 'processes/updatePatientRegistrationStep', payload: 1 });
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
    queryPatientsCountSuccess(state, action) {
      const { newPatientsToday } = action.payload;
      return { ...state, newPatientsToday };
    },
    showImportModal(state, action) {
      return { ...state, ...action.payload, importModalVisible: true };
    },
    hideImportModal(state) {
      return { ...state, importModalVisible: false };
    },
  },

});
