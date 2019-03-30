import React, {Component} from 'react'
import Navbarcollapse from './Navbarcollapse'
import {Link} from 'react-router-dom'


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