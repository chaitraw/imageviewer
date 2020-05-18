import React,{Component} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import Login from './login/Login';

class Controller extends Component{
    constructor(){
        super()
        this.baseUrl = "https://api.instagram.com/v1/users/self/"; 
    }

    render(){
        return(
            <Router>
                <div className = 'main-container'>
                    <Route exact path = '/' render={(props) => <Login {...props} baseUrl = {this.baseUrl}/>}/>
                </div>
            </Router>
        )
    }
}

export default Controller;