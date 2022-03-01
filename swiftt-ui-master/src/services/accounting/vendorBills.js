import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const {
  vendorBills,
  vendorBill,
  vendorBillActions
} = accounting;

export async function query(params) {
  return request(vendorBills, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(vendorBills, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(vendorBillActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(vendorBill)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(vendorBill)(params), {
    method: 'DELETE',
    body: params,
  });
}


// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(vendorBill)(params), {
    method: 'GET',
  });
}
