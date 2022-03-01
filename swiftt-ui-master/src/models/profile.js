import modelExtend from 'dva-model-extend';

import { resourceModel } from './common';
import { query, update, applyAction } from '../services/profile';

export default modelExtend(resourceModel, {

  namespace: 'profile',

  state: {
    modalVisible: false,
    modalType: 'create',
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(query, payload);
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
    *applyAction({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(applyAction, payload);
        if (data) {
          yield put({ type: 'query', payload: { publicId: data.publicId } });
        }
      } catch (e) {
        console.log('Update failed. ', e);
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
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
  },
});
