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
} from '../../services/procurement/requisitions';

export default modelExtend(resourceModel, {

  namespace: 'requisition',

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
            description: 'Requisition created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });

          if(payload.fromWorkspace) {
            yield put(routerRedux.push('/workspace/requisitions'));
          } else {
            yield put(routerRedux.push('/procurement/requisitions'));
          }
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
          const submitPayload = Object.assign({},
            { id: data.id } ,
            { fromWorkspace: payload.fromWorkspace ? true : false,});
          yield put({ type: 'submit', payload: submitPayload });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *submit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { id: payload.id, requisitionActionType: 'SUBMIT' });

        notification.success({
          message: 'Success.',
          description: 'Requisition submitted successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        if(payload.fromWorkspace) {
          yield put(routerRedux.push('/workspace/requisitions'));
        } else {
          yield put(routerRedux.push('/procurement/requisitions'));
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
            description: 'Requisition saved successfully.',
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
        yield call(applyAction, { id: payload.id, requisitionActionType: 'FAKE_APPROVE', items: payload.items });

        notification.success({
          message: 'Success.',
          description: 'Requisition approved successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        if(payload.fromWorkspace) {
          yield put(routerRedux.push('/workspace/requisitions'));
        } else {
          yield put(routerRedux.push('/procurement/requisitions'));
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *createPurchaseOrder({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, requisitionActionType: 'COPY_TO_PURCHASE_ORDER' });
        yield put(routerRedux.push('/procurement/requisitions'));

        notification.success({
          message: 'Success.',
          description: 'Purchase order created successfully.',
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
        yield call(applyAction, { id: payload.id, requisitionActionType: 'REJECT' });

        notification.success({
          message: 'Success.',
          description: 'Requisition rejected.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

        if(payload.fromWorkspace) {
          yield put(routerRedux.push('/workspace/requisitions'));
        } else {
          yield put(routerRedux.push('/procurement/requisitions'));
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
