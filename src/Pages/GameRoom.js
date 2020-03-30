import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    useParams,
} from "react-router-dom";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

var apiKey = "46617242";
var sessionId = "1_MX40NjYxNzI0Mn5-MTU4NTI3ODQ1MTU3NH43Rm84SWRBbkN2QWh5dkUyUGJMZWlPTE1-fg";
var token = "T1==cGFydG5lcl9pZD00NjYxNzI0MiZzaWc9ZGE0MGJmOThiMmM1MTQyMzFmOTUzZmY3Y2I3MmNlZjI0ZTQzYmYxMDpzZXNzaW9uX2lkPTFfTVg0ME5qWXhOekkwTW41LU1UVTROVEkzT0RRMU1UVTNOSDQzUm04NFNXUkJia04yUVdoNWRrVXlVR0pNWldsUFRFMS1mZyZjcmVhdGVfdGltZT0xNTg1Mjc4NDgwJm5vbmNlPTAuODQxMTM0Mzg4ODA3MTk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg3ODcwNDc5JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

const Container = styled.div`
    width: 100vw;
    height: calc(100% - 64px);
    display: flex;
`;

const MainArea = styled.div`
    flex: 1;
`;

const SideBar = styled.div`
    width: 300px;
    position: relative;
`;

const Mouse = styled.img`
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
`;

function click(x, y)
{
    var ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    var el = document.elementFromPoint(x, y);

    el.dispatchEvent(ev);
}

