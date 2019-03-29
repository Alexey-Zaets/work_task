import React, {Component} from 'react'
import {Link} from 'react-router-dom'


class TagList extends Component {
    state = {
        tagsList: []
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

    render() {
        return (
            <div>
                <h3>Tags</h3>
                {this.state.tagsList.map((tag) => {
                    return (
                        <Link to={`/tag/${tag.id}/posts/`} className="badge badge-info" key={tag.id}>{tag.title}</Link>
                    )
                })}
            </div>
        )
    }
}

export default TagList