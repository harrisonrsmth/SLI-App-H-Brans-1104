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
            "currentClass": "",
            "teacher": localStorage.getItem("username"),
            users: [
                "Please add student to class"
            ],
            classes: []
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
        
        this.api.getClasses().then(data => {
            this.setState({classes: data.classes})
          })        
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
                    <Link to="/myClasses"><button type="submit" class="btn btn-primary">Add Class</button></Link>
                    <div class="form-group">
                        <label>Select a Class</label>
                        <select class="form-select" onChange={e => this.setState({ currentClass: e.target.value })}>
                        <option> --Select a Class-- </option>
                        {
                          this.state.classes.map((myClass, id) => {
                            console.log(myClass[0]);
                            return <option key={id} value={myClass[0]}>{myClass[0]}</option>
                          })
                        }
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