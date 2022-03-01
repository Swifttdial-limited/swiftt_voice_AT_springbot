import { parse } from 'qs';
import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

import { collectionModel } from './common';
import { query, queryEncountersCount } from '../services/encounters';
import { createEncounter, queryPatientEncounters } from '../services/patient';

export default modelExtend(collectionModel, {

  namespace: 'encounters',

  state: {
    newEncountersToday: [],
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
    *queryEncountersCount({ payload }, { call, put }) {
      const data = yield call(queryEncountersCount, parse(payload));

      if (data && data.success) {
        yield put({ type: 'queryEncountersCountSuccess', payload: { newEncountersToday: data.data } });
      }
    },
    *queryPatientEncounters({ payload }, { call, put }) {
      try {
        const data = yield call(queryPatientEncounters, parse(payload));
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
        console.log(e);
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
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(createEncounter, payload);
        if (data) {

          if(payload.appointment === undefined) {
            yield put({ type: 'encounter/querySuccess', payload: { data } });
            yield put({ type: 'processes/updateVisitCreationStep', payload: 1 });            
          }

          notification.success({
            message: 'Visit created successfully.',
            description: 'Patient visit created successfully.',
          });

        }
      } catch (e) {
        console.log('Error creating visit');
      }
    },
  },

  reducers: {
    queryEncountersCountSuccess(state, action) {
      const { newEncountersToday } = action.payload;
      return { ...state, newEncountersToday };
    },
  },

});
