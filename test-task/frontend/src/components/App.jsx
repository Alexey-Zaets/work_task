import React, {Fragment} from 'react'
import Navbar from './Navbar'
import 'bootstrap/dist/css/bootstrap.css'
import Pagination from './Pagination'
import Sidebar from './Sidebar'


const App = ({children}) => (
    <Fragment>
        <Navbar/>
        <div className="flex-shrink-0">
            <div className="container">
                <div className="row mt-5">
                    {children}
                    <Sidebar/>
                </div>
            </div>
        </div>
        <Pagination/>
    </Fragment>
)

export default App