import React, {Component} from 'react'
import {Link} from 'react-router-dom'


class CategoryList extends Component {
    constructor(props) {
        super(props)
        this.state = {categoriesList: []}
        this.renderCat = this.renderCat.bind(this)
    }

    renderCat(cat) {
        return (
            <li key={cat.id}>
                <Link to={{pathname: '/', search: `category__title=${cat.title}`}} key={cat.id}>{cat.title}</Link>
                {(cat.subcats && cat.subcats.length) ? <ul>{cat.subcats.map(this.renderCat)}</ul>: ''}
            </li>
        )
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
        let items = this.state.categoriesList

        items.forEach(e => e.subcats = items.filter(el => el.parent === e.id))
        items = items.filter(e => e.parent == null)

        return (
            <div>
                <h3>Categories</h3>
                <ul className="border-bottom">
                    {items.map(this.renderCat)}
                </ul>
            </div>
        )
    }
}

export default CategoryList