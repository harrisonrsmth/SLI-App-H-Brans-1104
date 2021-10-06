import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'
import { Api } from '../api';
import leaf from '../leaf.png';
import badge from '../award.png';
import Card from 'react-bootstrap/Card';

function Upcoming(props) {
    return (
      <div style={{position: 'relative', left: '15%'}}>
        <Card border="success" style={{ width: '18rem'}}>
        <Card.Header>{props.date}</Card.Header>
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

  function Recent(props) {
    return (
      <div style={{position: 'relative', left: '15%'}}>
        <Card border="warning" style={{ width: '18rem'}}>
        <Card.Header>{props.date}</Card.Header>
        <Card.Body>
          <Card.Title>{props.camp}</Card.Title>
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
            classes: []
        }
    }


    render() { 
        return (
            <div>
            <React.Fragment>
              <NavBar/>
              <h1>Dashboard</h1>
              <div class="row align-items-start">
                <div class="col-4">
                  Upcoming
                  <Upcoming date={'10/2/2021'} camp={'River Cleanup'} hours={5}/>
                </div>
                <div class="col-4">
                  Class Impact
                  <div class="row justify-content-between">
                    <div class="col-4" style={{position: 'relative', left: '-10%'}}>
                      <img src={leaf} width="210" height="300" />
                    </div>
                    <div class="col-4" style={{position: 'relative', left: '-15%'}}>
                      <img src={badge} width="200" height="250" />
                      
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  Recent Work
                  <Recent date={"September 15, 2021"} camp={"Recycling"} description={"Helped by recycling goods at my school"}/>
                </div>
              </div>

              <Link to="/myClasses"><button type="submit" class="btn btn-primary">Manage Classes</button></Link>
              <Link to="/logWork"><button className="btn btn-primary">Log Work</button></Link>
            </React.Fragment>
            </div>
        );
    }
}
 
export default Dashboard;