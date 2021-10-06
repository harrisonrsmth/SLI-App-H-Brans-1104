import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import { Redirect } from 'react-router-dom';

class AddStudentToClass extends React.Component {
    api = new Api();
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            username: "",
            password: "",
            conf_password: "",
            role: "S",
            teacher: localStorage.getItem("username"),
            className: "thisclass"
        }

    }
    createAccount() {
        console.log("api called");
        this.api.createAccount(this.state).then(
          data => {
            console.log(data);
            if (data["code"] == 0) {
              alert("Password does not meet requirements");
            } else if (data["code"] == 2) {
              alert("User already exists");
            } else if (data["code"] == 1) {
                return <Redirect to="/myClasses" />
            }
          }
        )
    }
    render() {
        return (
            <>
                <form id="createAccount" style={{ position: 'absolute', left: '15%', top: '15%' }}>
                    <label class="btn btn-outline-success" for="student-select">Student</label>
                    <div class="form-group">
                        <label for="formGroupExampleInput">First Name</label>
                        <input
                            type="text"
                            class="form-control"
                            id="formGroupExampleInput"
                            placeholder="Input First Name"
                            onChange={e => this.setState({ fname: e.target.value })} />
                    </div>
                    <div class="form-group">
                        <label for="formGroupExampleInput2">Last Name</label>
                        <input
                            type="text"
                            class="form-control"
                            id="formGroupExampleInput2"
                            placeholder="Input Last Name"
                            onChange={e => this.setState({ lname: e.target.value })} />
                    </div>
                    <div class="form-group">
                        <label for="formGroupExampleInput2">Email Address</label>
                        <input
                            type="text"
                            class="form-control"
                            id="formGroupExampleInput2"
                            placeholder="Input Email"
                            onChange={e => this.setState({ username: e.target.value })} />
                    </div>
                    <div class="form-group">
                        <label for="formGroupExampleInput2">Password</label>
                        <input
                            type="password"
                            class="form-control"
                            id="formGroupExampleInput2"
                            placeholder="Input Password"
                            onChange={e => this.setState({ password: e.target.value })} />
                        <small id="passwordHelpBlock" class="form-text text-muted">
                        Your password must be 8-20 characters long
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="formGroupExampleInput2">Confirm Password</label>
                        <input
                            type="password"
                            class="form-control"
                            id="formGroupExampleInput2"
                            placeholder="Input Confirm Password"
                            onChange={e => this.setState({ conf_password: e.target.value })} />
                    </div>
                    <Link to="/myClasses"><button
                        type="submit"
                        class="btn btn-primary"
                        onClick={() => this.createAccount()}>Submit</button></Link>
                    </form>

              </>

        );
    }
}
export default AddStudentToClass;