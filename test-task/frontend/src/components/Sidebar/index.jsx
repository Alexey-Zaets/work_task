import React, {Component} from 'react'
import './style.css'
import {store} from '../../index'


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

class CategoryList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categoriesList: [],
        }

        this.onCategoryClick = this.onCategoryClick.bind(this)
    }

    onCategoryClick(id, e) {
        e.preventDefault();
        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }

        fetch(`http://0.0.0.0/api/v1/category/${id}/posts`, req)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    store.dispatch({type: "POST_LIST", postsList: data})
                }
            })
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
        fetch('http://0.0.0.0/api/v1/category/', req)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    categoriesList: data.results,
                })
            })
    }

    render() {
        return (
            <div>
                <h3>Categories</h3>
                <ul className="border-bottom">
                    {this.state.categoriesList.map((category) => {
                        if (!category.children.length) {
                            return (
                                <li className="category-list__li" key={category.id}>
                                    <span style={{cursor: 'pointer'}} onClick={(e) => this.onCategoryClick(category.id, e)} key={category.id}>{category.title}</span>
                                </li>
                            )
                        } else {
                            return (
                                <ul className="children" key={category.id}>
                                    <span style={{cursor: 'pointer'}} onClick={(e) => this.onCategoryClick(category.id, e)} key={category.id}>{category.title}</span>
                                </ul>
                            )
                        }
                    })}
                </ul>
            </div>
        )
    }
}

class LastTenCommentList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            commentsList: [],
            currentIndex: 0
        }

        this.handleOnCommentClick = this.handleOnCommentClick.bind(this);
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

        fetch('http://0.0.0.0/api/v1/lastcomment', req)
            .then(response => {
                return response.json()
            })
            .then(data=> {
                this.setState({commentsList: data.results})
            })

    }

    handleOnCommentClick(e) {
        e.preventDefault();
        if (this.state.currentIndex < this.state.commentsList.length - 1) {
            this.setState({currentIndex: this.state.currentIndex + 1})
        } else {
            this.setState({currentIndex: 0})
        }
    }

    render() {
        const currentIndex = this.state.currentIndex
        const comment = !this.state.commentsList.length ? '': this.state.commentsList[currentIndex]
        const author = comment.author ? comment.author.username: 'Anonymous'

        return (
            <div className="card mt-3" style={{width: "18rem"}}  onClick={this.handleOnCommentClick}>
                <div className="card-body">
                    <h5 className="card-title">{author}</h5>
                    <p className="card-text">{comment.comment}</p>
                </div>
            </div>
        )
    }
}

class Sidebar extends Component {
    render() {
        return (
            <div className="col-md-3 ml-auto">
                <CategoryList/>
                <TagList/>
                <LastTenCommentList/>
            </div>
        )
    }
}

export default Sidebar