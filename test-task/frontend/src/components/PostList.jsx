import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'


class PostList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            postTitle: {}
        }
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
            .then(function(response) {
                return response.json()
            })
            .then(data => data.results.map(post => post.title))
            .then(postTitle => this.setState({postTitle}))
    }

    render() {
        return (
            <div>
            </div>
        )
    }

}

export default PostList