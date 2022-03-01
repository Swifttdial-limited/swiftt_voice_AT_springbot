import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import { create, remove, update, query } from '../../services/accounting/accounts';

export default modelExtend(collectionModel, {

  namespace: 'accountCategories',

  state: {
    accountCategoryModalVisible: false,
    accountCategoryModalType: 'create',
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
        yield put({
          type: 'queryFailure',
          payload: {
            errorMessage: error.responseJSON ? error.responseJSON : {},
          },
        });
      }
    },
    *delete({ payload }, { call, put }) {
      try {
        yield put({ type: 'showLoading' });
        yield call(remove, { publicId: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Error occured while deleting accounts');
      }
    },
    *create({ payload }, { call, put }) {

      if(payload.category) {
        yield put({ type: 'hideAccountCategoryModal' });
      } else {
        yield put({ type: 'hideAccountModal' });
      }

      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data) {
        yield put({ type: 'query', payload : { accountCategory: payload.category } });
      }
    },
    *update({ payload }, { select, call, put }) {
      if(payload.category) {
        yield put({ type: 'hideAccountCategoryModal' });
      } else {
        yield put({ type: 'hideAccountModal' });
      }

      yield put({ type: 'showLoading' });
      try {
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query', payload : { accountCategory: payload.category } });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
  },

  reducers: {
    showAccountCategoryModal(state, action) {
      return { ...state, ...action.payload, accountCategoryModalVisible: true };
    },
    hideAccountCategoryModal(state) {
      return { ...state, accountCategoryModalVisible: false };
    },
  },

});
