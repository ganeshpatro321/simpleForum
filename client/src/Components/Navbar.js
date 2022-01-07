import React, { useContext } from "react";
import AuthContext from "../Contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  navbar: {
    backgroundColor: "#942e6b"
  },
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
  },

}));

export default function Navbar() {
  const history = useHistory();
  const { user, handleLogout } = useContext(AuthContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [createPostError, setCreatePostError] = React.useState(false);
  const open = Boolean(anchorEl);
  const logout = () => {
    handleClose();
    handleLogout();
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCreatePostError(false);
  };

  const handleLogin = () => {
    handleClose();
    history.push("/auth/login");
  };

  const handleTitleClick = () => {
    history.push('/');
  }

  const handleRegister = () => {
    handleClose();
    history.push("/auth/register");
  };

  const handleCreatePost = () => {
    if (user) {
        history.push("/createpost");
    } else {
        setCreatePostError(true);
    }
  };

  const handleOpenMyPosts = () => {
    if (user) {
      history.push("/posts")
    }
  }

  return (
    <div className={classes.root}>
      {createPostError ? <Alert
        action={
          <Button size="small" onClick={handleLogin}>
            Login here.
          </Button>
        }
        severity="error"
      >
        You must be logged in to create a post
      </Alert> : null}
      <AppBar position="static" classes={{root: classes.navbar}}>
        <Toolbar>
          
            <Button color="inherit" disableFocusRipple disableRipple onClick={handleTitleClick} className={classes.title}>
            <Typography variant="h6">
            Simple Forum
            </Typography>
            </Button>
          
          {user ? (
            <div>
              <Button color="inherit" onClick={handleOpenMyPosts}>
            My Posts
            </Button>
            </div>
          ): <div />}
          <Button color="inherit" onClick={handleCreatePost}>
            Create Post
          </Button>
          {user ? (
            <div>
              <Button onClick={handleMenu} color="inherit">
                {user.username}
              </Button>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Button onClick={handleMenu} color="inherit">
                Account
              </Button>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogin}>Login</MenuItem>
                <MenuItem onClick={handleRegister}>Register</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>        
      </AppBar>
    </div>
  );
}
