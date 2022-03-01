import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { stockTakeLists, stockTakeList, stockTakeListActions } = inventory;

export async function query(params) {
  return request(stockTakeLists, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(stockTakeLists, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(stockTakeListActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(stockTakeList)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(stockTakeList)(params), {
    method: 'DELETE',
    body: params,
  });
}


// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(stockTakeList)(params), {
    method: 'GET',
  });
}
