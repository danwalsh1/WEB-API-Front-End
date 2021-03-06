import React from 'react'
import {Modal, Button, Form, Icon, Input} from 'antd'

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
        console.log(event);
        console.log(this.state);
        const loginData = {username: this.state.username, password: this.state.password}
        event.preventDefault();

        // Validate fields and check to make sure neither are null.
        if (!loginData.username){
            console.log("Username should not be null.");
        }else if (!loginData.password){
            console.log("Password should not be null.");
        }else{
            this.setState({
                visible: false,
            })

            var urlToFetch = "http://localhost:8080/api/v1.0/login/signin"
            fetch(urlToFetch, {
                method: 'post',
                body: JSON.stringify(loginData),
                headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(loginData.username+':'+loginData.password)},
            }).then(response => {
                console.log(response.status);
                fetch(urlToFetch, {
                    method: 'get',
                    headers: {'Content-Type': 'application/json'}
                }).then(res => res.json())
                .then((result) => {
                    if(response.status === 200){
                        console.log(result);
                        localStorage.setItem("userId", result)
                        localStorage.setItem("username",loginData.username)
                        localStorage.setItem("password", loginData.password)
                        
                        window.location.reload();

                        console.log(localStorage.getItem("userId"))
                    }
                })
            })

            
    }}

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
        this.setState({username: event.target.value});
    }

    handlePassword = event => {
        this.setState({password: event.target.value});
    }

    signOut = () => {
        /*
    The following code logs the user out and refreshes the page so any activities are removed.
    This will be used in future for log out.
    Set the userid to 0 then reload the page and its contents.
    */

    localStorage.setItem('userId', 0)
    window.location.reload();
    }

    render() {
        const { getFieldDecorator } = this.props.form
        var button;
        if(localStorage.getItem('userId') == 0 || localStorage.getItem('userId') == null) {
            button = <Button type="primary" onClick={this.showModal} visible="false"
            >
              Login here
            </Button>
        }else if (localStorage.getItem('userId') != 0){
            button = <Button type="primary" onClick={this.signOut} visible="false"
            >
              Sign out
            </Button>
        }

        return (
          <div className='login'>
            {button}
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