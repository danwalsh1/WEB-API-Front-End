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