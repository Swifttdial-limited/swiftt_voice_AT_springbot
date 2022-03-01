import config from '../utils/config';
import request from '../utils/request';

const { api } = config;
const { patients } = api;

export async function query(params) {
  return request(patients, {
    method: 'GET',
    body: params,
  });
}

export async function queryPatientsCount(params) {
  return request('/api/v1/patients/action/countNewToday', {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request(patients, {
    method: 'POST',
    body: params,
  });
}
