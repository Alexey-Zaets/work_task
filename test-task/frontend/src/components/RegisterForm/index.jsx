import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {URL} from '../../index'


class RegisteForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            email: '',
            password: '',
            redirectToReferrer: false,
            username_error: '',
            email_error: '',
            password_error: '',
            non_field_errors: ''
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
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

        fetch('http://' + URL + '/user/register/', req)
            .then(response => {
                if (response.status === 201) {
                    this.setState({
                        redirectToReferrer: true,
                        username_error: '',
                        password_error: '',
                        email_error: ''
                    })
                } else {
                    response.json().then((data) => {
                        this.setState({
                            username_error: data.username && data.username[0],
                            password_error: data.password && data.password[0],
                            email_error: data.email && data.email[0]
                        })
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