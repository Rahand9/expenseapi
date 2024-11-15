import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//Browser router is a component from the react-router-dom library it enables your app to use routing 
// which means you can have multiple pages or views (like a login page, dashboard) in the react app.
// as Router this renames BrowserRouter to Router for simplicity 
// Route is a component from react-router-dom that defines which component should be shown when the URL matches a specific path (/login, /dashboard)
//Switch ensures that only one route is matched and displayed at a time. Without Switch, if two routes match the URL, they could both render.
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App;
// makes the app component the primary thing being exported from this file and it simplifies how you import it elsewhere in your project
//(meaning without the use of curly braces whie importing since we set it as default)