import React from 'react';
import { Calendar, Alert, Modal, Badge, Form, Input, TimePicker } from 'antd';
import moment from 'moment';
import '../App.css';
import PropTypes from 'prop-types';
import CommentUI from './CommentUI';

class CalendarClass extends React.Component {
  state = {
    value: moment('2017-01-25'),
    selectedValue: moment('2017-01-25'),
    calendarModalVisible: false,
    modalTitle: "null",
    activityTitle: "No content found for this date.",
    activityDescription: "No Description",
    activityTime: 'No time',
    dateActvities: [],
    userId: localStorage.getItem('userId'),
    dataFromDB: {},
    dataFuncRun: false,
    composerVisible: false,
    activityDate: null,
    from: null,
    to: null,
    location: null,
    activityTitleToPass: null,
    activityID: null,
    taggedUsers: null,
    uploadedFile: null,
  };

  componentDidMount(){
    if (localStorage.getItem('userId') != 0){
      // Fetches all activity data from the backend, using the logged in user's ID.
      let URLToFetchFrom = 'http://localhost:8080/api/v1.0/GetActivity/'+this.state.userId;
      fetch(URLToFetchFrom, {
        method: 'get',
        headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))},})
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
    var hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const seconds = datetime.getSeconds();

    if (hours < 10)
      hours = '0' + hours
    var time = hours + ':' + minutes + seconds;

    if (time.length === 6)
      time = time.slice(0, time.length-1)

    return time;
  }

  // Function that is called when a user selects a date.
  onSelect = value => {

    this.setState({
      value,
      selectedValue: value,
      modalTitle: `Your activities on: ${value.format('DD-MM-YYYY')}`,
      calendarModalVisible: true,
    });
  };

  getActivityData = value => {
    var i;
    var dateActvities = [];
    for (i = 0; i < this.state.activityCount; i++){
      // Get info from calendar_activity_item table
      var dataToUse = this.state.dataFromDB[i];
      var id = dataToUse.id;
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
        dateActvities.push({ key: i, id: id, type: 'success', title: titles, description: description, timeFROM: timeFROM, timeTO: timeTO, location: location, url: url});
      };
    }
    
    return dateActvities || [];
  }

  onPanelChange = value => {
    this.setState({ value });
  };

  showModal = () =>{
    this.setState({
      calendarModalVisible: true,
    });
  };

  handleCancel = event =>{
    this.setState({
      calendarModalVisible: false,
    });
  };

  handleOk = event =>{
    this.setState({
      calendarModalVisible: false,
    });
  };

  dateCellRender = value => {
    if (!this.state.dataFuncRun){return;}
    const dateActivities = this.getActivityData(value);

    return (
      <ul className="events">
      {dateActivities.map(item => (
        <li key={item.key}>
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
        <li key={item.key}>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <p>Time: {item.timeFROM} - {item.timeTO}</p>
          <p>Location: {item.location}</p>
          <p>URL: {item.url}</p>
          <CommentUI itemId={item.id} />
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

    // Fetch an activity.
    const URLToFetchFrom = 'http://localhost:8080/api/v1.0/GetActivityByItsID/'+activityId;
    fetch(URLToFetchFrom, {
      method: 'get',
      headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))},})
    .then(res => res.json())
    .then(
        (result) => {
            console.log(result)
            this.setState({
              activityTitleToPass: result[0].title,
              activityID: result[0].id,
              location: result[0].location,
            });
        },
        (error) => {
        this.setState({
          dataFuncRun: true,
            error
        });
        }
    );

    this.setState({composerVisible: true});
  }

  allowDrop = (e) => {
      e.preventDefault();
  }

  handleComposerOk = (ev) => {
    ev.preventDefault();

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // Edit below to use proper user ID and use correct dateTime format using date given through props <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    const activityItemData = {from: this.state.from, to: this.state.to, location: this.state.location, userId: this.state.userId, activityId: this.state.activityID, fileData: this.state.uploadedFile};
    const activityTagUserData = {taggedUsers: this.state.taggedUsers, taggedByUserID: this.state.userId, actID: this.state.activityID, actFrom: this.state.from}

    // Validate Form
    if(activityItemData.from != null && activityItemData.to != null){
        if(activityItemData.location.length > 0){

            var data = activityItemData.from;
            var dateClicked = this.state.activityDate;
            var hours = data.split(':')[0];
            var mins = data.split(':')[1];
            const fromInt = dateClicked.setHours(hours, mins);
            const fromDate = new Date(fromInt)

            activityItemData.from = fromDate;
            activityTagUserData.actFrom = fromDate;

            data = activityItemData.to;
            dateClicked = this.state.activityDate;
            hours = data.split(':')[0];
            mins = data.split(':')[1];
            const toInt = dateClicked.setHours(hours, mins);
            const toDate = new Date(toInt)

            activityItemData.to = toDate;

            console.log(JSON.stringify(activityItemData))
            
            fetch('http://localhost:8080/api/v1.0/manage-activity/create-item', {
              method: 'post',
              body: JSON.stringify(activityItemData),
              headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))},
          }).then(response => {
              console.log(response.status);
              if (response.status === 200)
              //window.location.reload();
              if (this.state.taggedUsers != null){
                if(this.state.taggedUsers.length > 0){
                  let taggedUsers = this.state.taggedUsers;
                  let arrOfTaggedUsers = taggedUsers.split(/[ ,]+/);
                  activityTagUserData.taggedUsers = arrOfTaggedUsers;
                  
                  fetch('http://localhost:8080/api/v1.0/tag/tagUserInAct', {
                    method: 'post',
                    body: JSON.stringify(activityTagUserData),
                    headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))},
                }).then(response => {
                    console.log(response.status);
                });
                }
              }
          });
            
            this.setState({composerVisible: false});
        }
    }
  }

  handleComposerCancel = (ev) => {
    console.log("test")
    console.log(ev);
    this.setState({composerVisible: false});
    console.log(this.state.composerVisible);
  }

  handleFromChange = (ev) => {
    const timeWSeconds = ev._d.toTimeString().split(' ')[0];
    const hours = timeWSeconds.split(':')[0];
    const mins = timeWSeconds.split(':')[1];
    const timeFrom = hours +':'+mins

    this.setState({from: timeFrom});
  }

  handleToChange = (ev) => {
    const timeWSeconds = ev._d.toTimeString().split(' ')[0];
    const hours = timeWSeconds.split(':')[0];
    const mins = timeWSeconds.split(':')[1];
    const timeTo = hours +':'+mins

    this.setState({to: timeTo});
  }

  handleLocationChange = (ev) => {
    this.setState({location: ev.target.value});
  }

  handleTaggedUsersChange = (ev) => {
    this.setState({taggedUsers: ev.target.value});
  }

  onFileChange = (ev) =>{
    console.log(ev.target.files[0])
    this.setState({
      uploadedFile: ev.target.files[0],
    })
  }

  // Handles the content that needs to be inside the calendar_activity_item composer modal.
  getActivityComposerModalContent = () => {
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

        return (
            <div>
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
                          <Input placeholder="Location" onChange={this.handleLocationChange} placeholder={this.state.location} />
                      )}
                  </Form.Item>
                  <Form.Item label="Tagged Users">
                      {getFieldDecorator('TaggedUsers')(
                          <Input placeholder="Tagged Users" onChange={this.handleTaggedUsersChange} />
                      )}
                  </Form.Item>
                  <Form.Item label="Uploaded File">
                      {getFieldDecorator('UploadFile')(
                          <Input type="file" onChange={this.onFileChange}/>
                      )}
                  </Form.Item>
              </Form>
              
            </div>
        );
  }

  render() {
    const { value, selectedValue } = this.state;
    return (
      <div className='calendar' id={this.props.id} onDrop={this.drop} onDragOver={this.allowDrop}>

        <Modal title="Add Activity"
          visible={this.state.composerVisible}
          onOk={this.handleComposerOk}
          onCancel={this.handleComposerCancel}>
        {this.getActivityComposerModalContent()}
        </Modal>

        <Modal title={this.state.modalTitle}
              visible={this.state.calendarModalVisible}
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