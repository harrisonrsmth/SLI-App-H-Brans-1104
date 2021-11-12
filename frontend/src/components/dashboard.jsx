import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar';
import { Api } from '../api';
import leaf from '../leaf.png';
import badge from '../award.png';
import Card from 'react-bootstrap/Card';

function Campaign(props) {
    return (
      <div style={{position: 'relative', left: '15%'}}>
        <Card border="success" style={{ width: '18rem'}}>
        <Card.Header>Due: {props.date}</Card.Header>
        <Card.Body>
          <Card.Title>{props.camp}</Card.Title>
          <Card.Text>
            You have a total of {props.hours} hours to complete.
          </Card.Text>
        </Card.Body>
        </Card><br />
      </div>
    );
  }

  function Goal(props) {
    return (
      <div style={{position: 'relative', left: '15%'}}>
        <Card border="warning" style={{ width: '18rem'}}>
        <Card.Header>{props.date}</Card.Header>
        <Card.Body>
          <Card.Title>Goal</Card.Title>
          <Card.Text>
            {props.description}
          </Card.Text>
        </Card.Body>
        </Card><br />
      </div>
    );
  }

class Dashboard extends React.Component {
    api = new Api();
    constructor() {
        super();
        this.state = {
            classes: [],
            campaigns: [],
            goal: []
        }
    }

    componentDidMount() {
      this.api.getCampaigns().then(data => {
        console.log(data.campaignList)
        this.setState({campaigns: data.campaignList});
      })

      this.api.getGoal().then(data => {
        this.setState({goal: data.goal})
      })
      console.log(this.state.goal)

      this.api.getClasses().then(data => {
        this.setState({classes: data.classes})
        console.log(data.classes)
      })
      console.log(this.state.classes)
    }
    
    
    // api call
    // getCurrentUser();
    // data = {body: {goals: []}}
    // const data = whatever is returned from api call
    // {condition && <div> react component}
    // {body.campaign && <div>{body.campaign.title}</div>}
    // {body.goal && <div>{body.campaign.title}</div>}
    // body.goals is an array
    // body.goals.map(goal => <Goal title={goal.title}>)
    render() { 
        return (
            <div>
            <React.Fragment>
              <NavBar/>
              <h1>Dashboard</h1>
              <div class="row align-items-start">
                <div class="col-4">
                {localStorage.getItem("role") == 'T' && <h1>Classes</h1>}
                  Campaigns
                  {localStorage.getItem("role") == 'T' &&
                    this.state.campaigns.map(campaign => {
                      console.log(campaign[0])
                      var date = new Date(campaign[3])
                      return <Campaign date={date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()} camp={campaign[0]} hours={campaign[1]} />
                    })
                  }
                  {/* <Campaign date={'10/2/2021'} camp={'River Cleanup'} hours={5}/> */}
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <label for="exampleFormControlSelect1">Select a Class</label>
                      <select class="form-select" id="exampleFormControlSelect1">
                        <option>Hannah's Class</option>
                        <option>Brent's Class</option>
                        <option>Anh's Class</option>
                      </select>
                </div>
                  <div class="row justify-content-between">
                    <div class="col-4" style={{position: 'relative'}}>
                      <img src={leaf} width="210" height="300" />
                    </div>
                    <div class="col-4" style={{position: 'relative'}}>
                      <img src={badge} width="200" height="250" />
                      
                    </div>
                  </div>
                </div>
                <div style={{position: 'relative'}} class="col-4">
                  Goals
                  <Goal date={"September 15, 2021"} description={"Helped by recycling goods at my school"}/>
                </div>
              </div>

              {localStorage.getItem("role") == 'T' && <Link to="/myClasses"><button type="submit" class="btn btn-primary">Manage Classes</button></Link>}
              {localStorage.getItem("role") == 'T' && <Link to="/createCampaign"><button type="submit" class="btn btn-primary">Create a Campaign</button></Link>}
              {localStorage.getItem("role") == 'S' && <Link to="/logWork"><button className="btn btn-primary">Log Work</button></Link>}
              {localStorage.getItem("role") == 'S' && <Link to="/createGoal"><button type="submit" class="btn btn-primary">Set a Goal</button></Link>}
              {/* <Link to="/myClasses"><button type="submit" class="btn btn-primary">Manage Classes</button></Link>
              <Link to="/logWork"><button className="btn btn-primary">Log Work</button></Link> */}
            </React.Fragment>
            </div>
        );
    }
}
 
export default Dashboard;