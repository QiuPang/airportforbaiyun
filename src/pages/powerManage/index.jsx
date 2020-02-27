import React, {Component, useState,useRef } from 'react';
import { Button, Divider, Dropdown, Menu, message,Card,Row,Col,Icon,Table,Popconfirm} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import { PlusOutlined } from '@ant-design/icons';
import AddModal from './addModal'

@connect(({ powerManage,user, loading }) => ({
  powerManage: powerManage,
  currentUser:user.currentUser,
  loading: loading.effects['powerManage/queryList'],
}))
export default class PowerManage extends Component{
  state={
    modalShow:false,
    title:'',
    recordData:null,
    isEdit:false,
  }

  columns=[
    {
      title: '序号',
      dataIndex: 'uid',
      key:'uid',
    },
    {
      title: '账户名',
      dataIndex: 'uname',
      // key:'uname',
    },
    {
      title: '权限角色',
      dataIndex: 'role_name',
      // key:'role_name',
    },
    {
      title: '操作',
      render:(text,record)=>(
        <span>
        <a onClick={()=>this.edit(record)} disabled={record['uid']==this.props.currentUser['userid']}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm
          title="确定删除?"
          onConfirm={()=>this.del(record)}
          onCancel={this.cancel}
          okText="确定"
          cancelText="取消"
        >
          <a  href="#">删除</a>
        </Popconfirm>
        
      </span>
      )
    },
  ]

  

  componentDidMount(){
    const {dispatch}=this.props;
    dispatch({
      type:'powerManage/queryList'
    })
  }

  // 编辑
  edit=(record)=>{
    this.setState({
      modalShow:true,
      title:'修改密码',
      recordData:record,
      isEdit:true
    })
  }

  //删除
  del=(record)=>{
    const {dispatch}=this.props;
    const callback=()=>{
      dispatch({
        type:'powerManage/queryList'
      })
    }
    dispatch({
      type:'powerManage/delUser',
      payload:{
        uid:record.uid,
      },
      callback:callback,
    })
  }

  // 删除取消
  cancel=(e)=>{
  }

  // 函数区域
  add=()=>{
    this.setState({
      modalShow:true,
      title:'新增账号',
      isEdit:false,
    })
  }

  // 分页
  onBaseClick=(current,pageSize)=>{
    const {dispatch}=this.props;
    dispatch({
      type: "powerManage/queryList",
      payload: {
        page:current,
        size:pageSize
      }
    })
  }

  // 弹层确定
  modalOk=(data)=>{
    const {dispatch}=this.props;
    const callback=()=>{
      this.setState({
        modalShow:false,
        title:'',
        isEdit:false,
        recordData:null,
      })
      dispatch({
        type:'powerManage/queryList'
      })
    }
    dispatch({
      type:'powerManage/addUser',
      payload:data,
      callback,
    })
  }

  // 弹层取消
  modalCancel=()=>{
    this.setState({
      modalShow:false,
      title:'',
    })
  }

  // 编辑确定
  onEditOk=(data)=>{
    const {dispatch}=this.props;
    const callback=()=>{
      this.setState({
        modalShow:false,
        title:'',
        isEdit:false,
        recordData:null,
      })
    }
    dispatch({
      type:'powerManage/editPwd',
      payload:data,
      callback,
    })
  }


  render(){
    const {powerManage:{manageData},currentUser}=this.props;
    const {modalShow,title,recordData,isEdit}=this.state;

    return (<PageHeaderWrapper>
      <div className={styles.main}>
        <Card>
          <Row>
            <Col key="1">
              <Button  type="primary" onClick={this.add}><PlusOutlined />新增</Button>
            </Col>
            <Col key="2" span={24} style={{marginTop:'20px'}}>
              <Table 
                columns={this.columns}
                rowKey="uid"
                dataSource={manageData&&manageData.list||[]}
                pagination={{
                  total:manageData&&manageData.count,
                  current:manageData&&manageData.page,
                  pageSizeOptions:['10','20','30','40','50'],
                  showSizeChanger:true,
                  pageSize:manageData&&manageData.size,
                  showTotal: (count=manageData&&manageData.count)=>{
                    return '共'+count+'条数据'
                  },
                  onChange:(current,pageSize)=>{
                    this.onBaseClick(current,pageSize)
                  },
                  onShowSizeChange:(current,pageSize)=>{
                    this.onBaseClick(current,pageSize)
                  }
                }}
              /> 
            </Col>
          </Row>
        </Card>
      </div>
      {/* 弹层 */}
      <AddModal
        modalShow={modalShow}
        title={title}
        onOk={this.modalOk}
        onCancel={this.modalCancel}
        record={recordData}
        isEdit={isEdit}
        onEditOk={this.onEditOk}
      />
    </PageHeaderWrapper>)
  }
}
