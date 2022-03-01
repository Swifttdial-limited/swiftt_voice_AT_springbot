import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { fixed_asset } = api;
const {
  assets,
  asset,
  assetActions,
  assetInsurances,
  assetWarranties
} = fixed_asset;

export async function query(params) {
  return request(assets, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(assets, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(asset)(params), {
    method: 'DELETE',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(asset)(params), {
    method: 'PATCH',
    body: params,
  });
}

// ////////////////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(asset)(params), {
    method: 'GET',
  });
}


export async function applyAction(params) {
  return request(pathToRegexp.compile(assetActions)(params), {
    method: 'POST',
    body: params,
  });
}

///////////////////////////////////////////////////////////////

export async function queryAssetInsurances(params) {
  return request(pathToRegexp.compile(assetInsurances)(params), {
    method: 'GET',
  });
}

export async function queryAssetWarranties(params) {
  return request(pathToRegexp.compile(assetWarranties)(params), {
    method: 'GET',
  });
}
