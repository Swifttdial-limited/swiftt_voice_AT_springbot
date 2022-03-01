import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { catalogue } = api;
const { administrationRoute, administrationRoutes } = catalogue;

export async function query(params) {
  return request(administrationRoutes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(administrationRoutes, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(administrationRoute)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(administrationRoute)(params), {
    method: 'PATCH',
    body: params,
  });
}
