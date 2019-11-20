import React from 'react';
import {Modal, Button, Form, List, Input, Comment} from 'antd';

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
            visible: false,
            commentData: [],
            submitting: false,
            newComment: '',
            editCommentId: null,
            editComment: '',
            activityItemId: this.props.itemId,
            commentsRecieved: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleEditComment = this.handleEditComment.bind(this);
        this.handleEditCancel = this.handleEditCancel.bind(this);
        this.handleEditOk = this.handleEditOk.bind(this);
        this.handleEditCommentChange = this.handleEditCommentChange.bind(this);
    }

    /* Component Functions - Start */

    componentDidMount(){
        this.getComments();
    }

    async getComments(){
        console.log(localStorage.getItem('userId'))
        if (!this.state.commentsRecieved){
            // Get open requests
            let fetchURL = 'http://localhost:8080/api/v1.0/comments/' + this.state.activityItemId;

            await fetch(fetchURL, {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))},})
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result)
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
        console.log("Comment formatting started!");
        if(this.state.commentData.length < 1){
            // If no comments, don't proceed to format them.
            console.log("No comments");
            return;
        }

        let newData = this.state.commentData;
        console.log("Formatting in progress...");

        for(let x = 0; x < newData.length; x++){
            if(newData[x].userId == localStorage.getItem('userId')){
                newData[x].spanCode = [<span key="comment-list-reply-to-0" onClick={() => this.handleEditComment(newData[x].id, newData[x].allText)}>Edit</span>];
            }else{
                newData[x].spanCode = [];
            }
        }

        this.setState({commentData: newData});
        console.log("Comment formatting ended!");
    }

    /* Component Functions - End */

    /* Editor Functions - Start */

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

    /* Editor Functions - End */

    /* Modal Functions - Start */

    handleEditComment(commentId, commentText){
        console.log(`Comment ID: ${commentId}`);
        this.setState({visible: true, editCommentId: commentId, editComment: commentText});
    }

    async handleEditOk(){
        console.log("Starting to edit comment");
        if(this.state.editComment == ''){
            console.log("Failed to edit comment!");
            return;
        }

        let sqlData = {commentId: this.state.editCommentId, allText: this.state.editComment};

        await fetch('http://localhost:8080/api/v1.0/comments/update', {
            method: 'put',
            body: JSON.stringify(sqlData),
            headers: {'Content-Type': 'application/json', 'Authorization' : 'Basic ' + window.btoa(localStorage.getItem("username")+':'+localStorage.getItem("password"))}
        }).then(res => console.log(res.status));
        console.log("Finished comment edit");
        window.location.reload();
    }

    handleEditCancel(){
        this.setState({visible: false, editComment: '', editCommentId: null});
    }

    handleEditCommentChange(ev){
        this.setState({editComment: ev.target.value});
    }

    /* Modal Functions - End */

    render(){
        const {commentData, submitting, newComment, editComment} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            }, wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        }

        const element = (
            <div>
                <List className="comment-list" header={`${commentData.length} comments`} itemLayout="horizontal" dataSource={commentData} renderItem={item => (
                    <li>
                        <Comment author={item.username} content={item.allText} actions={item.spanCode} />
                    </li>
                )}/>
                <Editor onChange={this.handleChange} onSubmit={this.handleSubmit} submitting={submitting} value={newComment} />
                <Modal title="Edit Comment" visible={this.state.visible} okText="Save Edit" onOk={this.handleEditOk} onCancel={this.handleEditCancel}>
                    <Form {...formItemLayout}>
                        <Form.Item label="Comment">
                            <TextArea rows={4} value={editComment} onChange={this.handleEditCommentChange}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );

        return element;
    }
}

export default CommentUI;