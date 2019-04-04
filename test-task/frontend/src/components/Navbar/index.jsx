import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {store, cookies} from '../../index'


class Navbarcollapse extends Component {

    constructor(props) {
        super(props)

        this.state = {
            auth: false,
        }

        this.handleOnClickSignOut = this.handleOnClickSignOut.bind(this)
    }

    componentDidMount() {

        store.subscribe(() => {
            if (this.state !== store.getState()) {
                this.setState(store.getState())
            }
        })

        if (cookies.get('token')) {
            store.dispatch({type: "LOGIN"})
        }
    }

    handleOnClickSignOut = (e) => {
        e.preventDefault();
        cookies.remove('token');
        cookies.remove('username')
        store.dispatch({type: "LOGOUT"});
    }

    render() {
        const username = store.getState().username || cookies.get('username')

        if (this.state.auth) {
            return (
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <Link className="nav-link" to={{pathname: '/blog/', search: `author__username=${username}`}}>Blog</Link>
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