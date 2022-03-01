import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { accessControl } = api;
const { profile, profileActions } = accessControl;

export async function query(params) {
  return request(profile, {
    method: 'GET',
  });
}

export async function update(params) {
  return request(profile, {
    method: 'PATCH',
    body: params,
  });
}

export async function applyAction(params) {
  return request(profileActions, {
    method: 'POST',
    body: params,
  });
}
