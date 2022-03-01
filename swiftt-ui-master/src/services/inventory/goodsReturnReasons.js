import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { goodsReturnReasons, goodsReturnReason } = inventory;

export async function query(params) {
  return request(goodsReturnReasons, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(goodsReturnReasons, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(goodsReturnReason)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(goodsReturnReason)(params), {
    method: 'DELETE',
    body: params,
  });
}
