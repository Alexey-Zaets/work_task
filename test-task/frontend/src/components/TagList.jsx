import React, {Component} from 'react'
import {store} from '../index'
import {Link} from 'react-router-dom'


class TagList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tagsList: []
        }

        this._onClick = this._onClick.bind(this)
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
        
        fetch('http://0.0.0.0/api/v1/tag', req)
            .then(response => response.json())
            .then(data => this.setState({tagsList: data.results}))
    }

    _onClick(id, e) {
        e.preventDefault();
        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }

        fetch(`http://0.0.0.0/api/v1/tag/${id}/posts`, req)
            .then(response => response.json())
            .then(data => {
                store.dispatch({
                type: "POST_LIST", postsList: data})
            })
    }

    render() {
        return (
            <div>
                <h3>Tags</h3>
                {this.state.tagsList.map((tag) => {
                    return (
                        <Link to={`/tag/${tag.id}/posts`} className="badge badge-info" key={tag.id}>{tag.title}</Link>
                    )
                })}
            </div>
        )
    }
}

export default TagList