import React from 'react';
import {Modal, Button, Form, Icon, List, Card, Radio, Input} from 'antd';

class TagRequestManager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            requestsRecieved: false,
            tagRequestAlert: false,
            tagData: null,
            tagDisplay: [],
            userOptions: null
        };

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    /* Component Functions - Start */

    componentDidMount(){
        this.getTagRequests();
    }

    getTagRequests(){
        console.log(localStorage.getItem('userId'))
        if (!this.state.requestsRecieved && localStorage.getItem('userId') != 0){
            // Get open requests
            let fetchURL = 'http://localhost:8080/api/v1.0/get-tag/open-user/' + localStorage.getItem("userId");

            fetch(fetchURL, {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))},})
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if(result.length > 0){
                        console.log("tags");
                        this.setState({tagRequestAlert: true, tagData: result});
                    }
                    this.setState({requestsRecieved: true});
                    this.formatTagDisplay();
                }
            );
        }
      }
      
    formatTagDisplay(){
        console.log("Formatting");
        if(this.state.tagData === null || this.state.tagRequestAlert === false){
            console.log("No tag requests to display");
        }else{
            this.state.tagDisplay = this.state.tagData;
        }
    }

    /* Component Functions - End */

    /* Modal Functions - Start */

    showModal(){
        this.setState({visible: true});
    }

    async handleOk(ev){
        ev.preventDefault();

        if(this.state.userOptions == null){
            // User has no accepted or rejected any tag requests
            this.setState({visible: false});
            console.log("No tags updated!");
        }else{
            // User has accepted or rejected tag requests
            for(let x = 0; x < Object.keys(this.state.userOptions).length; x++){
                let sqlId = parseInt(Object.keys(this.state.userOptions)[x], 10);
                if(this.state.userOptions[Object.keys(this.state.userOptions)[x]] == "accept"){
                    let sqlData = {id: sqlId, accepted: true};
                    await fetch('http://localhost:8080/api/v1.0/update-tag/update', {
                        method: 'put',
                        body: JSON.stringify(sqlData),
                        headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))}
                    }).then(res => console.log(res.status));
                }else{
                    // Delete the tag request
                }
            }

            console.log("Updated tags: " + Object.keys(this.state.userOptions).length);
            this.setState({visible: false});
            window.location.reload();
        }
    }

    handleCancel(ev){
        console.log(ev);
        this.setState({visible: false});
    }

    handleRadioChange(ev){
        console.log(ev);

        if(this.state.userOptions == null){
            let aOptions = {};
            aOptions[ev.target.valuetwo] = ev.target.value;
            this.setState({userOptions: aOptions});
        }else{
            let aOptions = this.state.userOptions;
            aOptions[ev.target.valuetwo] = ev.target.value;
            this.setState({userOptions: aOptions});
        }
    }

    /* Modal Functions - End */

    /* Form Functions - Start */

    handleSubmit(ev){
        ev.preventDefault();
    }

    /* Form Functions - End */

    render(){
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            }, wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        }

        console.log(this.state.tagDisplay);

        const element = (
            <div>
                <Button type="primary" onClick={this.showModal} ghost={!this.state.tagRequestAlert}>
                    <Icon type="exclamation-circle" spin={this.state.tagRequestAlert} style={{ fontSize: '17px'}} />
                    Tag Requests
                </Button>
                <Modal title="Activity Tag Requests" visible={this.state.visible} okText="Confirm" onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <List dataSource={this.state.tagDisplay} renderItem={item =>
                            <Card title={item.calendarItemID} style={{ paddingBottom: '20px' }} >
                                Tagged By: {item.taggedByUserID}
                                <br />
                                <Radio.Group onChange={this.handleRadioChange}>
                                    <Radio.Button valuetwo={item.id} value="accept">Accept</Radio.Button>
                                    <Radio.Button valuetwo={item.id} value="reject">Reject</Radio.Button>
                                </Radio.Group>
                            </Card>}
                        />
                    </Form>
                </Modal>
            </div>
        );

        return element;
    }
}

export default TagRequestManager;