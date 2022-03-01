import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { catalogue } = api;
const {
  products,
  product,
  productActions,
} = catalogue;

export async function query(params) {
  return request(products, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(products, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(product)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(product)(params), {
    method: 'PATCH',
    body: params,
  });
}

// ////////////////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(product)(params), {
    method: 'GET',
  });
}

// ////////////////////////////////////////////////////
export async function applyActionToMany(params) {
  return request(pathToRegexp.compile(products)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(productActions)(params), {
    method: 'POST',
    body: params,
  });
}
