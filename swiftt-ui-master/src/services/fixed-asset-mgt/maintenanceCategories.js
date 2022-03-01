import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { fixed_asset } = api;
const { maintenanceCategories, maintenanceCategory, maintenanceCategoryActions } = fixed_asset;

export async function query(params) {
  return request(maintenanceCategories, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(maintenanceCategories, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(maintenanceCategory)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(maintenanceCategory)(params), {
    method: 'PATCH',
    body: params,
  });
}

// ////////////////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(maintenanceCategory)(params), {
    method: 'GET',
  });
}


export async function applyAction(params) {
  return request(pathToRegexp.compile(maintenanceCategoryActions)(params), {
    method: 'POST',
    body: params,
  });
}
