import React from 'react'
import Navbarbrand from './Navbarbrand'
import Navbarcollapse from './Navbarcollapse'


function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <Navbarbrand/>
                <Navbarcollapse/>
            </nav>
        </div>
    )
}

export default Navbar