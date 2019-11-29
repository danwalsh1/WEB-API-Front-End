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
            confirmDirty: false,
            username: '',
            password: '',
            confirmPassword: ''
        };

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.compareToSecondPassword = this.compareToSecondPassword.bind(this);
        this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    }

    /* Modal Functions - Start */
    showModal(){
        this.setState({visible: true});
    }

    async handleOk(ev){
        ev.preventDefault();
        console.log(ev);
        // TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        /* WARNING - NOTE:
        *  After testing, this function is run when the ok button is pressed, not the "handleSubmit" function
        */
       const signUpData = {username: this.state.username, password: this.state.password};

        // Validation

       // Define valid characters
       var validLetters = /^[0-9a-zA-Z]+$/;
       // Username
       if (signUpData.username > 20 || typeof signUpData.username != "string" || !signUpData.username.match(validLetters)){
        window.alert("Username content must be less than 20 characters, must all be of type string and must all be alphanumeric.");
        return;
       }
       // Password
       if (signUpData.password > 100 || typeof signUpData.password != "string" || !signUpData.password.match(validLetters)){
        window.alert("Password content must be less than 100 characters, must all be of type string and must all be alphanumeric.");
        return;
       }

       // End of validation

       // Validate fields
       // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
       if(signUpData.username.length > 0 && signUpData.password.length > 0){
            if(signUpData.password === this.state.confirmPassword){
                /*fetch('http://localhost:8080/api/v1.0/signup/register', {
                    method: 'post',
                    body: JSON.stringify(signUpData),
                    headers: {'Content-Type': 'application/json'}
                }).then(res => res.json()).then(json => console.log(json));*/
                let resultStatus = await fetch('http://localhost:8080/api/v1.0/signup/register', {
                    method: 'post',
                    body: JSON.stringify(signUpData),
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {return res.status;})
                if(resultStatus == 200){
                    window.alert("Your account has been created!");
                }else if(resultStatus == 409){
                    window.alert("The username you gave is already in use!");
                }else{
                    window.alert("Server error!");
                }
                console.log(`Status: ${resultStatus}`);
                console.log(resultStatus);
                this.setState({visible: false});
            }
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

    handleUsernameChange(ev){
        this.setState({username: ev.target.value});
    }

    handlePasswordChange(ev){
        this.setState({password: ev.target.value});
    }

    handleConfirmPasswordChange(ev){
        this.setState({confirmPassword: ev.target.value});
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
        var button;
        if(localStorage.getItem('userId') == 0 || localStorage.getItem('userId') == null){
            button = <Button type="primary" onClick={this.showModal} visible="false"
            >
              Sign Up
            </Button>
        }else {
            button = null;
        }

        const element = (
            <div className='signup'>
                {button}
                <Modal title="Sign Up" visible={this.state.visible} okText="Register" onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="Username">
                            {getFieldDecorator('username', {rules: [{required: true, message: 'Input a username!'}]})(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25'}} />}
                                placeholder="Username" onChange={this.handleUsernameChange}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback>
                            {getFieldDecorator('password', {rules: [{required: true, message: 'Input a password!'}, {validator: this.compareToSecondPassword}]})(
                                <Input.Password prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25'}} />}
                                placeholder="Password" onChange={this.handlePasswordChange}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {/* The onBlur in this input tag is the function that is run when the object "loses focus".
                            It is, therefore, used to validate the two passwords when the user clicks off entering the second password */}
                            {getFieldDecorator('confirm', {rules: [{required: true, message: 'Confirm your password!'}, {validator: this.compareToFirstPassword}]})(
                                <Input.Password prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25'}} />} onBlur={this.handleConfirmBlur}
                                placeholder="Confirm Password" onChange={this.handleConfirmPasswordChange}
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