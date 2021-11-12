import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar';
import { Api } from '../api';
import leaf00 from '../leaf00.png';
import leaf05 from '../leaf05.png';
import leaf10 from '../leaf10.png';
import leaf15 from '../leaf15.png';
import leaf20 from '../leaf20.png';
import leaf25 from '../leaf25.png';
import leaf30 from '../leaf30.png';
import leaf35 from '../leaf35.png';
import leaf40 from '../leaf40.png';
import leaf45 from '../leaf45.png';
import leaf50 from '../leaf50.png';
import leaf55 from '../leaf55.png';
import leaf60 from '../leaf60.png';
import leaf65 from '../leaf65.png';
import leaf70 from '../leaf70.png';
import leaf75 from '../leaf75.png';
import leaf80 from '../leaf80.png';
import leaf85 from '../leaf85.png';
import leaf90 from '../leaf90.png';
import leaf95 from '../leaf95.png';
import leaf100 from '../leaf100.png';
import badge from '../SLbadge.png';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card';

function Campaign(props) {
    return (
      <div style={{position: 'relative', left: '15%'}}>
        <Card border="success" style={{ width: '18rem'}}>
        <Card.Header>{props.date}</Card.Header>
        <Card.Body>
          <Card.Title>{props.camp}</Card.Title>
          <Card.Text>
            You have a total of {props.hours} hours to complete.
          </Card.Text>
          <ProgressBar variant="success" animated now={50}/>
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
          <Card.Title>{props.camp}</Card.Title>
          <Card.Text>
            {props.description}
          </Card.Text>
          <ProgressBar variant="success" animated now={30}/>
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
            classes: []
        }
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
                  <Campaign date={'10/2/2021'} camp={'River Cleanup'} hours={5}/>
                </div>
                <div class="col-4">
                  Class Impact
                  <div class="row justify-content-between">
                    <div class="col-4" style={{position: 'relative', left: '-10%'}}>
                      <img src={leaf100} width="200" height="250"/>
                    </div>
                    <div class="col-4" style={{position: 'relative', left: '-15%'}}>
                      <img src={badge} width="250" height="250" />
                      
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  Goals
                  <Goal date={"September 15, 2021"} camp={"Recycling"} description={"Helped by recycling goods at my school"}/>
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