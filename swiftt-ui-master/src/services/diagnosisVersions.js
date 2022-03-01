import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { diagnosisVersions, diagnosisVersion } = api;

export async function query(params) {
  return request(diagnosisVersions, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(diagnosisVersions, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(diagnosisVersion)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(diagnosisVersion)(params), {
    method: 'PATCH',
    body: params,
  });
}
