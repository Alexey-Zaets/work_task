import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {store, cookies} from '../index'


class LoginForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            redirectToReferrer: false,
            username_error: '',
            password_error: '',
            non_field_errors: ''
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleClickSignin = this.handleClickSignin.bind(this)
    }


    handleUsernameChange = ({target: {value}}) => {
        this.setState({
            username: value
        })
    }

    handlePasswordChange = ({target: {value}}) => {
        this.setState({
            password: value
        })
    }

    handleClickSignin = (e) => {
        e.preventDefault();

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }

        fetch('http://0.0.0.0/api/v1/user/login/', req)
            .then(response => {
                if (response.status === 200) {
                    store.dispatch({type: "LOGIN", username: this.state.username})
                    response.json().then(data => {
                        cookies.set('token', 'JWT ' + data.token, {path: '/'})
                        this.setState({redirectToReferrer: true})
                    })
                } else {
                    response.json().then(data => {
                        if (data.password && data.username) {
                            this.setState({
                                password_error: data.password[0],
                                username_error: data.username[0],
                                non_field_errors: ''
                            })
                        } else if (data.username) {
                            this.setState({
                                username_error: data.username[0],
                                password_error: '',
                                non_field_errors: ''
                            })
                        } else if (data.password) {
                            this.setState({
                                username_error: '',
                                non_field_errors: '',
                                password_error: data.password[0]
                            })
                        } else if (data.non_field_errors) {
                            this.setState({
                                username_error: '',
                                password_error: '',
                                non_field_errors: data.non_field_errors[0]})
                        }
                    })
                }
            })
    }

    render() {
        const {username, password, username_error, password_error, non_field_errors} = this.state;

        let {from} = this.props.location.state || {from: {pathname: '/'}}
        let {redirectToReferrer} = this.state

        const username_error_alert = username_error && <div className="alert alert-danger" role="alert">{username_error}</div>
        const password_error_alert = password_error && <div className="alert alert-danger" role="alert">{password_error}</div>
        const non_field_errors_alert = non_field_errors && <div className="alert alert-danger" role="alert">{non_field_errors}</div>

        if (redirectToReferrer) return <Redirect to={from}/>

        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h1 className="text-center">Sign in</h1>
                        <form>
                            <div className='row justify-content-center'>
                                <div className='col-6'>
                                    <div className="form-group">
                                        <label className="col-form-label requiredField">
                                            Имя пользователя
                                        </label>
                                        <input className="textinput textInput form-control" type="text" name="username" value={username} onChange={this.handleUsernameChange}/>
                                    </div>
                                    {username_error_alert}
                                    <div className="form-group">
                                        <label className="col-form-label requiredField">
                                            Пароль
                                        </label>
                                        <input className="textinput textInput form-control" type="password" name="password" value={password} onChange={this.handlePasswordChange}/>
                                    </div>
                                    {password_error_alert}
                                    {non_field_errors_alert}
                                    <button className="btn btn-lg btn-primary btn-block" onClick={this.handleClickSignin}>Sign in</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginForm