import React from 'react';
import {Modal, Button, Form, Icon, Input} from 'antd';

class ActivityComposer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            confirmDirty: false,
            title: '',
            description: '',
            url: '',
            location: ''
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    /* Modal Functions - Start */

    showModal(){
        this.setState({visible: true});
    }

    handleOk(ev){
        ev.preventDefault();

        const activityData = {title: this.state.title, description: this.state.description, url: this.state.url, location: this.state.location, userId: localStorage.getItem('userId')};

        // Validation --

        var invalidLetters = /^[0-9a-zA-Z]+$/;
        // Title
        if (activityData.title.length > 20 || typeof activityData.title != "string" || !activityData.title.match(invalidLetters)){
            window.alert("Title must be less than 20 characters, must be of type string and must be alphanumeric.");
            return;
        }

        // Description
        if (activityData.description.length > 280 || typeof activityData.description != "string" || !activityData.description.match(invalidLetters)){
            window.alert("Description must be less than 280 characters, must be of type string and must be alphanumeric.");
            return;
        }

        // URL
        if (activityData.url.length > 200 || typeof activityData.url != "string" || !activityData.url.match(invalidLetters)){
            window.alert("url must be less than 200 characters, must be of type string and must be alphanumeric.");
            return;
        }

        // Location
        if (activityData.location.length > 200 || typeof activityData.location != "string" || !activityData.location.match(invalidLetters)){
            window.alert("location must be less than 200 characters, must be of type string and must be alphanumeric.");
            return;
        }

        
        // End of validation -- 

        // Validate form
        if(activityData.title.length > 0){
            // Title has been given!
            fetch('http://localhost:8080/api/v1.0/manage-activity/create', {
                method: 'post',
                body: JSON.stringify(activityData),
                headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))}
                //headers: {'Content-Type': 'application/json'}
            }).then(res => console.log(res.status));
            console.log(activityData);
            console.log(JSON.stringify(activityData));
            
            this.setState({visible: false});
            window.location.reload();
        }
    }

    handleCancel(ev){
        console.log(ev);
        this.setState({visible: false});
    }

    /* Modal Functions - End */

    /* Form Functions - Start */

    handleSubmit(ev){
        ev.preventDefault();
    }

    handleTitleChange(ev){
        this.setState({title: ev.target.value});
    }

    handleDescriptionChange(ev){
        this.setState({description: ev.target.value});
    }

    handleUrlChange(ev){
        this.setState({url: ev.target.value});
    }

    handleLocationChange(ev){
        this.setState({location: ev.target.value});
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

        const element = (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    <Icon type="plus" />
                </Button>
                <Modal title="Add Activity" visible={this.state.visible} okText="Add" onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="Title">
                            {getFieldDecorator('Title', {rules: [{required: true, message: 'You need a activity title!'}]})(
                            <Input placeholder="Title" onChange={this.handleTitleChange}/>
                            )}
                        </Form.Item>
                        <Form.Item label="Description">
                            {getFieldDecorator('Description', {rules: [{required: false}]})(
                            <Input placeholder="Description" onChange={this.handleDescriptionChange}/>
                            )}
                        </Form.Item>
                        <Form.Item label="URL">
                            {getFieldDecorator('URL', {rules: [{required: false}]})(
                            <Input placeholder="URL" onChange={this.handleUrlChange}/>
                            )}
                        </Form.Item>
                        <Form.Item label="Location">
                            {getFieldDecorator('Location', {rules: [{required: false}]})(
                            <Input placeholder="Location" onChange={this.handleLocationChange}/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );

        return element;
    }
}

export default ActivityComposer;