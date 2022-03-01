import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { paymentMode, paymentModes } = accounting;

export async function query(params) {
  return request(paymentModes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(paymentModes, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(paymentMode)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(paymentMode)(params), {
    method: 'PATCH',
    body: params,
  });
}
