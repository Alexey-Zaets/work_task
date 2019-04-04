import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {store} from '../../index'


class Post extends Component {
    constructor(props) {
        super(props)

        this.state = {
            post: {},
            tags: [],
        }

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
            .then(response => {
                return response.json()
            })
            .then(data => {
                store.dispatch({type: "POST_DETAIL", post: data, tags: data.tags})
            })
    }

    render() {
        const {post, tags} = this.state
        const {auth} = store.getState()

        return (
            <div className="col-md-9">
                <h1 className="text-center">{post.title}</h1>
                {tags.map((tag) => {
                    return (
                        <span className="badge badge-info" key={tag.id}>
                            {tag.title}
                        </span>
                    )
                })}
                <p className="text-justify text-monospace mt-3 border-bottom">{post.content}</p>
                {auth && <button className="btn btn-primary btn-lg btn-block" onClick={this.onClickUpdate}>Update post</button>}
                <h3 className="mt-3">Comments</h3>
                <h3 className="mt-3">Add new comment</h3>
                <form>
                    <div className="form-group">
                        <label className="col-form-label requiredField">Comment</label>
                        <div>
                            <textarea className="textarea form-control" name="comment" cols="40" rows="10" required=""></textarea>
                        </div>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block mb-5">Add</button>
                </form>
            </div>
        )
    }

}

export default Post