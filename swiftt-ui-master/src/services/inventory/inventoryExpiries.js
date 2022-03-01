import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { inventory } = api;
const { inventoryExpiries } = inventory;

export async function query(params) {
  return request(inventoryExpiries, {
    method: 'GET',
    body: params,
  });
}
