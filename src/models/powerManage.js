import { fetchManageList,fetchDelUser,fetchAddUser,fetchEditUser } from '@/services/powerManage';
import {message} from 'antd';

const PowerManageModal={
    namespace:'powerManage',
    state:{
        manageData:null,
    },
    effects:{
        *queryList({ payload }, { call, put }) {
            const {data} = yield call(fetchManageList, payload);
            if(data){
                yield put({
                    type: 'saveManageList',
                    payload:data,
                }); // Login successfully
            }
        },
        *delUser({payload,callback},{call,put}){
            const response= yield call(fetchDelUser, payload);
            if(response.code==0){
                message.success('操作成功');
                if(callback){
                    callback();
                }
            }else{
                message.error(response.msg||'出现错误');
            }
        },
        *addUser({payload,callback},{call,put}){
            const response= yield call(fetchAddUser, payload);
            if(response.code==0){
                message.success('操作成功');
                if(callback){
                    callback();
                }
            }else{
                message.error(response.msg)
            }
        },
        *editPwd({payload,callback},{call,put}){
            const response= yield call(fetchEditUser, payload);
            if(response.code==0){
                message.success('操作成功');
                if(callback){
                    callback();
                }
            }else{
                message.error(response.msg)
            }
        }
    },
    reducers:{
        saveManageList(state,{ payload }){
            return {...state,manageData:payload}
        }
    },
}
export default PowerManageModal