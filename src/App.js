import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import styled from 'styled-components';
import uid from 'uid';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Container } from './Shared';

import Home from './Pages/Home';
import GameRoom from './Pages/GameRoom';

import './App.css';

const InnerContainer = styled.div`
    max-width: 480px;
    width: 100%;
`;

//Call related components
const CallContainer = styled.div`
    width: 100%;
    height: calc(100% - 64px);
`;

const CallContainerLeft = styled.div`
  width: 100%;
  height: 100%;
  
  & > div {
    height: 100%;
  }
`;

const Gap = styled.div`
    width: 100%;
    height: 10px;
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
          <>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                      Game Together
                  </Typography>
                    <Switch>
                        <Route exact path="/gameroom/:gamename">
                            {`Invite others with this link: ${window.location}`}
                        </Route>
                    </Switch>
                </Toolbar>
              </AppBar>

              <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
              <Route exact path="/gameroom/:gamename">
                  <GameRoom />
              </Route>
              </Switch>
          </>
  );
}


const AppWrapper = () => (
    <Router>
      <App/>
    </Router>
);

export default AppWrapper;
