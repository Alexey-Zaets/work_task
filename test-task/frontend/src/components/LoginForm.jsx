import React, {Component} from 'react'
import Cookies from 'universal-cookie'
import {Redirect} from 'react-router-dom'


class LoginForm extends Component {
    state = {
        username: '',
        password: '',
        redirectToReferrer: false
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

        const cookies = new Cookies()

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const req = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        }

        fetch('http://0.0.0.0/api/v1/user/login/', req)
            .then(response => {
                return response.json()
            })
            .then(data => {
                cookies.set('token', 'JWT ' + data.token, {path: '/'})
                this.setState({redirectToReferrer: true})
            })
    }

    render() {
        const {username, password} = this.state;

        let {from} = this.props.location.state || {from: {pathname: '/'}}
        let {redirectToReferrer} = this.state

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
                                        <label className="col-form-label">
                                            Имя пользователя*
                                        </label>
                                        <input className="textinput textInput form-control" type="text" name="username" value={username} onChange={this.handleUsernameChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label">
                                            Пароль*
                                        </label>
                                        <input className="textinput textInput form-control" type="password" name="password" value={password} onChange={this.handlePasswordChange}/>
                                    </div>
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