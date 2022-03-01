import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const {
  bankReconciliations,
  bankReconciliation,
  bankReconciliationActions,
} = accounting;

export async function query(params) {
  return request(bankReconciliations, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(bankReconciliations, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(bankReconciliation)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(bankReconciliation)(params), {
    method: 'DELETE',
    body: params,
  });
}

/////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(bankReconciliation)(params), {
    method: 'GET',
  });
}

////////////////////////////////////////
export async function applyAction(params) {
  return request(pathToRegexp.compile(bankReconciliationActions)(params), {
    method: 'POST',
    body: params,
  });
}
