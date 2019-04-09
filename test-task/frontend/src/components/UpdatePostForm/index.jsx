import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {store, cookies} from '../../index'
import Select from 'react-select'


class UpdatePostForm extends Component {
    constructor(props) {
        super(props)

        this.categoryRef = React.createRef();
        this.tagsRef = React.createRef();

        this.state = {
            title: '',
            categories: [],
            tags: [],
            content: '',

            currentCategory: {},
            currentTags: [],

            title_error: '',
            tags_error: '',
            content_error: '',

            wasUpdated: false
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
        const selected_category = this.categoryRef.current.props.value.value

        this.tagsRef.current.state.value.map((tag) => {
            selected_tags.push(tag.value)
        })

        const id = this.props.match.params.id || ''

        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": cookies.get('token')
        })

        const req = {
            method: 'PATCH',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({
                title: this.state.title,
                tags: selected_tags,
                category: selected_category,
                content: this.state.content,
            })
        }

        fetch(`http://0.0.0.0/api/v1/post/${id}/`, req)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        title: '',
                        content: '',
                        currentCategory: {},
                        title_error: '',
                        tags_error: '',
                        content_error: '',
                        wasUpdated: true
                    })
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

        const id = this.props.match.params.id || ''

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'GET',
            headers: headers,
            mode: 'cors'
        }

        fetch(`http://0.0.0.0/api/v1/post/${id}`, req)
            .then(response => {return response.json()})
            .then(data => {
                const currentTags = []
                data.tags.map((tag) => {
                    currentTags.push({value: tag.id, label: tag.title})
                })
                this.setState({
                    title: data.title,
                    currentCategory: {label: data.category.title, value: data.category.id},
                    currentTags: currentTags,
                    content: data.content,
                })
            })

        fetch(`http://0.0.0.0/api/v1/tag`, req)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState({tags: data.results})
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
        const {title, content, tags, categories, currentCategory, currentTags, title_error, tags_error, content_error} = this.state;
        const id = this.props.match.params.id
        const tagsList = []
        const categoriesList = []

        tags.map((tag) => {
            tagsList.push({value: tag.id, label: tag.title})
        })

        categories.map((cat) => {
            categoriesList.push({value: cat.id, label: cat.title})
        })

        const title_error_alert = title_error && <div className="alert alert-danger" role="alert">{title_error}</div>
        const tags_error_alert = tags_error && <div className="alert alert-danger" role="alert">{tags_error}</div>
        const content_error_alert = content_error && <div className="alert alert-danger" role="alert">{content_error}</div>

        if (!store.getState().auth) return <Redirect to='/login'/>
        if (this.state.wasUpdated) return <Redirect to={`/post/${id}`}/>

        return (
            <div className="col-md-9">
                <h1 className="text-center">Update post</h1>
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
                                <Select
                                    ref={this.categoryRef}
                                    name="categories"
                                    options={categoriesList}
                                    value={currentCategory}
                                    onChange={value => this.setState({currentCategory: value})}
                                    className="basic-single"
                                    classNamePrefix="select"
                                />
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Tags
                                </label>
                                <Select
                                    ref={this.tagsRef}
                                    isMulti
                                    name="tags"
                                    options={tagsList}
                                    value={currentTags}
                                    onChange={value => this.setState({currentTags: value})}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>
                            {tags_error_alert}
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Content
                                </label>
                                <textarea className="textarea form-control" type="text" name="content" value={content} onChange={this.handleContentChange} cols="40" rows="10"/>
                            </div>
                            {content_error_alert}
                            <button className="btn btn-lg btn-primary btn-block" type="submit">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default UpdatePostForm