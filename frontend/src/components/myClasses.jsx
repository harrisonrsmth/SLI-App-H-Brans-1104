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
            "className": "thisclass",
            "teacher": localStorage.getItem("username"),
            users: [

            ]
        }
        this.headers = [
            'First Name', 'Edit', 'Delete'
        ];
    }

    componentDidMount() {
        this.api.getStudentList(this.state).then(
            response => {
                console.log(response);
                console.log(this.state.teacher);
                this.setState({users: response["studentList"]});
            })
            .catch(() => console.log("ok"))
    }



    render() {
        return (
            <>
                <NavBar/>
                <div className="m-2 ml-4 mr-4">
                    <h3 className="d-inline">My Classes</h3>
                    <Link to="/addStudent"><button className="btn btn-primary float-right">Add Student</button></Link>

                    <hr />
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