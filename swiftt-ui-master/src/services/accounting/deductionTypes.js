import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { deductionType, deductionTypes } = accounting;

export async function query(params) {
  return request(deductionTypes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(deductionTypes, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(deduction)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(deduction)(params), {
    method: 'PATCH',
    body: params,
  });
}
