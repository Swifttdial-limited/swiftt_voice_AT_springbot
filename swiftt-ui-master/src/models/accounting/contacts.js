import modelExtend from 'dva-model-extend';

import { collectionModel } from '../common';
import { create, remove, update, query } from '../../services/accounting/contacts';
import { parse } from 'qs';

export default modelExtend(collectionModel, {

  namespace: 'contacts',

  state: {
    modalVisible: false,
    modalType: 'create',
    importModalVisible: false,
  },

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
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(remove, { publicId: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Cannot delete contact');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(create, payload);
        if (data) {
          yield put({ type: 'contact/query', payload: { publicId: data.publicId } });
          yield put({ type: 'processes/updateContactRegistrationStep', payload: 1 });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });
      const id = yield select(({ contacts }) => contacts.currentItem.id);
      const newPatient = { ...payload, id };
      const data = yield call(update, newPatient);
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              total: data.page.total,
              current: data.page.current,
            },
          },
        });
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
    showImportModal(state, action) {
      return { ...state, ...action.payload, importModalVisible: true };
    },
    hideImportModal(state) {
      return { ...state, importModalVisible: false };
    },
  },

});
