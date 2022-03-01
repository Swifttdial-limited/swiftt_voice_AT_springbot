import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { inventoryTransfers, inventoryTransfer, inventoryTransferActions } = inventory;

export async function query(params) {
  return request(inventoryTransfers, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(inventoryTransfers, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(inventoryTransferActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(inventoryTransfer)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(inventoryTransfer)(params), {
    method: 'DELETE',
    body: params,
  });
}


// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(inventoryTransfer)(params), {
    method: 'GET',
  });
}
