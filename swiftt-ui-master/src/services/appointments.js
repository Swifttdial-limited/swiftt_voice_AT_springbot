import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { appointments, appointment, appointmentActions } = api;

export async function query(params) {
  return request(appointments, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(appointments, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(appointment)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(appointment)(params), {
    method: 'DELETE',
  });
}

////////////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(appointment)(params), {
    method: 'GET',
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(appointmentActions)(params), {
    method: 'POST',
    body: params,
  });
}
