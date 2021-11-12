import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import { Redirect } from 'react-router-dom';

class MyClasses extends React.Component {
    api = new Api();

    constructor(props) {
        super(props);
        this.state = {
            "role": "T",
            "className": "this class",
            "teacher": localStorage.getItem("username"),
            users: [
                "Please add student to class"
            ]
        }
        this.headers = [
            'Username', 'Edit', 'Delete'
        ];
    }

    componentDidMount() {
        this.api.getStudentList(this.state).then(
            response => {
                console.log(response);
                console.log(this.state.teacher);
                console.log(response);
                if (response["studentList"].length > 0) {
                    this.setState({users: response["studentList"]});
                }
            })
            .catch(() => console.log("ok"))
    }

    getClasses() {
        this.api.getClasses().then(
            response => {
                if (response["code"] === 1) {
                    return response["classes"]
                } else {
                    return []
                }
            }
        )
        .catch(() => console.log("ok"))
    }

    render() {
        return (
            <>
                <NavBar/>
                <div className="m-2 ml-4 mr-4">
                    <h3>My Classes</h3>
                    <Link to="/addStudent"><button className="btn btn-primary float-right">Add Student</button></Link>

                    <Link to="/createClass"><button type="submit" class="btn btn-primary">Add Class</button></Link>
                    <hr />

                    <div class="form-group">
                        <label for="exampleFormControlSelect1">Select a Class</label>
                        <select class="form-select" id="exampleFormControlSelect1">
                            <option>Hannah's Class</option>
                            <option>Brent's Class</option>
                            <option>Anh's Class</option>
                        </select>
                    </div>

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                            {
                                this.headers.map((item, id) => (
                                    <th scope="col" key={id}>{item}</th>
                                ))
                            }
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.users.map((user, id) => (
                            <tr key={id}>
                                <td>{user}</td>
                                <td><Link style={{fontSize:"0.6em"}} to={`/admin/info/${user.id}`} className="btn btn-sm btn-info" > Edit </Link></td>
                                <td><button style={{fontSize:"0.6em"}}
                                className="btn btn-sm btn-danger"
                                onClick={() => this.deleteUser(user.firstName, user.id)}> Delete </button></td>
                            </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
export default MyClasses;