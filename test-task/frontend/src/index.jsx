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
import Cookies from 'universal-cookie'
import TagPosts from './components/TagPosts'


export let store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const cookies = new Cookies()

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
                    <Route path='/post/:id'>
                        <Route component={Post}/>
                        <Route component={Sidebar}/>
                    </Route>
                    <Route path='/tag/:id/posts'>
                        <Route component={TagPosts}/>
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