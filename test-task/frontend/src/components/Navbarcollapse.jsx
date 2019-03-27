import React, {Component} from 'react'
import {Link} from 'react-router-dom'


class Navbarcollapse extends Component {

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
                <Link className="btn btn-primary" to="">Sign out</Link>
            </div>
        )
    }
}

export default Navbarcollapse