import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './navbar'

class Dashboard extends React.Component {
    render() { 
        return (
            <div>
            <React.Fragment>
              <NavBar/>
              <h1>Dashboard</h1>
              <Link to="/createClass"><button type="submit" class="btn btn-primary">Create a Class</button></Link>
            </React.Fragment>
            </div>
        );
    }
}
 
export default Dashboard;