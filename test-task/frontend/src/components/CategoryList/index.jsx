import React, {Component} from 'react'
import './style.css'
import {Link} from 'react-router-dom'


class CategoryList extends Component {
    state = {
        parents: null,
        categoriesList: []
    }

    componentWillMount() {
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
            .then(data => {
                const parents = data.results.filter(cat => !cat.parent)
                const categoriesList = data.results.filter(cat => cat.parent)

                this.setState({
                    categoriesList,
                    parents
                })

                console.log('parents', parents, 'sran', categoriesList)
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
                                    <Link to={`/category/${category.id}/posts`} key={category.id}>{category.title}</Link>
                                </li>
                            )
                        } else {
                            return (
                                <ul className="children" key={category.id}>
                                    <Link to={`/category/${category.id}/posts`} key={category.id}>{category.title}</Link>
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