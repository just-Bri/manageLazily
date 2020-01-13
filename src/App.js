import React, { useContext } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import Login from './components/Account/Login';

import SignUp from './components/Account/SignUp';
import NewProject from './components/NewProject/NewProject';
import ProjectView from './components/ProjectView/ProjectView';
import LandingPage from './routes/LandingPage/LandingPage';
import PrivateRoute from './services/PrivateRoute';
import { AuthContext } from './services/Auth.js';
// import NewJob from "./components/NewJob/NewJob";

// import { auth } from "./services/firebase";
// import FirebaseContext from "./services/context";
// import db from "./services/firebase";

const App = props => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <Router>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <PrivateRoute exact path="/dashboard" component={() => <Dashboard user={currentUser} />} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={SignUp} />

          <Route exact path="/new_project" render={props => <NewProject {...props} />} />
          {/* <Route
            exact
            path="/new_job"
            render={props => <NewJob {...props} />}
          /> */}
          <Route exact path="/project/:id" component={props => <ProjectView id={props.match.params.id} />} />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
