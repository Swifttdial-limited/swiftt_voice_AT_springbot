import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { locationType, locationTypes } = api;

export async function query(params) {
  return request(locationTypes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(locationTypes, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(locationType)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(locationType)(params), {
    method: 'DELETE',
    body: params,
  });
}
