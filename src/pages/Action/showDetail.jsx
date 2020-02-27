import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card,Row,Col,Popover } from 'antd';
import { connect} from 'dva';
import { FileImageOutlined,YoutubeFilled} from '@ant-design/icons';

class showDetail extends React.Component {
    state={
        // ad_id:'',
    }

    componentDidMount(){
        const {match,dispatch}=this.props;
        dispatch({
            type:'action/queryDetailData',
            payload:{
                ad_id:match.params.ad_id,
            }
        })
    }

    render(){
        const {detailData}=this.props;
        console.log('查看页面',detailData)

        return<PageHeaderWrapper>
            <Card
                title="基本信息"
                headStyle={{border:'none'}}
                style={{marginBottom:'20px'}}
            >
            <Row gutter={[10,10]}>
                <Col span={12}>广告名称：{detailData&&detailData.ad_name}</Col><Col span={12}>广告时间：{detailData&&detailData.put_time}</Col>
                <Col span={12}>广告ID：{detailData&&detailData.ad_id}</Col><Col span={12}>售卖方式：{detailData&&detailData.sell_mode}</Col>
                <Col span={12}>广告主账号：{detailData&&detailData.ad_account}</Col>
            </Row>
            </Card>
            <Card 
                title="素材设置"
                headStyle={{border:'none'}}
            >
                <Row>
                    <Col span={18} style={{marginBottom:'20px',border:"1px solid #ddd",height:'400px',borderRaidus:'4px',overflowY:'auto'}}> 
                        <p style={{margin:'5px 20px',fontSize:'20px'}}><FileImageOutlined style={{marginRight:'5px'}}/>图片</p>
                        <div style={{display:'flex',flexWrap:'wrap',padding:'0 30px'}}>
                            {detailData&&detailData.resource&&detailData.resource.filter((item)=>{
                                return item.type==1
                            }).map((item,index)=>{
                                return<div  style={{width:'180px',height:'348px',margin:'5px 10px'}}>
                                    <img src={`${detailData.host}${item.url}`} style={{width:'180px',display:'block'}}/>
                                    <p style={{textAlign:'center'}}>{item.sort}</p>
                                </div>
                            })}
                        </div>
                    </Col>
                    <Col span={18} style={{marginBottom:'20px',border:"1px solid #ddd",height:'400px',borderRaidus:'4px',overflowY:'auto'}}>
                        <p style={{margin:'5px 20px',fontSize:'20px'}}><YoutubeFilled style={{marginRight:'5px'}}/>视频</p>
                        <div style={{display:'flex',flexWrap:'wrap',padding:'0 30px'}}>
                            {detailData&&detailData.resource&&detailData.resource.filter((item)=>{
                                return item.type==2
                            }).map((item,index)=>{
                                return <div key={index} style={{width:'180px',height:'348px',margin:'5px 10px'}}>
                                <video controls="controls" src={`${detailData.host}${item.url}`} style={{width:'180px',display:'block'}}/>
                            <p style={{textAlign:'center'}}>{item.sort}</p>
                            </div>
                            })}
                        </div>
                    </Col>
                </Row>
            </Card>
        </PageHeaderWrapper>
    }
}

export default connect(({ action, loading }) => ({
    detailData: action.detailData,
    // tableData:action.tableData,
    loading: loading.models.action,
}))(showDetail);
  