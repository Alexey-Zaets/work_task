import React, {Component} from 'react'
import ReplyForm from '../ReplyForm'


class Comment extends Component {
    constructor(props) {
        super(props)
        this.state = {reply: false}
        this.handleReply = this.handleReply.bind(this)
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
        console.log('Comment', comment)

        return (
            <ul className="list-group list-group-flush" key={comment.parent}>
                <li className="list-group-item">
                    <div className="media position-relative border-bottom mt-2">
                        <div className="media-body">
                            <h5 className="mt-0">{comment.author}</h5>
                            <p>{comment.text}</p>
                            {comment.level < 2 && <button onClick={this.handleReply} className="btn btn-primary btn-sm">{this.state.reply ? 'Close' : 'Reply'}</button>}
                            {this.state.reply && <ReplyForm postID={comment.postID} commentID={comment.commentID} level={comment.level} children={comment.children}/>}
                        </div>
                    </div>
                </li>
            </ul>
        )
    }
}

export default Comment