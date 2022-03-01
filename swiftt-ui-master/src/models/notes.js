import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from './common';
import { createNote, queryNotes } from '../services/encounters';

export default modelExtend(collectionModel, {

  namespace: 'notes',

  state: {},

  subscriptions: {},

  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      try {
        const data = yield call(queryNotes, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.content,
              pagination: { current: data.number, total: data.totalElements },
            },
          });
        }
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
    *delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        yield call(remove, { id: payload });
        yield put({ type: 'query' });
      } catch (e) {
        console.log('Cannot delete note');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      const data = yield call(createNote, payload);
      if (data) {
        yield put({ type: 'query', payload: { encounterId: payload.encounterId } });
      }
    },
  },

  reducers: {},

});
