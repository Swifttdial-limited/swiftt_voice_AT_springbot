import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { catalogue } = api;
const { manufacturers, manufacturer } = catalogue;

export async function query(params) {
  return request(manufacturers, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(manufacturers, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(manufacturer)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(manufacturer)(params), {
    method: 'PATCH',
    body: params,
  });
}
