import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {store, cookies} from '../../index'
import Select from 'react-select'


class CreatePostForm extends Component {
    constructor(props) {
        super(props)

        this.categoryRef = React.createRef();
        this.tagsRef = React.createRef();

        this.state = {
            title: '',
            categories: [],
            form_tags: [],
            content: '',
            title_rrorr: '',
            tags_error: '',
            content_error: ''
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleTitleChange = ({target: {value}}) => {
        this.setState({title: value, title_error: ''})
    }

    handleContentChange = ({target: {value}}) => {
        this.setState({content: value, content_error: ''})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const selected_tags = []
        const selected_category = this.categoryRef.current.state.value.value

        this.tagsRef.current.state.value.map((tag) => {
            selected_tags.push(tag.value)
        })

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
                tags: selected_tags,
                category: selected_category,
                content: this.state.content,
                author: store.getState().username || cookies.get('username')
            })
        }

        fetch(localStorage.getItem('POST'), req)
            .then(response => {
                if (response.status === 201) {
                    this.setState({
                        title: '',
                        content: '',
                        selected_category: {},
                        selected_tags: [],
                        title_error: '',
                        tags_error: '',
                        content_error: ''
                    })
                    alert('Post was added')
                } else {
                    response.json().then((json) => {
                        this.setState({
                            title_error: json.title && json.title[0],
                            tags_error: json.tags && json.tags[0],
                            content_error: json.content && json.content[0]
                        })
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

        fetch(localStorage.getItem('TAG'), req)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState({form_tags: data.results})
            })

        fetch(localStorage.getItem('CATEGORY'), req)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState({categories: data.results})
            })
    }

    render() {
        const {title, content, form_tags, categories, title_error, tags_error, content_error} = this.state;

        const tagsList = []
        const categoriesList = []

        form_tags.map((tag) => {
            tagsList.push({value: tag.id, label: tag.title})
        })

        categories.map((cat) => {
            categoriesList.push({value: cat.id, label: cat.title})
        })

        const title_error_alert = title_error && <div className="alert alert-danger" role="alert">{title_error}</div>
        const tags_error_alert = tags_error && <div className="alert alert-danger" role="alert">{tags_error}</div>
        const content_error_alert = content_error && <div className="alert alert-danger" role="alert">{content_error}</div>

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
                            {title_error_alert}
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Category
                                </label>
                                <Select ref={this.categoryRef} defaultValue={[categoriesList[0]]} name="categories" options={categoriesList} className="basic-single" classNamePrefix="select"/>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Tags
                                </label>
                                <Select ref={this.tagsRef} defaultValue={[tagsList[0]]} isMulti name="tags" options={tagsList} className="basic-multi-select" classNamePrefix="select"/>
                            </div>
                            {tags_error_alert}
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Content
                                </label>
                                <textarea className="textarea form-control" type="text" name="content" value={content} onChange={this.handleContentChange} cols="40" rows="10"/>
                            </div>
                            {content_error_alert}
                            <button className="btn btn-lg btn-primary btn-block" type="submit">Add</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default CreatePostForm