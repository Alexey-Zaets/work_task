import React, {Fragment} from 'react'
import Navbar from './Navbar'
import 'bootstrap/dist/css/bootstrap.css'


class App extends React.Component {

    render() {
        return (
            <Fragment>
                <Navbar/>
                <div className="flex-shrink-0">
                    <div className="container">
                        <div className="row mt-5">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default App