import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { userProfile } = api;
const { nextOfKins, nextOfKin } = userProfile;

export async function query(params) {
  return request(pathToRegexp.compile(nextOfKins)(params), {
    method: 'GET',
  });
}

export async function create(params) {
  return request(pathToRegexp.compile(nextOfKins)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  console.log(params)
  return request(pathToRegexp.compile(nextOfKin)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(nextOfKin)(params), {
    method: 'DELETE',
    body: params,
  });
}
