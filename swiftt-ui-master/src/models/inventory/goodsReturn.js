import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import { createGoodsReturn } from '../../services/procurement/receiptNotes';
import { remove, update, queryOne, applyAction } from '../../services/inventory/goodsReturns';

export default modelExtend(resourceModel, {

  namespace: 'goodsReturn',

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
        const data = yield call(createGoodsReturn, payload);
        if (data) {
          notification.success({
            message: 'Success.',
            description: 'Goods Return created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put(routerRedux.push('/inventory/goods-returns'));
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *createAndSubmit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(createGoodsReturn, payload);
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
            description: 'Goods Return saved successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put({ type: 'query', payload: { id: data.id } });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
    *submit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, goodsReturnActionType: 'SUBMIT' });
        notification.success({
          message: 'Success.',
          description: 'Goods Return submitted successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
        yield put(routerRedux.push('/inventory/goods-returns'));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *approve({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, goodsReturnActionType: 'FAKE_APPROVE', items: payload.items });
        yield put(routerRedux.push('/inventory/goods-returns'));

        notification.success({
          message: 'Success.',
          description: 'Goods Return approved successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *creategoodsReturn({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, goodsReturnActionType: 'COPY_TO_VENDOR_RETURN' });
        yield put(routerRedux.push('/inventory/goods-returns'));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *reject({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, goodsReturnActionType: 'FAKE_REJECT' });
        notification.success({
          message: 'Success.',
          description: 'Goods Return rejected.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
        yield put(routerRedux.push('/inventory/goods-returns'));
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
