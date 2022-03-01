import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'Dashboard',
    icon: 'laptop',
    path: 'dashboard',
    authority: 'VIEW_DASHBOARD',
  }, {
    name: 'My Workspace',
    path: 'workspace',
    icon: 'inbox',
    authority: 'VIEW_DEPARTMENT_WORKSPACE',
    children: [
      {
        name: 'Tasks',
        path: 'tasks',
        authority: 'VIEW_DEPARTMENT_WORKSPACE_TASKS',
      }, {
        name: 'Items',
        path: 'items',
        authority: 'VIEW_DEPARTMENT_WORKSPACE_ITEMS',
      }, {
        name: 'Requisitions',
        path: 'requisitions',
        authority: 'VIEW_DEPARTMENT_WORKSPACE_REQUISITIONS',
      }, {
        name: 'Inventory Transfers',
        path: 'inventory-transfers',
        authority: 'VIEW_DEPARTMENT_WORKSPACE_INVENTORY_TRANSFERS',
      },
    ],
  }, {
    path: 'patients',
    name: 'Patients',
    authority: 'VIEW_PATIENTS',
    icon: 'solution',
  }, {
    path: 'visits',
    name: 'Visits',
    authority: 'VIEW_VISITS',
    icon: 'fork',
  }, {
    path: 'billing',
    name: 'Billing',
    authority: 'VIEW_BILLING',
    icon: 'credit-card',
    children: [
      {
        path: 'cash-payments',
        name: 'Cash Payments',
        authority: 'VIEW_BILLING_CASH',
      }, {
        path: 'credit-processing',
        name: 'Credit Processing',
        authority: 'VIEW_BILLING_CREDIT',
      }, {
        path: 'deposits',
        name: 'Deposits',
        authority: 'VIEW_PATIENT_DEPOSITS',
      }, {
        path: 'setup',
        name: 'Setup',
        authority: 'VIEW_BILLING_SETUP',
      },
    ],
  }, {
    path: 'medical-records',
    name: 'Medical Definitions',
    authority: 'VIEW_MEDICAL_RECORDS',
    icon: 'switcher',
    children: [
      {
        path: 'setup',
        name: 'Setup',
        authority: 'VIEW_MEDICAL_RECORDS_SETUP',
      }, {
        path: 'templates',
        name: 'Templates',
        authority: 'VIEW_MEDICAL_RECORDS_TEMPLATES',
      },
    ],
  }, {
    path: 'appointments',
    name: 'Appointments',
    authority: 'VIEW_APPOINTMENTS',
    icon: 'calendar',
  }, {
    path: 'admissions',
    name: 'Admissions',
    authority: 'VIEW_ADMISSIONS',
    icon: 'skin',
    children: [
      {
        path: 'setup',
        name: 'Setup',
        authority: 'VIEW_ADMISSIONS_SETUP',
      }, {
        path: 'waiting-list',
        name: 'Scheduled Admissions',
        authority: 'VIEW_ADMISSIONS_WAITING_LIST',
      }, {
        path: 'occupations',
        name: 'Admissions',
        authority: 'VIEW_ADMISSIONS_OCCUPATIONS',
      }, {
        path: 'beds',
        name: 'Beds',
        authority: 'VIEW_ADMISSIONS_BEDS',
      },
    ],
  }, {
    path: 'accounts',
    name: 'Accounting',
    authority: 'VIEW_ACCOUNTING',
    icon: 'calculator',
    children: [
      {
        path: 'setup',
        name: 'Setup',
        authority: 'VIEW_ACCOUNTING_SETUP',
      }, {
        path: 'journals',
        name: 'Journals',
        authority: 'VIEW_ACCOUNTING_MANUAL_JOURNALS',
      }, {
        path: 'bankings',
        name: 'Banking',
        authority: 'VIEW_ACCOUNTING_BANKING',
      }, {
        path: 'petty-cash',
        name: 'Petty Cash',
        authority: 'VIEW_ACCOUNTING_PETTY_CASH',
      }, {
        path: 'contacts',
        name: 'Contacts',
        authority: 'VIEW_ACCOUNTING_CONTACTS',
      }, {
        path: 'vendors-bills-and-payments',
        name: 'Vendors',
        authority: 'VIEW_ACCOUNTING_VENDORS',
        children: [
          {
            path: 'vendors',
            name: 'Vendors Listing',
            authority: 'VIEW_ACCOUNTING_VENDORS',
          }, {
            path: 'vendor-bills',
            name: 'Vendor Bills',
            authority: 'VIEW_ACCOUNTING_VENDOR_BILLS',
            hideInMenu: true,
          }, {
            path: 'vendor-payments',
            name: 'Vendor Payments',
            authority: 'VIEW_ACCOUNTING_VENDOR_PAYMENTS',
          }, {
            path: 'credit-notes',
            name: 'Credit Notes',
            authority: 'VIEW_ACCOUNTING_CREDIT_NOTES',
          },
        ]
      }, {
        path: 'customers-and-payments',
        name: 'Customers',
        authority: 'VIEW_ACCOUNTING_CUSTOMER_PAYMENTS',
        children: [
          {
            path: 'customers',
            name: 'Customers Listing',
            authority: 'VIEW_ACCOUNTING_CUSTOMERS',
          },
          {
            path: 'schemes',
            name: 'Scheme Listings',
            authority: 'VIEW_ACCOUNTING_SCHEMES',
          },
          {
            path: 'customer-payments',
            name: 'Customer Payments',
            authority: 'VIEW_ACCOUNTING_CUSTOMER_PAYMENTS',
          },
          {
            path: 'credit-notes',
            name: 'Debit Notes',
            authority: 'VIEW_ACCOUNTING_CREDIT_NOTES',
          },
        ]
      }, {
        path: 'customer-refunds',
        name: 'Customer Refunds',
        authority: 'VIEW_ACCOUNTING_CUSTOMER_REFUNDS',
        hideInMenu: true,
      },{
        path: 'bank-reconciliations',
        name: 'Bank Reconciliations',
        authority: 'VIEW_ACCOUNTING_BANK_RECONCILIATIONS',
      },
    ],
  }, {
    path: 'inventory',
    name: 'Inventory',
    authority: 'VIEW_INVENTORY',
    icon: 'shopping-cart',
    children: [
      {
        path: 'setup',
        name: 'Setup',
        authority: 'VIEW_INVENTORY_SETUP',
      }, {
        path: 'inventory-transfers',
        name: 'Inventory Transfers',
        authority: 'VIEW_INVENTORY_INVENTORY_TRANSFERS',
      }, {
        path: 'inventory-adjustments',
        name: 'Inventory Adjustments',
        authority: 'VIEW_INVENTORY_INVENTORY_ADJUSTMENTS',
      }, {
        path: 'goods-returns',
        name: 'Goods Returns',
        authority: 'VIEW_INVENTORY_GOODS_RETURNS',
      }, {
        path: 'stock-take-lists',
        name: 'Stock Take',
        authority: 'VIEW_INVENTORY_STOCKTAKE',
      },
    ],
  }, {
    path: 'procurement',
    name: 'Procurement',
    authority: 'VIEW_PROCUREMENT',
    icon: 'book',
    children: [
      {
        path: 'setup',
        name: 'Setup',
        authority: 'VIEW_PROCUREMENT_SETUP',
      }, {
        path: 'requisitions',
        name: 'Requisitions',
        authority: 'VIEW_PROCUREMENT_REQUISITIONS',
      }, {
        path: 'purchase-orders',
        name: 'Purchase Orders',
        authority: 'VIEW_PROCUREMENT_PURCHASE_ORDERS',
      }, {
        path: 'receipt-notes',
        name: 'Receipt Notes',
        authority: 'VIEW_PROCUREMENT_RECEIPT_NOTES',
      },
    ],
  }, {
    path: 'catalogue',
    name: 'Catalogue',
    authority: 'VIEW_CATALOGUE',
    icon: 'tags-o',
    children: [
      {
        path: 'setup',
        name: 'Setup',
        authority: 'VIEW_CATALOGUE_SETUP',
      }, {
        path: 'products',
        name: 'Products',
        authority: 'VIEW_CATALOGUE_PRODUCTS',
      }, {
        path: 'price-lists',
        name: 'Price Lists',
        authority: 'VIEW_CATALOGUE_PRICE_LISTS',
      },
    ],
  },

  {
    path: 'fixed-assets-management',
    name: 'Fixed Assets',
    //authority: 'VIEW_FIXED_ASSETS',
    icon: 'table',
    children: [
      {
        path: 'asset-listing',
        name: 'Assets',
        //authority: 'VIEW_FIXED_ASSETS_TRANSFER_VIEW',
      },{
        path: 'transfer-listing',
        name: 'Transfers',
        //authority: 'VIEW_FIXED_ASSETS_TRANSFER_VIEW',
      }, {
        path: 'maintenance-listing',
        name: 'Maintenance',
        //authority: 'VIEW_FIXED_ASSETS_MAINTENANCE_VIEW',
      },{
        path: 'stock-take-lists',
        name: 'Asset Count',
        //authority: 'VIEW_FIXED_ASSETS_INVENTORY_VIEW',
      },
      // {
      //   path: 'adjustment-listing',
      //   name: 'Adjustments',
      //   //authority: 'VIEW_FIXED_ASSETS_ADJUSTMENT_VIEW',
      // },
      {
        path: 'disposal-listing',
        name: 'Disposals',
        //authority: 'VIEW_FIXED_ASSETS_DISPOSAL_VIEW',
      },{
        path: 'setup',
        name: 'Setup',
        //authority: 'VIEW_FIXED_ASSETS_DISPOSAL_VIEW',
      },{
        path: 'depreciation-report',
        name: 'Depreciation Report',
        //authority: 'VIEW_FIXED_ASSETS_DISPOSAL_VIEW',
      },
    ]
  }
  ,{
    path: 'knowledge-base',
    name: 'Knowledge Base',
    authority: 'VIEW_KNOWLEDGE_BASE',
    icon: 'file-search',
    children: [
      {
        path: 'files',
        name: 'Document Control',
        authority: 'VIEW_KNOWLEDGE_BASE_FILES',
      }, {
        path: 'diagnoses',
        name: 'Diagnoses',
        authority: 'VIEW_KNOWLEDGE_BASE_DIAGNOSES',
      },
    ]
  }, {
    path: 'reports',
    name: 'Reports',
    authority: 'VIEW_REPORTS',
    icon: 'solution',
    children: [
      {
        path: 'medical-records',
        name: 'Medical Records',
        authority: 'VIEW_MEDICAL_RECORDS_REPORTS',
      }, {
        path: 'accounts',
        name: 'Accounts',
        authority: 'VIEW_ACCOUNTS_REPORTS',
      }, {
        path: 'inventory',
        name: 'Inventory',
        authority: 'VIEW_INVENTORY_REPORTS',
      }, {
        path: 'catalogue',
        name: 'Catalogue',
        authority: 'VIEW_CATALOGUE_REPORTS',
        hideInMenu: true,
      }, {
        path: 'others',
        name: 'Other Reports',
        authority: 'VIEW_OTHER_REPORTS',
      },
    ],

  }, {
    path: 'system-administration',
    name: 'System',
    authority: 'VIEW_SYSTEM_ADMINISTRATION',
    icon: 'setting',
    children: [
      {
        path: 'organization',
        name: 'Organization',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_ORGANIZATION_DETAILS',
      }, {
        path: 'departments',
        name: 'Departments',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_DEPARTMENTS',
      }, {
        path: 'locations-types-and-locations',
        name: 'Locations',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_LOCATIONS',
      }, {
        path: 'outbound-channels',
        name: 'Outbound Channels',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_INTEGRATION_CHANNELS',
      }, {
        path: 'other-settings',
        name: 'Other Definitions',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_DEFINITIONS',
      }, {
        path: 'roles-and-groups',
        name: 'Roles & Groups',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_ROLES_AND_GROUPS',
      }, {
        path: 'users',
        name: 'Users',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_USERS',
      }, {
        path: 'data-importation',
        name: 'Data Importation',
        authority: 'VIEW_SYSTEM_ADMINISTRATION_DATA_IMPORTATION',
      }
    ],
  }, {
    path: 'theatre-management',
    name: 'Operational Theatre',
    authority: 'VIEW_OPERATIONAL_THEATRE',
    icon: 'cut icon',
    hideInMenu: true,
  }, {
    path: 'employee-management',
    name: 'Workforce',
    authority: 'VIEW_EMPLOYEES',
    icon: 'team',
    hideInMenu: true,
    isLeaf: true,
    children: [
      {
        path: 'menu',
        name: 'Menu & Nav',
        hideInMenu: true,
      },
    ],
  }, {
    path: 'calls',
    name: 'Calls',
    authority: '',
    icon: 'setting',
  }, {
    path: 'ivrOptions',
    name: 'ivr',
    authority: '',
    icon: 'setting',
  }];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