const GameRoom = () => {
    const { gamename } = useParams();
    const [ isGuest, setIsGuest ] = useState(false);

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

        //const canvass = document.querySelector('canvas');
        var myIframe = document.getElementById('gameIframe');
        myIframe.addEventListener("load", function() {
            const canvass = myIframe.contentWindow.document.getElementById("myCanvas");

            let localVideo = document.querySelector('#localVideo');
            let remoteVideo = document.querySelector('#remoteVideo');
            let cursor = document.querySelector('#remoteCursor');

            let localStream;
            let remoteStream;

            var pc;
            var mouseDc;
            var clickDc;
            var keypressDc;

            const offerOptions = {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            };

            let isChannelReady = false;
            let isInitiator = false;
            let isStarted = false;


            function customLog(message) {

            }

            //Begin socket.io --------------------------------------------
            let room = 'foo';
            let socket = window.io.connect('https://rust-sandpaper.glitch.me');
            if (room !== '') {
                socket.emit('create or join', room);
                customLog('Attempted to create or  join room', room);
            }

            socket.on('created', function(room) {
                customLog('Created room ' + room);
                isInitiator = true;
            });

            socket.on('full', function(room) {
                customLog('Room ' + room + ' is full');
            });

            socket.on('join', function (room){
                customLog('Another peer made a request to join room ' + room);
                customLog('This peer is the initiator of room ' + room + '!');
                isChannelReady = true;
            });

            socket.on('joined', function(room) {
                customLog('joined: ' + room);
                isChannelReady = true;
                setIsGuest(true);
            });

            socket.on('log', function(array) {
                customLog(array)
            });

            function sendMessage(message) {
                console.log('Client sending message: ', message);
                socket.emit('message', message);
            }

// This client receives a message
            socket.on('message', function(message) {
                customLog('Client received message:', message);
                if (message === 'got user media') {
                    maybeStart();
                } else if (message.type === 'offer') {
                    if (!isInitiator && !isStarted) {
                        maybeStart();
                    }
                    pc.setRemoteDescription(new RTCSessionDescription(message));
                    doAnswer();
                } else if (message.type === 'answer' && isStarted) {
                    pc.setRemoteDescription(new RTCSessionDescription(message));
                } else if (message.type === 'candidate' && isStarted) {
                    var candidate = new RTCIceCandidate({
                        sdpMLineIndex: message.label,
                        candidate: message.candidate
                    });
                    pc.addIceCandidate(candidate);
                } else if (message === 'bye' && isStarted) {
                    handleRemoteHangup();
                }
            });
            //End socket.io -----------------------------------------------------------

            const stream = canvass.captureStream();
            console.log('Got stream from canvas');

            localStream = stream;
            //localVideo.srcObject = stream;
            sendMessage('got user media');
            if (isInitiator) {
                maybeStart();
            }

            function maybeStart() {
                console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
                if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
                    console.log('>>>>>> creating peer connection');
                    createPeerConnection();
                    pc.addStream(localStream);
                    isStarted = true;
                    console.log('isInitiator', isInitiator);
                    if (isInitiator) {
                        doCall();
                    } else {

                    }
                }
            }

            function createPeerConnection() {
                try {
                    pc = new RTCPeerConnection(null);
                    pc.onicecandidate = handleIceCandidate;
                    pc.onaddstream = handleRemoteStreamAdded;
                    pc.onremovestream = handleRemoteStreamRemoved;
                    pc.ondatachannel = ({channel}) => {
                        channel.onmessage = e => {
                            console.log(e.data);

                            if(channel.label === 'keyPress') {
                                console.log('keyPress: ', e.data);

                                // var keyboardEvent = document.createEvent("KeyboardEvent");
                                // var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
                                // keyboardEvent[initMethod](
                                //     "keypress", // event type: keydown, keyup, keypress
                                //     true,      // bubbles
                                //     true,      // cancelable
                                //     window,    // view: should be window
                                //     false,     // ctrlKey
                                //     false,     // altKey
                                //     false,     // shiftKey
                                //     false,     // metaKey
                                //     e.data,        // keyCode: unsigned long - the virtual key code, else 0
                                //     0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
                                // );
                                // document.dispatchEvent(keyboardEvent);


                                function simulateKey (keyCode, type, modifiers) {
                                    var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
                                    var modifier = (typeof(modifiers) === "object") ? modifier : {};

                                    var event = myIframe.contentWindow.document.createEvent("HTMLEvents");
                                    event.initEvent(evtName, true, false);
                                    event.keyCode = keyCode;

                                    for (var i in modifiers) {
                                        event[i] = modifiers[i];
                                    }

                                    myIframe.contentWindow.document.dispatchEvent(event);
                                }

                                simulateKey(39);

                                myIframe.contentWindow.document.dispatchEvent(
                                    new KeyboardEvent(
                                        'keydown',
                                        {key: 'ArrowRight'}
                                        )
                                );
                            }
                            if(channel.label === 'mousePosition') {
                                const split = e.data && e.data.split(',');
                                cursor.style.left = split[0] + 'px';
                                cursor.style.top = split[1] + 'px';
                            }
                        }
                    };
                    console.log('Created RTCPeerConnnection');

                    //Setup mouse data channel
                    mouseDc = pc.createDataChannel(
                        'mousePosition',
                        {
                            ordered: false,
                            maxRetransmits: 0
                        }
                    );
                    mouseDc.onerror = (error) => {
                        console.log("Data Channel Error:", error);
                    };
                    mouseDc.onmessage = (event) => {
                        console.log("Got Data Channel Message:", event.data);
                        const split = event.data && event.data.split(',');
                        cursor.style.left = split[0];
                        cursor.style.top = split[1];
                    };
                    mouseDc.onopen = () => {
                        mouseDc.send("Hello World!");
                        document.onmousemove = e => mouseDc.send(e.x + "," + e.y);
                    };
                    mouseDc.onclose = () => {
                        console.log("The Data Channel is Closed");
                    };

                    //setup click data channel
                    clickDc = pc.createDataChannel(
                        'keyPress',
                        {
                            ordered: false,
                            maxRetransmits: 0
                        }
                    );
                    clickDc.onerror = (error) => {
                        console.log("Click Data Channel Error:", error);
                    };
                    clickDc.onmessage = (event) => {
                        console.log("Click Got Data Channel Message:", event.data);
                        const split = event.data && event.data.split(',');
                        click(split[0], split[1]);
                    };
                    clickDc.onopen = () => {
                        clickDc.send("Click Hello World!");
                    };
                    clickDc.onclose = () => {
                        console.log("Click The Data Channel is Closed");
                    };
                    document.onkeypress = function (e) {
                        e = e || window.event;
                        // use e.keyCode
                        clickDc.send(e.keyCode);
                    };
                    document.onClick = e => clickDc.send(e.clientX + "," + e.clientY);
                } catch (e) {
                    console.log('Failed to create PeerConnection, exception: ' + e.message);
                    alert('Cannot create RTCPeerConnection object.');
                    return;
                }
            }

            function handleIceCandidate(event) {
                console.log('icecandidate event: ', event);
                if (event.candidate) {
                    sendMessage({
                        type: 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
                } else {
                    console.log('End of candidates.');
                }
            }

            function handleCreateOfferError(event) {
                console.log('createOffer() error: ', event);
            }

            function doCall() {
                console.log('Sending offer to peer');
                pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
            }

            function doAnswer() {
                console.log('Sending answer to peer.');
                pc.createAnswer().then(
                    setLocalAndSendMessage,
                    onCreateSessionDescriptionError
                );
            }

            function setLocalAndSendMessage(sessionDescription) {
                pc.setLocalDescription(sessionDescription);
                console.log('setLocalAndSendMessage sending message', sessionDescription);
                sendMessage(sessionDescription);
            }

            function onCreateSessionDescriptionError(error) {
                debugger;
                //trace('Failed to create session description: ' + error.toString());
            }

            function handleRemoteStreamAdded(event) {
                console.log('Remote stream added.');
                remoteStream = event.stream;
                remoteVideo.srcObject = remoteStream;
            }

            function handleRemoteStreamRemoved(event) {
                console.log('Remote stream removed. Event: ', event);
            }

            function hangup() {
                console.log('Hanging up.');
                stop();
                sendMessage('bye');
            }

            function handleRemoteHangup() {
                console.log('Session terminated.');
                stop();
                isInitiator = false;
            }

            function stop() {
                isStarted = false;
                pc.close();
                pc = null;
            }

            window.onbeforeunload = function() {
                sendMessage('bye');
            };

            return () => {
                sendMessage('bye');
            }
        });
        //const canvasElement = document.getElementById("c2canvas");
    }, []);

    console.log('gamename: ', gamename);

    return (
        <Container>
            <MainArea>
                <iframe
                    id={'gameIframe'}
                    src={`/${gamename}/index.html`} width={"100%"} height={"100%"}
                    style={{ display: isGuest ? 'none' : 'initial', border: 'none' }}
                />
                {/*<video id={"localVideo"} autoPlay muted playsInline/>*/}
                <video id={"remoteVideo"} autoPlay muted playsInline/>
            </MainArea>
            <SideBar>
                <OTSession apiKey={apiKey} sessionId={sessionId} token={token}>
                    <OTPublisher />
                    <OTStreams>
                        <OTSubscriber />
                    </OTStreams>
                </OTSession>
            </SideBar>
            <Mouse src="/mouse.png" id="remoteCursor" />
        </Container>
    );
};

export default GameRoom;
