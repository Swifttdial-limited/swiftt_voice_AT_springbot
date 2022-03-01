import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { procurement, exportDocuments } = api;
const { purchaseOrders, purchaseOrder, purchaseOrderActions } = procurement;
const { purchaseOrderPdf } = exportDocuments;

export async function query(params) {
  return request(purchaseOrders, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(purchaseOrders, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(purchaseOrderActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(purchaseOrder)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(purchaseOrder)(params), {
    method: 'DELETE',
    body: params,
  });
}
// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(purchaseOrder)(params), {
    method: 'GET',
  });
}

export async function printPurchaseOrder(params) {
  return request(pathToRegexp.compile(purchaseOrderPdf)(params), {
    method: 'GET',
    body: params,
    file: true,
  });
}
