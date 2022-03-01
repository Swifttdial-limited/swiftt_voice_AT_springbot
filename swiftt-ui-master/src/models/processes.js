export default {

  namespace: 'processes',

  state: {
    admissionDischarge: {
      current: 0,
    },
    contactCreation: {
      current: 0,
    },
    customerRefundCreation: {
      current: 0,
    },
    patientCreation: {
      current: 0,
    },
    visitCreation: {
      current: 0,
    },
    priceCreation: {
      current: 0,
    }
  },

  subscriptions: {},

  effects: {
    *updateAdmissionDischargeStep({ payload }, { call, put }) {
      yield put({ type: 'updateAdmissionDischargeSuccess',
        payload: {
          admissionDischarge: {
            current: payload,
          },
        },
      });
    },
    *updateContactRegistrationStep({ payload }, { call, put }) {
      yield put({ type: 'updateContactCreationSuccess',
        payload: {
          contactCreation: {
            current: payload,
          },
        },
      });
    },
    *updateCustomerRefundStep({ payload }, { call, put }) {
      yield put({ type: 'updateCustomerRefundCreationSuccess',
        payload: {
          customerRefundCreation: {
            current: payload,
          },
        },
      });
    },
    *updatePatientRegistrationStep({ payload }, { call, put }) {
      yield put({ type: 'updateSuccess',
        payload: {
          patientCreation: {
            current: payload,
          },
        },
      });
    },
    *updateVisitCreationStep({ payload }, { call, put }) {
      yield put({ type: 'updateVisitCreationSuccess',
        payload: {
          visitCreation: {
            current: payload,
          },
        },
      });
    },
    *updatePriceCreationStep({ payload }, { call, put }) {
      yield put({ type: 'updatePriceCreationSuccess',
        payload: {
          priceCreation: {
            current: payload,
          },
        },
      });
    },
  },

  reducers: {
    updateAdmissionDischargeSuccess(state, { payload }) {
      const { admissionDischarge } = payload;
      return { ...state, admissionDischarge };
    },
    updateContactCreationSuccess(state, { payload }) {
      const { contactCreation } = payload;
      return { ...state, contactCreation };
    },
    updateCustomerRefundCreationSuccess(state, { payload }) {
      const { customerRefundCreation } = payload;
      return { ...state, customerRefundCreation };
    },
    updateSuccess(state, { payload }) {
      const { patientCreation } = payload;
      return { ...state, patientCreation };
    },
    updateVisitCreationSuccess(state, { payload }) {
      const { visitCreation } = payload;
      return { ...state, visitCreation };
    },
    updatePriceCreationSuccess(state, { payload }) {
      const { priceCreation } = payload;
      return { ...state, priceCreation };
    },
  },
};
