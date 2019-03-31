import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'universal-cookie'
import {store} from '../index'


class Navbarcollapse extends Component {

    constructor(props) {
        super(props)

        this.cookies = new Cookies()

        if (this.cookies.get('token')) {
            this.authenticated = true
        } else {
            this.authenticated = false
        }

        this.state = {
            auth: this.authenticated,
        }

        this.handleOnClickSignOut = this.handleOnClickSignOut.bind(this)

        store.subscribe(() => {
            if (this.state !== store.getState()) {
                this.setState(store.getState())
            }
        })
    }

    handleOnClickSignOut = (e) => {
        e.preventDefault();
        this.cookies.remove('token')
        store.dispatch({type: "LOGOUT"})
    }

    render() {
        const token = this.cookies.get('token')

        if (this.state.auth || token) {
            return (
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/post">Blog</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/add">+ Add new post</Link>
                        </li>
                    </ul>
                    <button className="btn btn-primary ml-auto" onClick={this.handleOnClickSignOut}>Sign out</button>
                </div>
            )
        } else {
            return (
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/login">Sign in</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/register">Sign up</Link>
                        </li>
                    </ul>
                </div>
            )
        }
    }
}

class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/">Main</Link>
                    <Navbarcollapse/>
                </nav>
            </div>
        )
    }
}

export default Navbar;