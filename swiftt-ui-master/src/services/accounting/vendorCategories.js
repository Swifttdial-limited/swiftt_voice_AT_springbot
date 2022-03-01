import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { vendorCategory, vendorCategories } = accounting;

export async function query(params) {
  return request(vendorCategories, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(vendorCategories, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(vendorCategory)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(vendorCategory)(params), {
    method: 'PATCH',
    body: params,
  });
}
