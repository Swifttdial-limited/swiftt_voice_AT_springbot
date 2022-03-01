import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { patientProfile } = api;
const {
  paymentWallets, paymentWallet, paymentWalletActions
} = patientProfile;

export async function query(params) {
  return request(pathToRegexp.compile(paymentWallets)(params), {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(pathToRegexp.compile(paymentWallets)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(paymentWallet)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(paymentWallet)(params), {
    method: 'DELETE',
    body: params,
  });
}

///////////////////////////////////////////////////////////////////////////

export async function applyAction(params) {
  return request(pathToRegexp.compile(paymentWalletActions)(params), {
    method: 'POST',
    body: params,
  });
}
