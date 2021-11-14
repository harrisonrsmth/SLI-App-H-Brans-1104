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
        <Card.Header>Due: {props.date}</Card.Header>
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
        <Card border="primary" style={{ width: '18rem'}}>
        <Card.Header>{props.date}</Card.Header>
        <Card.Body>
          <Card.Title>Goal</Card.Title>
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
            classes: [],
            campaigns: [],
            goal: [],
            "currentClass": "",
            recent_work: [],
            all_work: true
        }
    }

    componentDidMount() {
      this.api.getCampaigns(this.state).then(data => {
        console.log(this.state)
        this.state["campaigns"] = data.campaignList;
        console.log(data.campaignList)
        console.log(this.state.campaigns)
      })

      this.api.getGoal().then(data => {
        this.setState({goal: data.goal})
      })

      this.api.getClasses().then(data => {
        if (data.classes) {
          this.setState({classes: data.classes})
        }
      })
      console.log(this.state.classes)

      this.api.getRecentWork(this.state).then(data => {
        if (data.recent_work) {
          this.setState({recent_work: data.recent_work})
        }
      })
    }
    
    render() { 
        return (
            <div>
            <React.Fragment>
              <NavBar/>
              <h1>Dashboard</h1>
              <div class="row align-items-start">
                <div class="col-4">
                <font>
                  Campaigns                
                </font>
                  {
                    this.state.campaigns.map(campaign => {
                      // console.log(campaign[0])
                      var date = new Date(campaign[3])
                      return <Campaign date={date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()} camp={campaign[0]} hours={campaign[1]} />
                    })
                  }
                </div>
                <div class="col-4">
                  <div class="form-group">
                    <label>Select a Class</label>
                      <select class="form-select" onChange={e => {
                        this.state["currentClass"] = e.target.value
                        console.log(this.state)
                        this.componentDidMount()
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
                </div>
                  <div class="row justify-content-between">

                    <div id ="leaf" class="col-4">
                      <img src={leaf100} width="200" height="250"/>
                    </div>
                    <div class="col-4" style={{position: 'relative', left: '-15%'}}>
                      <img src={badge} width="250" height="250" />
                      
                    </div>
                  </div>
                </div>
                <div style={{position: 'relative'}} class="col-4">
                  Goals
                  <Goal date={"Target: 11/25/2021"} description={"Helped by recycling goods at my school"}/>
                </div>
              </div>
              {/* <Link to="/myClasses"><button type="submit" class="btn btn-primary">Manage Classes</button></Link>
              <Link to="/logWork"><button className="btn btn-primary">Log Work</button></Link> */}
            </React.Fragment>
            </div>
        );
    }
}
 
export default Dashboard;