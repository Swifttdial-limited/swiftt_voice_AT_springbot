import { notification } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import {
  create,
  remove,
  update,
  queryOne,
  applyAction
} from '../../services/procurement/purchaseOrders';

export default modelExtend(resourceModel, {

  namespace: 'purchaseOrder',

  state: {
    modalVisible: false,
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
    *create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(create, payload);
        if (data) {

          notification.success({
            message: 'Success.',
            description: 'Purchase Order created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put(routerRedux.push('/procurement/purchase-orders'));
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
    *submit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, purchaseOrderActionType: 'SUBMIT' });

        notification.success({
          message: 'Success.',
          description: 'Purchase Order submitted successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        yield put(routerRedux.push('/procurement/purchase-orders'));
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
            description: 'Purchase Order saved successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });

          yield put({ type: 'query', payload: { id: payload.id }});
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
    *approve({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, purchaseOrderActionType: 'FAKE_APPROVE', items: payload.items });
        yield put(routerRedux.push('/procurement/purchase-orders'));

        notification.success({
          message: 'Success.',
          description: 'Purchase Order approved.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *close({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, purchaseOrderActionType: 'MARK_AS_CLOSED' });
        yield put(routerRedux.push('/procurement/purchase-orders'));

        notification.success({
          message: 'Success.',
          description: 'Purchase Order closed.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *open({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, purchaseOrderActionType: 'MARK_AS_OPEN' });
        yield put(routerRedux.push('/procurement/purchase-orders'));

        notification.success({
          message: 'Success.',
          description: 'Purchase Order opened.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *createReceiptNote({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, purchaseOrderActionType: 'COPY_TO_RECEIPT_NOTE' });

        notification.success({
          message: 'Success.',
          description: 'Goods receipt note created successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        yield put(routerRedux.push('/procurement/purchase-orders'));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *reject({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, purchaseOrderActionType: 'FAKE_REJECT' });
        yield put(routerRedux.push('/procurement/purchase-orders'));

        notification.success({
          message: 'Success.',
          description: 'Purchase Order rejected.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
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
