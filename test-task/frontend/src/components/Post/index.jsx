import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {store, cookies} from '../../index'
import {Link} from 'react-router-dom'


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

    addReply = (id, comments) => {

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": cookies.get('token')
        })

        const patchReq = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
                comments: comments,
                level: this.props.level + 1,
                comment: this.state.comment
            })
        }

        fetch(`http://0.0.0.0/api/v1/comment/${this.props.parent}/`, patchReq)
            .then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        const comments = store.getState().comments
                        comments.push(data)
                        this.setState({comment: ''})
                        store.dispatch({
                            type: "ADD_REPLY",
                            comments: comments
                        })
                    alert('Reply was added')
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
                post: this.props.post,
                author: cookies.get('username'),
                comment: this.state.comment
            })
        }

        fetch(`http://0.0.0.0/api/v1/comment/`, postReq)
            .then(response => {
                if (response.status === 201) {
                    response.json().then((json) => {
                        this.addReply(json.id, json.comments)
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

class Comment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            reply: false
        }

        this.handleReply = this.handleReply.bind(this)
    }

    handleReply = (e) => {
        e.preventDefault();
        this.setState({
            reply: !this.state.reply
        })
    }

    render() {

        return (
            <ul className="list-group list-group-flush" key={this.props.index}>
                <li className="list-group-item">
                    <div className="media position-relative border-bottom mt-2">
                        <div className="media-body">
                            <h5 className="mt-0">{this.props.author}</h5>
                            <p>{this.props.text}</p>
                            {this.props.level < 2 && <button onClick={this.handleReply} className="btn btn-primary btn-sm">{this.state.reply ? 'Close' : 'Reply'}</button>}
                            {this.state.reply && <ReplyForm post={this.props.post} parent={this.props.parent} level={this.props.level}/>}
                        </div>
                    </div>
                </li>
            </ul>
        )
    }
}

class Post extends Component {
    constructor(props) {
        super(props)

        this.state = {
            post: {},
            tags: [],
            comments: [],
            comment: '',
        }

        this.handleCommentAdd = this.handleCommentAdd.bind(this)
        this.handleCommentChange = this.handleCommentChange.bind(this)
    }

    componentDidMount() {
        store.subscribe(() => {
            if (this.state !== store.getState()) {
                this.setState(store.getState())
            }
        })

        const id = this.props.match.params.id || ''

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }

        fetch(`http://0.0.0.0/api/v1/post/${id}`, req)
            .then(response => {return response.json()})
            .then(data => {
                store.dispatch({
                    type: "POST_DETAIL",
                    post: data,
                    tags: data.tags,
                    comments: data.comment_set.reverse()
                })
            })
    }

    handleCommentAdd = (e) => {
        e.preventDefault();

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": cookies.get('token')
        })

        const req = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({
                post: this.props.match.params.id || '',
                author: cookies.get('username'),
                comment: this.state.comment
            })
        }

        fetch(`http://0.0.0.0/api/v1/comment/`, req)
            .then(response => {
                if (response.status === 201) {
                    alert('Comment was added')
                    response.json().then(data => {
                        const comments = store.getState().comments
                        comments.push(data)
                        this.setState({comment: ''})
                        store.dispatch({
                            type: "POST_DETAIL",
                            post: this.state.post,
                            tags: this.state.tags,
                            comments: comments
                        })
                    })
                } else {
                    response.json().then(data => {
                        this.setState({comment_error: data.comment[0]})
                    })
                }
            })
    }

    handleCommentChange = ({target: {value}}) => {
        this.setState({comment: value, comment_error: ''})
    }

    render() {
        const {post, tags, comments} = this.state
        const {auth} = store.getState()
        const comment_error_alert = this.state.comment_error && <div className="alert alert-danger" role="alert">{this.state.comment_error}</div>

        return (
            <div className="col-md-9" key={post.id}>
                <h1 className="text-center">{post.title}</h1>
                {tags.map((tag) => {
                    return (
                        <Link to={{pathname: '/', search: `tags__title=${tag.title}`}} className="badge badge-info" key={tag.id}>{tag.title}</Link>
                    )
                })}
                <p className="text-justify text-monospace mt-3 border-bottom">{post.content}</p>
                {auth && <Link to={`/update/${post.id}`} className="btn btn-primary btn-lg btn-block">Update post</Link>}
                <h3 className="mt-3">Comments</h3>
                {comments.map((comment) => {
                    return (
                        <Comment key={comment.id} post={post.id} parent={comment.id} author={comment.author ? comment.author.username : 'Anonymous'} text={comment.comment} level={comment.level}/>
                    )
                })}
                <h3 className="mt-3">Add new comment</h3>
                <form>
                    <div className="form-group">
                        <label className="col-form-label requiredField">Comment</label>
                        <div>
                            <textarea onChange={this.handleCommentChange} value={this.state.comment} className="textarea form-control" name="comment" cols="40" rows="10" required=""></textarea>
                        </div>
                    </div>
                    {comment_error_alert}
                    <button onClick={this.handleCommentAdd} className="btn btn-lg btn-primary btn-block mb-5">Add</button>
                </form>
            </div>
        )
    }

}

export default Post