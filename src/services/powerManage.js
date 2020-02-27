import request from '@/utils/request';
export async function fetchManageList(params) {
  return request('/back/user/select', {
    method: 'POST',
    data:params,
  });
}

export async function fetchDelUser(params) {
    return request('/back/user/delete', {
      method: 'POST',
      data:params,
    });
}

export async function fetchAddUser(params) {
    return request('/back/user/register', {
      method: 'POST',
      data:params,
    });
}

export async function fetchEditUser(params) {
    return request('/back/user/update', {
      method: 'POST',
      data:params,
    });
}