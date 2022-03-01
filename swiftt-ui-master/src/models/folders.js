import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from './common';
import {
  createFolder,
  removeFolder,
  updateFolder,
  queryFolders
} from '../services/files';

export default modelExtend(collectionModel, {

  namespace: 'folders',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryFolders, parse(payload));
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
        yield put({
          type: 'queryFailure',
          payload: {
            errorMessage: error.responseJSON ? error.responseJSON : 'Ooopss!',
          },
        });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(removeFolder, { publicId: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Cannot delete identfication type');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      const data = yield call(createFolder, payload);
      if (data) {
        yield put({ type: 'query' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(updateFolder, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        console.log('Update failed');
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
  },

});
