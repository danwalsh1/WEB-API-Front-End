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
        console.log(e)
        this.setState({
            visible: false,
        })
    }

    render() {
        return (
          <div>
            <Button type="primary" onClick={this.showModal}>
              Login
            </Button>
            <Modal
              title="Login"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>do a form in here so the user can log in</p>
            </Modal>
          </div>
        );
      }

}

export default Login