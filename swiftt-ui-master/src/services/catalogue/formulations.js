import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { catalogue } = api;
const { formulation, formulations } = catalogue;

export async function query(params) {
  return request(formulations, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(formulations, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(formulation)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(formulation)(params), {
    method: 'PATCH',
    body: params,
  });
}
