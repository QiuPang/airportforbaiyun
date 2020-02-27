import { stringify } from 'querystring';
import { router } from 'umi';
import { fakeAccountLogin,fetchOut } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { stat } from 'fs';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response.code === 0) {
        // 登陆成功
        yield put({
          type: 'changeLoginStatus',
          payload: {
            role_id:response.data.role_id,
            status:'ok',
            type:'account'
          },
        }); // Login successfully
        localStorage.setItem('authorization',response.data.token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }else{
        // 登录失败
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status:'error',
            type:'account'
          },
        }); // Login successfully
      }
    },

    *logout({payload},{call,put}) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      const res=yield call(fetchOut,payload)
      localStorage.removeItem('authorization');
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log('权限',payload);
      setAuthority(payload.role_id||'')
      // return { ...state, status: payload.status, type: payload.type };
      return { ...state, ...payload}
    },
  },
};
export default Model;
