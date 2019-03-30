import React, {Fragment} from 'react'
import Navbar from './Navbar'
import 'bootstrap/dist/css/bootstrap.css'


const App = ({children}) => (
    <Fragment>
        <Navbar/>
        <div className="flex-shrink-0">
            <div className="container">
                <div className="row mt-5">
                    {children}
                </div>
            </div>
        </div>
    </Fragment>
)

export default App