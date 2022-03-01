import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { medicalRecords } = api;
const { arrivalMean, arrivalMeans } = medicalRecords;

export async function query(params) {
  return request(arrivalMeans, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(arrivalMeans, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(arrivalMean)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(arrivalMean)(params), {
    method: 'PATCH',
    body: params,
  });
}
