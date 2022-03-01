import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { accountingPreferences, accountingPreference } = accounting;

export async function query(params) {
  return request(accountingPreferences, {
    method: 'GET',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(accountingPreference)(params), {
    method: 'PATCH',
    body: params,
  });
}
