import React from 'react';
import {Modal, Button, Form, Icon, Input} from 'antd';

/* USAGE:
*  To use this component you first need to do:
*  const SignUpForm = Form.create({name: 'signup'})(SignUp);
*
*  You can then use:
*  <SignUpForm />
*
*  to put the button onto the page
*/

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

    /* Modal Functions - Start */
    showModal(){
        this.setState({visible: true});
    }

    handleOk(ev){
        console.log(ev);
        this.setState({visible: false});
        // TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        /* WARNING - NOTE:
        *  After testing, this function is run when the ok button is pressed, not the "handleSubmit" function
        */
    }

    handleCancel(ev){
        console.log(ev);
        this.setState({visible: false});
    }
    /* Modal Functions - End */

    /* Form Functions - Start */
    handleSubmit(ev){
        ev.preventDefault();
        // TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        /* WARNING - NOTE:
        *  After testing, this function is not run when the ok button is pressed, but the "handleOk" function is
        */
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
                            {/* The onBlur in this input tag is the function that is run when the object "loses focus".
                            It is, therefore, used to validate the two passwords when the user clicks off entering the second password */}
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