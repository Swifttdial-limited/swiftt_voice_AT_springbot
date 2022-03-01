import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { catalogue } = api;
const { priceLists, priceList, priceListActions } = catalogue;

export async function query(params) {
  return request(priceLists, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(priceLists, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(priceList)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(priceList)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(priceListActions)(params), {
    method: 'POST',
    body: params,
  });
}
