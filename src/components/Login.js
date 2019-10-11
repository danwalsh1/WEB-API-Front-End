import React from 'react'
import {Modal, Button, Form, Icon, Input} from 'antd'
//import { throwStatement } from '@babel/types';

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = { visible: false, 
            username: '',
            password: ''};
    }

    showModal = () =>{
        this.setState({
            visible: true,
        })
    }

    handleOk = event =>{
        console.log("ok");
        console.log(event);
        console.log(this.state)
        const loginData = {username: this.state.username, password: this.state.password}

        // Validate fields and check to make sure neither are null.
        if (!loginData.username){
            console.log("Username should not be null.")
        }else if (!loginData.password){
            console.log("Password should not be null.")
        }else{
            this.setState({
                visible: false,
            })

            fetch("localhost:8080/api/v1.0/login/signin", {
                method: 'post',
                body: JSON.stringify(loginData),
                headers: { 'Content-Type': 'application/json'},
            })
            .then(res => res.json())
            .then(json => console.log(json));
        }
    }

    handleSubmit = event =>{
        console.log("submit");
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err){
                console.log("Values recieved: ",values);
            }
        })
    }

    handleCancel = event =>{
        this.setState({
            visible: false,
        })
    }

    handleUsername = event =>{
        this.setState({username: event.target.value})
    }

    handlePassword = event => {
        this.setState({password: event.target.value})
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
          <div>
            <Button type="primary" onClick={this.showModal}>
              Login here
            </Button>
            <Modal
              title="Login"
              visible={this.state.visible}
              okText='Login'
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item>
                    {getFieldDecorator('username', { rules: [{ required: true, message: 'Please input your username!' }],})(
                        <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                        onChange={this.handleUsername}
                        placeholder="Username"
                        />,
                    )}
                    </Form.Item>
                    <Form.Item>
                    {getFieldDecorator('password', {rules: [{ required: true, message: 'Please input your Password!' }],})(
                        <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                        onChange={this.handlePassword}
                        type="password"
                        placeholder="Password"
                        />,
                    )}
                    </Form.Item>

                </Form>

            </Modal>
          </div>
        );
      }

}

export default Login