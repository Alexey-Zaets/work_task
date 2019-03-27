import React, {Fragment} from 'react'
import Navbar from './Navbar'
import 'bootstrap/dist/css/bootstrap.css'


const App = ({children}) => (
    <Fragment>
        <Navbar/>
        {children}
    </Fragment>
)

export default App