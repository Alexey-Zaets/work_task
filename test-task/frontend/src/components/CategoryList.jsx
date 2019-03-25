import React, {Component} from 'react'


class CategoryList extends Component {

    render() {
        return (
            <div>
                <h3>Categories</h3>
                <ul className="border-bottom">
                    <li>
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