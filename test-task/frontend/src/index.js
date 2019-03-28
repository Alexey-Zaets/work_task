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


export let store = createStore(rootReducer)


render((
    <Provider store={store}>
        <BrowserRouter>
            <App>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/api/v1/post/:id' component={Post}/>
                    <Route path='/api/v1/user/login' component={LoginForm}/>
                    <Route path='/api/v1/user/register' component={RegisterForm}/>
                </Switch>
            </App>
        </BrowserRouter>
    </Provider>
    ), document.getElementById('root')
)