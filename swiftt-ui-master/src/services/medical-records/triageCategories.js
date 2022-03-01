import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { medicalRecords } = api;
const { triageCategory, triageCategories } = medicalRecords;

export async function query(params) {
  return request(triageCategories, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(triageCategories, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(triageCategory)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(triageCategory)(params), {
    method: 'PATCH',
    body: params,
  });
}
