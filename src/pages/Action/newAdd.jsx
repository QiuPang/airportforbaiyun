import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card,Row,Col,Popover } from 'antd';
import { connect} from 'dva';
import { FileImageOutlined,YoutubeFilled} from '@ant-design/icons';
import Public from './components/public';
import {router} from 'umi';

class NewAdd extends React.Component {
    state={

    }

    componentDidMount(){

    }

    add=(data)=>{
        const {dispatch}=this.props;
        const callback=()=>{
            router.push({
                pathname:`/adver/action`
            })
        }
        dispatch({
            type:'action/queryNewAdd',
            payload:data,
            callback,
        })
    }

    render(){
        return <PageHeaderWrapper>
            <Public
                addNew={this.add}
            />
        </PageHeaderWrapper>
    }

}

export default connect(({ action, loading }) => ({
    // detailData: action.detailData,
    // tableData:action.tableData,
    loading: loading.models.action,
}))(NewAdd);