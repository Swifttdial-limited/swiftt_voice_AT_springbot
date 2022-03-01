import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { beds, bed } = api;

export async function query(params) {
  return request(beds, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(beds, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(bed)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(bed)(params), {
    method: 'DELETE',
    body: params,
  });
}
