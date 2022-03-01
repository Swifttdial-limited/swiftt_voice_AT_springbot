import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { binLocations, binLocation } = inventory;

export async function query(params) {
  return request(binLocations, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(binLocations, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(binLocation)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(binLocation)(params), {
    method: 'PATCH',
    body: params,
  });
}
