import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { procurement } = api;
const { requisitions, requisition, requisitionActions } = procurement;

export async function query(params) {
  return request(requisitions, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(requisitions, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(requisitionActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(requisition)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(requisition)(params), {
    method: 'DELETE',
    body: params,
  });
}


// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(requisition)(params), {
    method: 'GET',
  });
}
