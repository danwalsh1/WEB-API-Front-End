import React from 'react'
import {Modal, Button, Form, Icon, Input} from 'antd'

class Login extends React.Component{
    state = { visible: false}

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = e => {
        console.log("ok")
        console.log(e)
        this.setState({
            visible: false,
        })
    }

    handleSubmit = e => {
        console.log("submit")
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err){
                console.log("Values recieved: ",values);
            }
        })
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
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item>
                    {getFieldDecorator('username', { rules: [{ required: true, message: 'Please input your username!' }],})(
                        <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                        />,
                    )}
                    </Form.Item>
                    <Form.Item>
                    {getFieldDecorator('password', {rules: [{ required: true, message: 'Please input your Password!' }],})(
                        <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                        />,
                    )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>

                </Form>

            </Modal>
          </div>
        );
      }

}

export default Login