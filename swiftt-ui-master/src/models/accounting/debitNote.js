import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import { create, remove, update, queryOne, applyAction } from '../../services/accounting/debitNotes';

export default modelExtend(resourceModel, {

  namespace: 'debitNote',

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
        yield call(create, payload);
          notification.success({
            message: 'Success.',
            description: 'Debit Note created successfully.',
            duration: 5,
            style: {
              marginTop: 30,
            },
          });
          yield put(routerRedux.push(`/accounts/customer-bills-and-payments/debit-notes`));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *createAndSubmit({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(create, payload);

        notification.success({
          message: 'Success.',
          description: 'Debit Note created successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });

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
            description: 'Credit Note saved successfully.',
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
        yield call(applyAction, { id: payload.id, debitNoteActionType: 'SUBMIT' });
        notification.success({
          message: 'Success.',
          description: 'Credit Note submitted successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
        yield put(routerRedux.push('/accounts/customer-bills-and-payments/debit-notes'));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *approve({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, debitNoteActionType: 'FAKE_APPROVE', items: payload.items });
        yield put(routerRedux.push('/accounts/customer-bills-and-payments/debit-notes'));

        notification.success({
          message: 'Success.',
          description: 'Credit Note approved successfully.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *createVendorReturn({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, debitNoteActionType: 'COPY_TO_VENDOR_RETURN' });
        yield put(routerRedux.push('/accounts/customer-bills-and-payments/debit-notes'));
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *reject({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        yield call(applyAction, { id: payload.id, debitNoteActionType: 'FAKE_REJECT' });
        notification.success({
          message: 'Success.',
          description: 'Credit Note rejected.',
          duration: 5,
          style: {
            marginTop: 30,
          },
        });
        yield put(routerRedux.push('/accounts/customer-bills-and-payments/debit-notes'));
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
