import React, { useState, useEffect } from "react";
import "./App.css";
import AuthContext from "./Contexts/AuthContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import CreatePost from "./Pages/createPost";
import Feed from "./Pages/Feed";
import MyPosts from "./Pages/MyPosts";
import { PostStoreProvider } from "./Contexts/PostContext";

function App() {
  const [user, setUser] = useState(null);
  const [isInitiated, setIsInititated] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get( `${process.env.REACT_APP_BACKEND_URL}/auth/init`, {
      headers: { Authorization: `${token}` },
    });
    const { user } = response.data;
    setUser(user);
    setIsInititated(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.setItem("token", null);
  };

  return (
    <div className="App">
      {isInitiated && (
        <AuthContext.Provider value={{ user, setUser, handleLogout }}>
          <Router>
            <Navbar />
            <Switch>
              <Route path="/" exact>
                <PostStoreProvider>
                  <Feed />
                </PostStoreProvider>
              </Route>

              <Route path="/auth/login">
                {!user ? <Login /> : <Redirect to="/" />}
              </Route>
              <Route path="/auth/register">
                {!user ? <Register /> : <Redirect to="/" />}
              </Route>
              <Route path="/createpost">
                {user ? <CreatePost /> : <Redirect to="/" />}
              </Route>
              <Route path="/posts">
                {user ? (
                  <PostStoreProvider>
                    <MyPosts />
                  </PostStoreProvider>
                ) : (
                  <Redirect to="/unauthorized" />
                )}
              </Route>
              <Route
                path="/unauthorized"
                render={() => <p>Access Denied! :(</p>}
              />
            </Switch>
          </Router>
        </AuthContext.Provider>
      )}
    </div>
  );
}

export default App;
