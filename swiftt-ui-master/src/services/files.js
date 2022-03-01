import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const {
  files,
  file,
  folders,
  folder
} = api;

export async function query(params) {
  return request(files, {
    method: 'GET',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(file)(params), {
    method: 'DELETE',
  });
}


/////////////////////////////////////////////////////////////////
export async function queryFolders(params) {
  return request(folders, {
    method: 'GET',
    body: params,
  });
}

export async function createFolder(params) {
  return request(folders, {
    method: 'POST',
    body: params,
  });
}

export async function updateFolder(params) {
  return request(pathToRegexp.compile(folder)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function removeFolder(params) {
  return request(pathToRegexp.compile(folder)(params), {
    method: 'DELETE',
    body: params,
  });
}
