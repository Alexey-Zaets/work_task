import React, {Component} from 'react'
import Navbarbrand from './Navbarbrand'
import Navbarcollapse from './Navbarcollapse'


class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <Navbarbrand/>
                    <Navbarcollapse/>
                </nav>
            </div>
        )
    }
}

export default Navbar