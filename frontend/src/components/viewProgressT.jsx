import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card';

class ViewProgressT extends React.Component {
    api = new Api();

    async componentDidMount() {
        await this.api.getProgress(this.state).then(data => {
            console.log(data.progress)
            if (data.progress) {
                this.setState({campaigns: data.progress})
            } else {
                this.setState({campaigns: []})
            }
          })

        await this.api.getClasses(this.state).then(data => {
            if (data.classes) {
              this.setState({classes: data.classes})
            }
        })

        await this.api.getRecentWork(this.state).then(data => {
            console.log(data.recent_work)
            if (data.recent_work) {
                this.setState({loggedWork: data.recent_work})
            } else {
                this.setState({loggedWork: []})
            }
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            campaigns: [],
            student_filter: "",
            current_class: "",
            loggedWork: []
        }
    }
    render() {
        return (
            <>
                <NavBar/>
                <h3>View Progress</h3>
                <select class="form-select" id="class-selecter" onChange={async(e) => {
                        await this.setState({current_class: e.target.value})
                        await this.componentDidMount()
                      }
                      }>
                        <option> --Select a Class-- </option>
                        {
                          this.state.classes.map((myClass, id) => {
                            // console.log(myClass[0]);
                            return <option key={id} value={myClass[0]}>{myClass[0]}</option>
                          })
                        }
                      </select>
                    <div style={{position: 'relative', left: '39%'}}>
                        <Card border="success" style={{ width: '18rem'}}>
                        <Card.Body>
                        <Card.Title>Your class has completed 1 total hours of work this year! </Card.Title>
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
                                <th>Class Hours Completed</th>
                                <th>Class Hours Assigned</th>
                                <th>Class Completion Percentage</th>
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
                        {
                                this.state["loggedWork"].map((work, id) => {
                                    return (
                                        <tr key={id}>
                                            <td>{work[0]}</td>
                                            <td>{work[3]}</td>
                                            <td>{work[5]}</td>
                                            <td>{work[2]}</td>
                                            <td>{work[4]}</td>

                                        </tr>
                                    )
                                    
                                })
                            }
                        
                        </tbody>
                    </table>
            </>
        );
    }
}
export default ViewProgressT;