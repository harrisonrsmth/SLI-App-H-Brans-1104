import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card';

class ViewProgress extends React.Component {
    api = new Api();

    constructor(props) {
        super(props);
        this.state = {
            campaigns: [],
            goal: [],
            goalProgress: 0,
            loggedWork: [],
            all_work: true,
            totalHours: 0
        }
    }

    componentDidMount() {
        this.api.getProgress(this.state).then(data => {
            if (data.progress) {
                this.setState({campaigns: data.progress})
            } else {
                this.setState({campaigns: []})
            }
        })

        this.api.getGoal(this.state).then(data => {
            if (data.goal) {
                this.setState({goal: data.goal})
            }
        })

        this.api.getGoalProgress(this.state).then(data => {
            if (data.current_hours) {
                this.setState({goalProgress: data.current_hours})
            }
        })

        this.api.getRecentWork(this.state).then(data => {
            if (data.recent_work) {
                this.setState({loggedWork: data.recent_work})
            } else {
                this.setState({loggedWork: []})
            }
        })

        this.api.getTotalHours(this.state).then(data => {
            if (data.total_hours) {
                this.setState({totalHours: data.total_hours})
            }
        })
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
                        <Card.Title>You have completed {this.state.totalHours} total hours of work this year! </Card.Title>
                        </Card.Body>
                        </Card><br />
                    </div>
                    <div style={{position: 'relative', left: '65%'}}>
                        <Card border="success" style={{ width: '18rem'}}>
                        <Card.Body>
                        <Card.Title>Your class has completed FIX total hours of work this year! </Card.Title>
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
                                <th>Your Hours Completed</th>
                                <th>Your Hours Assigned</th>
                                <th>Your Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.campaigns.map((campaign, id) => {
                                    return (
                                        <tr key={id}>
                                            <td>{campaign[0][0]}</td>
                                            <td>{campaign[0][2]}</td>
                                            <td>{campaign[0][3]}</td>
                                            <td>{campaign[1][0][1]}</td>
                                            <td>{campaign[0][1]}</td>
                                            <td>{campaign[1][0][2]}% <ProgressBar variant="success" animated now={campaign[1][0][2]}/></td>
                                        </tr>
                                    )
                                    
                                })
                            }
                        
                        </tbody>
                    </table>
                    <h4>Current Goal</h4>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Target Date</th>
                                <th>Hours Completed</th>
                                <th>Goal Hours</th>
                                <th>Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.goal[1]}</td>
                                <td>{this.state.goalProgress}</td>
                                <td>{this.state.goal[0]}</td>
                                <td>{Math.round((this.state.goalProgress / this.state.goal[0]) * 100)}% <ProgressBar variant="success" animated now={(this.state.goalProgress / this.state.goal[0]) * 100}/></td>
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
                        {
                                this.state["loggedWork"].map((work, id) => {
                                    return (
                                        <tr key={id}>
                                            <td>{work[1]}</td>
                                            <td>{work[3]}</td>
                                            <td>{work[5]}</td>
                                            <td>{work[2]}</td>
                                            <td>{work[4]}</td>

                                        </tr>
                                    )
                                    
                                })
                            }
                        {/* <tr>
                            <td>Cleanup</td>
                            <td>11/19/2021</td>
                            <td>Spent 1 hour picking up trash by the river</td>
                            <td>Life Below Water</td>
                            <td>1</td>
                        </tr> */}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
export default ViewProgress;