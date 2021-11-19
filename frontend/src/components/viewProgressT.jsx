import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card';

class ViewProgressT extends React.Component {
    api = new Api();

    componentDidMount() {
        this.api.getProgress(this.state).then(data => {
            console.log(data.progress)
            this.state["campaigns"] = data.progress
            console.log(this.state)
          })
        console.log(this.state.campaigns)
    }

    constructor(props) {
        super(props);
        this.state = {
            "campaigns": [],
            student_filter: "",
            currentClass: "class"
        }
    }
    render() {
        return (
            <>
                <NavBar/>
                <h3>View Progress</h3>
                    <div style={{position: 'relative', left: '39%'}}>
                        <Card border="success" style={{ width: '18rem'}}>
                        <Card.Body>
                        <Card.Title>Your class has completed 83 total hours of work this year! </Card.Title>
                        </Card.Body>
                        </Card><br />
                    </div>
                    <h4>Campaigns</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Campaign Name</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Class Hours Assigned</th>
                                <th>Class Hours Completed</th>
                                <th>Class Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Riverside Cleanup</td>
                            <td>11/14/2021</td>
                            <td>12/14/2021</td>
                            <td>100</td>
                            <td>83</td>
                            <td>83% <ProgressBar variant="success" animated now={83}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h4>Logged Work</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Date Logged</th>
                                <th>Description</th>
                                <th>SDG</th>
                                <th>Hours Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Johnny A</td>
                            <td>11/6/2021</td>
                            <td>Picked up trash</td>
                            <td>Life Below Water</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>Suzie Q</td>
                            <td>11/5/2021</td>
                            <td>Spent 3 hours cleaning up by the river</td>
                            <td>Life Below Water</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>Hannah W</td>
                            <td>11/5/2021</td>
                            <td>Suzie and I went to the river and picked up trash</td>
                            <td>Life Below Water</td>
                            <td>3</td>
                        </tr>
                        </tbody>
                    </table>
            </>
        );
    }
}
export default ViewProgressT;