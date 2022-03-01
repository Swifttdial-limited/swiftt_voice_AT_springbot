import pathToRegexp from 'path-to-regexp';

import config from '../utils/config'; import request from '../utils/request';

const { api } = config;
const { accessControl } = api;
const { userGroups, userGroup, userGroupSpecializations } = accessControl;

export async function query(params) {
  return request(userGroups, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(userGroups, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(userGroup)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(userGroup)(params), {
    method: 'PATCH',
    body: params,
  });
}

///////////////////////////////////////////////////////////////////
export async function querySpecialistsByUserGroup(params) {
  return request(pathToRegexp.compile(userGroupSpecializations)(params), {
    method: 'GET',
  });
}
