import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { billing } = api;
const { billingRules, billingRule } = billing;

export async function query(params) {
  return request(billingRules, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(billingRules, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(billingRule)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(billingRule)(params), {
    method: 'DELETE',
    body: params,
  });
}
