/*
GameTogether © Copyright, Nang Development Limited 2020. All Rights Reserved.
The authors, being Leon Talbert have asserted their moral rights.
 */

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Home from './Pages/Home';
import GameRoom from './Pages/GameRoom';

import './App.css';

const MainContainer = styled.div`
      background: url(https://wallpaperaccess.com/full/242332.jpg) no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  
  height: 100%;
  width: 100%;
`;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const useStylesCard = makeStyles({
  root: {
    maxWidth: 480,
  },
  media: {
    width: "100%",
    maxWidth: 480
  },
});

function App() {
  //react-mui
  const classes = useStyles();
  const classesCard = useStylesCard();

  //state
  const [userState, setUserState] = useState("");
  const [childCanvas, setChildCanvas] = useState(null);
    const [uid, setUid] = useState(null);

  //router
  return (
          <MainContainer>
              <AppBar position="static" style={{ backgroundColor: 'black' }}>
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                      Game Together
                  </Typography>
                    <Switch>
                        <Route exact path="/:roomid/:gamename/">
                            {`Invite others with this link: ${window.location}`}
                        </Route>
                    </Switch>
                </Toolbar>
              </AppBar>

              <Switch>
                  <Route exact path="/">
                      <Home />
                  </Route>
                  <Route path="/:roomid">
                      <GameRoom />
                  </Route>
              </Switch>
          </MainContainer>
  );
}


const AppWrapper = () => (
    <Router>
      <App/>
    </Router>
);

export default AppWrapper;
