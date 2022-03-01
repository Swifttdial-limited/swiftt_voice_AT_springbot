import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { organogramNode, organogramNodes } = api;

export async function query(params) {
  return request(organogramNodes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(organogramNodes, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(organogramNode)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(organogramNode)(params), {
    method: 'DELETE',
    body: params,
  });
}
