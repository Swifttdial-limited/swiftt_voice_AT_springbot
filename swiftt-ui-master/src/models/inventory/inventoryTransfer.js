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
} from '../../services/inventory/inventoryTransfers';

export default modelExtend(resourceModel, {

  namespace: 'inventoryTransfer',

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
            description: 'Inventory Transfer created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put(routerRedux.push('/inventory/inventory-transfers'));
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
            description: 'Inventory Transfer saved successfully.',
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
        yield call(applyAction, { id: payload.id, inventoryTransferActionType: 'SUBMIT' });
        notification.success({
          message: 'Success.',
          description: 'Inventory Transfer submitted successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        if(payload.fromWorkspace) {
          yield put(routerRedux.push('/workspace/inventory-transfers'));
        } else {
          yield put(routerRedux.push('/inventory/inventory-transfers'));
        }

      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *fulfil({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, inventoryTransferActionType: 'FAKE_FULFIL', items: payload.items });
        notification.success({
          message: 'Success.',
          description: 'Inventory Transfer fulfiled and marked as sent successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        if(payload.fromWorkspace) {
          yield put(routerRedux.push('/workspace/inventory-transfers'));
        } else {
          yield put(routerRedux.push('/inventory/inventory-transfers'));
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *receive({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, inventoryTransferActionType: 'FAKE_APPROVE', items: payload.items });

        notification.success({
          message: 'Success.',
          description: 'Inventory Transfer approved successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        if(payload.fromWorkspace) {
          yield put(routerRedux.push('/workspace/inventory-transfers'));
        } else {
          yield put(routerRedux.push('/inventory/inventory-transfers'));
        }

      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *reject({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, inventoryTransferActionType: 'FAKE_REJECT' });
        notification.success({
          message: 'Success.',
          description: 'Inventory Transfer rejected.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
        
        if(payload.fromWorkspace) {
          yield put(routerRedux.push('/workspace/inventory-transfers'));
        } else {
          yield put(routerRedux.push('/inventory/inventory-transfers'));
        }

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
