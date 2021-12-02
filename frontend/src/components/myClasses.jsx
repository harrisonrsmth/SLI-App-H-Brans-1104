import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import { Redirect } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

class MyClasses extends React.Component {
    api = new Api();

    constructor(props) {
        super(props);
        this.state = {
            "role": "T",
            "current_class": "",
            "username": sessionStorage.getItem("username"),
            students: [

            ],
            classes: [],

            deleteFormShow: false,
            currStudent: ""
        }
        this.headers = [
            'Username', 'Delete'
        ];
    }

    componentDidMount() {

        this.updateStudentList()

        this.api.getClasses().then(data => {
            if (data.classes) {
                this.setState({classes: data.classes})
            }
          })        
    }

    updateStudentList() {
        this.api.getStudentList(this.state).then(
            response => {
                console.log(response);
                console.log(this.state.username);
                console.log(response);
                try {
                    if (response["studentList"].length > 0) {
                        this.setState({students: response["studentList"]});
                    }
                } catch {
                    this.setState({students: []})
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

    handleDeleteUser(username) {
        console.log(username);
        this.setState({currStudent: username});
        this.handleShow();
    }
    onDeleteSubmit = () => {
        this.handleClose();
        this.api.deleteUserAccount(this.state).then(
            response => {
                if (response["code"] === 1) {
                    this.updateStudentList()
                }
            }
        ).catch(() => console.log("deleted user sucessfully"))
    }

    handleClose = () => {
        return this.setState({deleteFormShow: false, currStudent: ""});
    }
    handleShow = () => {
        return this.setState({deleteFormShow: true})
    }

    render() {
        return (
            <>
                <NavBar/>
                <div className="m-2 ml-4 mr-4">
                    <h3>My Classes</h3>
                    <Link to="/addStudent"><button className="btn btn-primary float-right">Add Student</button></Link>
                    {" "}
                    <Link to="/createClass"><button type="submit" class="btn btn-primary">Add Class</button></Link>
                    <hr />

                    <div class="form-group">
                        <label>Select a Class</label>
                        <select class="form-select" onChange={e => {
                            // this.setState({ currentClass: e.target.value })
                            this.state["current_class"] = e.target.value
                            this.componentDidMount()
                            console.log(this.state)
                        }
                        }>
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
                            this.state.students.map((user, id) => (
                            <tr key={id}>
                                <td>{user}</td>
                                <td><button style={{fontSize:"0.6em"}}
                                className="btn btn-sm btn-danger"
                                onClick={() => this.handleDeleteUser(user)}> Delete </button></td>
                            </tr>
                            ))
                        }
                        <Modal show={this.state.deleteFormShow} onHide={this.handleClose}>
                            <Modal.Header handleClose>
                                <Modal.Title>Delete Current Student</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>{this.state.currStudent}</div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-sm btn-danger" variant="secondary" onClick={this.handleClose}>
                                    Cancel
                                </button>
                                <button className="btn btn-sm btn-primary" onClick={this.onDeleteSubmit}>Submit</button>
                            </Modal.Footer>
                        </Modal>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
export default MyClasses;