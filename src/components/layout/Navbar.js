/*
    This component render the Main Navigation bar  and perform load user function if there is a token 
    stored in the browser  
 */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logout, loaduser } from "../../actions/authAction";
import { connect } from "react-redux";
import "../../css/navbar.css";
import logo from "../../img/UI/logo.png";

class Navbar extends Component {
  componentWillMount() {
    if (localStorage.getItem("token") !== null) {
      this.props.loaduser();
    }
  }
  onLogout = () => {
    this.props.logout();
  };

  render() {
    const { isAuthenticated } = this.props.authState;
    const { onLogout } = this;
    return (
      <div className="main-nav">
        <div className="logo">
          <ul>
            <li>
              <Link to="/">
                <img src={logo} alt="Logo" />
                &nbsp;HEAD PAGE
              </Link>
            </li>
          </ul>
        </div>
        <div className="right-nav">
          {!isAuthenticated ? (
            <ul>
              <li>
                <Link to="/login">Log in</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <a onClick={onLogout} href="/">
                  Log out
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authState: state.auth
});

export default connect(
  mapStateToProps,
  { logout, loaduser }
)(Navbar);
