import React, { useState, useEffect } from 'react';
import './App.css';
import AuthContext from './Contexts/AuthContext';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import axios from "axios";


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
      <AuthContext.Provider value={{user, setUser, handleLogout}}>
        <Router>
          <Switch>
            <Route path="/" exact>
              HomePage
            </Route>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
