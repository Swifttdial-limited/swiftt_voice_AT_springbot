export default {
  namespace: 'workspace',
  state: {
    templateDetailView: false,
    activeTabKey: 'request',
    activeTemplateKey: null,
  },

  effects: {
    *openTemplateDetailView(payload, { put }) {
      yield put({ type: 'add',
        payload: {
          templateDetailView: true,
          activeTemplateKey: payload.id,
        },
      });
    },
    *closeTemplateDetailView(_, { put }) {
      yield put({ type: 'add',
        payload: {
          templateDetailView: false,
          activeTemplateKey: null,
        },
      });
    },
  },
  reducers: {
    add(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

