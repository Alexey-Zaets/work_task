import React from 'react'
import {render} from 'react-dom'
import App from './components/App'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './components/Home'
import Post from './components/Post'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import rootReducer from './store/reducers'
import Sidebar from './components/Sidebar'
import CreatePostForm from './components/CreatePostForm'
import UpdatePostForm from './components/UpdatePostForm'
import Cookies from 'universal-cookie'


export let store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export const cookies = new Cookies()

const URL = process.env.REACT_APP_API

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function getRoute() {
    const headers = new Headers({
        "Content-Type": "application/coreapi+json"
    })

    const req = {
        method: 'GET',
        headers: headers,
        mode: 'cors'
    }

    fetch(URL, req)
        .then(response => response.json())
        .then(data => {
            if (supports_html5_storage() === false) {
                const host = data._meta.url.split('/', 3).join('/')
                localStorage.setItem("HOST", host);
                localStorage.setItem("CATEGORY", host + data.v1.category.list.url);
                localStorage.setItem("COMMENT", host + data.v1.comment.list.url);
                localStorage.setItem("LASTCOMMENT", host + data.v1.lastcomment.list.url);
                localStorage.setItem("POST", host + data.v1.post.list.url);
                localStorage.setItem("TAG", host + data.v1.tag.list.url);
                localStorage.setItem("LOGIN", host + data.v1.user.login.create.url);
                localStorage.setItem("REGISTER", host + data.v1.user.register.create.url);
            } else {
                const host = data._meta.url.split('/', 3).join('/')
                var route = { 
                    CATEGORY: host + data.v1.category.list.url,
                    COMMENT: host + data.v1.comment.list.url,
                    LASTCOMMENT: host + data.v1.lastcomment.list.url,
                    POST: host + data.v1.post.list.url,
                    TAG: host + data.v1.tag.list.url,
                    LOGIN: host + data.v1.user.login.create.url,
                    REGISTER: host + data.v1.user.register.create.url
                }
            }
        })
}

getRoute()

render((
    <Provider store={store}>
        <BrowserRouter>
            <App>
                <Switch>
                    <Route exact path='/'>
                        <Route component={Home}/>
                        <Route component={Sidebar}/>
                    </Route>
                    <Route exact path='/add'>
                        <Route component={CreatePostForm}/>
                        <Route component={Sidebar}/>
                    </Route>
                    <Route exact path='/blog'>
                        <Route component={Home}/>
                        <Route component={Sidebar}/>
                    </Route>
                    <Route path='/post/:id'>
                        <Route component={Post}/>
                        <Route component={Sidebar}/>
                    </Route>
                    <Route path='/update/:id'>
                        <Route component={UpdatePostForm}/>
                        <Route component={Sidebar}/>
                    </Route>
                    <Route path='/login' component={LoginForm}/>
                    <Route path='/register' component={RegisterForm}/>
                </Switch>
            </App>
        </BrowserRouter>
    </Provider>
    ), document.getElementById('root')
)