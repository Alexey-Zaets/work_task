import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'


class Navbarcollapse extends Component {

    render() {
        return (
            <div className="collapse navbar-collapse">
                <Router>
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
                        {/*<Route path="" component={SignIn} onClick={this.handleClickSignin}/>
                        <Route path="" component={SignUp}/>*/}
                    </ul>
                    <Link className="btn btn-primary" to="">Sign out</Link>
                </Router>
            </div>
        )
    }

    handleClickSignin = () => {
        console.log('---', 'clicked')
    }
}

export default Navbarcollapse