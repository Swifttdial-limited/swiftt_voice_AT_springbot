import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { procurement } = api;
const {
  receiptNotes,
  receiptNote,
  receiptNoteActions,
  receiptNoteGoodsReturns
} = procurement;

export async function query(params) {
  return request(receiptNotes, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(receiptNotes, {
    method: 'POST',
    body: params,
  });
}

export async function applyAction(params) {
  return request(pathToRegexp.compile(receiptNoteActions)(params), {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(receiptNote)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(receiptNote)(params), {
    method: 'DELETE',
    body: params,
  });
}


// //////////////////////////////////////
export async function queryOne(params) {
  return request(pathToRegexp.compile(receiptNote)(params), {
    method: 'GET',
  });
}

export async function createGoodsReturn(params) {
  return request(pathToRegexp.compile(receiptNoteGoodsReturns)(params), {
    method: 'POST',
    body: params.payload,
  });
}
