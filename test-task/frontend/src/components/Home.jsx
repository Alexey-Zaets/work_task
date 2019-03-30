import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {Link} from 'react-router-dom'


class Home extends Component {
    state = {
        postsList: [],
        post: {},
        tags: []
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
            <div>
                {this.state.postsList.map((post) => {
                    return (
                        <h3 key={post.id}><Link to={`/api/v1/post/${post.id}`}>{post.title}</Link></h3>
                    )
                })}
            </div>
        )
    }

}

export default Home