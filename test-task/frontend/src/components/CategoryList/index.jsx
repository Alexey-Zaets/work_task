import React, {Component} from 'react'
import './style.css'
import {store} from '../../index'


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
                    store.dispatch({
                    type: "POST_LIST", postsList: data})
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

export default CategoryList