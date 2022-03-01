import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import {
  create,
  remove,
  update,
  queryOne,
  applyAction
} from '../../services/accounting/vendorBills';

export default modelExtend(resourceModel, {

  namespace: 'vendorBill',

  state: {},

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
    *create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(create, payload);
        if (data) {
          notification.success({
            message: 'Success.',
            description: 'Vendor Bill created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put(routerRedux.push('/accounts/vendors-bills-and-payments/vendor-bills'));
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *createAndSubmit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(create, payload);
        if (data) {
          yield put({ type: 'submit', payload: { id: data.id } });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *save({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(update, payload);
        if (data) {
          notification.success({
            message: 'Success.',
            description: 'Vendor Bill saved successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put(routerRedux.push('/accounts/vendors-bills-and-payments/vendor-bills'));
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
    *submit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, vendorBillActionType: 'SUBMIT' });
        notification.success({
          message: 'Success.',
          description: 'Vendor Bill submitted successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
        yield put(routerRedux.push('/accounts/vendors-bills-and-payments/vendor-bills'));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *approve({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, vendorBillActionType: 'FAKE_APPROVE', items: payload.items });
        yield put(routerRedux.push('/accounts/vendors-bills-and-payments/vendor-bills'));

        notification.success({
          message: 'Success.',
          description: 'Vendor Bill approved successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *reject({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, vendorBillActionType: 'FAKE_REJECT' });
        notification.success({
          message: 'Success.',
          description: 'Vendor Bill rejected.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
        yield put(routerRedux.push('/accounts/vendors-bills-and-payments/vendor-bills'));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
  },
});
