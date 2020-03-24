import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import styled from 'styled-components';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

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
    height: calc(100% - 64px);
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    overflow-y: auto;
`;

const QueueContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 64px);
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    overflow-y: auto;
    flex-direction: column;
`;

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
const CallContainerRight = styled.div`
  height: 100%;
  width: 240px;
`;

const ChatContainer = styled.div`

`;

const SendMessageContainer = styled.div`

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

const Queue = () => {
  const history = useHistory();

  //countdown
  const [currentCount, setCount] = useState(3);

  useEffect(() => {
      if (currentCount < 1) {
          return;
      }

      setTimeout(function () {
          setCount(currentCount => currentCount - 1);
      }, 2000);

  },[ currentCount ]);

  return (
      <QueueContainer>
        <Typography variant="h6" gutterBottom id="scrollTarget">
          You are number
        </Typography>
        <Typography variant="h1" component="h2">
          {currentCount}
        </Typography>
        <Typography variant="h6" gutterBottom id="scrollTarget">
          in the queue.
        </Typography>
          <Typography variant="h6" gutterBottom id="scrollTarget">
              When it reaches zero click the join button!
          </Typography>
        <Button
            variant="contained"
            color="primary"
            disabled={currentCount > 0}
            onClick={() => {
              history.push("/call");
            }}
        >
          Join call
        </Button>
        <Gap/>
        <Gap/>
        <Gap/>
      </QueueContainer>
  );
}

function App() {
  //react-mui
  const classes = useStyles();
  const classesCard = useStylesCard();

  //state
  const [userState, setUserState] = useState("");

  //router

  return (
          <>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                      Confinement Mental Health
                  </Typography>
                </Toolbar>
              </AppBar>

              <Switch>
                <Route exact path="/">
                  <Container>
                    <Link to="/queue" onClick={() => setUserState("doctor")}>
                    <Card className={classesCard.root} style={{marginRight: '60px'}}>
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
                  <Queue />
                </Route>

                <Route path="/call">
                  <CallContainer>
                    <CallContainerLeft id={"CallContainerLeft"}>
                      <OTSession
                          style={{ width: '100%', height: '100%'}}
                          apiKey="45828062"
                          sessionId="2_MX40NTgyODA2Mn5-MTU4NTAwNTU4OTU1NH5RUW9ReTVqdHB6Ym9NN0pXM3crcW1NQ1R-UH4"
                          token="T1==cGFydG5lcl9pZD00NTgyODA2MiZzaWc9MTc2Y2Q4NzdmOGM0NGNhYTBhMDQxZDEyZTY4YWI3OWU3NzAwMzBkMDpzZXNzaW9uX2lkPTJfTVg0ME5UZ3lPREEyTW41LU1UVTROVEF3TlRVNE9UVTFOSDVSVVc5UmVUVnFkSEI2WW05Tk4wcFhNM2NyY1cxTlExUi1VSDQmY3JlYXRlX3RpbWU9MTU4NTAwNTY0NCZub25jZT0wLjQwOTU4ODg4MzU0OTc1NjUzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1ODUwOTIwNDQ="
                      >
                        <OTPublisher style={{ width: '100%', height: '100%'}} />
                        <OTStreams>
                          <OTSubscriber />
                        </OTStreams>
                      </OTSession>
                    </CallContainerLeft>
                  </CallContainer>
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
          </>
  );
}

const AppWrapper = () => (
    <Router>
      <App/>
    </Router>
);

export default AppWrapper;
