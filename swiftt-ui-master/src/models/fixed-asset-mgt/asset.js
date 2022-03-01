import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import { queryOne, remove, update, applyAction } from '../../services/fixed-asset-mgt/assets';

export default modelExtend(resourceModel, {

  namespace: 'fixed_asset',

  state: {
    addInsuranceModalVisible: false,
    addWarrantyModalVisible: false,
    addMaintainanceModalVisible: false,
    addTransferModalVisible: false,
    addDisposalModalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/fixed-assets-management/asset/view/:id').exec(location.pathname);
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
    *approveItem({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { id: payload.id, assetActionType: 'APPROVE' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *activateItem({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { id: payload.id, assetActionType: 'ACTIVATE' });
        yield put({ type: 'query', payload: { id: payload.id } });
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *deactivateItem({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        yield call(applyAction, { id: payload.id, assetActionType: 'DEACTIVATE' });
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
    showInsuranceModal(state, action) {
      return { ...state, ...action.payload, addInsuranceModalVisible: true };
    },
    hideInsuranceModal(state) {
      return { ...state, addInsuranceModalVisible: false };
    },
    showWarrantyModal(state, action) {
      return { ...state, ...action.payload, addWarrantyModalVisible: true };
    },
    hideWarrantyModal(state) {
      return { ...state, addWarrantyModalVisible: false };
    },
    showMaintenanceModal(state, action) {
      return { ...state, ...action.payload, addMaintainanceModalVisible: true };
    },
    hideMaintenanceModal(state) {
      return { ...state, addMaintainanceModalVisible: false };
    },
    showDisposalModal(state, action) {
      return { ...state, ...action.payload, addDisposalModalVisible: true };
    },
    hideDisposalModal(state) {
      return { ...state, addDisposalModalVisible: false };
    },
    showTransferModal(state, action) {
      return { ...state, ...action.payload, addTransferModalVisible: true };
    },
    hideTransferModal(state) {
      return { ...state, addTransferModalVisible: false };
    },
  },
});
