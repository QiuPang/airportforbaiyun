import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card,Row,Col,Select,Input,Button,Table,Badge,Switch,Divider,Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {router} from 'umi';

const { Option } = Select;
const badgeArr=['','default','processing','success','warning','error'];
const badgeText=['','待投放','投放中','已结束','暂停','撤单'];
const souceArr=['','图片','视频','图片+视频'];

class Action extends React.Component {
  state = {
    status:'', //状态
    type:'',//素材
    ad_id:'', //广告id
    ad_name:'', // 广告名称
    ad_account:'', // 广告主名称
    page:1, // 当前页
    size:10, // 当前页每页条数
  };

  columns=[
    {
      title:'操作',
      dataIndex:'',
      render:(text,record)=>(<span>
        <a onClick={()=>this.edit(record)} disabled={record.status==3}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm
          title="确定撤单?"
          onConfirm={()=>this.switchChange(record,3)}
          onCancel={this.cancel}
          okText="确定"
          cancelText="取消"
        >
          <a disabled={record.status==3} href="#">撤单</a>
        </Popconfirm>
        <Divider type="vertical" />
        <a onClick={()=>this.see(record)}>查看</a>
      </span>)
    },
    {
      title:'开关',
      dataIndex:'status',
      render:(item,record)=>{
        return <Switch checked={item==1?true:false} disabled={item!=1&&item!=2} onChange={(value)=>this.switchChange(record,value)} />
      }
    },
    {
      title:'广告ID',
      dataIndex:'ad_id',
    },
    {
      title:'广告主账号',
      dataIndex:'ad_account',
    },
    {
      title:'广告名称',
      dataIndex:'ad_name',
    },
    {
      title:'状态',
      dataIndex:'status_text',
    },
    {
      title:'投放时间',
      dataIndex:'put_time',
    },
    {
      title:'售卖方式',
      dataIndex:'sell_mode',
    },
    {
      title:'素材类型',
      dataIndex:'type_text',
      // render:(text)=>{
      // return <span>{souceArr[text]}</span>
      // }
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props;
      // 状态
      dispatch({
        type: 'action/queryStatus',
      });
      // 获取列表数据
      dispatch({
        type: 'action/queryData',
      })
  }

  // 查看
  see=(record)=>{
    router.push({
      pathname:`/adver/action/showDetail/${record.ad_id}`
    })
  }

  // 编辑
  edit=(record)=>{
    router.push({
      pathname:`/adver/action/editAd/${record.ad_id}`
    })
  }

  // 开关 & 撤单
  switchChange=(record,value=3)=>{
      const {dispatch}=this.props;
      const {status,type,ad_id,ad_name,ad_account,page,size}=this.state;
      const callback=()=>{
        let formData={
          page:page,
          size:size,
          status:status,
          type:type,
          ad_id:ad_id,
          ad_name:ad_name,
          ad_account:ad_account,
        }
        dispatch({
          type: "action/queryData",
          payload: formData
        })
      }
      dispatch({
        type:'action/queryStatusChange',
        payload:{
          status:value==3?3:(value?1:2),
          ad_id:record.ad_id
        },
        callback,
      })
  }

  // 新建广告 
  add=()=>{
    router.push({
      pathname:`/adver/action/newAdd`
    })
  }

  // 查询
  check=()=>{
    const {dispatch}=this.props;
    const {status,type,ad_id,ad_name,ad_account}=this.state;
    let formData={
      status:status,
      type:type,
      ad_id:ad_id,
      ad_name:ad_name,
      ad_account:ad_account,
    }
    dispatch({
      type: "action/queryData",
      payload: formData
    })
  }

  // 表格数据
  onBaseClick=(current,pageSize)=>{
    const {dispatch}=this.props;
    const {status,type,ad_id,ad_name,ad_account}=this.state;
    let formData={
      page:current,
      size:pageSize,
      status:status,
      type:type,
      ad_id:ad_id,
      ad_name:ad_name,
      ad_account:ad_account,
    }
    this.setState({
      page:current,
      size:pageSize,
    },()=>{
      dispatch({
        type: "action/queryData",
        payload: formData
      })
    })
  }

  // 重置
  reset=()=>{
    const {dispatch}=this.props;
    this.setState({
      status:'', //状态
      type:'',//素材
      ad_id:'', //广告id
      ad_name:'', // 广告名称
      ad_account:'', // 广告主名称
    },()=>{
      dispatch({
        type: 'action/queryData',
      });
    })
  }

  handleStatus=(value)=>{this.setState({status:value})}  // 状态
  handleSouceType=(value)=>{this.setState({type:value})}  // 素材
  handleAdId=(e)=>{this.setState({ad_id:e.target.value})}  // 广告ID
  handleAdName=(e)=>{this.setState({ad_name:e.target.value})}  // 广告名称
  handleAdManName=(e)=>{this.setState({ad_account:e.target.value})}   // 广告主名称

  render() {
    const {searchData,tableData}=this.props;
    const {status,type,ad_id,ad_name,ad_account}=this.state;

    console.log('tableData',tableData);

    return <PageHeaderWrapper>
      <Card>
        <Row gutter={[10,10]}>
          <Col span={12} style={{display:'flex', alignItems:'center'}}>
            <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}}>状态:</label>
            <Select value={status} onChange={this.handleStatus} style={{maxWidth:300,minWidth:100,width:300}}>
              {searchData&&searchData.status.map((item,index)=>{
                return <Option value={item.key} key={item.key}>{item.value}</Option>
              })}
            </Select>
          </Col>
          <Col span={12} style={{display:'flex', alignItems:'center'}}>
            <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}} >素材类型:</label>
            <Select value={type} onChange={this.handleSouceType} style={{maxWidth:300,minWidth:100,width:300}}>
              {searchData&&searchData.type.map((item,index)=>{
                return <Option value={item.key} key={item.key}>{item.value}</Option>
              })}
            </Select>
          </Col>
          <Col span={12} style={{display:'flex', alignItems:'center'}}>
            <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}}>广告ID:</label>
            <Input value={ad_id} onChange={this.handleAdId} style={{maxWidth:300,minWidth:100}}/>
          </Col>
          <Col span={12} style={{display:'flex', alignItems:'center'}}>
            <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}}>广告名称:</label>
            <Input value={ad_name} onChange={this.handleAdName} style={{maxWidth:300,minWidth:100}}/>
          </Col>
          <Col span={12} style={{display:'flex', alignItems:'center'}}>
            <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}}>广告主账号:</label>
            <Input value={ad_account} onChange={this.handleAdManName} style={{maxWidth:300,minWidth:100}}/>
          </Col>
          <Col span={12} style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
            <Button type="primary" onClick={this.check} style={{marginRight:'10px'}}>查询</Button>
            <Button onClick={this.reset}>重置</Button>
          </Col>
        </Row>
        <Row style={{marginTop:'20px'}}>
          <Col span={24} style={{marginBottom:'20px'}}>
            <Button  type="primary" onClick={this.add} icon={<PlusOutlined/>}>创建广告</Button>
          </Col>
          <Col  span={24}>
            <Table columns={this.columns}
              rowKey="ad_id"
              dataSource={tableData&&tableData.list||[]}
              pagination={{
              total:tableData&&tableData.count,
              current:tableData&&tableData.page,
              pageSizeOptions:['10','20','30','40','50'],
              showSizeChanger:true,
              pageSize:tableData&&tableData.size,
              showTotal: (count=tableData&&tableData.count)=>{
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
    </PageHeaderWrapper>
  }
}

export default connect(({ action, loading }) => ({
  searchData: action.searchData,
  tableData:action.tableData,
  loading: loading.models.action,
}))(Action);
