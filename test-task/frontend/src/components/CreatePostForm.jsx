import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {store, cookies} from '../index'


class CreatePostForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            categories: [],
            form_tags: [],
            content: '',
            selected_category: {},
            selected_tags: []
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleCategoryChange = this.handleCategoryChange.bind(this)
        this.handleTagsChange = this.handleTagsChange.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleTitleChange = ({target: {value}}) => {
        this.setState({
            title: value
        })
    }

    handleCategoryChange = ({target: {value}}) => {
        console.log(value)
        this.setState({selected_category: value})
    }

    handleTagsChange = ({target: {value}}) => {
        const selected_tags = this.state.selected_tags
        selected_tags.push(value)
        this.setState({selected_tags: selected_tags})
    }

    handleContentChange = ({target: {value}}) => {
        this.setState({
            content: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        console.log(e.currentTarget)

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": cookies.get('token')
        })

        const req = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({
                title: this.state.title,
                tags:this.state.selected_tags,
                category: this.state.selected_category,
                content: this.state.content,
                author: store.getState().username
            })
        }

        fetch('http://0.0.0.0/api/v1/post/', req)
            .then(response => {
                if (response.status === 201) {
                    this.setState({
                        title: '',
                        content: '',
                        selected_category: {},
                        selected_tags: []
                    })
                    alert('Post was added')
                } else {
                    response.json().then((json) =>{
                        console.log(json)
                    })
                }
            })
    }

    componentDidMount() {
        store.subscribe(() => {
            if (this.state !== store.getState()) {
                this.setState(store.getState())
            }
        })

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }

        fetch(`http://0.0.0.0/api/v1/tag`, req)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState({form_tags: data.results})
            })

        fetch(`http://0.0.0.0/api/v1/category`, req)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState({categories: data.results})
            })
    }

    render() {
        const {title, content, form_tags, categories} = this.state;

        if (!store.getState().auth) return <Redirect to='/login'/>

        return (
            <div className="col-md-9">
                <h1 className="text-center">Add new post</h1>
                <form onSubmit={this.handleSubmit}>
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
                                <select className="select form-control" name='categories' multiple={false} onChange={this.handleCategoryChange}>
                                    {categories.map((category) => {
                                        return (
                                            <option value={category.id} key={category.id}>{category.title}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Tags
                                </label>
                                <select className="selectmultiple form-control" name="tags" multiple={true} onChange={this.handleTagsChange}>
                                    {form_tags.map((tag) => {
                                        return (
                                            <option value={tag.id} key={tag.id}>{tag.title}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Content
                                </label>
                                <textarea className="textarea form-control" type="text" name="content" value={content} onChange={this.handleContentChange} cols="40" rows="10"/>
                            </div>
                            <button className="btn btn-lg btn-primary btn-block" type="submit">Add</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default CreatePostForm