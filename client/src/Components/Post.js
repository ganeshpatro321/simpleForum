import React, { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    minWidth: 500,
    marginTop: theme.spacing(1),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function Post(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useContext(AuthContext);
  const open = Boolean(anchorEl);

  const data = props.data;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:5000/api/post/${data._id}`,
        { headers: { authorization: `${token}` } }
      );
      if (res.status !== 200) {
        setError("There were problems deleting this post. Try again later");
      } else {
        props.fetchPosts();
      }
    } catch (e) {
      console.log(e);
      setError("There were problems deleting this post. Try again later.");
    }
  };

  const handleUpVote = (e) => {
    e.preventDefault();
    props.upVote(data._id);
  };

  return (
    <div>
      {error ? (
        <div style={{ marginTop: "15px" }}>
          <Alert severity="error">{error}.</Alert>
        </div>
      ) : null}
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {data.username ? data.username.slice(0, 1) : ""}
            </Avatar>
          }
          action={
            <div>
              {user && data.userId === user._id ? (
                <div>
                  <IconButton aria-label="settings" onClick={handleMenu}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "bottom",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "bottom",
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </div>
              ) : (
                <div />
              )}
            </div>
          }
          title={data.title}
          subheader={data.createdAt.slice(0, 10)}
        />
        <Typography variant="body2" color="textSecondary" component="p">
          {data.username}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {data.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={handleUpVote}>
            <FavoriteIcon />
          </IconButton>{" "}
          {data.likecount}
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>{data.content}</CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
