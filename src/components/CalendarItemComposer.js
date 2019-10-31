import React from 'react';
import {Modal, Button, Form, Icon, Input} from 'antd';

class CalendarItemComposer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        };
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
                <Modal title="Add Activity" visible={this.state.visible} okText="Add" onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="">

                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );

        return element;
    }
}

export default CalendarItemComposer;