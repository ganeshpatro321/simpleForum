import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePostStore } from "../Contexts/PostContext";
import Post from "../Components/Post";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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
  const classes = useStyles();

  useEffect(() => {
    init();
  }, []);

  const posts = store.posts.data;

  const init = async () => {
    try {
      const posts = await axios.get("api/post/getposts");
      dispatch({ type: "UPDATE_POSTS", payload: posts });
    } catch (e) {
      console.log(e);
      setError("There were problems fetching posts. Try again later.");
    }
  };

  console.log(posts);
  return (
    <Container component="main" maxwidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        {posts && posts.length != 0 ? (
          posts.map(post => <Post data={post} />)
        ) : (
          <div>There are no posts available</div>
        )}
      </div>
    </Container>
  );
}
