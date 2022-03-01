import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { account, accounts, accountActions, printAccountListings } = accounting;

export async function query(params) {
  return request(accounts, {
    method: 'GET',
    body: params,
  });
}
export async function fetchPrintAccountListings(params) {
  return request(printAccountListings, {
    method: 'GET',
    body: params,
    file:true,
  });
}

export async function create(params) {
  return request(accounts, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(account)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(account)(params), {
    method: 'PATCH',
    body: params,
  });
}
////////////////////////////////////////////////////////////////
export async function queryNextAccountNumber(params) {
  return request(pathToRegexp.compile(accountActions)(params), {
    method: 'POST',
    body: params,
  });
}
