import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../Contexts/AuthContext";
import { usePostStore } from "../Contexts/PostContext";
import Post from "../Components/Post";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";


const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

export default function Feed() {
  const [store, dispatch] = usePostStore();
  const [error, setError] = useState(null);
  const [switchAlert, setSwitchAlert] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [switched, setSwitched] = useState(0);
  const classes = useStyles();
  const {user} = useContext(AuthContext);

  const posts = store.posts.data;

  const onFocus = () => {
    console.log('Tab is in focus');
    if(switched > 0){
      setSwitchAlert(true);
    }
  };
  
  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    console.log('Tab is blurred');
    setSwitched(switched + 1);
  };
  

  useEffect(() => {
    init();
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    }
  }, [toggle, switched]);

  const upVote = async (id) => {
      const data = {id};
      setToggle(!toggle);
      if(!user){
          setError("You must be logged in to like a post");
      }
      try {
          await axios.post("http://ec2-3-23-128-253.us-east-2.compute.amazonaws.com:5000/api/post/upVote", data);
          setError(null);
      } catch (e) {
          console.log(e);
          setError("There were problems upvoting the post");
      }
  }

  const init = async () => {
    try {
      const posts = await axios.get("http://ec2-3-23-128-253.us-east-2.compute.amazonaws.com:5000/api/post/getposts");
      dispatch({ type: "UPDATE_POSTS", payload: posts });
    } catch (e) {
      console.log(e);
      setError("There were problems fetching posts. Try again later.");
    }
  };

  return (
    <Container component="main" maxwidth="md">
    {switchAlert ? (
      <div style={{marginTop: "15px"}}>
      <Alert severity="error">You have switched tabs {switched} times. You will be disqualified if you continue.</Alert>
      </div>
    ): null}
    {error ? (
        <div style={{marginTop: "15px"}}>
        <Alert severity="error">{error}.</Alert>
        </div>
      ) : null}
      <CssBaseline />
      <div className={classes.paper}>
        {posts && posts.length !== 0 ? (
          posts.map(post => <Post data={post} upVote={upVote} />)
        ) : (
          <div>There are no posts available</div>
        )}
      </div>
    </Container>
  );
}
