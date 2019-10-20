import React from 'react'
import { Calendar, Alert, Modal, Badge } from 'antd';
import moment from 'moment';

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

  getDataFromDB() {
    const datetime = ['22-01-2017 18:00:00','22-01-2017 20:00:00','01-05-2017 22:00:00']
    const titles = ['First title','Second title','Third title'];
    const description = ['wow so cool description','wow so cool description 2','wow so cool description 3'];

    const data = {
      datetime: datetime,
      titles: titles,
      description: description
    }

    return data;
  }

  convertDatefromSQLtoJS(datetime) {
    const temp = datetime;
    const datetimeparts = temp.split(/[- :]/);
    const dateArr = datetimeparts.toString().split(',');
    const tempDate = new Date(dateArr[2],dateArr[1],dateArr[0],dateArr[3],dateArr[4],dateArr[5]);
    return tempDate;
  }

  convertDateToString(datetime){
    var dd = datetime.getDate();
    var mm = datetime.getMonth();
    var yyyy = datetime.getFullYear();
    if(dd < 10) { dd = '0' + dd; } 
    if(mm < 10) { mm = '0' + mm; }
    const activityDate = dd + '-' + mm + '-' + yyyy;

    return activityDate;
  }

  onSelect = value => {
    const dateChosen = value.format('DD-MM-YYYY');
    const noActivityTitle = "No content found for this date."
    const noActivityDescription = "No Description"
    const noActivityTime = "No time"

   const data = this.getDataFromDB()
   const datetime = data.datetime;
   const titles = data.titles;
   const description = data.description;

   var i;
   for (i = 0; i < datetime.length; i++) {
    const tempDate = this.convertDatefromSQLtoJS(datetime[i]);
    const time = tempDate.toLocaleTimeString('it-IT')

    const activity = {
      title: titles[i],
      datetime: tempDate,
      description: description[i],
      time: time
    };

    const activityDate = this.convertDateToString(activity.datetime)

    if (dateChosen === activityDate) {
      this.setState({activityTitle: activity.title});
      this.setState({activityDescription: activity.description})
      this.setState({activityTime: activity.time})
      break;
    }else{
      this.setState({ activityTitle: noActivityTitle, activityDescription: noActivityDescription, activityTime: noActivityTime})
    };

   };

    this.setState({
      value,
      selectedValue: value,
      modalTitle: `Your activities on: ${value.format('DD-MM-YYYY')}`,
      visible: true,
    });
  };

  getActivityData = value => {
    const data = this.getDataFromDB()
    const datetime = data.datetime;
    const titles = data.titles;
    const description = data.description;

    const currentDateToRender = value.format('DD-MM-YYYY');
    let datesActivities;

    var i;
    datesActivities = [];
    var dateAct = []
    for (i = 0; i < datetime.length; i++) {
      const date = this.convertDatefromSQLtoJS(datetime[i])
      const dateString = this.convertDateToString(date)
      if (currentDateToRender === dateString){
        console.log("-----")
        console.log(dateString)
        console.log(titles[i])
        const activityToAppend = { key: i, type: 'success', content: description[i], title: titles[i]}
        console.log(activityToAppend)
        datesActivities.push(activityToAppend)
        console.log(datesActivities)

        //this.setState({
        //  dateActvities: this.state.dateActvities.concat(activityToAppend)
        //})

        //this.setState(prevState => ({
        //  dateActvities: [...prevState.dateActvities, activityToAppend]
        //}))

        //this.state.dateActvities.concat(activityToAppend)

        //console.log(this.state.dateActvities)
        //dateAct = this.state.dateActvities
        //console.log("--- End ---")
        break;
      }
    }
    return datesActivities || [];
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
    const datesActivities = this.getActivityData(value);
    return (
      <ul>
        {datesActivities.map(item => (
            <Badge status={item.type} text={item.title} />
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
              onCancel={this.handleCancel}
        >
          <h1> {this.state.activityTitle} </h1>
          <p> {this.state.activityDescription} </p>
          <p> {this.state.activityTime} </p>
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