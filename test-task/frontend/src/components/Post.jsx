import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import CategoryList from './CategoryList'
import TagList from './TagList'
import LastTenCommentList from './LastTenCommentList'
import Pagination from './Pagination'
import {Link} from 'react-router-dom'


class Post extends Component {
    state = {
        post: {},
        tags: []
    }

    componentDidMount() {
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
                this.setState({post: data, tags: data.tags})
            })
    }

    render() {
        const post = this.state.post
        return (
            <div className="flex-shrink-0">
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-9">
                            <h1 className="text-center">{post.title}</h1>
                            {this.state.tags.map((tag) => {
                                return (
                                    <Link to='' className="badge badge-info" key={tag.id}>{tag.title}</Link>
                                )
                            })}
                            <p className="text-justify text-monospace mt-3 border-bottom">{post.content}</p>
                        </div>
                        <div className="col-md-3 ml-auto">
                            <CategoryList/>
                            <TagList/>
                            <LastTenCommentList/>
                        </div>
                    </div>
                </div>
                <Pagination/>
            </div>
        )
    }

}

export default Post