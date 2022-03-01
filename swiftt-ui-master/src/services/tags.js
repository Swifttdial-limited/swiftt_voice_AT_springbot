import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { object, objects } = api;

export async function query(params) {
  return request(objects, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(objects, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(object)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(object)(params), {
    method: 'DELETE',
    body: params,
  });
}
