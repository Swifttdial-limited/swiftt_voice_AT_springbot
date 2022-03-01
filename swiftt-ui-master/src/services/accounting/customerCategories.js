import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { customerCategory, customerCategories } = accounting;

export async function query(params) {
  return request(customerCategories, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(customerCategories, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(customerCategory)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(customerCategory)(params), {
    method: 'PATCH',
    body: params,
  });
}
