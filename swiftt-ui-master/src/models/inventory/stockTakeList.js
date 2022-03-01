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
} from '../../services/inventory/stockTakeLists';

export default modelExtend(resourceModel, {

  namespace: 'stockTakeList',

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
            description: 'Stock Take List created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put(routerRedux.push('/inventory/stock-take-lists'));
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
        yield call(applyAction, { id: payload.id, stockTakeListActionType: 'SUBMIT' });

        notification.success({
          message: 'Success.',
          description: 'Stock Take List submitted successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        yield put(routerRedux.push('/inventory/stock-take-lists'));
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
            description: 'Stock Take List saved successfully.',
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
        yield call(applyAction, { id: payload.id, stockTakeListActionType: 'FAKE_APPROVE', items: payload.items });
        yield put(routerRedux.push('/inventory/stock-take-lists'));

        notification.success({
          message: 'Success.',
          description: 'Stock Take List approved.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *reconcile({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, stockTakeListActionType: 'RECONCILE' });
        yield put(routerRedux.push('/inventory/stock-take-lists'));

        notification.success({
          message: 'Success.',
          description: 'Stock Take List reconciled.',
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
        yield call(applyAction, { id: payload.id, stockTakeListActionType: 'FAKE_REJECT' });
        yield put(routerRedux.push('/inventory/stock-take-lists'));

        notification.success({
          message: 'Success.',
          description: 'Stock Take List rejected.',
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
