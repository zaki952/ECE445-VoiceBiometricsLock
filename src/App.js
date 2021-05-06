import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar.js'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './Components/Home/Home.js'
import Lock from './Components/Lock/Lock.js'
import Setup from './Components/Setup/Setup.js'
import Unlock from './Components/Unlock/Unlock.js'
import React, {Component} from 'react'




class App extends Component {
  render() {
  return (
    
    <Router>
      <Navbar />
      <Switch>
          <Route path = '/' exact component = {Home} />
          <Route path = '/lock' exact component = {Lock} />
          <Route path = '/setup' exact component = {Setup} />
          <Route path = '/unlock' exact component = {Unlock} />
          </Switch>
      </Router>
      
  );
}
}
export default App;
