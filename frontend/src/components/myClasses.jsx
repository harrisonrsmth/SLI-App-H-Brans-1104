import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';

class MyClasses extends React.Component {
    api = new Api();

    constructor(props) {
        super(props);
        this.state = {

            users: [
            {
                firstName: "haha",
                lastName: "hihi",
                username: "hello"
            }
            ]
        }
        this.headers = [
            'First Name', 'Last Name', 'Username', 'Edit', 'Delete'
        ];
    }

    render() {
        return (
            <>
                <NavBar/>
                <div className="m-2 ml-4 mr-4">
                    <h3 className="d-inline">My Classes</h3>
                    <button className="btn btn-primary float-right"
                        onClick={() => console.log("hello")}>Add Student</button>
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
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.username}</td>
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