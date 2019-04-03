import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {Link, Redirect} from 'react-router-dom'
import {store} from '../index'


class Blog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            postsList: []
        }
        
    }

    componentDidMount() {

        store.subscribe(() => {
            if (this.state !== store.getState()) {
                this.setState(store.getState())
            }
        })

        const username = this.props.match.params.username || ''

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }

        fetch(`http://0.0.0.0/api/v1/user/${username}/posts`, req)
            .then(response => response.json())
            .then(data => {
                store.dispatch({type: "POST_LIST", postsList: data})
            })
    }

    render() {
        const username = this.props.match.params.username || ''

        if (username === '') {
            return <Redirect to='/login'/>
        }

        return (
            <div>
                {this.state.postsList.map((post) => {
                    return (
                        <h3 key={post.id}><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
                    )
                })}
            </div>
        )
    }

}

export default Blog