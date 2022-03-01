import pathToRegexp from 'path-to-regexp';
import modelExtend from 'dva-model-extend';

import { resourceModel } from './common';

// import { queryReceipt } from '../services/billing-management/bills';

export default modelExtend(resourceModel, {

  namespace: 'receipt',

  state: {},

  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen((location) => {
  //       const match = pathToRegexp('/billing/receipt/:id').exec(location.pathname);
  //       if (match) {
  //         dispatch({ type: 'query', payload: { patientBillId: match[1] } });
  //       }
  //     });
  //   },
  // },

  // effects: {
  //   * query({ payload }, { call, put }) {
  //     yield put({ type: 'showLoading' });

  //     try {
  //       const data = yield call(queryReceipt, payload);
  //       if (data) {
  //         yield put({
  //           type: 'querySuccess',
  //           payload: {
  //             data,
  //           },
  //         });
  //       }
  //     } catch (error) {
  //       yield put({ type: 'queryFailure' });
  //     }
  //   },
  // },

  // reducers: {
  //   querySuccess(state, { payload }) {
  //     const { data } = payload;
  //     return { ...state, loading: false, data, success: true };
  //   },
  // },
});
