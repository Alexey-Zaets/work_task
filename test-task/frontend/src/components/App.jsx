import React, {Fragment} from 'react'
import Navbar from './Navbar'
import 'bootstrap/dist/css/bootstrap.css'
// import {URL} from '../index'


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {route: {}}
    }

    

    // componentDidMount() {
    //     const headers = new Headers({
    //         "Content-Type": "application/coreapi+json"
    //     })

    //     const req = {
    //         method: 'GET',
    //         headers: headers,
    //         mode: 'cors'
    //     }

    //     fetch(URL, req)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (this.supports_html5_storage()) {
    //                 const host = data._meta.url.split('/', 3).join('/')
    //                 localStorage.setItem("HOST", host);
    //                 localStorage.setItem("CATEGORY", host + data.v1.category.list.url);
    //                 localStorage.setItem("COMMENT", host + data.v1.comment.list.url);
    //                 localStorage.setItem("LASTCOMMENT", host + data.v1.lastcomment.list.url);
    //                 localStorage.setItem("POST", host + data.v1.post.list.url);
    //                 localStorage.setItem("TAG", host + data.v1.tag.list.url);
    //                 localStorage.setItem("LOGIN", host + data.v1.user.login.create.url);
    //                 localStorage.setItem("REGISTER", host + data.v1.user.register.create.url);
    //             } else {
    //                 const host = data._meta.url.split('/', 3).join('/')
    //                 this.setState({
    //                     route: { 
    //                         CATEGORY: host + data.v1.category.list.url,
    //                         COMMENT: host + data.v1.comment.list.url,
    //                         LASTCOMMENT: host + data.v1.lastcomment.list.url,
    //                         POST: host + data.v1.post.list.url,
    //                         TAG: host + data.v1.tag.list.url,
    //                         LOGIN: host + data.v1.user.login.create.url,
    //                         REGISTER: host + data.v1.user.register.create.url
    //                     }
    //                 })
    //             }
    //         })
    // }

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