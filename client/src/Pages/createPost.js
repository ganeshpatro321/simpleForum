import React, { useState, useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%"
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const CreatePost = () => {
  const history = useHistory();
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const handleClose = e => {
      setError(false);
      history.push('/');
  }

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setContent('');
  }

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(user);
    const data = {
      userId: user._id,
      username: user.username,
      title,
      description,
      content
    };

    try {
      const response = await axios.post("http://ec2-3-23-128-253.us-east-2.compute.amazonaws.com:5000/api/post/createpost", data);
      if (response.status === 201) {
        setError("");
        setAlertMessage("Post created successfully!");
        handleClear();
      }
    } catch (e) {
      const message = e.response.data.message;
      console.log(message);
      setError("There were problems creating post");
    }
  };

  return (
    <Container component="main" maxWidth="md">
      {error ? (
        <div style={{marginTop: "15px"}}>
        <Alert severity="error">{error}.</Alert>
        </div>
      ) : null}
      {alertMessage ? (
        <div style={{marginTop: "15px"}}>
        <Alert
          action={
            <Button size="small" onClick={handleClose}>
              Go to feed
            </Button>
          }
          severity="success"
        >
          {alertMessage}
        </Alert>
        </div>
      ) : null}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create Post
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Post Title"
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            required
            fullWidth
            label="Description"
            autoFocus
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            id="standard-multiline-flexible"
            required
            fullWidth
            label="Content"
            multiline
            rows={6}
            autoFocus
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default CreatePost;
