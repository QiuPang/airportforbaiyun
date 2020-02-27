import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/back/user/info',{
    method: 'POST',
    data:{},
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
