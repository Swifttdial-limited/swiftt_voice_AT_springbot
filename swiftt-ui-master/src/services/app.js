import { stringify } from 'qs';

import request from '../utils/request';
import config from '../utils/config';

const { api, dev } = config;
const { authentication } = api;
const { userLogin } = authentication;
const { clientId, clientSecret, grantType } = dev;

export async function login(params) {
  const authorizationHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  params.grant_type = grantType;

  return request(userLogin, {
    login: true,
    method: 'POST',
    body: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${authorizationHeader}`,
    },
  });
}

export async function logout(params) {
  return request('/api/logout', {
    method: 'POST',
    body: params,
  });
}

export async function userInfo(params) {
  return request('/api/userInfo', {
    method: 'GET',
    body: params,
  });
}
