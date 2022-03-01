import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { medicalRecords } = api;
const { templates, template, requestInvestigations,visitInvestigation, actions } = medicalRecords;

export async function query(params) {
  return request(templates, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(templates, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(template)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(template)(params), {
    method: 'DELETE',
    body: params,
  });
}
// request/:requestId/requestItem/:requestItemId/investigations
export async function getRequestItemTemplates(params) {
  return request(pathToRegexp.compile(requestInvestigations)(params), {
    method: 'GET',
    body: params,
  });
}
export async function getVisitInvestigationsResults(params) {
  return request(pathToRegexp.compile(visitInvestigation)(params), {
    method: 'GET',
    body: params,
  });
}
// request/:requestId/requestItem/:requestItemId/actions
export async function requestItemsTemplateAction(params) {
  return request(pathToRegexp.compile(actions)(params), {
    method: 'POST',
    body: params,
  });
}
