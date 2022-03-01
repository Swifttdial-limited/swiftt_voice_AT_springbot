global._babelPolyfill = false;
import '@babel/polyfill';

// if((typeof window !== 'undefined' && !window._babelPolyfill) ||
//   (typeof global !== 'undefined' && !global._babelPolyfill)) {
//   require('@babel/polyfill')
// }

import dva from 'dva';
import { message } from 'antd';

import createHistory from 'history/createHashHistory';

// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
//import 'moment';
//import FastClick from 'fastclick';

import './index.less';

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(error) {
    message.error(error.message);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);
app.model(require('./models/error').default);
app.model(require('./models/accounting/accounts').default);
app.model(require('./models/accounting/accountCategories').default);
app.model(require('./models/accounting/accountingPreferences').default);
app.model(require('./models/accounting/bankReconciliations').default);
app.model(require('./models/accounting/bankReconciliation').default);
app.model(require('./models/accounting/chargeTypes').default);
app.model(require('./models/accounting/creditNote').default);
app.model(require('./models/accounting/creditNotes').default);
app.model(require('./models/accounting/currencies').default);
app.model(require('./models/accounting/customerPayment').default);
app.model(require('./models/accounting/customerPayments').default);
app.model(require('./models/accounting/customerRefunds').default);
app.model(require('./models/accounting/debitNote').default);
app.model(require('./models/accounting/debitNotes').default);
app.model(require('./models/accounting/deductionTypes').default);
app.model(require('./models/accounting/depositDefinitions').default);
app.model(require('./models/accounting/paymentModes').default);
app.model(require('./models/accounting/contact').default);
app.model(require('./models/accounting/contactIdentifications').default);
app.model(require('./models/accounting/contactPersons').default);
app.model(require('./models/accounting/contacts').default);
app.model(require('./models/accounting/customerCategories').default);
app.model(require('./models/accounting/paymentTerms').default);
app.model(require('./models/accounting/vendorCategories').default);
app.model(require('./models/accounting/scheme').default);
app.model(require('./models/accounting/schemes').default);
app.model(require('./models/accounting/taxTypes').default);
app.model(require('./models/accounting/tradingCurrencies').default);
app.model(require('./models/accounting/journals').default);
app.model(require('./models/accounting/taxCodes').default);
app.model(require('./models/accounting/vendorBill').default);
app.model(require('./models/accounting/vendorBills').default);
app.model(require('./models/accounting/vendorPayment').default);
app.model(require('./models/accounting/vendorPayments').default);
app.model(require('./models/appointments').default);
app.model(require('./models/appointment').default);
app.model(require('./models/biometrics').default);
app.model(require('./models/countries').default);
app.model(require('./models/departments').default);
app.model(require('./models/diagnoses').default);
app.model(require('./models/diagnosisVersions').default);
app.model(require('./models/encounter').default);
app.model(require('./models/encounter/diagnoses').default);
app.model(require('./models/encounter/dischargeSummaries').default);
app.model(require('./models/encounter/medicalSupplies').default);
app.model(require('./models/encounters').default);
app.model(require('./models/files').default);
app.model(require('./models/folders').default);
app.model(require('./models/identificationTypes').default);
app.model(require('./models/institution').default);
app.model(require('./models/institutions').default);
app.model(require('./models/organogramNodes').default);
app.model(require('./models/catalogue/groups').default);
app.model(require('./models/catalogue/activeIngredients').default);
app.model(require('./models/catalogue/administrationRoutes').default);
app.model(require('./models/catalogue/brands').default);
app.model(require('./models/catalogue/formulations').default);
app.model(require('./models/catalogue/manufacturers').default);
app.model(require('./models/catalogue/priceLists').default);
app.model(require('./models/catalogue/prices').default);
app.model(require('./models/catalogue/priceDeductions').default);
app.model(require('./models/catalogue/products').default);
app.model(require('./models/catalogue/product').default);
app.model(require('./models/catalogue/unitsOfMeasure').default);
app.model(require('./models/catalogue/strengths').default);
app.model(require('./models/fixed-asset-mgt/asset').default);
app.model(require('./models/fixed-asset-mgt/assets').default);
app.model(require('./models/fixed-asset-mgt/category').default);
app.model(require('./models/fixed-asset-mgt/categories').default);
app.model(require('./models/fixed-asset-mgt/adjustment').default);
app.model(require('./models/fixed-asset-mgt/adjustments').default);
app.model(require('./models/fixed-asset-mgt/disposal').default);
app.model(require('./models/fixed-asset-mgt/disposals').default);
app.model(require('./models/fixed-asset-mgt/maintenance').default);
app.model(require('./models/fixed-asset-mgt/maintenanceCategory').default);
app.model(require('./models/fixed-asset-mgt/maintenanceCategories').default);
app.model(require('./models/fixed-asset-mgt/maintenances').default);
app.model(require('./models/fixed-asset-mgt/stockTakeList').default);
app.model(require('./models/fixed-asset-mgt/stockTakeLists').default);
app.model(require('./models/fixed-asset-mgt/transfer').default);
app.model(require('./models/fixed-asset-mgt/transfers').default);
app.model(require('./models/guardians').default);
app.model(require('./models/inventory/binLocations').default);
app.model(require('./models/inventory/goodsReturn').default);
app.model(require('./models/inventory/goodsReturns').default);
app.model(require('./models/inventory/goodsReturnReasons').default);
app.model(require('./models/inventory/inventoryAdjustment').default);
app.model(require('./models/inventory/inventoryAdjustments').default);
app.model(require('./models/inventory/inventoryAdjustmentReasons').default);
app.model(require('./models/inventory/inventoryMetadata').default);
app.model(require('./models/inventory/inventoryPreferences').default);
app.model(require('./models/inventory/inventoryTransactions').default);
app.model(require('./models/inventory/inventoryTransfer').default);
app.model(require('./models/inventory/inventoryTransfers').default);
app.model(require('./models/inventory/reorderLevels').default);
app.model(require('./models/inventory/stockTakeList').default);
app.model(require('./models/inventory/stockTakeLists').default);
app.model(require('./models/locationTypes').default);
app.model(require('./models/locations').default);
app.model(require('./models/medical-records/appointmentTypes').default);
app.model(require('./models/medical-records/dischargeDispositions').default);
app.model(require('./models/medical-records/handOverReasons').default);
app.model(require('./models/medical-records/specimens').default);
app.model(require('./models/medical-records/arrivalMeans').default);
app.model(require('./models/medical-records/medicoLegals').default);
app.model(require('./models/medical-records/templates').default);
app.model(require('./models/medical-records/triageCategories').default);
app.model(require('./models/medical-records/visitTypes').default);
app.model(require('./models/medicalHistoryEntries').default);
app.model(require('./models/nextOfKins').default);
// app.model(require('./models/notes').default);
// app.model(require('./models/outboundChannels').default);
app.model(require('./models/patients').default);
app.model(require('./models/patient').default);
app.model(require('./models/patientPreferences').default);
app.model(require('./models/paymentWallets').default);
app.model(require('./models/privileges').default);
app.model(require('./models/processes').default);
app.model(require('./models/profile').default);
app.model(require('./models/procurement/purchaseItems').default);
app.model(require('./models/procurement/purchaseOrder').default);
app.model(require('./models/procurement/purchaseOrders').default);
app.model(require('./models/procurement/receiptNote').default);
app.model(require('./models/procurement/receiptNotes').default);
app.model(require('./models/procurement/requisitions').default);
app.model(require('./models/procurement/requisition').default);
app.model(require('./models/regions').default);
app.model(require('./models/religions').default);
app.model(require('./models/medications').default);
app.model(require('./models/request').default);
app.model(require('./models/requests').default);
app.model(require('./models/roles').default);
app.model(require('./models/role').default);
app.model(require('./models/standardsPreferences').default);
app.model(require('./models/tags').default);
app.model(require('./models/tagTypes').default);
app.model(require('./models/users').default);
app.model(require('./models/user').default);
app.model(require('./models/userGroups').default);
app.model(require('./models/tasks/tasks').default);
app.model(require('./models/tasks/task').default);
app.model(require('./models/tasks/assignedTasks').default);
app.model(require('./models/tasks/unassignedTasks').default);
app.model(require('./models/titles').default);
app.model(require('./models/walletTypes').default);
app.model(require('./models/wards/admission').default);
app.model(require('./models/wards/admissions').default);
app.model(require('./models/wards/beds').default);
app.model(require('./models/wards/wards').default);
app.model(require('./models/billing-management/bills').default);
app.model(require('./models/billing-management/billingGroups').default);
app.model(require('./models/billing-management/billingRules').default);
app.model(require('./models/billing-management/saleReceipt').default);
app.model(require('./models/billing-management/saleReceipts').default);
app.model(require('./models/billing-management/cashPayments').default);
app.model(require('./models/billing-management/deposits').default);
app.model(require('./models/billing-management/deposit').default);
app.model(require('./models/billing-management/depositRequests').default);
app.model(require('./models/calls').default);
app.model(require('./models/ivrOptions').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');


//FastClick.attach(document.body);

export default app._store;  // eslint-disable-line
