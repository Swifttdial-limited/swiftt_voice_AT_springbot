import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models
      .filter(model => modelNotExisted(app, model))
      .map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
      authority: 'ROLE_AUTHORIZED_USER',
    },
    '/dashboard': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/authentication': {
      component: dynamicWrapper(app, [], () => import('../layouts/AuthenticationLayout')),
    },
    '/authentication/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/authentication/Login')),
    },
    '/authentication/authorization': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/authentication/Authorization')),
    },
    '/authentication/forgot-password': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/authentication/ForgotPassword')),
    },
    '/authentication/password-reset': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/authentication/PasswordReset')),
    },
    '/settings': {
      component: dynamicWrapper(app, [], () => import('../routes/user-settings')),
      name: 'User settings',
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/workspace/tasks': {
      component: dynamicWrapper(app, ['requests'], () => import('../routes/workspace/tasks')),
      name: 'Workspace / Tasks',
    },
    '/workspace/request/:id': {
      component: dynamicWrapper(app, [
        'request',
        'requestItems',
        'medical-records/templateInvestigations',
        'results',
      ], () => import('../routes/workspace/request')),
      name: 'Request',
    },
    '/workspace/inventory-transfers': {
      component: dynamicWrapper(app, ['inventory/inventoryTransfers'], () => import('../routes/workspace/inventory-transfers')),
      name: 'Workspace / Departmental Inventory Transfers',
    },
    '/workspace/inventory-transfer/view/:id': {
      component: dynamicWrapper(app, ['inventory/inventoryTransfer'], () => import('../routes/workspace/inventory-transfers/detail')),
      name: 'Workspace / Inventory Transfer',
    },
    '/workspace/items': {
      component: dynamicWrapper(app, ['request'], () => import('../routes/workspace/items')),
      name: 'Workspace / Departmental Items',
    },
    '/workspace/requisitions': {
      component: dynamicWrapper(app, ['procurement/requisitions'], () => import('../routes/workspace/requisitions')),
      name: 'Workspace / Departmental Requisitions',
    },
    '/workspace/requisition/create': {
      component: dynamicWrapper(app, [], () => import('../routes/workspace/requisitions/create')),
      name: 'Workspace / Requisition',
    },
    '/workspace/requisition/view/:id': {
      component: dynamicWrapper(app, ['procurement/requisition'], () => import('../routes/workspace/requisitions/detail')),
      name: 'Workspace / Requisition',
    },
    '/patients-management/emergency': {
      component: dynamicWrapper(app, [], () => import('../routes/patients-management/emergency')),
    },
    '/patients': {
      component: dynamicWrapper(app, ['patients'], () => import('../routes/patients-management')),
    },
    '/patient/view/:id': {
      component: dynamicWrapper(app, ['patient'], () => import('../routes/patients-management/detail')),
      name: 'Patient Profile',
    },
    '/patient/create': {
      component: dynamicWrapper(app, ['processes'], () => import('../routes/patients-management/registration')),
      name: 'Patient Registration',
    },
    '/visits': {
      component: dynamicWrapper(app, ['encounters'], () => import('../routes/encounters-management')),
    },
    '/visit/create': {
      component: dynamicWrapper(app, ['patient'], () => import('../routes/encounters-management/registration')),
      name: 'Visit',
    },
    '/visit/view/:id': {
      component: dynamicWrapper(app, ['notes'], () => import('../routes/encounters-management/detail')),
      name: 'Visit',
    },
    '/billing/deposits': {
      component: dynamicWrapper(app, ['billing-management/deposits'], () => import('../routes/billing-management/patient-deposits')),
      name: 'Billing / Deposits'
    },
    '/billing/deposit/view/:id': {
      component: dynamicWrapper(app, ['billing-management/deposit'], () => import('../routes/billing-management/patient-deposits/detail')),
      name: 'Billing / Deposit'
    },
    '/billing/cash-payments': {
      component: dynamicWrapper(app, ['billing-management/billItems'], () => import('../routes/billing-management/cash-payments')),
    },
    '/billing/credit-processing': {
      component: dynamicWrapper(app, [
        'billing-management/billItems', 'billing-management/invoices',
        'billing-management/invoiceItems'], () => import('../routes/billing-management/credit-processing')),
    },
    '/billing/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/billing-management/setup')),
    },
    '/medical-records/template/create': {
      component: dynamicWrapper(app, [], () => import('../routes/medical-records-management/templates/registration')),
      name: 'Template',
    },
    '/medical-records/templates': {
      component: dynamicWrapper(app, [], () => import('../routes/medical-records-management/templates')),
    },
    '/medical-records/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/medical-records-management/setup')),
    },
    '/appointments': {
      component: dynamicWrapper(app, ['appointments'], () => import('../routes/appointments-management')),
    },
    '/admissions/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/ward-management/setup')),
    },
    '/admissions/beds': {
      component: dynamicWrapper(app, ['wards/beds'], () => import('../routes/ward-management/beds')),
    },
    '/admissions/waiting-list': {
      component: dynamicWrapper(app, ['wards/admissions'], () => import('../routes/ward-management/waiting-list')),
    },
    '/admissions/occupations': {
      component: dynamicWrapper(app, ['wards/admissions'], () => import('../routes/ward-management/admissions')),
    },
    '/admission/view/:id': {
      component: dynamicWrapper(app, ['wards/admission'], () => import('../routes/ward-management/detail')),
      name: 'Admission',
    },
    '/admission/discharge/:id': {
      component: dynamicWrapper(app, ['wards/admission'], () => import('../routes/ward-management/detail/discharge')),
      name: 'Admission Discharge',
    },
    '/accounts/bank-reconciliation/view/:id': {
      component: dynamicWrapper(app, ['accounting/bankReconciliation'], () => import('../routes/accounts-management/bank-reconciliations/detail')),
      name: 'Bank Reconciliation',
    },
    '/accounts/bank-reconciliations': {
      component: dynamicWrapper(app, ['accounting/bankReconciliations'], () => import('../routes/accounts-management/bank-reconciliations')),
      name: 'Bank Reconciliations',
    },
    '/accounts/customer-refunds': {
      component: dynamicWrapper(app, [
        'accounting/customerRefunds',
      ], () => import('../routes/accounts-management/customer-refunds')),
      name: 'Customer Refunds',
    },
    '/accounts/customer-refund/create': {
      component: dynamicWrapper(app, [
        'processes',
      ], () => import('../routes/accounts-management/customer-refunds/create')),
      name: 'Customer Refund',
    },
    '/accounts/scheme/view/:publicId': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/schemes/detail')),
      name: 'Scheme',
    },
    '/accounts/scheme/create': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/schemes/registration')),
      name: 'Scheme registration',
    },
    '/accounts/bankings': {
      component: dynamicWrapper(app, [
        'accounting/banking',
      ], () => import('../routes/accounts-management/banking')),
      name: 'Banking',
    },
    '/accounts/banking/create': {
      component: dynamicWrapper(app, [
        'accounting/banking',
      ], () => import('../routes/accounts-management/banking/create')),
      name: 'Banking',
    },
    '/accounts/customers-and-payments/schemes': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/schemes')),
    },
    '/accounts/customers-and-payments/credit-notes': {
      component: dynamicWrapper(app, ['accounting/creditNotes'], () => import('../routes/accounts-management/credit-notes')),
      name: 'Credit Notes',
    },
    '/accounts/customers-and-payments/credit-note/create': {
      component: dynamicWrapper(app, ['accounting/creditNotes'], () => import('../routes/accounts-management/credit-notes/create')),
      name: 'Create Credit Notes',
    },
    '/accounts/customers-and-payments/credit-note/view/:id': {
      component: dynamicWrapper(app, ['accounting/creditNotes'], () => import('../routes/accounts-management/credit-notes/detail')),
      name: 'Credit Notes',
    },
    '/accounts/customers-and-payments/customer-payments': {
      component: dynamicWrapper(app, ['accounting/customerPayments'], () => import('../routes/accounts-management/customer-payments')),
      name: 'Accounting / Customer Payments',
    },
    '/accounts/customers-and-payments/customer-payment/view/:id': {
      component: dynamicWrapper(app, ['accounting/customerPayments'], () => import('../routes/accounts-management/customer-payments/detail')),
      name: 'Accounting / Customer Payment',
    },
    '/accounts/customers-and-payments/customer-payment/create': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/customer-payments/create')),
      name: 'Accounting / Customer Payment',
    },
    '/accounts/customers-and-payments/customer-payment-schedule/create': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/customer-payments/schedule')),
      name: 'Accounting / Customer Payment Schedule',
    },
    '/accounts/vendors-bills-and-payments/credit-notes': {
      component: dynamicWrapper(app, ['accounting/debitNotes'], () => import('../routes/accounts-management/credit-notes')),
      name: 'Accounting / Vendors / Credit Notes',
    },
    '/accounts/vendors-bills-and-payments/credit-note/view/:id': {
      component: dynamicWrapper(app, ['accounting/debitNotes'], () => import('../routes/accounts-management/credit-notes/detail')),
      name: 'Accounting / Vendors /  Credit Note',
    },
    '/accounts/vendors-bills-and-payments/credit-note/create': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/credit-notes/create')),
      name: 'Accounting / Vendors /  Credit Note',
    },
    '/accounts/vendors-bills-and-payments/vendor-bill/view/:id': {
      component: dynamicWrapper(app, ['accounting/vendorBills'], () => import('../routes/accounts-management/vendor-bills/detail')),
      name: 'Vendor Bill',
    },
    '/accounts/vendors-bills-and-payments/vendor-bill/create': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/vendor-bills/create')),
      name: 'Vendor Bill',
    },
    '/accounts/vendors-bills-and-payments/vendor-bills': {
      component: dynamicWrapper(app, ['accounting/vendorBills'], () => import('../routes/accounts-management/vendor-bills')),
    },
    '/accounts/vendors-bills-and-payments/vendor-payment/view/:id': {
      component: dynamicWrapper(app, ['accounting/vendorPayments'], () => import('../routes/accounts-management/vendor-payments/detail')),
      name: 'Accounting / Vendor Payment',
    },
    '/accounts/vendors-bills-and-payments/vendor-payment/create': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/vendor-payments/create')),
      name: 'Accounting / Vendor Payment',
    },
    '/accounts/vendors-bills-and-payments/vendor-payments': {
      component: dynamicWrapper(app, ['accounting/vendorPayments'], () => import('../routes/accounts-management/vendor-payments')),
      name: 'Accounting / Vendor Payments',
    },
    '/accounts/petty-cash': {
      component: dynamicWrapper(app, ['accounting/pettyCash'], () => import('../routes/accounts-management/petty-cash')),
      name: 'Petty Cash',
    },
    '/accounts/pettyCash/create': {
      component: dynamicWrapper(app, ['accounting/pettyCash'], () => import('../routes/accounts-management/petty-cash/create')),
      name: 'Petty Cash',
    },
    '/accounts/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/setup')),
    },
    '/accounts/contact/view/:publicId': {
      component: dynamicWrapper(app, ['accounting/contact'], () => import('../routes/accounts-management/contacts/detail')),
      name: 'Contact',
    },
    '/accounts/contact/create': {
      component: dynamicWrapper(app, ['processes'], () => import('../routes/accounts-management/contacts/registration')),
      name: 'Contact',
    },
    '/accounts/contacts': {
      component: dynamicWrapper(app, ['accounting/contacts'], () => import('../routes/accounts-management/contacts')),
    },
    '/accounts/customers-and-payments/customers': {
      component: dynamicWrapper(app, ['accounting/contacts'], () => import('../routes/accounts-management/customers')),
    },
    '/accounts/customer/view/:publicId': {
      component: dynamicWrapper(app, ['accounting/contact'], () => import('../routes/accounts-management/customers/detail')),
    },
    '/accounts/vendors-bills-and-payments/vendors': {
      component: dynamicWrapper(app, ['accounting/contacts'], () => import('../routes/accounts-management/vendors')),
    },
    '/accounts/vendors-bills-and-payments/vendor/view/:publicId': {
      component: dynamicWrapper(app, ['accounting/contact'], () => import('../routes/accounts-management/vendors/detail')),
    },
    '/accounts/journals': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/journals')),
    },
    '/accounts/journal/view/:id': {
      component: dynamicWrapper(app, ['accounting/journal'], () => import('../routes/accounts-management/journals/journal')),
      name: 'Journals'
    },
    '/accounts/journal/create': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/journals/create')),
      name: 'Journals'
    },
    '/inventory/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/setup')),
    },
    '/inventory/inventory-adjustments': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/inventory-adjustments')),
      name: 'Inventory / Inventory Adjustments',
    },
    '/inventory/inventory-adjustment/create': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/inventory-adjustments/create')),
      name: 'Inventory / Inventory Adjustment',
    },
    '/inventory/inventory-adjustment/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/inventory-adjustments/detail')),
      name: 'Inventory / Inventory Adjustment',
    },
    '/inventory/inventory-transfers': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/inventory-transfers')),
      name: 'Inventory / Inventory Transfers',
    },
    '/inventory/inventory-transfer/create': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/inventory-transfers/create')),
      name: 'Inventory / Inventory Transfer',
    },
    '/inventory/inventory-transfer/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/inventory-transfers/detail')),
      name: 'Inventory / Inventory Transfer',
    },
    '/inventory/stock-take-lists': {
      component: dynamicWrapper(app, ['inventory/stockTakeLists'], () => import('../routes/inventory-management/stock-take-lists')),
      name: 'Inventory / Stock Take Lists',
    },
    '/inventory/stock-take-list/create': {
      component: dynamicWrapper(app, ['inventory/stockTakeLists'], () => import('../routes/inventory-management/stock-take-lists/create')),
      name: 'Inventory / Stock Take List',
    },
    '/inventory/stock-take-list/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/stock-take-lists/detail')),
      name: 'Inventory / Stock Take List',
    },
    '/inventory/goods-returns': {
      component: dynamicWrapper(app, ['inventory/goodsReturns'], () => import('../routes/inventory-management/goods-returns')),
      name: 'Procurement / Goods Return Notes',
    },
    '/inventory/goods-return/create': {
      component: dynamicWrapper(app, ['inventory/goodsReturn'], () => import('../routes/inventory-management/goods-returns/create')),
      name: 'Procurement / Goods Return Note',
    },
    '/inventory/goods-return/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/goods-returns/detail')),
      name: 'Procurement / Goods Return Note',
    },
    '/procurement/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/procurement-management/setup')),
    },
    '/procurement/requisitions': {
      component: dynamicWrapper(app, ['procurement/requisitions'], () => import('../routes/procurement-management/requisitions')),
      name: 'Procurement / Requisitions',
    },
    '/procurement/requisition/view/:id': {
      component: dynamicWrapper(app, ['procurement/requisition'], () => import('../routes/procurement-management/requisitions/detail')),
      name: 'Procurement / Requisition',
    },
    '/procurement/purchase-orders': {
      component: dynamicWrapper(app, ['procurement/purchaseOrders'], () => import('../routes/procurement-management/purchase-orders')),
      name: 'Procurement / Purchase Orders',
    },
    '/procurement/purchase-order/create': {
      component: dynamicWrapper(app, [], () => import('../routes/procurement-management/purchase-orders/create')),
      name: 'Procurement / Purchase Order',
    },
    '/procurement/purchase-order/view/:id': {
      component: dynamicWrapper(app, ['procurement/purchaseOrder'], () => import('../routes/procurement-management/purchase-orders/detail')),
      name: 'Procurement / Purchase Order',
    },
    '/procurement/receipt-notes': {
      component: dynamicWrapper(app, [], () => import('../routes/procurement-management/receipt-notes')),
      name: 'Procurement / Receipt Notes',
    },
    '/procurement/receipt-note/create': {
      component: dynamicWrapper(app, [], () => import('../routes/procurement-management/receipt-notes/create')),
      name: 'Procurement / Receipt Note',
    },
    '/procurement/receipt-note/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/procurement-management/receipt-notes/detail')),
      name: 'Procurement / Receipt Note',
    },
    '/catalogue/price/create': {
      component: dynamicWrapper(app, ['processes'], () => import('../routes/catalogue-management/price/create')),
      name: 'Catalogue / Price Definition',
    },
    '/catalogue/prices/create': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/prices/create')),
      name: 'Catalogue / Price Definition',
    },
    '/catalogue/price/view/:id': {
      component: dynamicWrapper(app, ['processes'], () => import('../routes/catalogue-management/price/detail')),
      name: 'Catalogue / Price',
    },
    '/catalogue/price-lists': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/price-lists')),
      name: 'Catalogue / Price Lists',
    },
    '/catalogue/products': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/products')),
      name: 'Catalogue / Products',
    },
    '/catalogue/product/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/products/detail')),
      name: 'Catalogue / Product',
    },
    '/catalogue/product/create': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/products/registration')),
      name: 'Catalogue / New Product',
    },
    '/catalogue/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/setup')),
    },
    '/knowledge-base/files': {
      component: dynamicWrapper(app, [], () => import('../routes/knowledge-base-management/files')),
    },
    '/knowledge-base/diagnoses': {
      component: dynamicWrapper(app, ['wards/beds'], () => import('../routes/knowledge-base-management/diagnoses')),
    },
    '/system-administration/other-settings': {
      component: dynamicWrapper(app, ['identificationTypes', 'religions', 'titles'], () => import('../routes/system-administration/other-settings')),
      name: 'System Administration / Other Settings',
    },
    '/system-administration/locations-types-and-locations': {
      component: dynamicWrapper(app, ['locationTypes', 'locations'], () => import('../routes/system-administration/locations-types-and-locations')),
      name: 'System Administration / Location and Types',
    },
    '/system-administration/departments': {
      component: dynamicWrapper(app, ['departments'], () => import('../routes/system-administration/departments')),
      name: 'System Administration / Departments',
    },
    '/system-administration/department/create': {
      component: dynamicWrapper(app, ['departments'], () => import('../routes/system-administration/department')),
      name: 'System Administration / Department',
    },
    '/system-administration/department/edit': {
      component: dynamicWrapper(app, ['departments'], () => import('../routes/system-administration/department')),
      name: 'System Administration / Department',
    },
    '/system-administration/organization': {
      component: dynamicWrapper(app, ['institutions', 'countries', 'organogramNodes'], () => import('../routes/system-administration/organization-structure')),
      name: 'System Administration / Organization',
    },
    '/system-administration/roles-and-groups': {
      component: dynamicWrapper(app, [], () => import('../routes/system-administration/roles-and-groups')),
      name: 'System Administration / Roles & Groups',
    },
    '/system-administration/role/view/:publicId': {
      component: dynamicWrapper(app, ['role', 'privileges'], () => import('../routes/system-administration/roles-and-groups/roles/detail')),
      name: 'System Administration / Role',
    },
    '/system-administration/outbound-channels': {
      component: dynamicWrapper(app, ['outboundChannels'], () => import('../routes/system-administration/outbound-channels')),
      name: 'System Administration / Outbound Channels',
    },
    '/system-administration/users': {
      component: dynamicWrapper(app, ['users'], () => import('../routes/system-administration/users')),
      name: 'System Administration / Users',
    },
    '/system-administration/user/view/:publicId': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/system-administration/users/detail')),
      name: 'System Administration / User',
    },
    '/system-administration/data-importation': {
      component: dynamicWrapper(app, ['users'], () => import('../routes/system-administration/data-importation')),
      name: 'System Administration / Data Importation',
    },
    '/theatre-management/schedule': {
      component: dynamicWrapper(app, [], () => import('../routes/theatre-management/schedule')),
    },
    '/reports/accounts': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports')),
    },
    '/reports/account-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/accounts-listings')),
      name: 'Report - Accounts Listing',
    },
    '/reports/balance-sheet': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/balance-sheet')),
      name: 'Report - Balance Sheet',
    },
    '/reports/cash-book': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/cash-book')),
      name: 'Report - Cash Book',
    },
    '/reports/customer-statements': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/customer-statements')),
      name: 'Report - Customer Statement',
    },
    '/reports/customer-aging': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/customer-aging')),
      name: 'Report - Customer Aging',
    },
    '/reports/trial-balance': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/trial-balance')),
      name: 'Report - Trial Balance',
    },
    '/reports/vendor-statements': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/vendor-statements')),
      name: 'Report - Vendor Statement',
    },
    '/reports/vendor-aging': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/vendor-aging')),
      name: 'Report - Vendor Aging',
    },
    '/reports/cashier-collection-summary': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/cashier-collection-summary')),
      name: 'Report - Cashier Collection Summary',
    },
    '/reports/cashier-collection-analysis': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/cashier-collection-analysis')),
      name: 'Report - Cashier Collection Analysis',
    },
    '/reports/general-ledger': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/general-ledger')),
      name: 'Report - General Ledger',
    },
    '/reports/income-statement': {
      component: dynamicWrapper(app, [], () => import('../routes/accounts-management/reports/income-statement')),
      name: 'Report - Income Statement',
    },
    '/reports/medical-records': {
      component: dynamicWrapper(app, [], () => import('../routes/medical-records-management/reports')),
      name: 'Medical Records Reports',
    },
    '/reports/patient-listing': {
      component: dynamicWrapper(app, ['patients'], () => import('../routes/medical-records-management/reports/patients-listing')),
      name: 'Report - Patient Listing',
    },
    '/reports/patient-visit-history': {
      component: dynamicWrapper(app, ['encounters'], () => import('../routes/medical-records-management/reports/patients-visit-history')),
      name: 'Report - Patient Visit History',
    },
    '/reports/patient-statement': {
      component: dynamicWrapper(app, ['patients', 'invoices'], () => import('../routes/medical-records-management/reports/patient-statement')),
      name: 'Report - Patient Statement',
    },
    '/reports/appointments-listing': {
      component: dynamicWrapper(app, ['appointments'], () => import('../routes/medical-records-management/reports/appointments-listing')),
      name: 'Report - Appointments Listing',
    },
    '/reports/departmental-requests': {
      component: dynamicWrapper(app, ['requests'], () => import('../routes/medical-records-management/reports/departmental-requests')),
      name: 'Report - Patients Visit Per Department',
    },
    '/reports/inventory': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/reports')),
      name: 'Inventory Reports',
    },
    '/reports/catalogue': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/reports')),
      name: 'Catalogue Reports',
    },
    '/reports/purchase-orders': {
      component: dynamicWrapper(app, ['purchaseOrders'], () => import('../routes/inventory-management/reports/purchase-orders-listing')),
      name: 'Report - Purchase Order',
    },
    '/reports/inventory-balances-and-valuation': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/reports/inventory-balances-and-valuation-listing')),
      name: 'Report - Inventory Balance and Valuation',
    },
    '/reports/inventory-activities': {
      component: dynamicWrapper(app, ['inventoryTransactions'], () => import('../routes/inventory-management/reports/inventory-activity-summary')),
      name: 'Report - Inventory Activity',
    },
    '/reports/stock-movement': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/reports/stock-movement-summary')),
      name: 'Report - Stock Movement',
    },
    '/reports/inventory-reorder-levels': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/reports/inventory-reorder-levels-listing')),
      name: 'Report - Inventory Re-Order levels',
    },
    '/reports/inventory-expiries': {
      component: dynamicWrapper(app, [], () => import('../routes/inventory-management/reports/inventory-expiries-listing')),
      name: 'Report - Inventory Expiries',
    },
    '/reports/stocktake': {
      component: dynamicWrapper(app, ['stockTakeLists'], () => import('../routes/inventory-management/reports/stocktake-summary')),
      name: 'Report - Stocktake Summary',
    },
    '/reports/stock-variance': {
      component: dynamicWrapper(app, [], () => import('../routes/catalogue-management/reports')),
      name: 'Report - Stock Variance',
    },
    '/reports/others': {
      component: dynamicWrapper(app, [], () => import('../routes/reports/other-reports')),
      name: 'Reports / Others',
    },
    '/reports/specialists-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/reports/other-reports/specialists-listing')),
      name: 'Reports / Other / Specialists Listing',
    },
    '/reports/fixed-asset-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/reports/other-reports/fixed-asset-listing')),
      name: 'Reports / Other / Fixed Assets Listing',
    },


    '/fixed-assets-management/asset-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/assets')),
      name: 'Fixed Asset / Listing',
    },
    '/fixed-assets-management/asset/create': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/assets/Create')),
      name: 'Fixed Asset / New',
    },
    '/fixed-assets-management/asset/edit': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/assets/Edit')),
      name: 'Fixed Asset / Edit',
    },
    '/fixed-assets-management/asset/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/assets/detail')),
      name: 'Fixed Asset / Details',
    },
    '/fixed-assets-management/adjustment-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/adjustment')),
      name: 'Fixed Asset / Adjustment / Listing',
    },
    '/fixed-assets-management/transfer-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/transfer')),
      name: 'Fixed Asset / Transfer / Listing',
    },
    '/fixed-assets-management/maintenance-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/maintenance')),
      name: 'Fixed Asset / Maintenance / Listing',
    },

    '/fixed-assets-management/stock-take-lists': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/stock-take-lists')),
      name: 'Fixed Asset / Stock Take / Listing',
    },
    '/fixed-assets-management/stock-take-list/create': {
      component: dynamicWrapper(app, ['fixed-assets-management/stockTakeLists'], () => import('../routes/fixed-assets-management/stock-take-lists/create')),
      name: 'Inventory / Stock Take List',
    },
    '/fixed-assets-management/stock-take-list/view/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/stock-take-lists/detail')),
      name: 'Inventory / Stock Take List',
    },

    '/fixed-assets-management/disposal-listing': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/disposal')),
      name: 'Fixed Asset / Disposal / Listing',
    },
    '/fixed-assets-management/setup': {
      component: dynamicWrapper(app, [], () => import('../routes/fixed-assets-management/setup')),
      name: 'Fixed Asset / Setup',
    },
    '/fixed-assets-management/depreciation-report': {
      component: dynamicWrapper(app, [], () => import('../routes/reports/other-reports/fixed-asset-listing')),
      name: 'Reports / Other / Fixed Assets Listing',
    },
    '/calls': {
      component: dynamicWrapper(app, ['calls'], () => import('../routes/calls')),
      name: 'Calls'
    }, 
    '/ivrOptions': {
      component: dynamicWrapper(app, ['ivrOptions'], () => import('../routes/ivrOptions')),
      name: 'Ivr'
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
