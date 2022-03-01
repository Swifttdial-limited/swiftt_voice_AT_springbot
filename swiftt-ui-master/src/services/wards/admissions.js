import pathToRegexp from 'path-to-regexp';
import { parse, stringify } from 'qs';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { admissions, admission, admissionActions } = api;

export async function query(params) {
  return request(admissions, {
    method: 'GET',
    body: params,
  });
}

export async function queryOne(params) {
  return request(pathToRegexp.compile(admission)(params), {
    method: 'GET',
  });
}

export async function applyActions(params) {
  return request(pathToRegexp.compile(admissionActions)(params), {
    method: 'POST',
    body: params,
  });
}
