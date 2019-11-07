import React from 'react'
import { List } from 'antd';
//import { DragDropContext } from 'react-beautiful-dnd';
import { Card } from 'antd';
import '../App.css';
import PropTypes from 'prop-types';

class ActivityList extends React.Component{
  state = {
    userId: localStorage.getItem('userID'),
    dataFromDB: {},
    dataFuncRun: false
  };

  getActivities = () => {
    if (!this.state.dataFuncRun && localStorage.getItem('userID') != "null"){
      // Fetches all activity data from the backend, using the logged in user's ID.
      let URLToFetchFrom = 'http://localhost:8080/api/v1.0/GetActivityByItsID/';
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
    return this.state.dataFromDB;
  }

  drag = (e) =>{
    e.dataTransfer.setData('transfer', e.target.id);
  }

  noAllowDrop = (e) => {
      e.stopPropagation();
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
            <Card title={item.title} bordered={true} id={item.id} draggable="true" onDragStart={this.drag} onDragOver={this.noAllowDrop} >
              {item.description}
              <br />
              {item.url}
              <br />
              {item.location}
              <br />
            </Card>}
      />
    </div>
  );
}
}

export default ActivityList;

ActivityList.propTypes = {
  id: PropTypes.number,
  children: PropTypes.node,
}