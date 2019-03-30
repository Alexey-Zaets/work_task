import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'


class CreatePostForm extends Component {
    state = {
        title: '',
        category: '',
        tags: '',
        content: '',
        redirectToReferrer: false
    }


    handleTitleChange = ({target: {value}}) => {
        this.setState({
            title: value
        })
    }

    handleCategoryChange = ({target: {value}}) => {
        this.setState({
            category: value
        })
    }

    handleTagsChange = ({target: {value}}) => {
        this.setState({
            tags: value
        })
    }

    handleContentChange = ({target: {value}}) => {
        this.setState({
            content: value
        })
    }

    handleAddPost = (e) => {
        e.preventDefault();

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({
                title: this.state.title,
                tags:this.state.tags,
                category: this.state.category,
                content: this.state.content
            })
        }

        fetch('http://0.0.0.0/api/v1/post', req)
            .then(response => {
                if (response.status === 201) {
                    this.setState({redirectToReferrer: true})
                } else {
                    response.json().then((json) =>{
                        console.log(json)
                    })
                }
            })
    }

    render() {
        const {title, category, tags, content} = this.state;

        let {from} = this.props.location.state || {from: {pathname: '/'}}
        let {redirectToReferrer} = this.state

        if (redirectToReferrer) return <Redirect to={from}/>

        return (
            <div className="col-md-9">
                <h1 className="text-center">Add new post</h1>
                <form>
                    <div className='row justify-content-center'>
                        <div className='col-9'>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Title
                                </label>
                                <input className="textinput textInput form-control" type="text" name="title" value={title} onChange={this.handleTitleChange}/>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Category
                                </label>
                                <select className="select form-control" type="text" name="category" value={category} onChange={this.handleCategoryChange}>
                                    <option value=""></option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Tags
                                </label>
                                <select className="selectmultiple form-control" type="text" name="tags" value={tags} onChange={this.handleTagsChange}>
                                    <option value=""></option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Content
                                </label>
                                <textarea className="textarea form-control" type="text" name="content" value={content} onChange={this.handleContentChange} cols="40" rows="10"/>
                            </div>
                            <button className="btn btn-lg btn-primary btn-block" onClick={this.handleAddPost}>Add</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default CreatePostForm