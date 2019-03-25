import React, {Component} from 'react'
import Button from './Navbarbutton'

class Navbarcollapse extends Component {

    render() {
        return (
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link">Blog</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link">+ Add new post</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        <a className="nav-link" onClick={this.handleClickSignin} style={{cursor: "pointer"}}>Sign in</a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link">Sign up</a>
                    </li>
                </ul>
                <Button/>
            </div>
        )
    }

    handleClickSignin = () => {
        console.log('---', 'clicked')
    }
}

export default Navbarcollapse