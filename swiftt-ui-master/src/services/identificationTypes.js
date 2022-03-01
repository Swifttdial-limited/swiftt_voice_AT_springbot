import pathToRegexp from 'path-to-regexp';

import config from '../utils/config'; import request from '../utils/request';

const { api } = config;
const { identificationType, identificationTypes } = api;

export async function query(params) {
  return request(identificationTypes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(identificationTypes, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(identificationType)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(identificationType)(params), {
    method: 'DELETE',
    body: params,
  });
}
