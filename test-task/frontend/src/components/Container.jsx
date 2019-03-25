import React, {Component} from 'react'
import CategoryList from './CategoryList'
import PostList from './PostList'
import TagList from './TagList'
import LastTenCommentList from './LastTenCommentList'
import Pagination from './Pagination'


class Container extends Component {

    render() {
        return (
            <div className="flex-shrink-0">
                <div className="container">
                    <div className="row mt-5">
                        <PostList/>
                        <div className="col-md-3 ml-auto">
                            <CategoryList/>
                            <TagList/>
                            <LastTenCommentList/>
                        </div>
                    </div>
                </div>
                <Pagination/>
            </div>
        )
    } 
}

export default Container