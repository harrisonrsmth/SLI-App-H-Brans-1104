import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    state = {}
    render() { 
        return (
        <React.Fragment>
            <h1>Seed and Lead Impact App</h1>
            <Link to="/login"><button className="btn btn-success m-2">Login</button></Link>
            <Link to="/createAccount"><button className="btn btn-primary">Create Account</button></Link>
        </React.Fragment>
        );
    }
}
 
export default Home;