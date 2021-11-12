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
            role: "T"
        };
    }

    login() {
        console.log("api called");

        this.api.login(this.state).then(
            data => {
                console.log(data);

                if (data["code"] == 0) {
                    alert(data.msg);
                } else {
                    localStorage.setItem('isLoggedIn', data["isLoggedIn"]);
                    localStorage.setItem('token', data["token"]);
                    localStorage.setItem('username', data["username"]);
                    localStorage.setItem('role', data["role"]);
                    console.log(this.state);
                    console.log("success");

                }
            }
        );
    }

    componentDidMount() {
        this.api.getCurrentUser().then(
            response => {
                console.log(response.data["isLoggedIn"]);
                localStorage.setItem("isLoggedIn", response.data["isLoggedIn"]);
                //this.setState({isLoggedIn: response.data["isLoggedIn"]});
            })
            .catch(() => console.log("ok"))
    }

    handleSelectedRole(role) {
        if (role == "T") {
            this.state.role = "T";
        } else {
            this.state.role = "S";
        }
    }

    render() {
        if (localStorage.getItem("isLoggedIn")) {
            return <Redirect push to="/dashboard" />
        }
        return (
            <div>
                <form className="mt-5 w-50 mx-auto" id="login">
                    <div>{this.state.redirect}</div>
                    <h1>Login</h1>
                    <input type="radio" class="btn-check" name="options-outlined" id="teacher-select" autocomplete="off"
                        onChange={this.handleSelectedRole("T")}
                        />
                        <label class="btn btn-outline-primary" for="teacher-select">Teacher</label>

                    <input type="radio" class="btn-check" name="options-outlined" id="student-select" autocomplete="off"
                        onChange={this.handleSelectedRole("S")}
                        />
                        <label class="btn btn-outline-success" for="student-select">Student</label>
                    <div className="form-group mt-2 mx-auto">
                        <label for="formGroupExampleInput2">Username/Email</label>
                        <input type="text"
                                class="form-control"
                                id="formGroupExampleInput2"
                                placeholder="Input Username/Email"
                                onChange={e => this.setState({username: e.target.value})}/>
                        <small id="passwordHelpBlock" class="form-text text-muted">
                            Teachers, username is your email used to create your account
                        </small>
                    </div>
                    <div className="form-group mt-2 mx-auto">
                        <label for="formGroupExampleInput2">Password</label>
                        <input type="password"
                                class="form-control"
                                id="formGroupExampleInput2"
                                placeholder="Input Password"
                                onChange={e => this.setState({password: e.target.value})}/>
                    </div>
                    <div className="mt-5 mx-auto">
                        <button type="submit"
                                class="btn btn-primary"
                                onClick={() => this.login()}>Submit</button>
                    </div>
                    <Link to="/forgotPassword">
                        <button className="mt-2 mx-auto btn btn-primary">Forgot Password</button>
                    </Link>

                </form>
            </div>
        );
    }
}
 
export default Login;