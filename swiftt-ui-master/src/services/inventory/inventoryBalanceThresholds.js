import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { inventoryBalanceThresholds } = inventory;

export async function query(params) {
  return request(inventoryBalanceThresholds, {
    method: 'GET',
    body: params,
  });
}
