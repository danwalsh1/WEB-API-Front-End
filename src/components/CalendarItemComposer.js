import React from 'react';
import {Modal, Button, Form, Icon, Input, TimePicker} from 'antd';
import moment from 'moment';

class CalendarItemComposer extends React.Component{
    constructor(props){
        /*
        NEEDED INFORMATION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        This component needs the following things to be input into the component through props:
        . Activity Title
        . Activity ID
        . Date of event
        . Location (even if that location is empty)
        */
        super(props);
        this.state = {
            visible: this.props.visible,
            title: this.props.title,
            date: this.props.date,
            from: null,
            to: null,
            location: this.props.location,
            activityID: this.props.activityID
        };

        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.render = this.render.bind(this);

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
    }

    /* Modal Functions - Start */

    showModal(){
        this.setState({visible: true});
    }

    handleOk(ev){
        ev.preventDefault();

        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Edit below to use proper user ID and use correct dateTime format using date given through props <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        const activityItemData = {from: this.state.from, to: this.state.to, location: this.state.location, userId: "jacob", activityId: this.state.activityID};

        // Validate Form
        if(activityItemData.from != null && activityItemData.to != null){
            if(activityItemData.location.length > 0){
                // Form valid

                // FETCH NEEDED
                
                this.setState({visible: false});
            }
        }
    }

    handleCancel(ev){
        console.log("test")
        console.log(ev);
        this.setState({visible: false});
        console.log(this.state.visible);
    }

    /* Modal Functions - End */

    /* Form Functions - Start */

    handleSubmit(ev){
        ev.preventDefault();
    }

    handleFromChange(ev){
        this.setState({from: ev.date});
    }

    handleToChange(ev){
        this.setState({to: ev.date});
    }

    handleLocationChange(ev){
        this.setState({location: ev.target.value});
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

        const format = 'HH:mm';

        const element = (
            <div>
                <Modal title="Add Activity" visible={this.state.visible} okText="Add" onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="From">
                            {getFieldDecorator('From', {rules: [{required: true, message: 'You need to specify a start time!'}]})(
                                <TimePicker format={format} onChange={this.handleFromChange} />
                            )}
                        </Form.Item>
                        <Form.Item label="To">
                            {getFieldDecorator('To', {rules: [{required: true, message: 'You need to specify an end time!'}]})(
                                <TimePicker format={format} onChange={this.handleToChange} />
                            )}
                        </Form.Item>
                        <Form.Item label="Location">
                            {getFieldDecorator('Location', {rules: [{required: true, message: 'You need to specify a location!'}]})(
                                <Input placeholder="Location" onChange={this.handleLocationChange} />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );

        return element;
    }
}

export default CalendarItemComposer;