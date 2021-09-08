import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    render() { 
        return ( 
        <form>
          <div class="form-group">
            <label for="formGroupExampleInput2">Username</label>
            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input" />
            <small id="passwordHelpBlock" class="form-text text-muted">
              Teachers, username is your email used to create your account
            </small>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Password</label>
            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input" />
          </div>
          <Link to="/dashboard"><button type="submit" class="btn btn-primary">Submit</button></Link>
        </form>
        );
    }
}
 
export default Login;