import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { regions, region } = api;

export async function query(params) {
  return request(regions, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(regions, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(region)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(region)(params), {
    method: 'PATCH',
    body: params,
  });
}
