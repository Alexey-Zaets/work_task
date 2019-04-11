import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {store, cookies} from '../../index'


class ReplyForm extends Component {
    constructor(props) {
        super(props)

        this.state = {comment: '', comment_error: ''}

        this.handleClick = this.handleClick.bind(this)
        this.handleComment = this.handleComment.bind(this)
    }

    handleComment = ({target: {value}}) => {
        this.setState({comment: value, comment_error: ''})
    }

    addReply = (id) => {

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": cookies.get('token')
        })

        const headersGet = new Headers({
            "Content-Type": "application/json"
        })

        const comments = this.props.children
        const newComments = []
        comments.map((comment) => {
            newComments.push(comment.id)
        })
        newComments.push(id)

        const reqGet = {
            method: 'GET',
            headers: headersGet,
            mode: 'cors'
        }

        const patchReq = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
                comments: newComments,
            })
        }

        fetch(`http://0.0.0.0/api/v1/comment/${this.props.commentID}/`, patchReq)
            .then(response => {
                if (response.status === 200) {
                    fetch(`http://0.0.0.0/api/v1/post/${this.props.postID}`, reqGet)
                        .then(response => {
                            response.json().then(data => {
                                store.dispatch({
                                    type: "POST_DETAIL",
                                    post: data,
                                    author: data.author.username,
                                    tags: data.tags,
                                    comments: data.comment_set, //.reverse()
                                })
                                this.setState({comment: ''})
                                alert('Reply was added')
                            })
                        })
                } else {
                    response.json().then((json) => {
                        this.setState({
                            comment_error: json.comment[0]
                        })
                    })
                }
            })
    }

    handleClick = (e) => {
        e.preventDefault();

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": cookies.get('token')
        })

        const postReq = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({
                post: this.props.postID,
                author: cookies.get('username'),
                comment: this.state.comment,
                level: this.props.level + 1
            })
        }

        fetch(`http://0.0.0.0/api/v1/comment/`, postReq)
            .then(response => {
                if (response.status === 201) {
                    response.json().then((json) => {
                        this.addReply(json.id)
                    })
                } else {
                    response.json().then((json) => {
                        this.setState({
                            comment_error: json.comment[0]
                        })
                    })
                }
            })
    }

    render() {
        const comment_error_alert = this.state.comment_error && <div className="alert alert-danger" role="alert">{this.state.comment_error}</div>

        return (
            <form>
                <div className="form-group">
                    <label className="col-form-label requiredField">Reply</label>
                    <div>
                        <textarea onChange={this.handleComment} value={this.state.comment} className="textarea form-control" name="comment" cols="40" rows="5" required=""></textarea>
                    </div>
                </div>
                {comment_error_alert}
                <button onClick={this.handleClick} className="btn btn-lg btn-primary btn-block mb-5">Reply</button>
            </form>
        )
    }
}

export default ReplyForm