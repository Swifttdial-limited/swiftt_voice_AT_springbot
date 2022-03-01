import modelExtend from 'dva-model-extend';

const requestModel = {

  state: {
    loading: false,
    success: false,
    errorMessage: {},
  },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    queryFailure(state, { payload }) {
      return { ...state,
        success: false,
        loading: false,
        errorMessage: payload,
      };
    },
  },

};

export const resourceModel = modelExtend(requestModel, {

  state: {
    data: {},
  },

  reducers: {
    purge(state) {
      return { ...state, loading: false, success: false, data: {} };
    },
    querySuccess(state, { payload }) {
      const { data } = payload;
      return { ...state, loading: false, data, success: true };
    },
    setData(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },

});

export const collectionModel = modelExtend(requestModel, {

  state: {
    list: [],
    currentItem: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 0,
      total: 0,
    },
  },

  reducers: {
    purge(state) {
      return { ...state, loading: false, success: false, list: [] };
    },
    purgeCurrentItem(state) {
      return { ...state, loading: false, success: false, currentItem: {} };
    },
    setCurrentItem(state, { payload }) {
      return {
        ...state,
        currentItem: payload,
      };
    },
    querySuccess(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        loading: false,
        success: true,
        errorMessage: {},
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
  },

});
