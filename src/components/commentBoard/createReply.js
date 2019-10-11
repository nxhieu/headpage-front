import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../dist/comment/createComment.css";

class CreateReply extends Component {
  render() {
    return (
      <div className="comment">
        <form onSubmit={this.props.onSubmit}>
          <div className="row">
            {this.props.email ? (
              <span>Comment as {this.props.email}</span>
            ) : (
              <span>Please log in to comment</span>
            )}
            {this.props.email ? (
              <input
                id="reply_uploadFile"
                type="file"
                accept="image/*"
                onChange={this.props.onChange}
              />
            ) : null}
            {this.props.email ? (
              <label htmlFor="reply_uploadFile">
                <i className="addimage"></i>
                &nbsp; Choose a Image
              </label>
            ) : null}
          </div>
          <div className="row">
            {this.props.replyfileUrl && <img src={this.props.replyfileUrl} />}
          </div>
          {this.props.replyfileUrl && (
            <div className="row">
              <input type="submit" value="Reply" />
            </div>
          )}
        </form>
      </div>
    );
  }
}

CreateReply.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  replyfileUrl: PropTypes.string,
  email: PropTypes.string.isRequired
};

export default CreateReply;
