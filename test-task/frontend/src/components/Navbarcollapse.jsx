import React, {Component} from 'react'
import Button from './Navbarbutton'

class Navbarcollapse extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isAuthenticated: true
        }
    }
    render() {
        return (
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    {['Blog', '+ Add new post'].map((link, index) => {
                        return (
                            <li className="nav-item active" key={index}>
                                <a className="nav-link" href="">{link}</a>
                            </li>
                    )
                    })}
                </ul>
                <ul className="navbar-nav ml-auto">
                    {['Sign in', 'Sign up'].map((link, index) => {
                        return (
                            <li className="nav-item active" key={index}>
                                <a className="nav-link" href="">{link}</a>
                            </li>
                    )
                    })}
                </ul>
                <Button/>
            </div>
        )
    }
}

export default Navbarcollapse