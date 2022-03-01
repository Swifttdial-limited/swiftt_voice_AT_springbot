import config from '../../utils/config';
import request from '../../utils/request';

const { api } = config;
const { warranty } = api;
const { assetWarranties } = warranty;
const {
  summarized
} = assetWarranties;

// export async function queryDetailed(params) {
//   return request(detailed, {
//     method: 'GET',
//     body: params,
//   });
// }

export async function querySummarized(params) {
  return request(summarized, {
    method: 'GET',
    body: params,
  });
}
