import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../Contexts/AuthContext";
import { usePostStore } from "../Contexts/PostContext";
import Post from "../Components/Post";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function MyPosts() {
  const [store, dispatch] = usePostStore();
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState(false);
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const myPosts = store.myPosts.data;

  const init = React.useCallback (async () => {
    try{
      const userId = user._id;
      const token = localStorage.getItem('token');
      const myPosts = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/getPosts/${userId}`, {
          headers : {
              authorization: `${token}`
          }
      } );
      dispatch({ type: "UPDATE_MY_POSTS", payload: myPosts})
    } catch (e) {
        console.log(e);
        setError("There were problems fetching your posts. Please try again later.")
    }
}, [dispatch, user._id]);

  useEffect(() => {
      init();
  }, [toggle, init]);

  const upVote = async (id) => {
    const data = { id };
    setToggle(!toggle);
    if (!user) {
      setError("You must be logged in to like a post");
    } else {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/upVote`, data);
        setError(null);
      } catch (e) {
        console.log(e);
        setError("There were problems upvoting the post");
      }
    }
  }

  return (
    <Container component="main" maxwidth="md">
    {error ? (
      <div style={{ marginTop: "15px" }}>
        <Alert severity="error">{error}.</Alert>
      </div>
    ) : null}
    <CssBaseline />
    <div className={classes.paper}>
      {myPosts && myPosts.length !== 0 ? (
        myPosts.map(post => <Post data={post} upVote={upVote} key={post._id} fetchPosts={init}/>)
      ) : (
        <div>There are no posts available</div>
      )}
    </div>
  </Container>
  );
}
