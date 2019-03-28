import React, {Component} from 'react'
import CategoryList from './CategoryList'
import TagList from './TagList'
import LastTenCommentList from './LastTenCommentList'


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