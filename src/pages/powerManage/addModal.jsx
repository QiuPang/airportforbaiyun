import React, {Component, useState,useRef } from 'react';
import {Modal,Form,Input,Button,Row,Col,message} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import { PlusOutlined } from '@ant-design/icons';

export default class addModal extends Component{
    state={
        username:'',
        password:'',
        repassword:'',
    }

    onFinish = () => {
        const { onOk, onCancel,modalShow, title,record,isEdit,onEditOk} = this.props;
        const {username,password,repassword}=this.state;
        if(isEdit){
            if(password==repassword&&password.length>5){
                onEditOk({
                    uid:record.uid,
                    password:password
                })
            }else if(password.length<6){
                message.error('用户名和密码长度需要大于6位')
            }else{
                message.error('两次输入密码不一致，请重新输入')
            }
        }else{
            if(username.length<6 ||password.length<6){
                message.error('用户名和密码长度需要大于6位')
            }else{
                onOk({
                    username:username,
                    password:password,
                })
            }

        }
    };

    handleCancel=()=>{
        const {onCancel} = this.props;
        this.setState({
            username:'',
            password:'',
            repassword:'',
        })
        onCancel();
    }

    usernameChange=(e)=>{
        this.setState({
            username:e.target.value,
        })
    }
    passChange=(e)=>{
        this.setState({
            password:e.target.value,
        })
    }
    repassChange=(e)=>{
        this.setState({
            repassword:e.target.value,
        })
    }

    render(){
        const {modalShow,title,isEdit,record}=this.props;
        const {username,password,repassword}=this.state;
        return (<Modal
            title={title}
            visible={modalShow}
            onCancel={this.handleCancel}
            footer={false}
            destroyOnClose
          >
          <Row type="flex" align="middle" justify="center">
              <Col span={24} style={{marginBottom:'10px'}}>
                <label htmlFor="" style={{width:100,display:'inline-block',textAlign:'right',marginRight:'10px'}}>账户:</label>
                <Input 
                    disabled={isEdit} 
                    name="username" 
                    placeholder="此项必填" 
                    value={record&&record.uname||username} 
                    style={{width:300}}
                    onChange={this.usernameChange}
                />
              </Col>
              <Col span={24} style={{marginBottom:'10px'}}>
                <label htmlFor="" style={{width:100,display:'inline-block',textAlign:'right',marginRight:'10px'}}>密码:</label>
                <Input 
                    type="password"  
                    name="password"  
                    placeholder="此项必填" 
                    style={{width:300}}
                    onChange={this.passChange}
                />
              </Col>
              {isEdit&&<Col span={24} style={{marginBottom:'10px'}}>
                <label htmlFor="" style={{width:100,display:'inline-block',textAlign:'right',marginRight:'10px'}}>重复密码:</label>
                <Input
                 type="password" 
                 name="repassword"  
                 style={{width:300}}
                 onChange={this.repassChange}
                 placeholder="此项必填"
                />
              </Col>}
              <Col style={{textAlign:'center'}}>
                  <Button type="primary" onClick={this.onFinish}>确定</Button>
              </Col>
          </Row>
      </Modal>)
    }
}

