import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '../api';
import circle from '../thumbnail_image.png';
import { NavBar } from './navbar';



class CreateGoal extends React.Component {
  api = new Api();

  constructor() {
    super();
    this.state = {
        user: sessionStorage.getItem("username"),
        hours: "",
        date: ""
    };
  }

  createGoal() {
    this.api.createGoal(this.state).then(
        data =>  {
            console.log(data);
            if (data["code"] == 1) {
                console.log("goal created success");

            }
        }
    );
}

    render() { 
        return (
        <>
        <NavBar/>
          <form id="createGoal" style={{ position: 'absolute', left: '15%', top: '15%' }}>
            <div class="form-group">
              <label for="formGroupExampleInput">Set a target for service hours?</label>
              <input
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                placeholder="Input number of hours"
                onChange={e => this.setState({ hours: e.target.value })} />
                <small id="hoursHelpBlock" class="form-text text-muted">
                This should be a number! (1, 2, etc.)
              </small>
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">Set a target date!</label>
              <input
                type="date"
                class="form-control"
                id="formGroupExampleInput2"
                placeholder="Input Date"
                onChange={e => this.setState({ date: e.target.value })} />
            </div>
            <Link to="/dashboard"><button
              type="submit"
              class="btn btn-primary"
              onClick={() => this.createGoal()}>Submit</button></Link>
          </form>
          <div style={{position: 'absolute', left: '60%', top: '15%'}}>
              <img src={circle} width="400" height="400" />
            </div></>
        );
    }
}
 
export default CreateGoal;