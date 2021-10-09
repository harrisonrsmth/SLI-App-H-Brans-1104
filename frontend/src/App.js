import React from 'react';
import './App.css';
import Home from './components/home';
import CreateAccount from './components/createAccount';
import Login from './components/login';
import Dashboard from './components/dashboard';
import CreateClass from './components/createClass';
import MyClasses from './components/myClasses';
import ForgotPassword from './components/forgotPassword';
import { Route, Link , Switch} from "react-router-dom";
import AddStudentToClass from './components/addStudentToClass';
//import Card from 'react-bootstrap/Card'

function App() {
  return (
    <div className="App">
      <Switch>
      <Route path="/createAccount" component={CreateAccount} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/createClass" component={CreateClass} />
      <Route path="/myClasses" component={MyClasses} />
      <Route path="/addStudent" component={AddStudentToClass} />
      <Route path="/forgotPassword" component={ForgotPassword} />
      <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
