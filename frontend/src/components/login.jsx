import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Api } from '../api';
import { useHistory } from 'react-router-dom';


class Login extends React.Component {
    api = new Api();

    constructor() {
        super();
        this.state = {
            isLoggedIn: false,
            username: "",
            password: "",
            role: null
        };
    }

    login() {
        console.log("api called");
        this.api.login(this.state).then(
            data => {
                console.log(data)
                if (data["code"] == 0) {

                    alert(data.msg);
                } else {
                    console.log(this.state);
                    this.setState({isLoggedIn: true});
                    localStorage.setItem('token', data["token"]);
                    console.log("success");
                    alert(data.msg);
                }
            }
        );
    }

    componentDidMount() {
        this.api.getCurrentUser().then(
                response => {
                    this.setState({isLoggedIn: response.data["isLoggedIn"]})
                })
            .catch(() => console.log("ok"))
    }

    render() {
        console.log(this.state.isLoggedIn);
        if (this.state.isLoggedIn) {
            return <Redirect push to="/dashboard" />
        }
        return (
            <div>
            <form id="login">
              <div>{this.state.redirect}</div>

              <div class="form-group">
                <label for="formGroupExampleInput2">Username</label>
                <input type="text"
                        class="form-control"
                        id="formGroupExampleInput2"
                        placeholder="Another input"
                        onChange={e => this.setState({username: e.target.value})}/>
                <small id="passwordHelpBlock" class="form-text text-muted">
                  Teachers, username is your email used to create your account
                </small>
              </div>
              <div class="form-group">
                <label for="formGroupExampleInput2">Password</label>
                <input type="text"
                        class="form-control"
                        id="formGroupExampleInput2"
                        placeholder="Another input"
                        onChange={e => this.setState({password: e.target.value})}/>
              </div>
              <button type="submit"
                     class="btn btn-primary"
                     onClick={() => this.login()}>Submit</button>
            </form>
            </div>
        );
    }
}
 
export default Login;