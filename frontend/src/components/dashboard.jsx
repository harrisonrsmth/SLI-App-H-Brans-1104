import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Dashboard extends React.Component {
    render() { 
        return (
        <React.Fragment>
          <h1>Dashboard</h1>
          <Link to="/createClass"><button type="submit" class="btn btn-primary">Create a Class</button></Link>
        </React.Fragment>
        );
    }
}
 
export default Dashboard;