import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from '../common';
import { queryOne, remove, update, applyAction } from '../../services/fixed-asset-mgt/maintenance';

export default modelExtend(resourceModel, {

  namespace: 'fixed_asset_maintenance',

  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/fixed-assets-management/maintenance/view/:id').exec(location.pathname);
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
  },
});
