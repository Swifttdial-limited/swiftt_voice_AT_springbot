import modelExtend from 'dva-model-extend';
import { parse } from 'qs';

import { collectionModel } from '../common';
import { create, query, update, remove, queryOne } from '../../services/catalogue/prices';

export default modelExtend(collectionModel, {

  namespace: 'catalogue_prices',

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
      } catch (error) {
        yield put({ type: 'queryFailure' });
      }
    },
    *queryOne({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(queryOne, parse(payload));
        if (data) {
          yield put({
            type: 'querySuccess',
          });
          yield put({ type: 'setCurrentItem', payload: data });
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
        console.log('Cannot delete price type');
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' });
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(create, payload);
        if (data) {
          yield put({ type: 'setCurrentItem', payload: data });
          yield put({ type: 'processes/updatePriceCreationStep', payload: 1 });
        }
      } catch (e) {
        yield put({ type: 'queryFailure' });
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });

      try {
        const data = yield call(update, payload);
        if (data) {
          yield put({ type: 'query' });
        }
      } catch (e) {
        console.log('Update failed');
      }
    },
  },

  reducers: {},

});
