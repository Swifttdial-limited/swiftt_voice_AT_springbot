import config from '../utils/config'; import request from '../utils/request';

const { api } = config;
const { diagnoses } = api;

export async function query(params) {
  return request(diagnoses, {
    method: 'GET',
    body: params,
  });
}
