import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { countries } = api;

export async function query(params) {
  return request(countries, {
    method: 'GET',
    body: params,
  });
}
