import React, {Component} from 'react'
import {Link} from 'react-router-dom'


class TagList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tagsList: [],
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
        
        fetch(localStorage.getItem('TAG'), req)
            .then(response => response.json())
            .then(data => this.setState({tagsList: data.results}))
    }

    render() {
        return (
            <div>
                <h3>Tags</h3>
                {this.state.tagsList.map((tag) => {
                    return (
                        <Link to={{pathname: '/', search: `tags__title=${tag.title}`}} className="badge badge-info" key={tag.id}>{tag.title}</Link>
                    )
                })}
            </div>
        )
    }
}

export default TagList