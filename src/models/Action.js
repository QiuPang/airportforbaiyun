import { fetchQueryList,fetchData,fetchStatusChange,fetchDetailData,fetchAddNew} from '@/services/action';
import {message} from 'antd';

const ActionModal={
    namespace:'action',
    state:{
        tableData:null,
        searchData:null,
        detailData:null,
    },
    effects:{
        *queryData({ payload }, { call, put }) {
            const res = yield call(fetchData, payload);
            if(res.code==0){
                yield put({
                    type: 'saveDataList',
                    payload:res.data,
                }); // Login successfully
            }
        },
        *queryStatus({payload},{call,put}){
            const res = yield call(fetchQueryList, payload);
            // console.log('状态返回值',res);
            if(res.code==0){
                yield put({
                    type:'saveStatus',
                    payload:res.data
                })
            }
        },
        *queryStatusChange({payload,callback},{call,put}){
            const res = yield call(fetchStatusChange, payload);
            if(res.code==0){
                message.success('操作成功');
                if(callback){
                    callback()
                }
            }else{
                message.error(res.msg)
            }
        },
        *queryDetailData({payload,callback},{call,put}){
            const res = yield call(fetchDetailData, payload);
            if(res.code==0){
                yield put({
                    type:'saveDetailData',
                    payload:res.data
                })
            }else{
                message.error(res.msg) 
            }
        },
        *queryNewAdd({payload,callback},{call,put}){
            const res = yield call(fetchAddNew, payload);
            if(res.code==0){
                message.success('操作成功，请联系管理员审核')
                if(callback){
                    callback()
                }
            }else{
                message.error(res.msg) 
            }
        }
    },
    reducers:{
        saveDataList(state,{ payload }){
            return {...state,tableData:payload}
        },
        saveStatus(state,{payload}){
            return {...state,searchData:payload}
        },
        saveDetailData(state,{payload}){
            return {...state,detailData:payload}
        }
    },
}
export default ActionModal