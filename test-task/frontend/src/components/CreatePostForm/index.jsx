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
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleTitleChange = ({target: {value}}) => {
        this.setState({
            title: value
        })
    }

    handleContentChange = ({target: {value}}) => {
        this.setState({
            content: value
        })
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

        const tagsList = []
        const categoriesList = []

        form_tags.map((tag) => {
            tagsList.push({value: tag.id, label: tag.title})
        })

        categories.map((cat) => {
            categoriesList.push({value: cat.id, label: cat.title})
        })

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
                                <Select ref={this.categoryRef} defaultValue={[categoriesList[0]]} name="categories" options={categoriesList} className="basic-single" classNamePrefix="select"/>
                            </div>
                            <div className="form-group">
                                <label className="col-form-label requiredField">
                                    Tags
                                </label>
                                <Select ref={this.tagsRef} defaultValue={[]} isMulti name="tags" options={tagsList} className="basic-multi-select" classNamePrefix="select"/>
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