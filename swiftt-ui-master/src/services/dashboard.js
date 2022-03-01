import request from '../utils/request';

export async function query(params) {
  return request('/api/dashboard', {
    method: 'GET',
    body: params,
  });
}
