import React from 'react';
import {Button, Form, Icon, List, Card, Radio, Input, Comment} from 'antd';

class CommentUI extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            commentData: [],
            activityItemId: this.props.itemId,
            commentsRecieved: false
        };
    }

    /* Component Functions - Start */

    componentDidMount(){
        this.getComments();
    }

    getComments(){
        console.log(localStorage.getItem('userId'))
        if (!this.state.commentsRecieved){
            // Get open requests
            let fetchURL = 'http://localhost:8080/api/v1.0/comments/' + this.state.activityItemId;

            fetch(fetchURL, {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))},})
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if(result.length > 0){
                        this.setState({commentData: result});
                    }
                    this.setState({commentsRecieved: true});
                }
            );
        }
      }

      /* Component Functions - End */

    render(){
        let commentData = this.state.commentData;

        const element = (
            <div>
                <List className="comment-list" header={`${commentData.length} comments`} itemLayout="horizontal" dataSource={commentData} renderItem={item => (
                    <li>
                        <Comment author={item.userId} content={item.allText} />
                    </li>
                )}/>
            </div>
        );

        return element;
    }
}

export default CommentUI;