import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CreateAccount extends React.Component {
    render() { 
        return (
        <form>
          <div class="form-group">
            <label for="formGroupExampleInput">First Name</label>
            <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Example input" />
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Last Name</label>
            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input" />
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Email Address</label>
            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input" />
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Password</label>
            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input" />
            <small id="passwordHelpBlock" class="form-text text-muted">
              Your password must be 8-20 characters long
            </small>
          </div>
          <div class="form-group">
            <label for="formGroupExampleInput2">Confirm Password</label>
            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input" />
          </div>
          <Link to="/dashboard"><button type="submit" class="btn btn-primary">Submit</button></Link>
        </form>
        );
    }
}
 
export default CreateAccount;