import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Api } from '../api';
import { useHistory } from 'react-router-dom';
class Login extends React.Component {
    api = new Api();
    state = {
        loaded: false,
        redirect: false,
        username: "",
        password: "",
        role: null
    };
    constructor() {
        super();
    }

    login() {
        console.log("api called");
        this.api.login(this.state).then(
            data => {

                if (data.auth === false) {
                    console.log(data);
                    alert(data.msg);
                } else {
                    localStorage.setItem('token', data.token);
                    this.setState({redirect: true});
                    console.log("success");
                    console.log(data);
                    alert(data.msg);
                }
            }
        );
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/dashboard' />
        }
        return ( 
        <form id="login">
          <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 pt-0">Choose one:</legend>
              <div class="col-sm-10">
                  <div class="form-check">
                    <input class="form-check-input"
                            type="radio"
                            name="gridRadios"
                            id="gridRadios1"
                            value="option1" checked/>
                    <label class="form-check-label" for="gridRadios1">
                      Student
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input"
                            type="radio"
                            name="gridRadios"
                            id="gridRadios2"
                            value="option2"/>
                    <label class="form-check-label" for="gridRadios2">
                      Teacher
                    </label>
                  </div>
              </div>
          </div>
          </fieldset>
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
        );
    }
}
 
export default Login;