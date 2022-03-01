import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { accessControl } = api;
const { privileges } = accessControl;

export async function query(params) {
  return request(privileges, {
    method: 'GET',
    body: params,
  });
}
