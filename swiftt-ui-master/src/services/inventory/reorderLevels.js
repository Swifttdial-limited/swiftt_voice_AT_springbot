import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { reorderLevels, reorderLevel } = inventory;

export async function query(params) {
  return request(reorderLevels, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(reorderLevels, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(reorderLevel)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(reorderLevel)(params), {
    method: 'PATCH',
    body: params,
  });
}
