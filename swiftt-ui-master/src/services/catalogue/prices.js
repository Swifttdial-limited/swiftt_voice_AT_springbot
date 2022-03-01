import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { catalogue } = api;
const { prices, price, priceDeduction, priceDeductions } = catalogue;

export async function query(params) {
  return request(prices, {
    method: 'GET',
    body: params,
  });
}

export async function queryOne(params) {
  return request(pathToRegexp.compile(price)(params), {
    method: 'GET',
  });
}

export async function create(params) {
  return request(prices, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(price)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(price)(params), {
    method: 'PATCH',
    body: params,
  });
}

//////////////////////////////////////////////////////////////////
export async function queryDeductions(params) {
  return request(pathToRegexp.compile(priceDeductions)(params), {
    method: 'GET',
    body: params,
  });
}

export async function createDeduction(params) {
  return request(pathToRegexp.compile(priceDeductions)(params), {
    method: 'POST',
    body: params.priceDeduction,
  });
}

export async function removeDeduction(params) {
  return request(pathToRegexp.compile(priceDeduction)(params), {
    method: 'DELETE',
  });
}

export async function updateDeduction(params) {
  return request(pathToRegexp.compile(priceDeduction)(params), {
    method: 'PATCH',
    body: params,
  });
}
