import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config'; import request from '../../utils/request';

const { api } = config;
const { medicalRecords } = api;
const { appointmentType, appointmentTypes } = medicalRecords;

export async function query(params) {
  return request(appointmentTypes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(appointmentTypes, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(appointmentType)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(appointmentType)(params), {
    method: 'PATCH',
    body: params,
  });
}
