import React, {Component} from 'react'
import ReplyForm from '../ReplyForm'
import {store} from '../../index'


class Comment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            post: {},
            author: '',
            tags: [],
            comments: [],
            comment: '',
            reply: false
        }
        this.handleReply = this.handleReply.bind(this)
    }

    componentDidMount() {
        store.subscribe(() => {
            if (this.state !== store.getState()) {
                this.setState(store.getState())
            }
        })
    }

    handleReply = (e) => {
        e.preventDefault();
        this.setState({reply: !this.state.reply})
    }

    render() {
        const comment = {
            author: this.props.author,
            text: this.props.text,
            level: this.props.level,
            postID: this.props.post,
            commentID: this.props.parent,
            children: this.props.children
        }

        return (
            <div>
                <h5 className="mt-0">{comment.author}</h5>
                <p>{comment.text}</p>
                {comment.level < 2 && <button onClick={this.handleReply} className="btn btn-primary btn-sm">{this.state.reply ? 'Close' : 'Reply'}</button>}
                {this.state.reply && <ReplyForm postID={comment.postID} commentID={comment.commentID} level={comment.level} children={comment.children}/>}
            </div>
        )
    }
}

export default Comment