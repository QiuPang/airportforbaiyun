import React ,{Fragment}from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Card,Row,Col,Popover, Input ,DatePicker,Select,Button,Alert,Modal,Upload,message,Progress,Table ,Divider} from 'antd';
import { connect} from 'dva';
import { FileImageFilled,YoutubeFilled,CloudUploadOutlined,InfoCircleOutlined,CloseCircleFilled} from '@ant-design/icons';
import moment from 'moment';
import styles from './style.less';
import {router} from 'umi';

const {Option}=Select;

const { RangePicker } = DatePicker;

class Public extends React.Component {
    state={
        selImg:true,
        imgModal:false,
        imgzhen:'',
        // imgInfo:'', //img上传进度
        imgFileList:[],
        videoShow:false,
        // videoInfo:'', //video上传进度
        videoUrl:'',
        ad_name:'',
        ad_account:'',
        begin_time:'',
        end_time:'',
        sell_mode:'',
        host:'',
        newimgFileList:[],
        newvideoFileList:[],
        videobtn:true,
    }

    componentDidMount(){

    }

    // 选择图片
    selImg=()=>{
        this.setState({
            selImg:true,
        })
    }

    // 选择视频
    selVideo=()=>{
        this.setState({
            selImg:false
        })
    }

    // 取消
    footCancel=()=>{
        router.push({
            pathname:`/adver/action`
        })
    }
        
    // 投放
    footOk=()=>{
        const {selImg,imgModal,imgzhen,imgFileList,videoShow,videoUrl,ad_name,begin_time,end_time,sell_mode,ad_account}=this.state;
        const{addNew}=this.props;
        if(ad_name&&ad_account&&begin_time&&end_time&&sell_mode&&imgFileList.length>0){
            imgFileList.forEach((item,index)=>{
                item.sort=index;
            })
            const formData={
                ad_name:ad_name,
                ad_account:ad_account,
                begin_time:begin_time,
                end_time:end_time,
                sell_mode:sell_mode,
                resource:imgFileList,
            }
            addNew(formData)
        }else{
            message.error('信息不全请重新编辑')
        }

    }

