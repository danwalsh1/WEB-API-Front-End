import React from 'react'
import { List, Typography } from 'antd';

class ActivityList extends React.Component{
  state = {
    userId: 7,
    dataFromDB: {},
    dataFuncRun: false
  };

  getActivities = () => {
    if (!this.state.dataFuncRun){
      // Fetches all activity data from the backend, using the logged in user's ID.
      let URLToFetchFrom = 'http://localhost:8080/api/v1.0/GetActivity/'+this.state.userId;
      fetch(URLToFetchFrom, {
        method: 'get',
        headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa('ja:pass')},})
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
    /*
    var dataForList = [];
    i = 0;
    for (i = 0; i < ObjectForList.length; i++){
      dataForList = dataForList.concat(ObjectForList[i].title)
    }
    */
    return ObjectForList;
  } 

render() {
  return (
    <div>
    <h3 style={{ margin: '16px 0' }}>Your Activities</h3>
    <List
      size="large"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={this.getActivityData()}
      renderItem={item =>
        <List.Item>
        {item.title}
        <br />
        {item.description}
        <br />
        {item.url}
        <br />
        {item.location}
        </List.Item>}
    />
  </div>
  );
}
}

export default ActivityList;