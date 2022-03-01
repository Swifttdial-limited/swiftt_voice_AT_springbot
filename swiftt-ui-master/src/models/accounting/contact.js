import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import { queryOne, update } from '../../services/accounting/contacts';

export default modelExtend(resourceModel, {

  namespace: 'contact',

  state: {
    modalVisible: false,
    customerModalVisible: false,
    vendorModalVisible: false,
  },

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryOne, payload);
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              data,
            },
          });
        }
      } catch (e) {
        yield put({ type: 'queryFailure ' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideEditModal' });
      yield put({ type: 'hideCustomerModal' });
      yield put({ type: 'hideVendorModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query', payload: { publicId: payload.publicId } });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
    showEditModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideEditModal(state) {
      return { ...state, modalVisible: false };
    },
    showCustomerModal(state, action) {
      return { ...state, ...action.payload, customerModalVisible: true };
    },
    hideCustomerModal(state) {
      return { ...state, customerModalVisible: false };
    },
    showVendorModal(state, action) {
      return { ...state, ...action.payload, vendorModalVisible: true };
    },
    hideVendorModal(state) {
      return { ...state, vendorModalVisible: false };
    },
  },
});
