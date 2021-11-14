import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '../api';
import circle from '../thumbnail_image.png';
import { NavBar } from './navbar';



class LogWork extends React.Component {
  api = new Api();

  constructor() {
    super();
    this.state = {
        user: sessionStorage.getItem("username"),
        project: "",
        SDG: "",
        date: "",
        hours: "",
        description: ""
    };
  }

  logWork() {
    this.api.logWork(this.state).then(
        data =>  {
            console.log(data);
            if (data["code"] == 1) {
                console.log("work logged success");

            }
        }
    );
}

    render() { 
        return (
        <>
        <NavBar/>
          <form id="logWork" style={{ position: 'absolute', left: '15%', top: '15%' }}>
            <div class="form-group">
              <label for="formGroupExampleInput">Project Name</label>
              <input
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                placeholder="Input Project Name"
                onChange={e => this.setState({ project: e.target.value })} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">Date</label>
              <input
                type="date"
                class="form-control"
                id="formGroupExampleInput2"
                placeholder="Input Date"
                onChange={e => this.setState({ date: e.target.value })} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">Description</label>
              <input
                type="text"
                class="form-control"
                id="formGroupExampleInput2"
                placeholder="Input Description"
                onChange={e => this.setState({ description: e.target.value })} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">Hours</label>
              <input
                type="number"
                class="form-control"
                id="formGroupExampleInput2"
                placeholder="How many hours?"
                onChange={e => this.setState({ hours: e.target.value })} />
              <small id="passwordHelpBlock" class="form-text text-muted">
                This should be a number! (1, 2, etc.)
              </small>
            </div>
            <div class="form-group">
              <label for="exampleFormControlSelect1">Which SDG?</label>
              <select class="form-select" id="exampleFormControlSelect1">
                <option>-- Select an SDG --</option>
                <option>No Poverty</option>
                <option>Zero Hunger</option>
                <option>Good Health and Well-Being</option>
                <option>Quality Education</option>
                <option>Gender Equality</option>
                <option>Clean Water and Sanitation</option>
                <option>Affordable and Clean Energy</option>
                <option>Decent Work and Economic Growth</option>
                <option>Industry, Innovation, and Infrastructure</option>
                <option>Reduced Inequalities</option>
                <option>Sustainable Cities and Communities</option>
                <option>Responsible Consumption and Production</option>
                <option>Climate Action</option>
                <option>Life Below Water</option>
                <option>Life On Land</option>
                <option>Peace, Justice and Strong Institutions</option>
                <option>Partnerships for the Goals</option>
              </select>
            </div>
            <Link to="/dashboard"><button
              type="submit"
              class="btn btn-primary"
              onClick={() => this.logWork()}>Submit</button></Link>
          </form>
          <div style={{position: 'absolute', left: '50%', top: '15%'}}>
              <img src={circle} width="400" height="400" />
            </div></>
        );
    }
}
 
export default LogWork;