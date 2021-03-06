import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {store, cookies} from '../../index'
import {Link} from 'react-router-dom'
import Comment from '../Comment'


class Post extends Component {
    constructor(props) {
        super(props)

        this.state = {
            post: {},
            author: '',
            tags: [],
            comments: [],
            comment: '',
        }

        this.renderComment = this.renderComment.bind(this)
        this.handleCommentAdd = this.handleCommentAdd.bind(this)
        this.handleCommentChange = this.handleCommentChange.bind(this)
    }

    renderComment(comment) {
        const id = this.props.match.params.id || ''
        return (
            <ul className="list-group list-group-flush" key={comment.id}>
                <li className="list-group-item">
                    <div className="media position-relative border-bottom mt-2">
                        <div className="media-body">
                            <Comment
                                key={comment.id}
                                children={comment.comments}
                                post={id}
                                parent={comment.id}
                                author={comment.author ? comment.author.username : 'Anonymous'}
                                text={comment.comment}
                                level={comment.level}
                            />
                        </div>
                    </div>
                </li>
                {(comment.comments && comment.comments.length) ? <li className="list-group-item">{comment.comments.map(this.renderComment)}</li> : ''}
            </ul>
        )
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

        fetch(localStorage.getItem('POST') + id, req)
            .then(response => {return response.json()})
            .then(data => {
                store.dispatch({
                    type: "POST_DETAIL",
                    post: data,
                    author: data.author.username,
                    tags: data.tags,
                    comments: data.comment_set //.reverse()
                })
            })
    }

    handleCommentAdd = (e) => {
        e.preventDefault();

        const id = this.props.match.params.id || ''

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": cookies.get('token')
        })

        const req = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({
                post: id,
                author: cookies.get('username'),
                comment: this.state.comment
            })
        }

        fetch(localStorage.getItem('COMMENT'), req)
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
        let items = this.state.comments
        items.forEach(e => e.comments = items.filter(el => el.parent && el.parent.includes(e.id)))
        items = items.filter(e => e.level === 0)

        const {post, tags, author} = this.state
        const {username} = store.getState()
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
                {username === author && <Link to={`/update/${post.id}`} className="btn btn-primary btn-lg btn-block">Update post</Link>}
                <h3 className="mt-3">Comments</h3>
                {items.map(this.renderComment)}
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