import React from 'react';
import {Modal, Button, Form, Icon, Input} from 'antd';

class SignUp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            confirmDirty: false
        };

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.compareToSecondPassword = this.compareToSecondPassword.bind(this);
        this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    }

    showModal(){
        this.setState({visible: true});
    }

    handleOk(ev){
        console.log(ev);
        this.setState({visible: false});
    }

    handleCancel(ev){
        console.log(ev);
        this.setState({visible: false});
    }

    handleSubmit(ev){
        ev.preventDefault();
        // Not sure if this function is run or the "handleOk" function is run
    }

    compareToSecondPassword(rule, value, callback){
        const {form} = this.props;
        if(value && this.state.confirmDirty){
            form.validateFields(['confirm'], {force: true});
        }

        callback();
    }

    compareToFirstPassword(rule, value, callback){
        const {form} = this.props;
        if(value && value !== form.getFieldValue('password')){
            callback("Passwords don't match!");
        }else{
            callback();
        }
    }

    handleConfirmBlur(ev){
        const {value} = ev.target;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

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
                    Sign Up
                </Button>
                <Modal title="Sign Up" visible={this.state.visible} okText="Register" onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="Username">
                            {getFieldDecorator('username', {rules: [{required: true, message: 'Input a username!'}]})(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25'}} />}
                                placeholder="Username"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback>
                            {getFieldDecorator('password', {rules: [{required: true, message: 'Input a password!'}, {validator: this.compareToSecondPassword}]})(
                                <Input.Password prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25'}} />}
                                placeholder="Password"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {getFieldDecorator('confirm', {rules: [{required: true, message: 'Confirm your password!'}, {validator: this.compareToFirstPassword}]})(
                                <Input.Password prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25'}} />} onBlur={this.handleConfirmBlur}
                                placeholder="Confirm Password"
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );

        return element;
    }
}

export default SignUp;