import React, { Component } from "react";
import Downshift from "downshift";
import EditModal from "./editpost/editmodal";
import { connect } from "react-redux";
import HamburgerButton from "./HamburgerButton";
import { deletePost } from "../../../actions/postAction";
import PropTypes from "prop-types";

//https://medium.com/@AmyScript/downshift-the-answer-to-building-accessible-and-visually-flexible-custom-react-input-components-aed1553e1e36

export class BlogpostEdit extends Component {
  state = {
    create: false
  };
  createEventHandler = () => {
    this.setState({ create: !this.state.create });
  };

  deletePost = e => {
    e.preventDefault();
    this.props.deletePost(this.props.post);
  };

  render() {
    return (
      <Downshift>
        {({ getMenuProps, getToggleButtonProps, isOpen }) => (
          <div className="blogpost-edit">
            <button
              {...getToggleButtonProps()}
              className="blogpost-edit-button"
            >
              <HamburgerButton />
            </button>
            {this.state.create && (
              <EditModal
                key={this.props.post}
                onClose={this.createEventHandler}
                post={this.props.post}
              ></EditModal>
            )}
            {isOpen && this.props.authState.userId === this.props.post._user ? (
              <ul className="edit-button-menu" {...getMenuProps()}>
                <li onClick={this.createEventHandler}>Edit</li>

                <li onClick={this.deletePost}>Delete</li>
              </ul>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

BlogpostEdit.propTypes = {
  post: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  postState: state.post,
  authState: state.auth
});

export default connect(
  mapStateToProps,
  { deletePost }
)(BlogpostEdit);
