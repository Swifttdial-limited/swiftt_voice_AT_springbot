import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { patientProfile } = api;
const { guardians, guardian } = patientProfile;

export async function query(params) {
  return request(pathToRegexp.compile(guardians)(params), {
    method: 'GET',
  });
}

export async function create(params) {
  return request(pathToRegexp.compile(guardians)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  console.log(params)
  return request(pathToRegexp.compile(guardian)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(guardian)(params), {
    method: 'DELETE',
    body: params,
  });
}
