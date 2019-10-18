import React from 'react'
import { Calendar, Alert, Modal, Badge } from 'antd';
import moment from 'moment';

class CalendarClass extends React.Component {
  state = {
    value: moment('2017-01-25'),
    selectedValue: moment('2017-01-25'),
    visible: false,
    modalTitle: "null",
    activityTitle: "No content found for this date."
  };

  onSelect = value => {
    const dateChosen = value.format('DD-MM-YYYY');

    /*
    use date to get all values from database depending on a date.
    get TITLE
    get TO - FROM time
    show in the calendar.
    */
    
    const dateFromDB = new Date(2017, 1, 18, 18, 0, 0, 0);
    const activity = {
      title: 'Activity title goes here',
      dateFrom: dateFromDB,
      to: '18:00'
    };

    // Define activity date as the date from the database and do any necessary adjustments.
    var dd = dateFromDB.getDate();
    var mm = dateFromDB.getMonth(); 
    var yyyy = dateFromDB.getFullYear();
    if(dd < 10) { dd = '0' + dd; } 
    if(mm < 10) { mm = '0' + mm; }
    const activityDate = dd + '-' + mm + '-' + yyyy;

    console.log("Date chosen: "+dateChosen)
    console.log("The activity date: "+activityDate)

    if (dateChosen == activityDate) {
      console.log("chosen a date with an activity.");
      this.setState({ activityTitle: activity.title})
    }

    // CURRENT STATE: Shows no content unless the user has selected the date specified at the top of this function.
    // TODO: Show an activity in the calendar before the date gets clicked.


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

  dateCellRender = value => {
    const listData = [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
    ];

    // get TITLE from database where user who is related to it (made it or tagged in it).
    // store it in an object or an array and then change the text below to work with that.

    return (
      <ul>
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
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
              onCancel={this.handleCancel}
        >
          <h1> {this.state.activityTitle} </h1>
          <p>  </p>
          <p>content 2</p>
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