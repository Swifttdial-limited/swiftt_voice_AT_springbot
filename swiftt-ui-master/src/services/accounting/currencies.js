import pathToRegexp from 'path-to-regexp';

import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { accounting } = api;
const { currencies } = accounting;

export async function query(params) {
  return request(currencies, {
    method: 'GET',
    body: params,
  });
}
