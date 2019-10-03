import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import request from "superagent";
import debounce from "lodash.debounce";
import { connect } from "react-redux";
import { BlogpostEdit } from "./BlogpostEdit";
import { getPosts, increasePage } from "../../../actions/postAction";
import Blogpost from "./Blogpost";
import loading from "../../../img/UI/loading.gif";
import "../../../dist/css/main.css";

export class Blogposts extends Component {
  constructor(props) {
    super(props);

    // Sets up our initial state
    // this.state = {
    //   error: false,
    //   hasMore: true,
    //   isLoading: false,
    //   posts: []
    // };

    // Binds our scroll event handler
    window.onscroll = debounce(() => {
      const { error, isLoading, hasMore } = this.props.postState;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 2
      ) {
        this.props.increasePage();
        this.loadPosts();
      }
    }, 1000);
  }

  componentWillMount() {
    // Loads some users on initial load
    this.loadPosts();
  }

  loadPosts = () => {
    const { currentPage } = this.props.postState;
    this.props.getPosts(currentPage);
  };

  render() {
    const { error, hasMore, posts, isLoading } = this.props.postState;

    return (
      <div class="blogposts">
        <h1>{}</h1>
        {posts.map(post => (
          <Fragment>
            <Blogpost key={post._id} post={post} />
          </Fragment>
        ))}

        {error && <div style={{ color: "#900" }}>{error}</div>}
        {this.props.postState.isLoading && (
          <div className="loading">
            <h4>Loading More Posts...</h4>
            <img src={loading} width="80" />
          </div>
        )}
        {!this.props.postState.hasMore && <div>No more posts.</div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  postState: state.post,
  authState: state.auth
});

export default connect(
  mapStateToProps,
  { getPosts, increasePage }
)(Blogposts);
