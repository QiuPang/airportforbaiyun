import { fetchActionData,fetchDownload } from '@/services/actionData';
import {message} from 'antd';

const ActionDataModal={
    namespace:'actionData',
    state:{
        data:null,
    },
    effects:{
        *queryData({ payload }, { call, put }) {
            const {data} = yield call(fetchActionData, payload);
            if(data){
                yield put({
                    type: 'saveActionData',
                    payload:data,
                }); // Login successfully
            }
        },
        *queryDownload({ payload }, { call, put }){
            const res=yield call(fetchDownload);
            if(res.code==0){
                window.location.href=res.data.url;
            }else{
                message.error(res.msg);
            }
        }
    },
    reducers:{
        saveActionData(state,{ payload }){
            return {...state,data:payload}
        }
    },
}
export default ActionDataModal