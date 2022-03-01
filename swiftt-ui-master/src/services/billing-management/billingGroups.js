import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { billing } = api;
const { billingGroups, billingGroup } = billing;

export async function query(params) {
  return request(billingGroups, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(billingGroups, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(billingGroup)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(billingGroup)(params), {
    method: 'DELETE',
    body: params,
  });
}
