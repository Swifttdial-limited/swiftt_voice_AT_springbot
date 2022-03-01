import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { queue, encounterProfile } = api;
const { req, requests, requestActions, requestItems, requestItem, requestItemActions } = queue;
const { requestItemsByEncounter } = encounterProfile;

export async function query(params) {
  return request(requests, {
    method: 'GET',
    body: params,
  });
}

// /////////////////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(req)(params), {
    method: 'GET',
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(requestActions)(params), {
    method: 'POST',
    body: params,
  });
}

// ///////////////////////////////////////////////////////////////
/**
 * Function for getting a request Item
 * @param params {requestId,requestItemId }
 * @returns {Promise<*>}
 */

export async function getRequestItem(params) {
  return request(pathToRegexp.compile(requestItem)(params), {
    method: 'GET',
    body: params,
  });
}


/**
 * Will be used to update Request Item action for FULFILL
 * @param params
 * @returns {Promise<*>}
 */
export async function updateRequestItemActions(params) {
  return request(pathToRegexp.compile(requestItemActions)(params), {
    method: 'POST',
    body: params,
  });
}

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function updateRequestItems(params) {
  return request(pathToRegexp.compile(requestActions)(params), {
    method: 'POST',
    body: params,
  });
}
// request/:id/requestItem
export async function getRequestItems(params) {
  return request(pathToRegexp.compile(requestItems)(params), {
    method: 'GET',
    body: params,
  });
}
// visits/:encounterId/requestItems
export async function getRequestItemsByEncounter(params) {
  return request(pathToRegexp.compile(requestItemsByEncounter)(params), {
    method: 'GET',
    body: params,
  });
}
