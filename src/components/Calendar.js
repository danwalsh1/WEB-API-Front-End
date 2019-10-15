import React from 'react'
import { Calendar, Alert } from 'antd';
import moment from 'moment';

// Testing code
import {Form} from 'antd'
import Login from './Login'
const LoginForm = Form.create({name: 'login'})(Login)

class CalendarClass extends React.Component {
  state = {
    value: moment('2017-01-25'),
    selectedValue: moment('2017-01-25'),
  };

  onSelect = value => {
    console.log(value)
    
    
    this.setState({
      value,
      selectedValue: value,
    });
  };

  onPanelChange = value => {
    this.setState({ value });
  };

  render() {
    const { value, selectedValue } = this.state;
    return (
      <div>
        <Alert
          message={`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`}
        />
        <LoginForm/>
        <Calendar value={value} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
      </div>
    );
  }
}

export default CalendarClass