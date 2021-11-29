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
            this.setState({campaigns: data.progress})
            console.log(this.state)
          })
        console.log(this.state.campaigns)

        await this.api.getClasses().then(data => {
            if (data.classes) {
              this.setState({classes: data.classes})
            }
          })
    }

    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            "campaigns": [],
            student_filter: "",
            currentClass: ""
        }
    }
    render() {
        return (
            <>
                <NavBar/>
                <h3>View Progress</h3>
                <select class="form-select" id="class-selecter" onChange={async(e) => {
                        this.state["currentClass"] = e.target.value
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
                                <th>Class Hours Assigned</th>
                                <th>Class Hours Completed</th>
                                <th>Class Completion Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Riverside Cleanup</td>
                            <td>11/19/2021</td>
                            <td>12/19/2021</td>
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
                                <th>Student Name</th>
                                <th>Date Logged</th>
                                <th>Description</th>
                                <th>SDG</th>
                                <th>Hours Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>bob1</td>
                            <td>11/19/2021</td>
                            <td>Spent 1 hour picking up trash by the river</td>
                            <td>Life Below Water</td>
                            <td>1</td>
                        </tr>
                        {/* <tr>
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
                        </tr> */}
                        </tbody>
                    </table>
            </>
        );
    }
}
export default ViewProgressT;