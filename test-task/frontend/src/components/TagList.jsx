import React, {Component} from 'react'
import {store} from '../index'


class TagList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tagsList: [],
        }

        this.onTagClick = this.onTagClick.bind(this)
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

    onTagClick(id, e) {
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
                        <span style={{cursor: 'pointer'}} className="badge badge-info" key={tag.id} onClick={(e) => this.onTagClick(tag.id, e)}>{tag.title}</span>
                    )
                })}
            </div>
        )
    }
}

export default TagList