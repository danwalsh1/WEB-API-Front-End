import React from 'react';
import {Button, Form, List, Input, Comment} from 'antd';

const {TextArea} = Input;

const Editor = ({onChange, onSubmit, submitting, value}) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

class CommentUI extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            commentData: [],
            submitting: false,
            newComment: '',
            activityItemId: this.props.itemId,
            commentsRecieved: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        this.formatComments();
    }

    formatComments(){
        if(this.state.commentData.length < 1){
            // If no comments, don't proceed to format them.
            return;
        }

        let newData = this.state.commentData;

        this.setState({commentData: newData});
    }

    /* Component Functions - End */

    /* Form Functions - Start */

    async handleSubmit(){
        console.log("Starting to submit comment");
        if(!this.state.newComment){
            console.log("Failed to submit comment!");
            return;
        }

        this.setState({submitting: true});

        let aDay = new Date();
        let today = aDay.getFullYear() + "-" + aDay.getMonth() + "-" + aDay.getDate() + " " + aDay.getHours() + ":" + aDay.getMinutes() + ":" + aDay.getSeconds();

        console.log(`Today: ${today}`);
        let sqlData = {userId: localStorage.getItem("userId"), activityId: this.state.activityItemId, allText: this.state.newComment, dateCreated: today, dateModified: today};

        await fetch('http://localhost:8080/api/v1.0/comments/create', {
            method: 'post',
            body: JSON.stringify(sqlData),
            headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))}
        }).then(res => console.log(res.status));
        this.setState({submitting: false});
        console.log("Finished comment submit");
        window.location.reload();
    }

    handleChange(ev){
        this.setState({newComment: ev.target.value});
    }

    /* Form Functions - End */

    render(){
        //let commentData = this.state.commentData;
        const {commentData, submitting, newComment} = this.state;

        const element = (
            <div>
                <List className="comment-list" header={`${commentData.length} comments`} itemLayout="horizontal" dataSource={commentData} renderItem={item => (
                    <li>
                        <Comment author={item.username} content={item.allText} />
                    </li>
                )}/>
                <Editor onChange={this.handleChange} onSubmit={this.handleSubmit} submitting={submitting} value={newComment} />
            </div>
        );

        return element;
    }
}

export default CommentUI;