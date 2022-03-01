import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { inventoryPreferences, inventoryPreference } = inventory;

export async function query(params) {
  return request(inventoryPreferences, {
    method: 'GET',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(inventoryPreference)(params), {
    method: 'PATCH',
    body: params,
  });
}
