import React from 'react'
import { Calendar, Alert, Modal, Badge } from 'antd';
import moment from 'moment';
import '../App.css';

class CalendarClass extends React.Component {
  state = {
    value: moment('2017-01-25'),
    selectedValue: moment('2017-01-25'),
    visible: false,
    modalTitle: "null",
    activityTitle: "No content found for this date.",
    activityDescription: "No Description",
    activityTime: 'No time',
    dateActvities: []
  };

  // Function thats gets the information from the database, currently holds dummy data that will be changed when the calendar is made functional with the back end.
  getDataFromDB() {
    const datetimeFROM =['22-01-2017 18:00:00','23-01-2017 20:00:00','22-01-2017 22:00:00']
    const datetimeTO =  ['22-01-2017 18:00:00','23-01-2017 20:00:00','22-01-2017 22:00:00'] 
    const titles =      ['Go Park','Swimming','Gaming'];
    const description = ['Go to the park with my friend.','Swimming for my birthday.','All nighter playing League of Legends with my buddies.'];

    const data = {
      datetimeFROM: datetimeFROM,
      datetimeTO: datetimeTO,
      titles: titles,
      description: description
    }

    return data;
  }

  // A function that converts a datetime from MySQL format to a format JavaScript can use.
  convertDatefromSQLtoJS(datetime) {
    const temp = datetime;
    const datetimeparts = temp.split(/[- :]/);
    const dateArr = datetimeparts.toString().split(',');
    const tempDate = new Date(dateArr[2],dateArr[1],dateArr[0],dateArr[3],dateArr[4],dateArr[5]);
    return tempDate;
  }

  // A function to convert a JavaScript Date object to a string.
  convertDateToString(datetime){
    var dd = datetime.getDate();
    var mm = datetime.getMonth();
    var yyyy = datetime.getFullYear();
    if(dd < 10) { dd = '0' + dd; } 
    if(mm < 10) { mm = '0' + mm; }
    const activityDate = dd + '-' + mm + '-' + yyyy;

    return activityDate;
  }

  // Gets time from a Date object.
  getTimeFromDate(datetime){
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const seconds = datetime.getSeconds();

    const time = hours + ':' + minutes + seconds;
    return time;
  }

  // Function that is called when a user selects a date.
  onSelect = value => {

    this.setState({
      value,
      selectedValue: value,
      modalTitle: `Your activities on: ${value.format('DD-MM-YYYY')}`,
      visible: true,
    });
  };

  getActivityData = value => {
    const data = this.getDataFromDB()
    const datetimeFROM = data.datetimeFROM;
    const titles = data.titles;
    const description = data.description;

    const currentDateToRender = value.format('DD-MM-YYYY');

    var i;
    var dateActvities = [];
    for (i = 0; i < datetimeFROM.length; i++) {
      const date = this.convertDatefromSQLtoJS(datetimeFROM[i])
      const dateString = this.convertDateToString(date)
      const timeFROM = this.getTimeFromDate(date)

      //timeTO: timeTO

      if (currentDateToRender === dateString){
        dateActvities.push({ key: i, type: 'success', description: description[i], title: titles[i], timeFROM: timeFROM});
      };
    };
    return dateActvities || [];
  }

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

  dateCellRender = value => {
    const dateActivities = this.getActivityData(value);
    return (
      <ul className="events">
      {dateActivities.map(item => (
        <li key={item.title}>
          <Badge status={item.type} text={item.title} />
        </li>
      ))}
    </ul>
    );
  }

  getModalContent = value => {
    const val = this.state.value
    const dateActivities = this.getActivityData(val);
    return (
      <ul className="events">
      {dateActivities.map(item => (
        <li key={item.title}>
          <h1> {item.title} </h1>
          <p> {item.description} </p>
          <p> {item.activityTime} </p>
          <p> Time: {item.time} </p>
        </li>
      ))}
    </ul>
    );
  }

  render() {
    const { value, selectedValue } = this.state;
    return (
      <div>
        
        <Modal title={this.state.modalTitle}
              visible={this.state.visible}
              okText='Close'
              onOk={this.handleOk}
              onCancel={this.handleCancel}>
          {this.getModalContent()}
        </Modal>
        <Alert
          message={`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`}
        />
        <Calendar value={value} onSelect={this.onSelect} onPanelChange={this.onPanelChange} dateCellRender={this.dateCellRender}/>
      </div>
    );
  }
}

export default CalendarClass