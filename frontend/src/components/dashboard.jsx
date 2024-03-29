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
          {sessionStorage.getItem("role") == 'S' && <ProgressBar variant="success" animated now={props.progress}/>}
        </Card.Body>
        </Card><br />
      </div>
    );
  }

  function Goal(props) {
    return (
      <div style={{position: 'relative', left: '15%'}}>
        <Card border="primary" style={{ width: '18rem'}}>
        <Card.Header>Target: {props.date}</Card.Header>
        <Card.Body>
          <Card.Title> Complete {props.hours} hours by the target date.</Card.Title>
          <Card.Text>
           
          </Card.Text>
          <ProgressBar variant="success" animated now={props.completed}/>
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
            {props.description}<br></br>
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
            goalProgress: 0,
            "current_class": "",
            "recent_work": [],
            "message": "",
            goal_date: new Date("1900-12-01"),
            all_work: false,
            leaf: leaf00,
            badge: false,
            "total_hours": 0
        }
    }


    leafMapping = {0: leaf00, 5: leaf05, 10: leaf10, 15: leaf15, 20: leaf20, 25: leaf25, 30: leaf30, 35: leaf35, 40: leaf40, 45: leaf45, 50: leaf50, 55: leaf55, 60: leaf60, 65: leaf65, 70: leaf70, 75: leaf75, 80: leaf80, 85: leaf85, 90: leaf90, 95: leaf95, 100: leaf100};
    async componentDidMount() {
      if (sessionStorage.getItem("role") === "T") {
        await this.api.getCampaigns(this.state).then(data => {
          this.setState({campaigns: data.campaignList});
        })
      }

      if (sessionStorage.getItem("role") === "S") {
        await this.api.getProgress(this.state).then(data => {
          var campaigns_with_progress = [];
          for (let i = 0; i < data.progress.length; i++) {
            var camp = data.progress[i][0];
            var progress = data.progress[i][1][0];
            campaigns_with_progress[i] = [camp, progress]
          }
          console.log(campaigns_with_progress)
          this.setState({campaigns: campaigns_with_progress});
        })
      }

      this.api.getGoalProgress(this.state).then(data => {
        if (data.current_hours) {
            this.setState({goalProgress: data.current_hours})
        }
      })

      if (this.current_class !== "") {
        let form = {
          "role" : sessionStorage.getItem("role"),
          "username" : sessionStorage.getItem("username"),
          "current_class" : this.state.current_class
        }
        await this.api.getTotalHours(form).then(data => {
          let total = 0
          if (sessionStorage.getItem("role") === "T") {
            total = data.total_hours;
          } else {
            total = data.indiv_hours;
          }
          this.setState({total_hours: total})
          total *= 10;
          total = 5 * Math.round(total/5);
          if (total >= 100) {
            this.setState({leaf: this.leafMapping[100]});
            this.setState({badge: true});
          } else {
            this.setState({leaf: this.leafMapping[total]});
            this.setState({badge: false});
          }
        });
      } else {
        this.setState({leaf: this.leafMapping[0]});
        this.setState({badge: false});
      }
      

      await this.api.getGoal().then(data => {
        if (data.goal) {
          this.setState({goal: data.goal})
          this.state.goal_date = new Date(this.state.goal[1])
        }
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
      console.log(this.state)
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
                    sessionStorage.getItem("role") === "T" &&
                    this.state.campaigns.map(campaign => {
                      var date = new Date(campaign[3])
                      console.log(campaign)
                      var cp = <Campaign date={date.getUTCMonth() + 1 + '/' + date.getUTCDate()   + '/' + date.getUTCFullYear()} camp={campaign[0]} hours={campaign[1]}/>
                      return cp
                    })
                  }
                  {
                    sessionStorage.getItem("role") === "S" &&
                    this.state.campaigns.map(campaign => {
                      var date = new Date(campaign[0][3])
                      console.log(campaign)
                      return <Campaign date={date.getUTCMonth() + 1 + '/' + date.getUTCDate()   + '/' + date.getUTCFullYear()} camp={campaign[0][0]} hours={campaign[0][1]} progress={campaign[1][2]}/>
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

                  <div class="row justify-content-between" style={{paddingTop: "80px"}}>

                    <div id ="leaf" class="col-4" style={{position: 'relative'}}>
                      <div style={{position: 'absolute', bottom: '0'}}>
                        <img src={this.state.leaf} width="200"/>
                      </div>
                    </div>
                    <div class="col-4" style={{position: 'relative', left: '-15%'}}>
                      <div style={{width: 250, height: 250}}>
                        {this.state.badge && <img src={badge} width="250" height="250"/>}
                      </div>                      
                    </div>
                    <font>Complete 10 hours of work to earn a badge!</font>
                    <font>You currently have {this.state["total_hours"]}/10 hours!</font>
                  </div>
                </div>
                <div style={{position: 'relative'}} class="col-4">
                {sessionStorage.getItem("role") == 'T' && <font>Recent Work</font>}
                {sessionStorage.getItem("role") == 'T' &&
                    this.state.recent_work.map(recent => {
                    var date = new Date(recent[3])
                    return <RecentWork student={recent[0]} date={date.getUTCMonth() + 1 + '/' + date.getUTCDate() + '/' + date.getUTCFullYear()} name={recent[1]} hours={recent[4]} description={recent[5]} sdg={recent[2]}/>
                    })
                }
                {sessionStorage.getItem("role") == 'S' && <font>Current Goal</font>}
                {sessionStorage.getItem("role") == 'S' && (this.state.goal.length != 0) && <Goal date={this.state.goal_date.getUTCMonth() + 1 + '/' + this.state.goal_date.getUTCDate() + '/' + this.state.goal_date.getUTCFullYear()} hours={this.state.goal[0]} completed={(this.state.goalProgress / this.state.goal[0]) * 100}/>}
                </div>
              </div>
            </React.Fragment>
            </div>
        );
    }
}
 
export default Dashboard;