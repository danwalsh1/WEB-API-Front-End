import React from 'react'
import { Calendar, Alert, Modal } from 'antd';
import moment from 'moment';

class CalendarClass extends React.Component {
  state = {
    value: moment('2017-01-25'),
    selectedValue: moment('2017-01-25'),
    visible: false,
    modalTitle: "null"
  };

  onSelect = value => {
    // When a date is selected set the modal title to be that date and show the modal.
    this.setState({
      value,
      selectedValue: value,
      modalTitle: `Your activities on: ${value.format('DD-MM-YYYY')}`,
      visible: true,
    });
  };

  onPanelChange = value => {
    this.setState({ value });
  };

  showModal = () =>{
    this.setState({
      visible: true,
    });
  };

  handleCancel = event =>{
    this.setState({
        visible: false,
    });
  };

  handleOk = event =>{
    this.setState({
        visible: false,
    });
  };

  render() {
    const { value, selectedValue, visible, modalTitle } = this.state;
    return (
      <div>
        <Modal title={this.state.modalTitle}
              visible={this.state.visible}
              okText='Close'
              onOk={this.handleOk}
              onCancel={this.handleCancel}>
        </Modal>


        <Alert
          message={`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`}
        />
        <Calendar value={value} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
      </div>
    );
  }
}

export default CalendarClass