    // img upload
    imgUpload=()=>{
        this.setState({
            imgModal:true,
        });
    }
    imgOk=()=>{
        let {imgFileList,newimgFileList,imgzhen}=this.state;
        let host='';
        let newArr=newimgFileList.map((item,index)=>{
            host=item.response&&item.response.data&&item.response.data.host||'';
            return {
                sort:index,
                type:1,
                frame:imgzhen,
                need_sound:2,
                url:item.response&&item.response.data&&item.response.data.route||''
            } 
        })
        imgFileList=imgFileList.concat(newArr);
        this.setState({
            imgModal:false,
            imgzhen:'',
            imgFileList:imgFileList,
            host:host,
            newimgFileList:[],
        });
    }
    imgCancel=()=>{
        this.setState({
            imgModal:false,
            newimgFileList:[],
        });
    }
    imgZhen=(e)=>{
        this.setState({
            imgzhen:e.target.value
        })
    }
    checkImageWH=(file, width, height)=>{
        let self = this;
        return new Promise(function (resolve, reject) {
            let filereader = new FileReader();
            filereader.onload = e => {
                let src = e.target.result;
                const image = new Image();
                image.onload = function () {
                    if (width && this.width != width) {
                        message.error('请上传宽为' + width + '的图片')
                        reject();
                    } else if (height && this.height != height) {
                        message.error('请上传高为' + height + '的图片')
                        reject();
                    } else {
                        resolve();
                    }
                };
                image.onerror = reject;
                image.src = src;
            };
            filereader.readAsDataURL(file);
        });
    }
    // 上传前
    beforeUpload=(file)=>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('请上传 JPG/JPEG/PNG 格式文件');
        }
        const isLt2M = file.size / 1024 < 801;
        if (!isLt2M) {
          message.error('图片大小需在800k以内');
        }
        return isJpgOrPng && isLt2M && this.checkImageWH(file,1080,1920)
    }
    imghandleChange=(info)=>{
        let newArr=[];
        if (info.file.status === 'done') {
            info.fileList.slice(-20).map((item)=>{
                if(item.response&&item.response.code==0){
                    console.log('item',item);
                    newArr.push(item);
                }
            })
            this.setState({
                newimgFileList:newArr
            })
        }
    }
    // 弹层删除照片
    imguploadRemove=(file)=>{
        const {newimgFileList}=this.state;
        console.log('del',file);
        let newArr=newimgFileList.filter((item,index)=>{
            return item.uid!=file.uid;
        })
        this.setState({
            newimgFileList:newArr
        })
    }
    // 删除照片
    imgDel=(data)=>{
        const {imgFileList}=this.state;
        let newArr=imgFileList.filter((item)=>{
            if(item['url']!=data['url']){
                return item
            }
        })
        this.setState({
            imgFileList:newArr
        })
    }
    // 修改帧
    imgzhenChange=(e,index)=>{
        const {imgFileList}=this.state;
        imgFileList[index]['frame']=e.target.value;
        this.setState({ 
            imgFileList,
        })
    }

    // 视频
    videoModalShow=()=>{
        this.setState({
            videoShow:true
        })
    }
    videoOk=()=>{
        const {imgFileList,newvideoFileList}=this.state;
        if(newvideoFileList.length==0){
            message.error('请先上传视频')
            return;
        }
        let newArr=imgFileList.filter((item)=>{
            return item.type!=2;
        })
        let host='';
        let newViode=newvideoFileList.map((item)=>{
            host=item.response&&item.response.data&&item.response.data.host||'';
            return {
                type:2,
                frame:1,
                need_sound:1,
                url:item.response&&item.response.data&&item.response.data.route||''
            }
        })
        newArr=newArr.concat(newViode)
        this.setState({
            imgFileList:newArr,
            videoShow:false,
            videoUrl:'',
            host:host,
        })
    }
    videoCancel=()=>{
        this.setState({
            newvideoFileList:[],
            videoShow:false,
            videoUrl:'',
        })
    }
    checkVideoWH=(file,width,height)=>{
        return new Promise(function(resolve, reject) {
            const url = URL.createObjectURL(file)
            const video = document.createElement('video')
            video.onloadedmetadata = evt => {
              // Revoke when you don't need the url any more to release any reference
              URL.revokeObjectURL(url)
              if (width && video.videoWidth / video.videoHeight !== width / height) {
                message.error('上传视频的宽高比例不符合要求，请重传')
                reject()
              } else {
                if(video.duration>14 && video.duration<16){
                    resolve();
                }else{
                    message.error('请上传15s时长的视频')
                    reject();
                }
              }
            }
            video.src = url
            video.load() // fetches metadata
          })
    }
    videobeforeUpload=(file)=>{
        const isJpgOrPng = file.type === 'video/mp4'
        if (!isJpgOrPng) {
          message.error('请上传 mp4 格式文件');
        }
        const isLt2M = file.size / 1024/1024 < 20;
        if (!isLt2M) {
          message.error('图片大小需在20M以内');
        }
        
        return isJpgOrPng && isLt2M && this.checkVideoWH(file,1080,1920);
    }
    videohandleChange=(info)=>{ 
        let newArr=[];
        let host='';
        let url='';
        if (info.file.status === 'done') {
            info.fileList.map((item)=>{
                if(item.response&&item.response.code==0){
                    console.log('item',item);
                    host=item.response&&item.response.data&&item.response.data.host||'';
                    url=item.response&&item.response.data&&item.response.data.route||'';
                    newArr.push(item);
                }
            })
            this.setState({
                newvideoFileList:newArr,
                videoUrl:url,
                host:host,
                videobtn:false,
            })
        }
    }
    videouploadRemove=(file)=>{
        const {newvideoFileList}=this.state;
        let newArr=newvideoFileList.filter((item,index)=>{
            return item.uid!=file.uid;
        })
        this.setState({
            newvideoFileList:newArr,
            videobtn:true,
        })
    }
    videoEdit=(record)=>{
        console.log('record',record);
        this.setState({
            videoShow:true,
            videoUrl:record.url
        })
    }
    videoDel=(record)=>{
        console.log('record',record);
        let {imgFileList}=this.state;
        let newArr=imgFileList.filter((item,index)=>{
            return item.url!=record.url;
        })
        this.setState({
            imgFileList:newArr
        })
    }

    // 修改名称
    ad_nameChange=(e)=>{this.setState({ad_name:e.target.value})}
    // 时间
    dateChange=(date,dateString)=>{
        console.log('111222333',moment(date[0]).unix(),moment(date[1]).unix());
        this.setState({
            begin_time:date && moment(date[0]).unix()||'',
            end_time:date && moment(date[1]).unix()||''
        })
    }
    sellModeChange=(value)=>{this.setState({sell_mode:value})};
    adAccountChange=(e)=>{this.setState({ad_account:e.target.value})}

    render(){
        const {videobtn,newimgFileList,selImg,imgModal,imgzhen,imgFileList,videoShow,videoUrl,ad_name,begin_time,end_time,sell_mode,ad_account,host}=this.state;
        let c_token = localStorage.getItem("authorization");

        console.log('newimgFileList',this.state.newimgFileList);

        return <div className={styles.main} id="imgModal">
            <Card 
                title="基本信息"
                headStyle={{border:'none'}}
                style={{marginBottom:'20px'}}
            >
                <Row gutter={[10,10]}>
                    <Col span={12} style={{display:'flex', alignItems:'center'}}>
                        <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;广告名称：</label>
                        <Input value={ad_name} onChange={this.ad_nameChange} maxLength={50} style={{width:300}}/>
                    </Col>
                    <Col span={12} style={{display:'flex', alignItems:'center'}}>
                        <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}}>广告时间：</label>
                        <RangePicker
                            value={begin_time&&[moment(begin_time*1000), moment(end_time*1000)]||[]}
                            onChange={this.dateChange}
                            format={'YYYY/MM/DD'}
                            style={{width:300}}
                        />
                    </Col>
                    <Col span={12} style={{display:'flex', alignItems:'center'}}>
                        <label htmlFor="" style={{width:'100px',marginRight:'10px',textAlign:'right'}}>售卖方式：</label>
                        <Select style={{width:300}} value={sell_mode} onChange={this.sellModeChange}> 
                            <Option value="CPT">CPT</Option>
                        </Select>
                    </Col>
                    <Col span={12} style={{display:'flex', alignItems:'center'}}>
                        <label htmlFor=""style={{width:'100px',marginRight:'10px',textAlign:'right'}}>广告主账号：</label>
                        <Input value={ad_account} onChange={this.adAccountChange} style={{width:300}}/>
                    </Col>

                </Row>
            </Card>
            <Card 
                title="创意内容"
                headStyle={{border:'none'}}

            >
                <Row>
                    <Col>
                        <Button onClick={this.selImg} icon={<FileImageFilled/>} type={selImg?'primary':'default'} className={styles.mr20} size="large">图片上传</Button>
                        <Button onClick={this.selVideo} icon={<YoutubeFilled/>} type={selImg?'default':'primary'} size="large" className={styles.mr20}> 视频上传</Button>
                <span className={styles.mr20}>创意个数：{imgFileList.length}/80</span>
                <span className={styles.mr20}>创意时长：{imgFileList.length>0&&imgFileList.reduce((t,i)=>{
                    return t+(+i.frame)*15
                },0)||0}s</span>
                        <span className={styles.mr20}>创意帧数：{imgFileList.length>0&&imgFileList.reduce((t,i)=>{
                    return t+(+i.frame)
                },0)||0}帧</span>
                    </Col>
                    {selImg&&<Col className={styles.imgCol} span={18}> 
                        <Row>
                            <Col className={styles.imgColL} span={6}>
                                <Button type="primary"  icon={<CloudUploadOutlined/>} size="large" style={{marginTop:'40px'}} onClick={this.imgUpload}>批量上传</Button>
                                <Alert message="图片可支持批量上传" type="info" showIcon className={styles.alert}/>
                                <ul className={styles.ul}>
                                    <li>图片尺寸：1080*1920</li>
                                    <li>图片大小：不超过800kb</li>
                                    <li>图片格式：JPG，JPEG，PNG</li>
                                </ul>
                            </Col>
                            <Col className={styles.imgColR} span={18} >
                                <div style={{display:'flex',flexWrap:'wrap',padding:'0 30px'}}>
                                    {imgFileList.map((item,index)=>{
                                        if(item.type==1){
                                            return <div key={index}   style={{width:'180px',height:'358px',margin:'5px 10px',position:'relative'}}>
                                                <CloseCircleFilled onClick={()=>this.imgDel(item)} className={styles.close}/>
                                                <img src={`${host}${item.url}`} style={{width:'180px',display:'block'}}/>
                                                <p style={{textAlign:'center'}}>
                                                    <Input value={item.frame} 
                                                        onChange={(e)=>this.imgzhenChange(e,index)}
                                                        style={{width:60}}
                                                        size="small"
                                                        type="number"
                                                    />帧
                                                </p>
                                            </div>
                                        }
                                    })}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    ||
                    <Col className={styles.videoCol} span={18}> 
                        <Row>
                            <Col className={styles.imgColL} span={6}>
                                <Button type="primary"  icon={<CloudUploadOutlined/>} size="large" style={{marginTop:'40px'}} onClick={this.videoModalShow}>视频上传</Button>
                                <Alert message="视频不支持批量上传" type="info" showIcon className={styles.alert}/>
                                <ul className={styles.ul}>
                                    <li>视频格式：MP4</li>
                                    <li>视频大小：小于20M</li>
                                    <li>视频规格：视频比例0.53~0.57</li>
                                </ul>
                            </Col>
                            <Col className={styles.imgColR} span={18}>
                                <div style={{display:'flex',flexWrap:'wrap',padding:'0 30px'}}>
                                        {imgFileList.map((item,index)=>{
                                            if(item.type==2){
                                                return <Table
                                                    style={{width:400}}
                                                    columns={[
                                                        {
                                                            title: '视频序号',
                                                            dataIndex: 'sort',
                                                            key: 'sort',
                                                            render: text => <a>1</a>,
                                                        },
                                                        {
                                                            title: '操作',
                                                            render: (text,record)=>{
                                                                return <span>
                                                                    <a onClick={()=>this.videoEdit(record)}>编辑</a>
                                                                    <Divider type="vertical"/>
                                                                    <a onClick={()=>this.videoDel(record)}>删除</a>
                                                                </span>
                                                            }
                                                        },
                                                    ]}
                                                    dataSource={[item]}
                                                    pagination={false}
                                                    rowKey='sort'
                                                />
                                            }
                                        })}
                                </div>
                            </Col>
                        </Row>
                    </Col>}
                    <Col span={18} className={styles.foot}>
                        <Button className={styles.mr20} onClick={this.footCancel}>取消</Button>
                        <Button type="primary" onClick={this.footOk}>投放</Button>
                    </Col>
                </Row>
            </Card>
            <Modal
                visible={imgModal}
                onOk={this.imgOk}
                onCancel={this.imgCancel}
                title={<Fragment><h3>上传创意</h3><p style={{marginBottom:"0"}}>一次批量上传最多支持20张图片</p></Fragment>}
                headStyle={{padding:'24px 16px 0'}}
                getContainer={()=>document.getElementById('imgModal')}
                destroyOnClose
            >
                <label htmlFor="">帧数:</label>
                <Input value={imgzhen} onChange={this.imgZhen} placeholder="此项为必填" style={{width:100}}/>
                <Alert style={{width:300,float:'right',height:32,padding:'4px 15px 0 37px'}} size='small' message="说明：该帧数为单个素材所占帧数" type="warning" showIcon />
                <Row style={{margin:'20px'}}>
                    <Col span={24}>
                        <Upload
                              action='/back/upload/file'
                              headers={{
                                'authorization':c_token
                              }}
                              beforeUpload={this.beforeUpload}
                              onChange={this.imghandleChange}
                              multiple={true}
                              showUploadList={{showDownloadIcon:false}}
                              onRemove={this.imguploadRemove}
                        >
                            <Button disabled={imgzhen?false:true} icon={<CloudUploadOutlined/>}  ref = 'queding' type="primary">上传</Button>
                        </Upload>
                    </Col>
                </Row>
            </Modal>
            {/* 上传视频 */}
            <Modal
                visible={videoShow}
                title={<Fragment><h3>上传创意</h3><p style={{marginBottom:"0"}}>仅支持上传一个视频文件</p></Fragment>}
                footer={null}
                onOk={this.videoOk}
                onCancel={this.videoCancel}
                headStyle={{padding:'24px 16px 0'}}
                getContainer={()=>document.getElementById('imgModal')}
                destroyOnClose
            >
                <Row>
                    <Col>
                        <div style={{width:'180px',height:'320px',margin:'5px 10px',border:'1px solid #ddd',display:'inline-block',float:'left'}}>
                            <video 
                                src={`${host}${videoUrl}`}
                                controls="controls"
                                style={{width:'180px',height:'320px',display:'block'}}
                            />
                        </div>
                        <div style={{width:'200px',height:'320px',margin:'5px 10px',display:'inline-block',float:'left'}}>
                            <label htmlFor="">帧数：</label><Input value="1" disabled style={{width:100}}/><br/>
                            <label htmlFor="">描述：</label><span>视频时长需要为15秒，默认为1帧，需MP4格式</span>
                            <Upload
                              action='/back/upload/file'
                            //   showUploadList={false}
                              headers={{
                                'authorization':c_token
                              }}
                              beforeUpload={this.videobeforeUpload}
                              onChange={this.videohandleChange}
                              showUploadList={{showDownloadIcon:false}}
                              onRemove={this.videouploadRemove}
                            >
                                <Button ref = 'queding' type="primary" disabled={!videobtn} icon={<CloudUploadOutlined/>} size="large"
                                    style={{marginLeft:'20px'}}
                                >上传</Button>
                            </Upload><br/><br/>

                        </div>
                    </Col>
                    <Col span={24} style={{textAlign:'right'}}>
                        <Button className={styles.mr20} onClick={this.videoCancel}>取消</Button>
                        <Button onClick={this.videoOk} ref = 'queding' type="primary">确定</Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    }

}

export default Public