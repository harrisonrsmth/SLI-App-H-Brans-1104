import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import { Redirect } from 'react-router-dom';
import circle from '../thumbnail_image.png';

class AddStudentToClass extends React.Component {
    api = new Api();
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            conf_password: "",
            role: "S",
            teacher: sessionStorage.getItem("username"),
            className: "",
            classes: []
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
    
    componentDidMount() {
        this.api.getClasses().then(data => {
            this.setState({classes: data.classes})
          })
    }
    render() {
        return (
            <>
                <form id="createAccount" style={{ position: 'absolute', left: '15%', top: '15%' }}>                    <div class="form-group">
                        <label>Select a Class</label>
                            <select class="form-select" onChange={e => this.setState({ className: e.target.value })}>
                            <option>--Select a Class--</option>
                            {
                                this.state.classes.map((myClass, id) => {
                                console.log(myClass[0]);
                                return <option key={id} value={myClass[0]}>{myClass[0]}</option>
                                })
                            }
                            </select>
                    </div>
                    <div class="form-group">
                        <label for="formGroupExampleInput2">Username</label>
                        <input
                            type="text"
                            class="form-control"
                            id="formGroupExampleInput2"
                            placeholder="Input Username"
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
                        The password must be 8-20 characters long
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
                    <div style={{position: 'absolute', left: '50%', top: '15%'}}>
                        <img src={circle} width="400" height="400" />
                    </div>
              </>

        );
    }
}
export default AddStudentToClass;