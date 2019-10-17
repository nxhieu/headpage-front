/*
    This file contains all actions related to Comment feature. All these functions will return a function 
    with dispatch as an argument.  
 */

import {
  GETURI_FAIL,
  GET_COMMENT_REQUEST,
  GET_COMMENT_SUCCESS,
  GET_COMMENT_FAIL,
  CLOSE_COMMENT,
  CLEAR_COMMENT,
  DELETECOMMENT_SUCCESS,
  EDITCOMMENT_FAIL,
  EDITCOMMENT_SUCCESS,
  COMMENT_FAIL
} from "./types";
import store from "../../src/store";
import { postImage, editImage } from "./imageAction";

export const postComment = (postId, file, parentsId) => async dispatch => {
  try {
    postImage(file)(dispatch).then(async imageUrl => {
      //create new comment
      const res = await fetch(`${window.apiAddress}/comment/comment`, {
        method: "POST",
        body: JSON.stringify({
          imageUrl,
          postId: postId,
          parentsId: parentsId
        }),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-type": "application/json"
        }
      });
      const data = await res.json();

      if (res.status !== 200) {
        dispatch({ type: COMMENT_FAIL, payload: data });
      } else {
        //Clear the current comments inside the post
        dispatch({ type: CLEAR_COMMENT });
        //get all comments of a post back
        getComment(postId)(dispatch);
      }
    });
  } catch (error) {
    dispatch({ type: GETURI_FAIL, payload: error });
  }
};

export const getComment = postId => async dispatch => {
  try {
    dispatch({ type: GET_COMMENT_REQUEST });
    const res = await fetch(
      `${window.apiAddress}/comment/getCommentList?postId=${postId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    const data = await res.json();
    if (res.status !== 200) {
      dispatch({ type: COMMENT_FAIL, payload: data });
    } else {
      dispatch({ type: GET_COMMENT_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: GET_COMMENT_FAIL, payload: error });
  }
};

export const deleteComment = (commentId, postId) => async dispatch => {
  try {
    const res = await fetch(
      `${window.apiAddress}/comment/deleteComment?commentId=${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );

    // console.log(deleleCommentObject(commentId));
    const data = await res.json();
    if (res.status !== 201) {
      dispatch({ type: COMMENT_FAIL, payload: data });
    } else {
      const deletedComment = deleleCommentObject(commentId);
      dispatch({ type: DELETECOMMENT_SUCCESS, payload: deletedComment });
      // dispatch({ type: CLEAR_COMMENT });
      // getComment(postId)(dispatch);
    }
  } catch (error) {
    dispatch({ type: GETURI_FAIL, payload: error });
  }
};

export const editComment = (comment, file, postId) => async dispatch => {
  try {
    //edit image on s3 . use the new imageUrl to edit a new comment
    editImage(comment, file, "comment")(dispatch).then(async imageUrl => {
      const res = await fetch(`${window.apiAddress}/comment/editComment`, {
        method: "POST",
        body: JSON.stringify({ comment, imageUrl }),
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-type": "application/json"
        }
      });
      const data = await res.json();
      if (res.status !== 201) {
        dispatch({ type: COMMENT_FAIL, payload: data });
      } else {
        const updatedComments = editCommentObject(data.comment);
        dispatch({ type: CLEAR_COMMENT });
        dispatch({ type: EDITCOMMENT_SUCCESS, payload: updatedComments });
      }
    });
  } catch (error) {
    dispatch({ type: EDITCOMMENT_FAIL, payload: error });
  }
};

export const closeComment = () => dispatch => {
  dispatch({ type: CLOSE_COMMENT });
};

//Delete Comments on the store
function deleleCommentObject(commentId) {
  const comments = store.getState().comment.comments;

  let copyComment = Object.assign([], comments);
  function removeComment(commentId, copyComment) {
    for (let i in copyComment) {
      if (copyComment[i]._id === commentId) {
        copyComment.splice(i, 1);
        return copyComment;
      }
      if (copyComment[i].child && copyComment[i].child.length) {
        removeComment(commentId, copyComment[i].child);
      }
    }
  }
  removeComment(commentId, copyComment);
  return copyComment;
}

//Edit imageUrl on specific comment on the store
function editCommentObject(updatedComment) {
  const comments = store.getState().comment.comments;

  let copyComment = Object.assign([], comments);

  function editComment(commentId, copyComment) {
    for (let i in copyComment) {
      if (copyComment[i]._id === commentId) {
        copyComment[i].imageUrl = updatedComment.imageUrl;
        return copyComment;
      }
      if (copyComment[i].child && copyComment[i].child.length) {
        editComment(commentId, copyComment[i].child);
      }
    }
  }
  editComment(updatedComment._id, copyComment);
  return copyComment;
}
