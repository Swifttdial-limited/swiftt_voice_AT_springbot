import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { locations, location } = api;

export async function query(params) {
  return request(locations, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(locations, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(location)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(location)(params), {
    method: 'PATCH',
    body: params,
  });
}
