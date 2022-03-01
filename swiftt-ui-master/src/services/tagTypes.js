import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { objectType, objectTypes } = api;

export async function query(params) {
  return request(objectTypes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(objectTypes, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(objectType)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(objectType)(params), {
    method: 'DELETE',
    body: params,
  });
}
