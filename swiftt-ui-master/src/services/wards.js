import config from '../utils/config'; import request from '../utils/request';

const { api } = config;
const { wards } = api;

export async function query(params) {
  return request(wards, {
    method: 'GET',
    body: params,
  });
}
