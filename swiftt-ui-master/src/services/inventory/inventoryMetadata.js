import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const {
  inventoryMetadata,
  inventoryMetadataActions,
} = inventory;

export async function query(params) {
  return request(inventoryMetadata, {
    method: 'GET',
    body: params,
  });
}

////////////////////////////////////////////////////

export async function applyAction(params) {
  return request(pathToRegexp.compile(inventoryMetadataActions)(params), {
    method: 'POST',
    body: params,
  });
}
