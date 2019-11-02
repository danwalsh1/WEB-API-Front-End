import React from 'react'
import { List } from 'antd';
//import { DragDropContext } from 'react-beautiful-dnd';
import { Card } from 'antd';
import Draggable from '../Dnd/Draggable';
import Droppable from '../Dnd/Droppable'
import '../App.css';

class ActivityList extends React.Component{
  state = {
    userId: localStorage.getItem('userID'),
    dataFromDB: {},
    dataFuncRun: false
  };

  getActivities = () => {
    if (!this.state.dataFuncRun){
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
  }

  componentDidMount(){
    this.getActivities()
  }

  getActivityData = () => {
    if (!this.state.dataFuncRun){return;}
    var  ObjectForList = []
    var i;
    for (i = 0; i < this.state.activityCount; i++){
      console.log(this.state.dataFromDB)
      ObjectForList = ObjectForList.concat(this.state.dataFromDB[i+this.state.activityCount])
    }
    console.log(ObjectForList)
    return ObjectForList;
  }


render() {
  //let data = this.getActivityData()
  return (
    <div className='activityList'>
      <h3 style={{ margin: '16px 0' }}>Your Activities</h3>
      <List
        size="large"
        dataSource={this.getActivityData()}
        renderItem={item =>
          <Draggable id="an activity">
          <Card title={item.title} bordered={true} >
            {item.description}
            <br />
            {item.url}
            <br />
            {item.location}
            <br />
          </Card>
          </Draggable>}
      />
    </div>
  );
}
}

export default ActivityList;