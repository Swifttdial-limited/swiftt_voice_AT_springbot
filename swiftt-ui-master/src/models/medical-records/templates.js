import modelExtend from 'dva-model-extend';

import { collectionModel } from '../common';

import { create, remove, update, query, getRequestItemTemplates, requestItemsTemplateAction } from '../../services/medical-records/templates';
import { parse } from 'qs';

export default modelExtend(collectionModel, {

  namespace: 'templates',

  state: {
    modalVisible: false,
    modalType: 'create',
    activeTemplateRequestItemId: null,
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: { current: data.number, total: data.totalElements },
          },
        });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(remove, { id: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Cannot delete template');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data) {
        yield put({ type: 'query' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
    * queryByRequestAndRequestItem({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(getRequestItemTemplates, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.content,
              activeTemplateRequestItemId: payload.requestItemId,
              pagination: { current: data.number, total: data.totalElements },
            },
          }
          );
        }
      } catch (error) {
        yield put({
          type: 'queryFailure',
          payload: {
            activeTemplateRequestItemId: payload.requestItemId,
            errorMessage: error.responseJSON ? error.responseJSON : 'Ooopss!',
          },
        });
      }
    },
    *actions({ payload }, { call, put }) {
      try {
        yield put({ type: 'showLoading' });
        yield call(requestItemsTemplateAction, payload);
        yield put({ type: 'queryByRequestAndRequestItem', payload });
        yield put({ type: 'requestItems/query', payload: { id: payload.requestId } });
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
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },

});
