import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { billing } = api;
const { deposits, deposit, depositActions } = billing;

export async function query(params) {
  return request(deposits, {
    method: 'GET',
    body: params,
  });
}

export async function queryOne(params) {
  return request(pathToRegexp.compile(deposit)(params), {
    method: 'GET',
  });
}

export async function create(params) {
  return request(deposits, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(deposit)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(depositActions)(params), {
    method: 'POST',
    body: params,
  });
}

////////////////////////////////////////////////
export async function printPatientDeposit(params) {

}
