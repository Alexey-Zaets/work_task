import React, {Component} from 'react'
import Navbar from './Navbar'
import Container from './Container'


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