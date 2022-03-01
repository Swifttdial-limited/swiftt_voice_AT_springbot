import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { scheme, schemes } = accounting;

export async function query(params) {
  return request(schemes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(schemes, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(scheme)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(scheme)(params), {
    method: 'PATCH',
    body: params,
  });
}

// /////////////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(scheme)(params), {
    method: 'GET',
  });
}
