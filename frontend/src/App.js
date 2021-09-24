import logo from './logo.svg';
import React from 'react';
import './App.css';
import Home from './components/home';
import CreateAccount from './components/createAccount';
import Login from './components/login';
import Dashboard from './components/dashboard';
import CreateClass from './components/createClass';
import logWork from './components/logWork';
import { Route, Link , Switch} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
      <Route path="/createAccount" component={CreateAccount} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/createClass" component={CreateClass} />
      <Route path="/logWork" component={logWork} />
      <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
