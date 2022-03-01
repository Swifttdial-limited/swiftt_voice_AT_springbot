import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const {
  inventoryAdjustments,
  inventoryAdjustment,
  inventoryAdjustmentActions
} = inventory;

export async function query(params) {
  return request(inventoryAdjustments, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(inventoryAdjustments, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(inventoryAdjustmentActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(inventoryAdjustment)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(inventoryAdjustment)(params), {
    method: 'DELETE',
    body: params,
  });
}
// //////////////////////////////////////

export async function queryOne(params) {
  return request(pathToRegexp.compile(inventoryAdjustment)(params), {
    method: 'GET',
  });
}
