import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {Link, Redirect} from 'react-router-dom'
import {store} from '../../index'
import Pagination from '../Pagination'


class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            count: '',
            nextPage: '',
            prevPage: '',
            postsList: [],
        }
    }

    componentDidMount() {

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

        fetch(localStorage.getItem('POST') + this.props.location.search, req)
            .then(response => response.json())
            .then(data => {
                store.dispatch({
                    type: "POST_LIST",
                    postsList: data.results,
                    count: data.count,
                    nextPage: data.next,
                    prevPage: data.previous
                })
            })
    }

    componentDidUpdate(prevProps) {

        if (this.props.location.search !== prevProps.location.search) {

            const headers = new Headers({
            "Content-Type": "application/json"
            })

            const req = {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            }

            fetch(localStorage.getItem('POST') + this.props.location.search, req)
                .then(response => response.json())
                .then(data => {
                    store.dispatch({
                        type: "POST_LIST",
                        postsList: data.results,
                        count: data.count,
                        nextPage: data.next,
                        prevPage: data.previous
                    })
                })
        }
    }

    render() {
        if (this.props.location.pathname !== '/' && !store.getState().auth){
            return <Redirect to='/login'/>
        } else {
            return (
                <div>
                    {this.state.postsList.map((post) => {
                        return (
                            <h3 key={post.id}><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
                        )
                    })}
                    <Pagination next={this.state.nextPage} previous={this.state.prevPage} count={this.state.count}/>
                </div>
            )
        }
    }
}

export default Home