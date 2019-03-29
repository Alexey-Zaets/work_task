import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'


class RegisteForm extends Component {
    state = {
        username: '',
        email: '',
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
                    response.json().then((json) =>{
                        console.log(json)
                    })
                }
            })
    }

    render() {
        const {username, email, password} = this.state;

        let {from} = this.props.location.state || {from: {pathname: '/'}}
        let {redirectToReferrer} = this.state

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
                                    <div className="form-group">
                                        <label className="col-form-label requiredField">
                                            Email
                                        </label>
                                        <input className="emailinput form-control" type="text" name="username" value={email} onChange={this.handleEmailChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label requiredField">
                                            Пароль
                                        </label>
                                        <input className="textinput textInput form-control" type="password" name="password" value={password} onChange={this.handlePasswordChange}/>
                                    </div>
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