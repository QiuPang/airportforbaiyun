import request from '@/utils/request';
export async function fetchQueryList(params) {
  return request('/back/advertise/items', {
    method: 'POST',
    data: params,
  });
}

// 列表
export async function fetchData(params) {
  return request('/back/advertise/select', {
    method: 'POST',
    data: params,
  });
}

export async function fetchStatusChange(params) {
    return request('/back/advertise/status', {
      method: 'POST',
      data: params,
    });
}

export async function fetchDetailData(params) {
    return request('/back/advertise/info', {
      method: 'POST',
      data: params,
    });
}

export async function fetchAddNew(params) {
  return request('/back/advertise/save', {
    method: 'POST',
    data: params,
  });
}