import pathToRegexp from 'path-to-regexp';

import config from '../utils/config'; import request from '../utils/request';

const { api } = config;
const { standardsPreferences, standardsPreference } = api;

export async function query(params) {
  return request(standardsPreferences, {
    method: 'GET',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(standardsPreference)(params), {
    method: 'PATCH',
    body: params,
  });
}
