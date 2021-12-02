import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '../api';
import circle from '../thumbnail_image.png';
import { NavBar } from './navbar';


class CreateCampaign extends React.Component {
  api = new Api();

  constructor() {
    super();
    this.state = {
        username: sessionStorage.getItem("username"),
        current_class: "",
        name: "",
        hours: "",
        start_date: "",
        due_date: "",
        classes: []
    };
  }

  createCampaign() {
    this.api.createCampaign(this.state).then(
        data =>  {
            console.log(data);
            if (data["code"] == 1) {
                console.log("campaign created success");

            }
        }
    )
  }

  componentDidMount() {
    this.api.getClasses().then(data => {
      if (data.classes) {
        this.setState({classes: data.classes})
      }
    })
  }
  
    render() { 
        return (
        <>
        <NavBar/>
          <form id="createCampaign" style={{ position: 'absolute', left: '15%', top: '15%' }}>
            <div class="form-group">
              <label for="formGroupExampleInput">Create Your Campaign</label>
              <input
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                placeholder="Input Campaign Name"
                onChange={e => this.setState({ name: e.target.value })} />
            </div>
            <div class="form-group">
              <label>Which class is this for?</label>
                <select class="form-select" onChange={e => this.setState({ current_class: e.target.value })}>
                  <option> --Select a Class-- </option>
                  {
                    this.state.classes.map((myClass, id) => {
                    console.log(myClass[0]);
                    return <option key={id} value={myClass[0]}>{myClass[0]}</option>
                    })
                  }
                </select>
                {/* onChange={e => this.setState({ current_class: e.target.value })} */}

            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">Required Hours</label>
              <input
                type="number"
                class="form-control"
                id="formGroupExampleInput2"
                placeholder="Input Required Hours"
                onChange={e => this.setState({ hours: e.target.value })} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">Start Date</label>
              <input
                type="date"
                class="form-control"
                id="formGroupExampleInput2"
                placeholder="Input Start Date"
                onChange={e => this.setState({ start_date: e.target.value })} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">Due Date</label>
              <input
                type="date"
                class="form-control"
                id="formGroupExampleInput2"
                placeholder="Input Due Date"
                onChange={e => this.setState({ due_date: e.target.value })} />
            </div>
            <Link to="/dashboard"><button
              type="submit"
              class="btn btn-primary"
              onClick={() => this.createCampaign()}>Submit</button></Link>
          </form>
          <div style={{position: 'absolute', left: '60%', top: '15%'}}>
              <img src={circle} width="400" height="400" />
            </div></>
        );
    }
}
 
export default CreateCampaign;