import pathToRegexp from 'path-to-regexp';

import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { outboundChannels, outboundChannel } = api;

export async function query(params) {
  return request(outboundChannels, {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(outboundChannels, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(pathToRegexp.compile(outboundChannel)(params), {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return request(pathToRegexp.compile(outboundChannel)(params), {
    method: 'DELETE',
  });
}
