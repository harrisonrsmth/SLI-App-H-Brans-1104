import logo from './logo.svg';
import React from 'react';
import './App.css';
import Home from './components/home';
import CreateAccount from './components/createAccount';
import Login from './components/login';
import Dashboard from './components/dashboard';
import CreateClass from './components/createClass';
import { Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Home} />
      <Route exact path="/createAccount" component={CreateAccount} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/createClass" component={CreateClass} />
    </div>
  );
}

export default App;
