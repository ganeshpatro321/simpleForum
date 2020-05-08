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
  const [toggle, setToggle] = useState(false);
  const classes = useStyles();
  const {user} = useContext(AuthContext);

  const posts = store.posts.data;

  useEffect(() => {
    init();
  }, [toggle]);

  const upVote = async (id) => {
      const data = {id};
      setToggle(!toggle);
      if(!user){
          setError("You must be logged in to upVote");
      }
      try {
          await axios.post("api/post/upVote", data);
          setError(null);
      } catch (e) {
          console.log(e);
          setError("There were problems upvoting the post");
      }
  }

  const init = async () => {
    try {
      const posts = await axios.get("api/post/getposts");
      dispatch({ type: "UPDATE_POSTS", payload: posts });
    } catch (e) {
      console.log(e);
      setError("There were problems fetching posts. Try again later.");
    }
  };

  return (
    <Container component="main" maxwidth="md">
    {error ? (
        <div style={{marginTop: "15px"}}>
        <Alert severity="error">{error}.</Alert>
        </div>
      ) : null}
      <CssBaseline />
      <div className={classes.paper}>
        {posts && posts.length != 0 ? (
          posts.map(post => <Post data={post} upVote={upVote} />)
        ) : (
          <div>There are no posts available</div>
        )}
      </div>
    </Container>
  );
}
