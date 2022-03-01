import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import { create, query, applyActionToMany } from '../../services/catalogue/products';

export default modelExtend(collectionModel, {

  namespace: 'catalogue_products',

  state: {
    modalVisible: false,
    modalType: 'create',
    importModalVisible: false,
    productsBulkUpdateModalVisible: false,
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
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
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data) {
        yield put({ type: 'query' });
      }
    },
    *doProductsBulkUpdate({ payload }, { select, call, put }) {
      yield put({ type: 'hideProductsBulkUpdateModal' });

      try {
        yield call(applyActionToMany, payload);
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {
    showProductsBulkUpdateModal(state, action) {
      return { ...state, ...action.payload, productsBulkUpdateModalVisible: true };
    },
    hideProductsBulkUpdateModal(state) {
      return { ...state, productsBulkUpdateModalVisible: false };
    },
    showImportModal(state, action) {
      return { ...state, ...action.payload, importModalVisible: true };
    },
    hideImportModal(state) {
      return { ...state, importModalVisible: false };
    },
  },

});
