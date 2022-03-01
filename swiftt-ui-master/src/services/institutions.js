import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { institution, institutions, me } = api;
const { myInstitution } = me;

export async function create(params) {
  return request(institutions, {
    method: 'POST',
    body: params,
  });
}

export async function query(params) {
  return request(institutions, {
    method: 'GET',
    body: params,
  });
}

export async function queryOne(params) {
  return request(pathToRegexp.compile(institution)(params), {
    method: 'GET',
  });
}

export async function update(params) {
  return request(myInstitution, {
    method: 'PATCH',
    body: params,
  });
}

////////////////////////////////////////////////////////////////

export async function queryMyInstitution(params) {
  return request(myInstitution, {
    method: 'GET',
  });
}
