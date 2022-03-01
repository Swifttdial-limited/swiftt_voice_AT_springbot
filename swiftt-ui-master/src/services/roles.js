import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { accessControl } = api;
const { roles, role, roleActions, privilegesByRole, usersByRole } = accessControl;

export async function query(params) {
  return request(roles, {
    method: 'GET',
    body: params,
  });
}

export async function queryOne(params) {
  return request(pathToRegexp.compile(role)(params), {
    method: 'GET',
  });
}

export async function create(params) {
  return request(roles, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(role)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(role)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(roleActions)(params), {
    method: 'PATCH',
    body: params.payload,
  });
}

// /////////////////////////////////////////////////////

export async function updateRolePrivileges(params) {
  return request(pathToRegexp.compile(privilegesByRole)(params), {
    method: 'POST',
    body: params.payload,
  });
}

export async function removeRolePrivileges(params) {
  return request(pathToRegexp.compile(privilegesByRole)(params), {
    method: 'DELETE',
    body: params.payload,
  });
}

// //////////////////////////////////////////////////////

export async function addUsers(params) {
  return request(pathToRegexp.compile(usersByRole)(params), {
    method: 'POST',
    body: params.payload,
  });
}

export async function removeUsers(params) {
  return request(pathToRegexp.compile(usersByRole)(params), {
    method: 'DELETE',
    body: params.payload,
  });
}
