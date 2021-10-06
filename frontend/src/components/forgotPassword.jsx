import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Api } from '../api';
import { useHistory } from 'react-router-dom';


class ForgotPassword extends React.Component {
    api = new Api();

    constructor() {
        super();
        this.state = {
            email: ""
        };
    }

    retrievePassword() {
        console.log("api called");

        this.api.retrievePassword(this.state).then(
            data => {
                console.log(data);

                if (data["code"] != 200) {
                    alert(data.msg);
                } else {
                    console.log("success");
                }
            }
        );
    }

    render() {
        return (
            <div>
                <form className="mt-5 w-50 mx-auto" id="forgotPassword">
                    <div>{this.state.redirect}</div>
                    <h1>Forgot Password</h1>
                    <div className="form-group mt-2 mx-auto">
                        <label for="formGroupExampleInput2">Email</label>
                        <input type="text"
                                class="form-control"
                                id="formGroupExampleInput2"
                                placeholder="Input Email"
                                onChange={e => this.setState({email: e.target.value})}/>
                        <small id="emailHelpBlock" class="form-text text-muted">
                            Teachers, enter your email here to be sent your password! Be sure to check your spam folder.
                            Students, go to your teacher to retrieve your password.
                        </small>
                    </div>
                    <div className="mt-4 mx-auto">
                    <Link to="/"><button
                        type="submit"
                        class="btn btn-primary"
                        onClick={() => this.retrievePassword()}>Submit</button></Link>
                    </div>
                </form>
            </div>
        );
    }
}
 
export default ForgotPassword;