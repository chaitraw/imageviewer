import React, { Component } from 'react';
import Header from "../../common/header/Header";
import './Login.css';
import Card from "@material-ui/core/Card";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Redirect } from 'react-router-dom';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            usernameRequired: "dispNone",
            passwordRequired: "dispNone",
            invalidCredentialsMessage: "dispNone",
            username: "",
            password: "",
            isLoggedIn: false,
        };
    }

    loginClickHandler = () => {

        let username = "chaitra";
        let password = "imageviewer@20";

        //Access token provided by upGrad
        let accessToken = "8661035776.d0fcd39.39f63ab2f88d4f9c92b0862729ee2784";

        if (this.state.username === "" || this.state.password === "") {
            //Throw "required" error if username and password fields are not entered by user 
            this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
            this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });

            this.setState({ invalidCredentialsMessage: "dispNone" });
        }
        else if (this.state.username === username && this.state.password === password) {
            sessionStorage.setItem("access-token", accessToken);
            this.setState({
                isLoggedIn: true,
            });
            this.setState({ usernameRequired: "dispNone" });
            this.setState({ passwordRequired: "dispNone" });
        }
        else {
            //If the user enters the wrong username and/or password, then a red error message saying “Incorrect username and/or password” must be displayed
            this.setState({ invalidCredentialsMessage: "dispBlock" });
            this.setState({ usernameRequired: "dispNone" });
            this.setState({ passwordRequired: "dispNone" });
        }

    }

    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }

    inputPasswordChangeHandler = (e) => {
        this.setState({ password: e.target.value });
    }

    render() {
        return (
            <div>
                {this.state.isLoggedIn === true ?
                    <Redirect to="/home" />
                    :
                    <div>
                        <Header></Header>
                        <br />
                        <Card className="login-card">
                            <p className="login-card-header">LOGIN</p>

                            <FormControl required>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler} value={this.state.username} />
                                <FormHelperText className={this.state.usernameRequired}><span className="errorMessage">required</span></FormHelperText>
                            </FormControl>

                            <br />
                            <br />

                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password} onChange={this.inputPasswordChangeHandler} value={this.state.password} />
                                <FormHelperText className={this.state.passwordRequired}><span className="errorMessage">required</span></FormHelperText>
                            </FormControl>

                            <br />
                            <br />

                            <FormHelperText className={this.state.invalidCredentialsMessage}><span className="errorMessage" style={{ fontSize: "14px" }}>Incorrect username and/or password</span></FormHelperText>

                            <br />

                            <Button variant="contained" color="primary" onClick={this.loginClickHandler} className="login-btn">LOGIN</Button>
                        </Card>
                    </div>
                }
            </div>
        );
    }
}

export default Login;