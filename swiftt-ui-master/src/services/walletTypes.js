import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { billing } = api;
const { walletType, walletTypes } = billing;

export async function query(params) {
  return request(walletTypes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(walletTypes, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(walletType)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(walletType)(params), {
    method: 'PATCH',
    body: params,
  });
}
