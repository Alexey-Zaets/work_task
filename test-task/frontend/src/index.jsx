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


export let store = createStore(rootReducer)

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
                    <Route path='/api/v1/post/:id'>
                        <Route component={Post}/>
                        <Route component={Sidebar}/>
                    </Route>
                    <Route path='/api/v1/user/login' component={LoginForm}/>
                    <Route path='/api/v1/user/register' component={RegisterForm}/>
                </Switch>
            </App>
        </BrowserRouter>
    </Provider>
    ), document.getElementById('root')
)