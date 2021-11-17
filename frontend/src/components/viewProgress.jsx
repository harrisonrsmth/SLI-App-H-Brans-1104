import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import ProgressBar from 'react-bootstrap/ProgressBar'

class ViewProgress extends React.Component {
    api = new Api();

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <NavBar/>
                <div className="m-2 ml-4 mr-4">
                    <h3>View Progress</h3>
                    <h4>Campaigns</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Campaign Name</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Hours Assigned</th>
                                <th>Hours Completed</th>
                                <th>Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Riverside Cleanup</td>
                            <td>11/14/2021</td>
                            <td>12/14/2021</td>
                            <td>4</td>
                            <td>3</td>
                            <td>75% <ProgressBar variant="success" animated now={75}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <h4>Current Goal</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Goal Name</th>
                                <th>Start Date</th>
                                <th>Target Date</th>
                                <th>Goal Hours</th>
                                <th>Hours Completed</th>
                                <th>Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Tree Planting</td>
                            <td>11/1/2021</td>
                            <td>11/30/2021</td>
                            <td>10</td>
                            <td>6</td>
                            <td>60% <ProgressBar variant="success" animated now={60}/></td>
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
                        <tr>
                            <td>Tree Planting</td>
                            <td>11/6/2021</td>
                            <td>Spent 6 hours at a local park and planted 4 trees</td>
                            <td>Life On Land</td>
                            <td>6</td>
                        </tr>
                        <tr>
                            <td>Riverside Cleanup</td>
                            <td>11/14/2021</td>
                            <td>Spent 1 hour picking up trash by the river</td>
                            <td>Life Below Water</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>Riverside Cleanup</td>
                            <td>11/15/2021</td>
                            <td>Spent 2 more hours picking up trash by the river</td>
                            <td>Life Below Water</td>
                            <td>2</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
export default ViewProgress;