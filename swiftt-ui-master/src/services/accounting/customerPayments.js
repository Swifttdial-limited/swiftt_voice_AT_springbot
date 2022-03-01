import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const {
  customerPayments,
  customerPayment,
  customerPaymentsActions,
} = accounting;

export async function query(params) {
  return request(customerPayments, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(customerPayments, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(customerPaymentsActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(customerPayment)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(customerPayment)(params), {
    method: 'DELETE',
    body: params,
  });
}


// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(customerPayment)(params), {
    method: 'GET',
  });
}
