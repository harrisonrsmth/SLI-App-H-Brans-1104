import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '../api';

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
        role: "teacher"
    };
  }

  createAccount() {
    console.log("api called");
    this.api.createAccount(this.state).then(
      data => {
        console.log(data);
        if (data["code"] == 0) {
          alert("Password confirmation does not match.");
        } else if (data["code"] == 2) {
          alert("User already exists");
        }
      }
    )
  }

    render() { 
        return (
        <form id="createAccount">
          <div class="form-group">
            <label for="formGroupExampleInput">First Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="formGroupExampleInput" 
              placeholder="First Name" 
              onChange={e => this.setState({fname: e.target.value})}/>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Last Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="formGroupExampleInput2" 
              placeholder="Last Name" 
              onChange={e => this.setState({lname: e.target.value})}/>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Email Address</label>
            <input 
              type="text" 
              class="form-control" 
              id="formGroupExampleInput2" 
              placeholder="Email" 
              onChange={e => this.setState({username: e.target.value})}/>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Password</label>
            <input 
              type="text" 
              class="form-control" 
              id="formGroupExampleInput2" 
              placeholder="Password" 
              onChange={e => this.setState({password: e.target.value})}/>
            <small id="passwordHelpBlock" class="form-text text-muted">
              Your password must be 8-20 characters long
            </small>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Confirm Password</label>
            <input 
              type="text" 
              class="form-control" 
              id="formGroupExampleInput2" 
              placeholder="Confirm Password" 
              onChange={e => this.setState({conf_password: e.target.value})}/>
          </div>
          <Link to="/"><button 
            type="submit" 
            class="btn btn-primary"
            onClick={() => this.createAccount()}>Submit</button></Link>
        </form>
        );
    }
}
 
export default CreateAccount;