import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin ,Modal,Row,Col,Input, message} from 'antd';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  state={
    modalshow:false,
    old_password:'',
    new_password_1:'',
    new_password_2:''
  }
  onMenuClick = event => {
    const {currentUser}=this.props;
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
          payload:{
            uid:currentUser.userid
          }
        });
      }

      return;
    }
    if(key==='settings'){
      console.log('settings');
      this.setState({
        modalshow:true
      })
      return;
    }

    router.push(`/account/${key}`);
  };

  oldPasswordChange=(e)=>{
    this.setState({
      old_password:e.target.value
    })
  }

  newPassword_1=(e)=>{
    this.setState({
      new_password_1:e.target.value
    })
  }
  newPassword_2=(e)=>{
    this.setState({
      new_password_2:e.target.value
    })
  }
  handleOk=()=>{
     const {currentUser,dispatch}=this.props;
     const {old_password,new_password_1,new_password_2}=this.state;
     if(old_password&&new_password_1&&new_password_2){
      if(new_password_1==new_password_2){
       let reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
       if(reg.test(new_password_1)){
        const callback=()=>{
          this.setState({
            modalshow:false,
            old_password:'',
            new_password_1:'',
            new_password_2:''
          },()=>{
            localStorage.removeItem('authorization');
            localStorage.removeItem('antd-pro-authority')
            router.push({
              pathname:'/user/login'
            })
          })

        } 
        dispatch({
          type:'powerManage/editPwd',
          payload:{
            uid:currentUser.userid,
            old_password:old_password,
            password:new_password_1,
          },
          callback,
        })
       }else{
         message.error("新密码需要包含字母和数字且长度在6-20之间")
       }
      }else{
        message.error('新密码两次输入不一致，请重新输入')
      }
     }else{
       message.error('请先填写表单')
     }
  }
  handleCancel=()=>{
    this.setState({
      modalshow:false,
      old_password:'',
      new_password_1:'',
      new_password_2:''
    })
  }
  
  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const {modalshow,old_password,new_password_1,new_password_2 }=this.state;
    console.log('用户信息111',currentUser)

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
          <Menu.Item key="settings">
            <SettingOutlined />
            修改密码
          </Menu.Item>
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return<>
      {currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    )
  }
  <Modal
    title="修改密码"
    visible={modalshow}
    width={600}
    onOk={this.handleOk}
    onCancel={this.handleCancel}
  >
    <Row type="flex">
      <Col span={24} style={{marginBottom:'10px'}}>
        <label style={{display:'inline-block',width:'120px',textAlign:'right'}}>旧密码：</label>
        <Input placeholder="此项为必填" style={{display:'',float:'',width:'300px'}} value={old_password} type="password"  onChange={this.oldPasswordChange} />
      </Col>
      <Col span={24} style={{marginBottom:'10px'}}>
        <label style={{ display:'inline-block',width:'120px',textAlign:'right'}}>新密码：</label>
        <Input placeholder="此项为必填" style={{display:'',float:'',width:'300px'}}  value={new_password_1} type="password" onChange={this.newPassword_1}/>
      </Col>
      <Col span={24}>
        <label style={{ display:'inline-block',width:'120px',textAlign:'right '}}>再次输入新密码：</label>
        <Input placeholder="此项为必填"  style={{display:'',float:'',width:'300px'}}   value={new_password_2} type="password" onChange={this.newPassword_2}/>
      </Col>
    </Row>
  </Modal>
  </>
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
