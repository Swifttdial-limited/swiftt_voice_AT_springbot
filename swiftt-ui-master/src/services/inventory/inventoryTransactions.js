import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { inventoryTransactions } = inventory;

export async function query(params) {
  return request(inventoryTransactions, {
    method: 'GET',
    body: params,
  });
}
