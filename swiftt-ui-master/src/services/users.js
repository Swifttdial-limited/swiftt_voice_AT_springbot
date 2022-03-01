import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { accessControl, userProfile } = api;
const {
  users,
  user,
  userActions,
  usersByRole,
  userIdentifications,
  userIdentification,
  userRoles,
  userRole,
  userSpecializations,
  userSpecialization,
} = accessControl;
const { nextOfKins } = userProfile;

export async function query(params) {
  return request(users, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(users, {
    method: 'POST',
    body: params,
  });
}

////////////////////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(user)(params), {
    method: 'GET',
  });
}

export async function queryNextOfKins(params) {
  return request(pathToRegexp.compile(nextOfKins)(params), {
    method: 'GET',
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(user)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(user)(params), {
    method: 'DELETE',
  });
}

/////////////////////////////////////////////////////////////
export async function applyAction(params) {
  return request(pathToRegexp.compile(userActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function queryRoles(params) {
  return request(pathToRegexp.compile(userRoles)(params), {
    method: 'GET',
  });
}

export async function addRole(params) {
  return request(pathToRegexp.compile(userRoles)(params), {
    method: 'POST',
    body: params,
  });
}

export async function removeRole(params) {
  return request(pathToRegexp.compile(userRole)(params), {
    method: 'DELETE',
  });
}

////////////////////////////////////////////////////////////////
export async function queryUserIdentifications(params) {
  return request(pathToRegexp.compile(userIdentifications)(params), {
    method: 'GET',
    body: params,
  });
}

export async function createUserIdentification(params) {
  return request(pathToRegexp.compile(userIdentifications)(params), {
    method: 'POST',
    body: params,
  });
}

///////////////////////////////////////////////////////////////

export async function queryUserSpecializations(params) {
  return request(pathToRegexp.compile(userSpecializations)(params), {
    method: 'GET',
  });
}

export async function createUserSpecialization(params) {
  return request(pathToRegexp.compile(userSpecializations)(params), {
    method: 'POST',
    body: params,
  });
}

export async function updateUserSpecialization(params) {
  return request(pathToRegexp.compile(userSpecialization)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function removeUserSpecialization(params) {
  return request(pathToRegexp.compile(userSpecialization)(params), {
    method: 'DELETE',
  });
}

////////////////////////////////////////////////////////////////

export async function queryUsersByRole(params) {
  return request(pathToRegexp.compile(usersByRole)(params), {
    method: 'GET',
    body: params,
  });
}
