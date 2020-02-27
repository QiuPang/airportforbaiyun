import request from '@/utils/request';
export async function fetchActionData(params) {
  return request('/back/statistic/select', {
    method: 'POST',
    data: params,
  });
}


export async function fetchDownload() {
  return request('/back/statistic/download', {
    method: 'POST',
  });
}

// export async function fetchOut(params) {
//   return request('/qy/back/user/loginOut', {
//     method: 'POST',
//     data: params,
//   });
// }