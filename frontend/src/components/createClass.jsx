import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CreateClass extends React.Component {
    render() { 
        return (
        <div>
            <h1>Create a Class</h1>
            <form id="createAccount">
                <div class="form-group">
                    <label for="formGroupExampleInput">Input Class Name:</label>
                    <input type="text" class="form-control" id="formGroupExampleInput" />
                </div>
                <div class="form-group">
                    <label for="formGroupExampleInput">Description for Class:</label>
                    <input type="text" class="form-control" id="formGroupExampleInput" />
                </div>
                <Link to="/dashboard"><button type="submit" class="btn btn-primary">Submit</button></Link>
            </form>
        </div>
        );
    }
}
 
export default CreateClass;