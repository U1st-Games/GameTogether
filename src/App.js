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

var apiKey = "46617242";
var sessionId = "1_MX40NjYxNzI0Mn5-MTU4NTI3ODQ1MTU3NH43Rm84SWRBbkN2QWh5dkUyUGJMZWlPTE1-fg";
var token = "T1==cGFydG5lcl9pZD00NjYxNzI0MiZzaWc9ZGE0MGJmOThiMmM1MTQyMzFmOTUzZmY3Y2I3MmNlZjI0ZTQzYmYxMDpzZXNzaW9uX2lkPTFfTVg0ME5qWXhOekkwTW41LU1UVTROVEkzT0RRMU1UVTNOSDQzUm04NFNXUkJia04yUVdoNWRrVXlVR0pNWldsUFRFMS1mZyZjcmVhdGVfdGltZT0xNTg1Mjc4NDgwJm5vbmNlPTAuODQxMTM0Mzg4ODA3MTk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg3ODcwNDc5JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

function initializeSession(canvasElement) {
    var session = window.OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        }, handleError);
    });

    console.log('video track: ', canvasElement.captureStream(1).getVideoTracks()[0]);

    // Create a publisher
    var publisher = window.OT.initPublisher('publisher', {
        videoSource: canvasElement.captureStream(1).getVideoTracks()[0],
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(token, function(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });
}

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

/*
const gotRemoteStream = (e) => {
    attachMediaStream(remoteVideo, e.stream);
};

const gotAnswer = (desc) => {
    pc.setRemoteDescription(desc);
};

const gotOffer = (desc) => {
    pc.setLocalDescription(desc);
    sendOffer(desc);
};

const initRTCPeerConnection = () => {
    const pc = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
    pc.onAddStream = gotRemoteStream;

    pc.ondatachannel = event => {
        recieveChannel = event.channel;
        recieveChannel.onmessage = event => {
            console.log('')
        }
    }
};

 */


function App() {
  //react-mui
  const classes = useStyles();
  const classesCard = useStylesCard();

  //state
  const [userState, setUserState] = useState("");
  const [childCanvas, setChildCanvas] = useState(null);
    const [uid, setUid] = useState(null);

    //init
    useEffect(() => {
        /*
        var myIframe = document.getElementById('gameIframe');
        myIframe.addEventListener("load", function() {
            const canvasElement = myIframe.contentWindow.document.getElementById("c2canvas");
            setChildCanvas(_ => canvasElement);
            initializeSession(canvasElement);
        });
        */
        //setUid(uid());

        const canvasElement = document.getElementById("c2canvas");
    }, []);

  //router
  return (
          <>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                      Game Together
                  </Typography>
                </Toolbar>
              </AppBar>

              <Switch>
                <Route exact path="/">
                  <Container>
                      <iframe id="gameIframe" src={"/pacman-canvas/index.htm"} />
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
