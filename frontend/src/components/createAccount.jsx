import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '../api';
import circle from '../thumbnail_image.png';


class CreateAccount extends React.Component {
  api = new Api();

  constructor() {
    super();
    this.state = {
        fname: "",
        lname: "",
        username: "",
        password: "",
        conf_password: "",
        role: "T"
    };
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
        }
      }
    )
  }

    render() { 
        return (
        <>
        <form id="createAccount" style={{ position: 'absolute', left: '15%', top: '15%' }}>
        <h1>Create Account</h1>
            {/* <input type="radio" class="btn-check" name="options-outlined" id="teacher-select" autocomplete="off" />
            <label class="btn btn-outline-primary" for="teacher-select">Teacher</label>

            <input type="radio" class="btn-check" name="options-outlined" id="student-select" autocomplete="off" />
            <label class="btn btn-outline-success" for="student-select">Student</label> */}
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
            <Link to="/"><button
              type="submit"
              class="btn btn-primary"
              onClick={() => this.createAccount()}>Submit</button></Link>
          </form>
          <div style={{position: 'absolute', left: '50%', top: '15%'}}>
              <img src={circle} width="400" height="400" />
            </div></>
        );
    }
}
 
export default CreateAccount;