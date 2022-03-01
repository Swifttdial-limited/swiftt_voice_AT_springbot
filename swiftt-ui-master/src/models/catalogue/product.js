import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import { queryOne, remove, update, applyAction } from '../../services/catalogue/products';

export default modelExtend(resourceModel, {

  namespace: 'catalogue_product',

  state: {
    assignableRoleModalVisible: false,
    associatedProductModalVisible: false,
    diagnosesModalVisible: false,
    incomeAccountsModalVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/catalogue/product/view/:id').exec(location.pathname);
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } });
        }
      });
    },
  },

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
      yield put({ type: 'hideAssociatedProductModal' });
      yield put({ type: 'hideDiagnosesModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query', payload: { id: data.id } });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
    *activateItem({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { id: payload.id, productActionType: 'ACTIVATE' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *deactivateItem({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { id: payload.id, productActionType: 'DEACTIVATE' });
        yield put({ type: 'query', payload: { id: payload.id } });
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
    showAssignableRolesModal(state, action) {
      return { ...state, ...action.payload, assignableRoleModalVisible: true };
    },
    hideAssignableRolesModal(state) {
      return { ...state, assignableRoleModalVisible: false };
    },
    showAssociatedProductsModal(state, action) {
      return { ...state, ...action.payload, associatedProductModalVisible: true };
    },
    hideAssociatedProductModal(state) {
      return { ...state, associatedProductModalVisible: false };
    },
    showDiagnosesModal(state, action) {
      return { ...state, ...action.payload, diagnosesModalVisible: true };
    },
    hideDiagnosesModal(state) {
      return { ...state, diagnosesModalVisible: false };
    },
    showIncomeAccountsModal(state, action) {
      return { ...state, ...action.payload, incomeAccountsModalVisible: true };
    },
    hideIncomeAccountsModal(state) {
      return { ...state, incomeAccountsModalVisible: false };
    },
  },
});
