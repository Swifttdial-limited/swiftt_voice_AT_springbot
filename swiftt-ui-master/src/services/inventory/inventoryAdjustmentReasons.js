import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { inventoryAdjustmentReasons, inventoryAdjustmentReason } = inventory;

export async function query(params) {
  return request(inventoryAdjustmentReasons, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(inventoryAdjustmentReasons, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(inventoryAdjustmentReason)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(inventoryAdjustmentReason)(params), {
    method: 'DELETE',
    body: params,
  });
}
