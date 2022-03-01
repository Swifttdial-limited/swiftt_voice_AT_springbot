import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { billing } = api;
const { bills, requestItemsActions, visitBillItems, visitActions,
  salesReceipts, salesReceipt, invoices , printReceipt, printInvoice } = billing;

export async function postRequestToBills(params) { // billing v2
  return request(pathToRegexp.compile(requestItemsActions)(params), {
    method: 'POST',
    body: params,
  });
}
/**
 * Get
 * @param params
 * @returns {Promise<*>}
 */
export async function queryBills(params) {
  return request(pathToRegexp.compile(bills)(params), {
    method: 'GET',
    body: params,
  });
}

export async function queryCustomerReceipts(params) {
  return request(pathToRegexp.compile(salesReceipts)(params), {
    method: 'GET',
    body: params,
  });
}



export async function queryCustomerReceipt(params) {
  return request(pathToRegexp.compile(salesReceipt)(params), {
    method: 'GET',
    body: params,
  });
}


export async function queryVisitBillItems(params) {
  return request(pathToRegexp.compile(visitBillItems)(params), {
    method: 'GET',
    body: params,
  });
}
// visit/:visitId/actions
export async function postActions(params) {
  return request(pathToRegexp.compile(visitActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function getSalesReceipts(params) {
  return request(pathToRegexp.compile(salesReceipts)(params), {
    method: 'GET',
    body: params,
  });
}


export async function queryInvoices(params) {
  return request(pathToRegexp.compile(invoices)(params), {
    method: 'GET',
    body: params,
  });
}

export async function printPdf(params){
  console.log("printPdf");
  return request(pathToRegexp.compile(printReceipt)(params), {
    method: 'GET',
    file: true,
    body: params,
  });
}


export async function printInvoicePdf(params){
  return request(pathToRegexp.compile(printInvoice)(params), {
    method: 'GET',
    file: true,
    body: params,
  });
}