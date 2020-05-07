import React, { useState, useEffect } from 'react';
import './App.css';
import AuthContext from './Contexts/AuthContext';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import axios from "axios";
import Navbar from './Components/Navbar';
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";


function App() {
  const [user, setUser] = useState(null);
  const [isInitiated, setIsInititated] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get('/api/auth/init', {params: {token}});
    const {user} = response.data;
    setUser(user);
    setIsInititated(true);
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.setItem("token", null);
  }

  return (
    <div className="App">
      {isInitiated && (
      <AuthContext.Provider value={{user, setUser, handleLogout}}>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact>
            </Route>
            <Route path="/auth/login">
              {!user ? <Login/> : <Redirect to="/"/>}
            </Route>
            <Route path="/auth/register">
              {!user ? <Register/> : <Redirect to="/"/>}
            </Route>
          </Switch>
        </Router>
      </AuthContext.Provider>
      )}
    </div>
  );
}

export default App;
