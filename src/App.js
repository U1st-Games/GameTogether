import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import styled from 'styled-components';

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

import './App.css';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    overflow-y: auto;
`;

const InnerContainer = styled.div`
    max-width: 480px;
    width: 100%;
`;

const Gap = styled.div`
    width: 100%;
    height: 10px;
`;

const Img = styled.img`
    width: 300px;
    height: 270px;
    border-radius: 50%;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: space-between;
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

const initVideoCall = () => {
  //opentok
  const apiKey = '45828062';
  const sessionId = '2_MX40NTgyODA2Mn5-MTU4NTAwNTU4OTU1NH5RUW9ReTVqdHB6Ym9NN0pXM3crcW1NQ1R-UH4';
  const token = 'T1==cGFydG5lcl9pZD00NTgyODA2MiZzaWc9MTc2Y2Q4NzdmOGM0NGNhYTBhMDQxZDEyZTY4YWI3OWU3NzAwMzBkMDpzZXNzaW9uX2lkPTJfTVg0ME5UZ3lPREEyTW41LU1UVTROVEF3TlRVNE9UVTFOSDVSVVc5UmVUVnFkSEI2WW05Tk4wcFhNM2NyY1cxTlExUi1VSDQmY3JlYXRlX3RpbWU9MTU4NTAwNTY0NCZub25jZT0wLjQwOTU4ODg4MzU0OTc1NjUzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1ODUwOTIwNDQ=';
  var session = window.OT.initSession(apiKey, sessionId);
  var publisher = window.OT.initPublisher();
  session.connect(token, function(err) {
  });
  session.publish(publisher);
  session.on('streamCreated', function(event) {
    session.subscribe(event.stream);
  });
};

function App() {
  //react-mui
  const classes = useStyles();
  const classesCard = useStylesCard();

  //state
  const [userState, setUserState] = useState("");

  //countdown
  const [currentCount, setCount] = useState(3);
  const [numberColor, setNumberColor] = useState('red');
  useEffect(() => {
    (function loop() {
      setTimeout(function () {
        setCount(currentCount => currentCount - 1);
        setNumberColor(() => 'green');
        setTimeout(function () {
          setNumberColor(() => 'red');
        }, 2000);

        if (currentCount < 1) {
          return;
        }
        loop();
      }, 2000);
    }());
  }, []);

  //router
  const history = useHistory();

  return (
          <Router>
            <div>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                      Confinement Mental Health
                  </Typography>
                </Toolbar>
              </AppBar>

              <Switch>
                <Route path="/">
                  <Container>

                    <Link to="/queue" onClick={() => setUserState("doctor")}>
                    <Card className={classesCard.root}>
                        <CardActionArea>
                          <CardContent>
                            <img
                                src="/doctor.png"
                                style={{width: "300px"}}
                            />
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <Button size="small" color="primary">
                            Volunteer to help
                          </Button>
                        </CardActions>
                      </Card>
                    </Link>

                    <Link to="/queue" onClick={() => setUserState("user")}>
                      <Card className={classesCard.root}>
                        <CardActionArea>
                          <CardContent>
                            <img
                                src="/patient.png"
                                style={{width: "300px"}}
                            />
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <Button size="small" color="primary">
                            Get help
                          </Button>
                        </CardActions>
                      </Card>
                    </Link>

                  </Container>
                </Route>

                <Route path="/queue">
                  <Container>
                    <Typography variant="h6" gutterBottom id="scrollTarget">
                      You are number
                    </Typography>
                      <Typography variant="h1" component="h2" style={{color: numberColor}}>
                        {currentCount}
                      </Typography>
                      <Typography variant="h6" gutterBottom id="scrollTarget">
                        in the queue. When it reaches zero click the join button!
                      </Typography>
                      <Button
                          size="small"
                          color="primary"
                          disabled={currentCount > 0}
                          onClick={() => {
                            history.push("/call");
                            initVideoCall();
                          }}
                      >
                        Join call
                      </Button>
                      <Gap/>
                      <Gap/>
                      <Gap/>
                  </Container>
                </Route>

                <Route path="/call">
                  <Container>
                    <InnerContainer>

                    </InnerContainer>
                  </Container>
                </Route>

                <Route path="/provider">
                  <Container>
                    <InnerContainer>

                    </InnerContainer>
                  </Container>
                </Route>

                <Route path="/user">
                  <Container>
                    <InnerContainer>

                    </InnerContainer>
                  </Container>
                </Route>

              </Switch>
            </div>
          </Router>
  );
}

export default App;
