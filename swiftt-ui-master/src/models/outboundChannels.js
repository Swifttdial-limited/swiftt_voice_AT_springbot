import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from './common';
import { create, update, query, remove } from '../services/outboundChannels';

export default modelExtend(collectionModel, {

  namespace: 'outboundChannels',

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
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(remove, { publicId: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Cannot delete religion');
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
    *update({ payload }, { select, call, put }) {
      try {
        yield put({ type: 'hideModal' });
        yield put({ type: 'showLoading' });
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        yield put({ type: 'queryFailure', payload: { httpStatus: e.httpStatus, message: e.integrationChannelMessage } });
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
