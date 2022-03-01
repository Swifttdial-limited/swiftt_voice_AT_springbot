import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { paymentTerm, paymentTerms } = accounting;

export async function query(params) {
  return request(paymentTerms, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(paymentTerms, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(paymentTerm)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(paymentTerm)(params), {
    method: 'PATCH',
    body: params,
  });
}
