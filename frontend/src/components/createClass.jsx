import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';

class CreateClass extends React.Component {
    api = new Api();

    constructor(props) {
        super(props);
        this.state = {
            username: sessionStorage.getItem("username"),
            class_name: ""
        }
    }

    createClass() {
        this.api.createNewClass(this.state).then(
            data =>  {
                console.log(data);
                if (data["code"] == 1) {
                    console.log("create class success");

                }
            }
        );
    }


    render() { 
        return (
        <div>
            <NavBar/>
            <form className="mt-5 w-50 mx-auto" id="createAccount">
                <h1 className="align-middle">Create a Class</h1>
                <div class="form-group">
                    <label for="formGroupExampleInput">Input Class Name:</label>
                    <input type="text"
                        class="form-control"
                        id="formGroupExampleInput"
                        onChange={e => this.setState({class_name: e.target.value})}/>
                </div>
                {/* This doesn't work right now, might change later if needed
                <div class="form-group">
                    <label for="formGroupExampleInput">Description for Class:</label>
                    <input type="text"
                        class="form-control"
                        id="formGroupExampleInput"
                        onChange={e => this.setState({classDescription: e.target.value})}/>
                </div>
                */}
                <Link to="/dashboard">
                    <button type="button"
                        className="mt-4 btn btn-primary btn-block"
                        onClick={() => this.createClass()}>
                                Submit
                    </button>
                </Link>
            </form>
        </div>
        );
    }
}
 
export default CreateClass;