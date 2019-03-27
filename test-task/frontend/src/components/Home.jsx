import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import CategoryList from './CategoryList'
import TagList from './TagList'
import LastTenCommentList from './LastTenCommentList'
import Pagination from './Pagination'
import {Link} from 'react-router-dom'


class Home extends Component {
    state = {
        postsList: []
    }

    componentDidMount() {
        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }
        fetch('http://0.0.0.0/api/v1/post', req)
            .then(response => response.json())
            .then(data => this.setState({postsList: data.results}))
    }

    render() {
        return (
            <div className="flex-shrink-0">
                <div className="container">
                    <div className="row mt-5">
                        <div>
                            {this.state.postsList.map((post) => {
                                return (
                                    <h3 key={post.id}><Link to={`/api/v1/post/${post.id}`}>{post.title}</Link></h3>
                                )
                            })}
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

export default Home