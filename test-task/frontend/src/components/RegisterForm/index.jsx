import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'


class RegisteForm extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        redirectToReferrer: false,
        username_error: '',
        email_error: '',
        password_error: '',
        non_field_errors: ''
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

    handleEmailChange = ({target: {value}}) => {
        this.setState({
            email: value
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
            body: JSON.stringify({username: this.state.username, email:this.state.email, password: this.state.password})
        }

        fetch('http://0.0.0.0/api/v1/user/register/', req)
            .then(response => {
                if (response.status === 201) {
                    this.setState({redirectToReferrer: true})
                } else {
                    response.json().then((data) => {
                        if (data.email && data.password && data.username) {
                            this.setState({
                                username_error: data.username[0],
                                password_error: data.password[0],
                                email_error: data.email[0]
                            })
                        } else if (data.email && data.password) {
                            this.setState({
                                username_error: '',
                                password_error: data.password[0],
                                email_error: data.email[0]
                            })
                        } else if (data.email && data.username) {
                            this.setState({
                                username_error: data.username[0],
                                password_error: '',
                                email_error: data.email[0]
                            })
                        } else if (data.username && data.password) {
                            this.setState({
                                username_error: data.username[0],
                                password_error: data.password[0],
                                email_error: ''
                            })
                        } else if (data.username) {
                            this.setState({
                                username_error: data.username[0],
                                password_error: '',
                                email_error: ''
                            })
                        } else if (data.password) {
                            this.setState({
                                username_error: '',
                                password_error: data.password[0],
                                email_error: ''
                            })
                        } else if (data.email) {
                            this.setState({
                                username_error: '',
                                password_error: '',
                                email_error: data.email[0]
                            })
                        } else if (data.non_field_errors) {
                            this.setState({
                                non_field_errors: data.non_field_errors[0],
                                username_error: '',
                                password_error: '',
                                email_error: ''
                            })
                        }
                    })
                }
            })
    }

    render() {
        const {username, email, password, username_error, password_error, email_error, non_field_errors} = this.state;

        let {from} = this.props.location.state || {from: {pathname: '/'}}
        let {redirectToReferrer} = this.state

        const username_error_alert = username_error && <div className="alert alert-danger" role="alert">{username_error}</div>
        const password_error_alert = password_error && <div className="alert alert-danger" role="alert">{password_error}</div>
        const email_error_alert = email_error && <div className="alert alert-danger" role="alert">{email_error}</div>
        const non_field_errors_alert = non_field_errors && <div className="alert alert-danger" role="alert">{non_field_errors}</div>

        if (redirectToReferrer) return <Redirect to={from}/>

        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <h1 className="text-center">Sign up</h1>
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
                                            Email
                                        </label>
                                        <input className="emailinput form-control" type="text" name="username" value={email} onChange={this.handleEmailChange}/>
                                    </div>
                                    {email_error_alert}
                                    <div className="form-group">
                                        <label className="col-form-label requiredField">
                                            Пароль
                                        </label>
                                        <input className="textinput textInput form-control" type="password" name="password" value={password} onChange={this.handlePasswordChange}/>
                                    </div>
                                    {password_error_alert}
                                    {non_field_errors_alert}
                                    {/*<div className="form-group">
                                        <label className="col-form-label">
                                            Подтверждение пароля*
                                        </label>
                                        <input className="textinput textInput form-control" type="password" name="password" value={password}/>
                                    </div>*/}
                                    <button className="btn btn-lg btn-primary btn-block" onClick={this.handleClickSignin}>Sign up</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegisteForm