import React, {Component} from 'react'
import CategoryList from '../CategoryList'
import TagList from '../TagList'


class LastTenCommentList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            commentsList: [],
            currentIndex: 0
        }

        this.handleOnCommentClick = this.handleOnCommentClick.bind(this);
        this.getComment = this.getComment.bind(this)
        setInterval(this.getComment, 10000)
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

        fetch(localStorage.getItem('LASTCOMMENT'), req)
            .then(response => {
                return response.json()
            })
            .then(data=> {
                this.setState({commentsList: data.results})
            })

    }

    getComment() {
        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }

        fetch(localStorage.getItem('LASTCOMMENT'), req)
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
            <div>
                <h3>Last comments</h3>
                <div className="card mt-3" style={{width: "18rem"}}  onClick={this.handleOnCommentClick}>
                    <div className="card-body">
                        <h5 className="card-title">{author}</h5>
                        <p className="card-text">{comment.comment}</p>
                    </div>
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