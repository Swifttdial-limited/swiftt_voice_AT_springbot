import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { medicalRecords } = api;
const { specimen, specimens } = medicalRecords;

export async function query(params) {
  return request(specimens, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(specimens, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(specimen)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(specimen)(params), {
    method: 'PATCH',
    body: params,
  });
}
