import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'



class PostList extends Component {
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
            <div>
                {this.state.postsList.map((post) => {
                    return (
                        <h3 key={post.id}>{post.title}</h3>
                    )
                })}
            </div>
        )
    }

}

export default PostList