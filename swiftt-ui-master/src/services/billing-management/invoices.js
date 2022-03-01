import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { billing } = api;
const { invoices, invoiceDetails, visitInvoices } = billing;

export async function queryInvoices(params) {
  return request(pathToRegexp.compile(invoices)(params), {
    method: 'GET',
    body: params,
  });
}

// get invoices by sourceReferenceId
export async function queryVisitInvoices(params) {
  return request(pathToRegexp.compile(invoices)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryInvoiceDetails(params) {
  return request(pathToRegexp.compile(invoiceDetails)(params), {
    method: 'GET',
    body: params,
  });
}
