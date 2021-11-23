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
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>
            {props.description}
          </Card.Text>
          <ProgressBar variant="success" animated now={60}/>
        </Card.Body>
        </Card><br />
      </div>
    );
  }

  function RecentWork(props) {
    return (
      <div style={{position: 'relative', left: '15%'}}>
        <Card border="primary" style={{ width: '18rem'}}>
        <Card.Header>{props.student}: {props.date}</Card.Header>
        <Card.Body>
          <Card.Title>{props.name}: {props.hours} hours</Card.Title>
          <Card.Text>
            {props.description}
            {props.sdg}
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
            goal: [],
            "current_class": "",
            "recent_work": [],
            "message": "",
            all_work: false
        }
    }

    async componentDidMount() {
      await this.api.getCampaigns(this.state).then(data => {
        this.setState({campaigns: data.campaignList});
      })

      await this.api.getGoal().then(data => {
        this.setState({goal: data.goal})
      })

      await this.api.getClasses().then(data => {
        if (data.classes) {
          this.setState({classes: data.classes})
        }
      })
      await this.api.getRecentWork(this.state).then(data => {
        if (data.recent_work) {
          this.setState({recent_work: data.recent_work})
          this.setState({message: ""})
        } else if (data.message) {
          this.setState({recent_work: []})
          this.setState({message: data.message})
        } else {
          this.setState({recent_work: []})
          this.setState({message: ""})
        }
      })
      return true;
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
                      console.log(campaign[0] + "here");
                      var date = new Date(campaign[3])
                      return <Campaign date={date.getMonth() + 1 + '/' + (date.getDate() + 1)  + '/' + date.getFullYear()} camp={campaign[0]} hours={campaign[1]} />
                    })
                  }
                </div>
                <div class="col-4">
                  <div class="form-group">
                  {sessionStorage.getItem("role") == 'T' && <label>Select a Class</label>}
                  {sessionStorage.getItem("role") == 'T' && <select class="form-select" id="class-selecter" onChange={async(e) => {
                        this.state["current_class"] = e.target.value
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
                      </select>}
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
                {sessionStorage.getItem("role") == 'T' && <font>Recent Work</font>}
                        {sessionStorage.getItem("role") == 'T' &&
                          this.state.recent_work.map(recent => {
                            // console.log(myClass[0]);
                            var date = new Date(recent[3])
                            return <RecentWork student={recent[0]} date={date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()} name={recent[1]} hours={recent[4]} description={recent[5]} sdg={recent[2]}/>
                          })
                        }
                  {sessionStorage.getItem("role") == 'T' && this.state.message > 0 && <font>Recent Work</font>}
                        {"\n\n" && this.state.message}
                  {sessionStorage.getItem("role") == 'S' && <font>Current Goal</font>}
                  {sessionStorage.getItem("role") == 'S' && <Goal date={"Target: 12/31/2021"} title={"Log 10 hours"}/>}
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