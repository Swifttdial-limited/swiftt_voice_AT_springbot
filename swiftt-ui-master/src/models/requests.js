import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { notification } from 'antd';

import { collectionModel } from './common';
import { createRequest, queryRequests } from '../services/encounters';
import { query } from '../services/requests';

export default modelExtend(collectionModel, {

  namespace: 'requests',

  state: {
    modalVisible: false,
    modalType: 'create',
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
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
    *queryByEncounter({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryRequests, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.content,
              pagination: { current: data.number, total: data.totalElements },
            },
          });
        }
      } catch (error) {
        yield put({ type: 'queryFailure' });
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
    *create({ payload, history }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      console.log(payload);

      yield call(createRequest, payload);
      // if (location.hash === '#/visit/create') {
      //   yield put(routerRedux.push('/patients'));
      // }
      notification.success({
        message: 'Request created successfully.',
        description: 'Patient request created successfully.',
      });

      yield put({ type: 'requestItems/queryByEncounter', payload: { encounterId: payload.encounterId } });
      yield put({ type: 'queryByEncounter', payload: { encounterId: payload.encounterId } });
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
