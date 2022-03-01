import pathToRegexp from 'path-to-regexp';

import config from '../utils/config'; import request from '../utils/request';

const { api } = config;
const { userProfile } = api;
const { biometrics } = userProfile;

export async function query(params) {
  return request(pathToRegexp.compile(biometrics)(params), {
    method: 'GET',
  });
}

export async function create(params) {
  return request(pathToRegexp.compile(biometrics)(params), {
    method: 'POST',
    body: params,
  });
}
