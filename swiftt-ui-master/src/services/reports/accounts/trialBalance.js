import config from '../../../utils/config';
import request from '../../../utils/request';

const { api } = config;
const { reports } = api;
const { accounts } = reports;
const { trialBalance } = accounts;

export async function query(params) {
  return request(trialBalance, {
    method: 'GET',
    body: params,
  });
}
