import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { titles, title } = api;

export async function query(params) {
  return request(titles, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(titles, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(title)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(title)(params), {
    method: 'PATCH',
    body: params,
  });
}
