import React, { Component } from 'react';

class ResetPassword extends React.Component {
    state = {};
    render() {
        return (
            <>
            <h1>Reset Your Password</h1>
            <form id="resetPassword">
                <div class="form-group">
                    <label for="exampleInputEmail1">New Password</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="New Password"/>
                    <small id="emailHelp" class="form-text text-muted">New password should be between 8-20 characters.</small>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Re-enter New Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Re-enter New Password"/>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            </>
        );
    }
}
export default ResetPassword;