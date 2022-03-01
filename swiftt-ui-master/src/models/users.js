import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';

import { collectionModel } from './common';
import {
  create,
  query,
  queryUsersByRole
} from '../services/users';

export default modelExtend(collectionModel, {

  namespace: 'users',

  state: {
    modalVisible: false,
    importModalVisible: false,
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
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *queryUsersByRole({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryUsersByRole, parse(payload));
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
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(remove, payload );
        yield put(routerRedux.push('/system-administration/users'));
      } catch (e) {
        console.log('Cannot delete user');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(create, payload);
        if (data) {
          yield put({ type: 'query' });
        }
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
    showImportModal(state, action) {
      return { ...state, ...action.payload, importModalVisible: true };
    },
    hideImportModal(state) {
      return { ...state, importModalVisible: false };
    },
  },

});
