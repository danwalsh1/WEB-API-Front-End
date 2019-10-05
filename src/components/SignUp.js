import React from 'react';
import {Modal, Button} from 'antd';

class SignUp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        };

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
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

    render(){
        const element = (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Sign Up
                </Button>
                <Modal title="Sign Up" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <p>Form will go here!</p>
                </Modal>
            </div>
        );

        return element;
    }
}

export default SignUp;