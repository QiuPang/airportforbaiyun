import React from 'react';
import {Card,Row,Col,Button,Table} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { PlusOutlined,DownOutlined } from '@ant-design/icons';

class ActionData extends React.Component {
  state = {
  };

  columns=[
    {
      title: '天',
      dataIndex: 'date_text',
    },
    {
      title: '账户名称',
      dataIndex: 'ad_account',
    },
    {
      title: '推广ID',
      dataIndex: 'ad_id', //st_id
    },
    {
      title: '展示(次)',
      dataIndex: 'show_count',
    },
  ]



  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'actionData/queryData',
      });
    }
  }

  // 下载
  download=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'actionData/queryDownload',
    })
  }

  // 分页
  onBaseClick=(current,pageSize)=>{
    const {dispatch}=this.props;
    dispatch({
      type: "actionData/queryData",
      payload: {
        page:current,
        size:pageSize
      }
    })
  }

  render() {
    const {data}=this.props;
    return <PageHeaderWrapper>
      <Card
        bordered={false}
      >
      <Row>
        <Col span={24} style={{marginBottom:'20px'}}><Button type="primary" icon={<DownOutlined />} onClick={this.download}>下载</Button></Col>
        <Col  span={24}>
          <Table columns={this.columns}
            rowKey="st_id"
            dataSource={data&&data.list||[]}
            pagination={{
              total:data&&data.count,
              current:data&&data.page,
              pageSizeOptions:['10','20','30','40','50'],
              showSizeChanger:true,
              pageSize:data&&data.size,
              showTotal: (count=data&&data.count)=>{
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

export default connect(({ actionData, loading }) => ({
  data: actionData.data,
  // loading: loading.models.user,
}))(ActionData);
