import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { creditNote, creditNotes ,creditNoteActions} = accounting;

export async function query(params) {
  return request(creditNotes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(creditNotes, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(creditNoteActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(creditNote)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(creditNote)(params), {
    method: 'DELETE',
    body: params,
  });
}


// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(creditNote)(params), {
    method: 'GET',
  });
}
