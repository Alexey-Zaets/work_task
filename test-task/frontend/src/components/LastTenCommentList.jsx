import React, {Component} from 'react'


class LastTenCommentList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            commentsList: [],
            currentIndex: 0
        }

        this.handleOnCommentClick = this.handleOnCommentClick.bind(this);
        // setInterval(this.tick, 1000)
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

        fetch('http://0.0.0.0/api/v1/lastcomment', req)
            .then(response => {
                return response.json()
            })
            .then(data=> {
                this.setState({commentsList: data.results})
            })

    }

    // tick() {
    //     const currentIndex = this.state.currentIndex
    //     if (this.state.currentIndex < this.state.commentsList.length) {
    //         this.setState({currentIndex: currentIndex + 1})
    //     } else {
    //         this.setState({currentIndex: 0})
    //     }
    // }

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

        return (
            <div className="card mt-3" style={{width: "18rem"}}  onClick={this.handleOnCommentClick}>
                <div className="card-body">
                    <h5 className="card-title">{comment.author ? comment.author.username: 'Anonymous'}</h5>
                    <p className="card-text">{comment.comment}</p>
                </div>
            </div>
        )
    }
}

export default LastTenCommentList