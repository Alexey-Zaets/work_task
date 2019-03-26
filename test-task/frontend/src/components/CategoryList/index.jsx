import React, {Component} from 'react'
import './style.css'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'


class CategoryList extends Component {
    state = {
        categoriesList: []
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
        fetch('http://0.0.0.0/api/v1/category', req)
            .then(response => response.json())
            .then(data => this.setState({categoriesList: data.results}))
    }

    render() {
        return (
            <div>
                <h3>Categories</h3>
                <ul className="border-bottom">
                    {this.state.categoriesList.map((category) => {
                        console.log('lll', category)
                        if (category.parent != []) {
                            return (
                                <li className="category-list__li" key={category.id}>
                                    <Router key={category.id}>
                                        <Link to="" key={category.id}>{category.title}</Link>
                                    </Router>
                                </li>
                            )
                        } else {
                            return (
                                <ul className="children" key={category.id}>
                                    <Router key={category.id}>
                                        <Link to="" key={category.id}>{category.title}</Link>
                                    </Router>
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