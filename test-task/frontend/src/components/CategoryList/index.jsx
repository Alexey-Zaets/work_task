import React, {Component} from 'react'
import './style.css'


class CategoryList extends Component {

    render() {
        return (
            <div>
                <h3>Categories</h3>
                <ul className="border-bottom">
                    <li className="category-list__li">
                        <a >Category</a>
                            <ul className="children">
                            </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

export default CategoryList