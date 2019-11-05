import React from 'react';
import { Calendar, Alert, Modal, Badge } from 'antd';
import moment from 'moment';
import '../App.css';
import PropTypes from 'prop-types';
import CalendarItemComposer from './CalendarItemComposer';
import {Form} from 'antd'
//import Droppable from '../Dnd/Droppable';

class CalendarClass extends React.Component {
  state = {
    value: moment('2017-01-25'),
    selectedValue: moment('2017-01-25'),
    visible: false,
    modalTitle: "null",
    activityTitle: "No content found for this date.",
    activityDescription: "No Description",
    activityTime: 'No time',
    dateActvities: [],
    userId: localStorage.getItem('userID'),
    dataFromDB: {},
    dataFuncRun: false,
    composerVisible: false,
    activityDate: null,
    activityLocation: null,
    activityTitle: null,
    activityID: null,
  };

  componentDidMount(){
    // Fetches all activity data from the backend, using the logged in user's ID.
    let URLToFetchFrom = 'http://localhost:8080/api/v1.0/GetActivity/'+this.state.userId;
    fetch(URLToFetchFrom, {
      method: 'get',
      headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa('jacob:mypassword123')},})
    .then(res => res.json())
    .then(
        (result) => {
            const activityCount = result.length / 2
            console.log(result)
            this.setState({
              dataFuncRun: true,
              dataFromDB: result,
              activityCount: activityCount
          });
        },
        (error) => {
        this.setState({
          dataFuncRun: true,
            error
        });
        }
    );
  }

  // A function that converts a datetime from MySQL format to a format JavaScript can use.
  convertDatefromSQLtoJS(datetime) {
    const datetimeparts = datetime.split(/[- :]/);
    const dateArr = datetimeparts.toString().split(',');
    const tempDate = new Date(dateArr[0],dateArr[1],dateArr[2],dateArr[3],dateArr[4],dateArr[5]);
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
    var i;
    var dateActvities = [];
    for (i = 0; i < this.state.activityCount; i++){
      // Get info from calendar_activity_item table
      var dataToUse = this.state.dataFromDB[i];
      //var id = dataToUse.id;
      var datetimeFROM = dataToUse.aFrom;
      var datetimeTO = dataToUse.aTo;
      var location = dataToUse.location;

      // Get info from activity table
      dataToUse = this.state.dataFromDB[i+this.state.activityCount];
      var titles = dataToUse.title;
      var description = dataToUse.description;
      var url = dataToUse.url;

      datetimeFROM = datetimeFROM.replace('T', ' ');
      datetimeFROM = datetimeFROM.slice(0 , datetimeFROM.length-5);
      datetimeTO = datetimeTO.replace('T', ' ');
      datetimeTO = datetimeTO.slice(0 , datetimeTO.length-5);

      const currentDateToRender = value.format('DD-MM-YYYY');

      const dateFrom = this.convertDatefromSQLtoJS(datetimeFROM);
      const dateString = this.convertDateToString(dateFrom);
      const timeFROM = this.getTimeFromDate(dateFrom);

      //timeTO: timeTO
      const dateTO = this.convertDatefromSQLtoJS(datetimeTO);
      const timeTO = this.getTimeFromDate(dateTO);

      if (currentDateToRender === dateString){
        dateActvities.push({ key: i, type: 'success', title: titles, description: description, timeFROM: timeFROM, timeTO: timeTO, location: location, url: url});
      };
    }
    
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
    if (!this.state.dataFuncRun){return;}
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
    if (!this.state.dataFuncRun){return;}
    const dateActivities = this.getActivityData(val);
    return (
      <ul className="events">
      {dateActivities.map(item => (
        <li key={item.title}>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <p>Time: {item.timeFROM} - {item.timeTO}</p>
          <p>Location: {item.location}</p>
          <p>URL: {item.url}</p>
          <h2>-------------------------------</h2>
        </li>
      ))}
    </ul>
    );
  }

  drop = (e) => {
    e.preventDefault();
    const activityId = e.dataTransfer.getData('transfer');
    const dateDroppedString = e.target.parentNode.parentNode.getAttribute("title");
    const dateActivityDropped = new Date(Date.parse(dateDroppedString));
    this.setState({activityDate: dateActivityDropped});
    
    console.log("Dropped.");
    console.log(activityId)
    console.log("Do something.")

    // Fetch an activity.
    const URLToFetchFrom = 'http://localhost:8080/api/v1.0/GetActivityByItsID/'+activityId
    fetch(URLToFetchFrom, {
      method: 'get',
      headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa('jacob:mypassword123')},})
    .then(res => res.json())
    .then(
        (result) => {
            console.log(result)
            this.setState({
              activityTitle: result[0].title,
              activityID: result[0].id,
              activityLocation: result[0].location,
            });
        },
        (error) => {
        this.setState({
          dataFuncRun: true,
            error
        });
        }
    );

    this.setState({composerVisible: true})
  }

  allowDrop = (e) => {
      e.preventDefault();
  }


  render() {
    const { value, selectedValue } = this.state;
    const ActivityItemComposer = Form.create({name: 'login'})(CalendarItemComposer)
    return (
      <div className='calendar' id={this.props.id} onDrop={this.drop} onDragOver={this.allowDrop}>

        <ActivityItemComposer title="testing" visible={this.state.composerVisible}/>

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

export default CalendarClass;

CalendarClass.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
}