import React, {Component} from 'react'
import Navbar from './Navbar'
import Container from './Container'
import 'bootstrap/dist/css/bootstrap.css'


class App extends Component {

    render() {
        return (
            <div>
                <Navbar/>
                <Container/>
            </div>
        )
    }
}

export default App