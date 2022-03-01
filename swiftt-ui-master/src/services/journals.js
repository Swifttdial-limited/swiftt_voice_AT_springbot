import { config, request } from '../../utils';

const { api } = config;
const { accounting } = api;
const { journals } = accounting;

export async function query(params) {
  return request(journals, {
    method: 'get',
    data: params,
  });
}

export async function create(params) {
  return request(journals, {
    method: 'post',
    data: params,

  });
}
