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
    dateActvities: [],
    userId: 7,
    dataFromDB: {},
    dataFuncRun: false
  };

  componentDidMount(){
    let URLToFetchFrom = 'http://localhost:8080/api/v1.0/admin/'+this.state.userId
    fetch(URLToFetchFrom)
    .then(res => res.json())
    .then(
        (result) => {
            console.log(result)
            const activityCount = result.length / 2
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
    )
}


  // Function thats gets the information from the database, currently holds dummy data that will be changed when the calendar is made functional with the back end.
  getDataFromDB() {

    /* const hasFuncRun = this.state.dataFuncRun
    console.log("hasFuncRun: "+hasFuncRun)
    if (!doRun){
      fetch('http://localhost:8080/api/v1.0/admin/1')
    .then(res => res.json())
    .then((result) => {
      this.setState({dataFromDB: result});
    });

    const DBdata = this.state.dataFromDB;
    console.log(DBdata) */

    const datetimeFROM =['22-01-2017 18:00:00','23-01-2017 20:00:00','22-01-2017 22:00:00']
    const datetimeTO =  ['22-01-2017 19:00:00','23-01-2017 21:00:00','22-01-2017 23:00:00'] 
    const titles =      ['Go Park','Swimming','Gaming'];
    const description = ['Go to the park with my friend.','Swimming for my birthday.','All nighter playing League of Legends with my buddies.'];

    const data = {
      datetimeFROM: datetimeFROM,
      datetimeTO: datetimeTO,
      titles: titles,
      description: description
    }

    //this.setState({dataFuncRun: true})
    return data;
  }

  // A function that converts a datetime from MySQL format to a format JavaScript can use.
  convertDatefromSQLtoJS(datetime) {
    const datetimeparts = datetime.split(/[- :]/);
    console.log("this: "+ datetimeparts)
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
    //const data = this.getDataFromDB()
    //const data = this.state.dataFromDB
    //console.log("Data in get activity data: "+data)

    var id = this.state.dataFromDB.id;
    var datetimeFROM = this.state.dataFromDB.aFrom;
    var datetimeTO = this.state.dataFromDB.aTo;
    var titles = this.state.dataFromDB.title;
    var description = this.state.dataFromDB.description;
    //console.log(this.state.dataFromDB)

    datetimeFROM = datetimeFROM.replace('T', ' ')
    datetimeFROM = datetimeFROM.slice(0 , datetimeFROM.length-5)
    datetimeTO = datetimeTO.replace('T', ' ')
    datetimeTO = datetimeTO.slice(0 , datetimeTO.length-5)
    
    //console.log(datetimeFROM)
    //console.log(datetimeTO)
    

    const currentDateToRender = value.format('DD-MM-YYYY');

    var i;
    var dateActvities = [];
    //console.log(this.state.dataFromDB)
    const dateFrom = this.convertDatefromSQLtoJS(datetimeFROM)
    const dateString = this.convertDateToString(dateFrom)
    const timeFROM = this.getTimeFromDate(dateFrom)

    //timeTO: timeTO
    const dateTO = this.convertDatefromSQLtoJS(datetimeTO)
    const timeTO = this.getTimeFromDate(dateTO)

    console.log(currentDateToRender)
    console.log(dateString)

    if (currentDateToRender === dateString){
      console.log("made it.")
      for (i = 0; i < 2; i++) {
        // Inside for loop to test to see multiple objects in dateActivities still works when rendering.
        dateActvities.push({ key: i, type: 'success', description: description, title: titles, timeFROM: timeFROM, timeTO: timeTO});
      }
      
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
          <h1> {item.title} </h1>
          <p> {item.description} </p>
          <p> {item.activityTime} </p>
          <p> Time: {item.timeFROM} - {item.timeTO} </p>
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