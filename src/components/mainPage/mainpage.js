/*
    userpage component displays a list of posts
    This component implement infinitescroll with debounce function. That deplays the loading to one second (avoid exhausting database)
    Each time user scrolls to the bottom, they will get 10 posts. 
    url: /
*/

import React, { Fragment, Component } from "react";
import Leaderboard from "./leaderboard/Leaderboard";
import Blogposts from "./post/Blogposts";
import Createpost from "./post/createpost/createPost";
import Welcome from "./welcome/Welcome";
import { connect } from "react-redux";
import { loaduser } from "../../actions/authAction";
import PropTypes from "prop-types";
import "../../css/main.css";
import "../../css/leaderboard.css";
import "../../css/userPage.css";

class Mainpage extends Component {
  render() {
    return (
      <Fragment>
        <div className="userPage">
          <div className="blogpost-leaderboard">
            <div className="blogpost-column">
              {this.props.authState.isAuthenticated && <Createpost />}

              <Blogposts userId={this.props.authState.userId} />
            </div>
            <div className="leaderboard-column">
              <div className="welcome">
                <Welcome />
              </div>
              <Leaderboard />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

Mainpage.propTypes = {
  authState: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authState: state.auth
});

export default connect(
  mapStateToProps,
  { loaduser }
)(Mainpage);
