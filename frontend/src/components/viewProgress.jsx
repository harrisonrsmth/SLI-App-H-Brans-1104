import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card';

class ViewProgress extends React.Component {
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
            current_class: "class"
        }
    }
    render() {
        return (
            <>
                <NavBar/>
                <div className="m-2 ml-4 mr-4">
                    <h3>View Progress</h3>
                    <div style={{position: 'absolute', left: '15%'}}>
                        <Card border="success" style={{ width: '18rem'}}>
                        <Card.Body>
                        <Card.Title>You have completed 9 total hours of work this year! </Card.Title>
                        </Card.Body>
                        </Card><br />
                    </div>
                    <div style={{position: 'relative', left: '65%'}}>
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
                                <th>Your Hours Assigned</th>
                                <th>Your Hours Completed</th>
                                <th>Your Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Riverside Cleanup</td>
                            <td>11/19/2021</td>
                            <td>12/19/2021</td>
                            <td>5</td>
                            <td>1</td>
                            <td>20% <ProgressBar variant="success" animated now={20}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h4>Current Goal</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Target Date</th>
                                <th>Goal Hours</th>
                                <th>Hours Completed</th>
                                <th>Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>12/31/2021</td>
                            <td>10</td>
                            <td>1</td>
                            <td>10% <ProgressBar variant="success" animated now={10}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h4>Logged Work</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Date Logged</th>
                                <th>Description</th>
                                <th>SDG</th>
                                <th>Hours Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* <tr>
                            <td>Tree Planting</td>
                            <td>11/6/2021</td>
                            <td>Spent 6 hours at a local park and planted 4 trees</td>
                            <td>Life On Land</td>
                            <td>6</td>
                        </tr> */}
                        <tr>
                            <td>Cleanup</td>
                            <td>11/19/2021</td>
                            <td>Spent 1 hour picking up trash by the river</td>
                            <td>Life Below Water</td>
                            <td>1</td>
                        </tr>
                        {/* <tr>
                            <td>Riverside Cleanup</td>
                            <td>11/15/2021</td>
                            <td>Spent 2 more hours picking up trash by the river</td>
                            <td>Life Below Water</td>
                            <td>2</td>
                        </tr> */}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
export default ViewProgress;