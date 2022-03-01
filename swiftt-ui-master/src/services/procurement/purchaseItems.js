import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { procurement } = api;
const { purchaseItems, purchaseItem } = procurement;

export async function query(params) {
  return request(purchaseItems, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(purchaseItems, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(purchaseItem)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(purchaseItem)(params), {
    method: 'DELETE',
    body: params,
  });
}
