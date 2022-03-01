import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { catalogue } = api;
const { brand, brands } = catalogue;

export async function query(params) {
  return request(brands, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(brands, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(brand)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(brand)(params), {
    method: 'PATCH',
    body: params,
  });
}
