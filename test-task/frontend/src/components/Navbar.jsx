import React, {Component} from 'react'
import Navbarcollapse from './Navbarcollapse'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'


class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <Router>
                        <Link className="navbar-brand" to="/">Main</Link>
                    </Router>
                    <Navbarcollapse/>
                </nav>
            </div>
        )
    }
}

export default Navbar