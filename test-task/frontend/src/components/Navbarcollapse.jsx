import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'universal-cookie'


class Navbarcollapse extends Component {

    handleOnClickSignOut = (e) => {
        e.preventDefault();
        let cookies = new Cookies()
        cookies.remove('token')
    }

    render() {
        return (
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/api/v1/post">Blog</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/api/v1/post">+ Add new post</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/api/v1/user/login">Sign in</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/api/v1/user/register">Sign up</Link>
                    </li>
                </ul>
                <button className="btn btn-primary" onClick={this.handleOnClickSignOut}>Sign out</button>
            </div>
        )
    }
}

export default Navbarcollapse