import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Api } from '../api';


class ResetPassword extends React.Component {
    api = new Api();

    constructor() {
        super();
        this.state = {
            link: window.location.href.split("/")[4],
            username: "",
            "redirect": false,
            new_password: "",
            conf_new_password: ""
        };
    }

    resetPassword() {
        this.api.resetPassword(this.state).then(
            data => {
                console.log(data);

                if (data["code"] == 0) {
                    alert("booo");
                } else {
                    console.log("success");
                    this.setState({redirect: true});
                }
            }
        );
    }

    componentDidMount() {
        this.api.getResetLinkUser(this.state).then(
            data => {
                if (data["code"] == 1) {
                    this.setState({"username": data["username"]});
                    // alert("check state")
                    console.log(this.state);
                } else {
                    if (this.state["redirect"] === false) {
                        this.setState({redirect: true});
                        alert("Invalid link");
                    }
                }
            }
        );
    }

    render() {
        if (this.state["redirect"]) {
            return <Redirect to="/"/>
        } else {
            return (
                <>
                <h1>Reset Your Password</h1>
                <form id="resetPassword">
                    <div class="form-group">
                        <label for="exampleInputEmail1">New Password</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="exampleInputEmail1" 
                            aria-describedby="emailHelp" 
                            placeholder="New Password"
                            onChange={e => this.setState({new_password: e.target.value})}/>
                        <small id="emailHelp" class="form-text text-muted">New password should be between 8-20 characters.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Re-enter New Password</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="exampleInputPassword1" 
                            placeholder="Re-enter New Password"
                            onChange={e => this.setState({conf_new_password: e.target.value})}/>
                    </div>
                    <button 
                        type="submit" 
                        class="btn btn-primary"
                        onClick={() => {
                            <Redirect to="/"/>;
                            this.resetPassword();
                        }}>Submit</button>
                </form>
                </>
            );
        }
    }
}
export default ResetPassword;