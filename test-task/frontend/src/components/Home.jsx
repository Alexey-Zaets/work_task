import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {Link} from 'react-router-dom'
import {store} from '../index'


class Home extends Component {
    constructor(props) {
        super(props)

        this._isMounted = false;

        this.state = {
            postsList: []
        }
        
    }

    componentDidMount() {

        this._isMounted = true;

        store.subscribe(() => {
            if (this.state !== store.getState()) {
                this.setState(store.getState())
            }
        })

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
            .then(data => {
                if (this._isMounted) {
                    store.dispatch({type: "POST_LIST", postsList: data.results})
                }
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

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

export default Home