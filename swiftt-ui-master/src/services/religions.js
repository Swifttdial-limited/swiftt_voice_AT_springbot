import pathToRegexp from 'path-to-regexp';

import config from '../utils/config'; import request from '../utils/request';

const { api } = config;
const { religions, religion } = api;

export async function query(params) {
  return request(religions, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(religions, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(religion)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(religion)(params), {
    method: 'PATCH',
    body: params,
  });
}
