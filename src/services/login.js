import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/back/user/login', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/login/captcha?mobile=${mobile}`);
}

export async function fetchOut(params) {
  return request('/back/user/loginOut', {
    method: 'POST',
    data: params,
  });
}
