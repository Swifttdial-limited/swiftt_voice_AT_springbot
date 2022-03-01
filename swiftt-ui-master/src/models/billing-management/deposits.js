import { notification } from 'antd';
import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import {
  create,
  update,
  query,
  applyAction,
} from '../../services/billing-management/deposits';

export default modelExtend(collectionModel, {

  namespace: 'deposits',

  state: {},

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
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(create, payload);
        if (data) {
          notification.success({
            message: 'Success.',
            description: 'Deposits created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put({ type: 'query' });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(update, payload);
        if (data) {
          notification.success({
            message: 'Success.',
            description: 'Deposits updated successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put({ type: 'query' });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
    *reverse({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, depositActionType: 'REFUND', paymentMode: payload.paymentMode });
        yield put(routerRedux.push('/billing/deposits'));

        notification.success({
          message: 'Success.',
          description: 'Patient deposit refund successful.',
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
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },

});
