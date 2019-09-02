import React, { Fragment, Component } from "react";
import Calendar from 'react-calendar';
import AnalogClock, { Themes } from 'react-analog-clock'; //https://github.com/zackargyle/react-analog-clock

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "./navigation/home"
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Posts from "./components/post/posts";
import Blogpost from "./components/layout/Blogpost";
import Leaderboard from "./components/layout/Leaderboard";
import PrivateRoute from "./route/PrivateRoute";
import { Provider } from "react-redux";
import store from "./store";
import "./dist/css/main.css";

class App extends Component {

  state = {
    date: new Date(),
  }
 
  onChange = date => this.setState({ date })

  render() {
    return (
      <Provider store={store}>
        {console.log(store.getState().auth.isAuthenticated)}
        <Router basename={'/'}>
          <Fragment>
            <Navbar />
            <Switch>
              <Route
                exact
                path="/post"
                component={Home}
                render={() =>
                  !store.getState().auth.isAuthenticated ? (
                    <Redirect to="/login" />
                  ) : (
                    <Posts />
                  )
                }
              />
              {/* <Route exact path="/Card" component={Card} /> */}

              <Route exact path="/register" component={Register} />
              <Route
                exact
                path="/login"
                render={() =>
                  !store.getState().auth.isAuthenticated ? (
                    <Login />
                  ) : (
                    <Redirect to="/Card" />
                  )
                }
              />
            </Switch>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
