import React from 'react'
import {render} from 'react-dom'
import App from './components/App'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './components/Home'
import Post from './components/Post'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import {Provider} from 'react-redux'
import store from './components/store'


render((
    <Router>
        <Provider store={store}>
            <App>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/api/v1/post/:id' component={Post}/>
                    <Route path='/api/v1/user/login' component={LoginForm}/>
                    <Route path='/api/v1/user/register' component={RegisterForm}/>
                </Switch>
            </App>
        </Provider>
    </Router>
    ), document.getElementById('root')
)