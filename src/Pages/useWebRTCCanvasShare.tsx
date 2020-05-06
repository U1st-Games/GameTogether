import {useEffect, useState, useRef} from 'react';

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

function click(x: number, y: number) {
    var ev = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: x,
        screenY: y,
    });

    var el = document.elementFromPoint(x, y);
    el?.dispatchEvent(ev);
}



interface Return {
    isGuest: boolean;
    start: () => void;
}

const useWebRTCCanvasShare = (
    iframeId: string,
    remoteCursorId: string,
    remoteVideoId: string,
    socketUrl: string,
    roomid: string,
    startOnLoad: boolean = true,
): Return => {
    const [hasInit, setHasInit] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [hasStart, setHasStart] = useState(startOnLoad);

    const start = () => {
        if (!hasStart) {
            setHasStart(true);
        }
    };

    useEffect(() => {
        if (hasStart && !hasInit) {
            setHasInit(true);
            var myIframe = document.getElementById(iframeId) as HTMLIFrameElement;
            myIframe.addEventListener('load', function () {
                const canvass = myIframe?.contentWindow?.document.getElementById('myCanvas');

                let remoteVideo = document.querySelector('#' + remoteVideoId);
                let cursor = document.querySelector('#' + remoteCursorId);

                let localStream: MediaStream;
                let remoteStream;

                var pc: RTCPeerConnection;
                var mouseDc: RTCDataChannel;
                var clickDc: RTCDataChannel;
                var keypressDc;

                const offerOptions = {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1,
                };

                let isChannelReady = false;
                let isInitiator = false;
                let isStarted = false;

                //Begin socket.io --------------------------------------------
                let room = roomid;
                //@ts-ignore
                let socket = window.io.connect(socketUrl);
                if (room !== '') {
                    socket.emit('create or join', room);
                    //@ts-ignore
                    console.log('Attempted to create or  join room', room);
                }

                socket.on('created', function (room: string) {
                    console.log('Created room ' + room);
                    isInitiator = true;
                });

                socket.on('full', function (room: string) {
                    console.log('Room ' + room + ' is full');
                });

                socket.on('join', function (room: string) {
                    console.log('Another peer made a request to join room ' + room);
                    console.log('This peer is the initiator of room ' + room + '!');
                    isChannelReady = true;
                });

                socket.on('joined', function (room: string) {
                    console.log('joined: ' + room);
                    isChannelReady = true;
                    setIsGuest(true);
                });

                socket.on('log', function (array: any) {
                    console.log(array);
                });

                function sendMessage(message: string) {
                    console.log('Client sending message: ', message);
                    socket.emit('message', message);
                }

                // This client receives a message
                //@ts-ignore
                socket.on('message', function (message) {
                    //@ts-ignore
                    console.log('Client received message:', message);
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
                            candidate: message.candidate,
                        });
                        pc.addIceCandidate(candidate);
                    } else if (message === 'bye' && isStarted) {
                        handleRemoteHangup();
                    }
                });
                //End socket.io -----------------------------------------------------------

                //@ts-ignore
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
                        //@ts-ignore
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
                        //@ts-ignore
                        pc = new RTCPeerConnection(null);
                        pc.onicecandidate = handleIceCandidate;
                        //@ts-ignore
                        pc.onaddstream = handleRemoteStreamAdded;
                        //@ts-ignore
                        pc.onremovestream = handleRemoteStreamRemoved;
                        pc.ondatachannel = ({channel}) => {
                            channel.onmessage = e => {
                                console.log(e.data);

                                if (channel.label === 'keyPress') {
                                    console.log('keyPress: ', e.data);

                                    //@ts-ignore
                                    function simulateKey(keyCode, type, modifiers) {
                                        var evtName = typeof type === 'string' ? 'key' + type : 'keydown';
                                        //@ts-ignore
                                        var modifier = typeof modifiers === 'object' ? modifier : {};

                                        //@ts-ignore
                                        var event = myIframe.contentWindow.document.createEvent('HTMLEvents');
                                        event.initEvent(evtName, true, false);
                                        //@ts-ignore
                                        event.keyCode = keyCode;

                                        for (var i in modifiers) {
                                            //@ts-ignore
                                            event[i] = modifiers[i];
                                        }
                                        //@ts-ignore
                                        myIframe.contentWindow.document.dispatchEvent(event);
                                    }

                                    if (e.data === '119') {
                                        //@ts-ignore
                                        simulateKey(38);
                                    }
                                    if (e.data === '97') {
                                        //@ts-ignore
                                        simulateKey(37);
                                    }
                                    if (e.data === '115') {
                                        //@ts-ignore
                                        simulateKey(40);
                                    }
                                    if (e.data === '100') {
                                        //@ts-ignore
                                        simulateKey(39);
                                    }
                                }
                                if (channel.label === 'mousePosition') {
                                    const split = e.data && e.data.split(',');
                                    //@ts-ignore
                                    cursor.style.left = split[0] + 'px';
                                    //@ts-ignore
                                    cursor.style.top = split[1] + 'px';
                                }
                            };
                        };
                        console.log('Created RTCPeerConnnection');

                        //Setup mouse data channel
                        mouseDc = pc.createDataChannel('mousePosition', {
                            ordered: false,
                            maxRetransmits: 0,
                        });
                        mouseDc.onerror = error => {
                            console.log('Data Channel Error:', error);
                        };
                        mouseDc.onmessage = event => {
                            console.log('Got Data Channel Message:', event.data);
                            const split = event.data && event.data.split(',');
                            //@ts-ignore
                            cursor.style.left = split[0];
                            //@ts-ignore
                            cursor.style.top = split[1];
                        };
                        mouseDc.onopen = () => {
                            mouseDc.send('Hello World!');
                            document.onmousemove = e => mouseDc.send(e.x + ',' + e.y);
                        };
                        mouseDc.onclose = () => {
                            console.log('The Data Channel is Closed');
                        };

                        //setup click data channel
                        clickDc = pc.createDataChannel('keyPress', {
                            ordered: false,
                            maxRetransmits: 0,
                        });
                        clickDc.onerror = error => {
                            console.log('Click Data Channel Error:', error);
                        };
                        clickDc.onmessage = event => {
                            console.log('Click Got Data Channel Message:', event.data);
                            const split = event.data && event.data.split(',');
                            click(split[0], split[1]);
                        };
                        clickDc.onopen = () => {
                            clickDc.send('Click Hello World!');
                        };
                        clickDc.onclose = () => {
                            console.log('Click The Data Channel is Closed');
                        };
                        document.onkeypress = function (e) {
                            //@ts-ignore
                            e = e || window.event;
                            // use e.keyCode
                            //@ts-ignore
                            clickDc.send(e.keyCode);
                        };
                        //@ts-ignore
                        document.onClick = e => clickDc.send(e.clientX + ',' + e.clientY);
                    } catch (e) {
                        console.log('Failed to create PeerConnection, exception: ' + e.message);
                        alert('Cannot create RTCPeerConnection object.');
                        return;
                    }
                }

                //@ts-ignore
                function handleIceCandidate(event) {
                    console.log('icecandidate event: ', event);
                    if (event.candidate) {
                        //@ts-ignore
                        sendMessage({
                            type: 'candidate',
                            label: event.candidate.sdpMLineIndex,
                            id: event.candidate.sdpMid,
                            candidate: event.candidate.candidate,
                        });
                    } else {
                        console.log('End of candidates.');
                    }
                }

                //@ts-ignore
                function handleCreateOfferError(event) {
                    console.log('createOffer() error: ', event);
                }

                function doCall() {
                    console.log('Sending offer to peer');
                    //@ts-ignore
                    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
                }

                function doAnswer() {
                    console.log('Sending answer to peer.');
                    pc.createAnswer().then(setLocalAndSendMessage, onCreateSessionDescriptionError);
                }

                //@ts-ignore
                function setLocalAndSendMessage(sessionDescription) {
                    pc.setLocalDescription(sessionDescription);
                    console.log('setLocalAndSendMessage sending message', sessionDescription);
                    sendMessage(sessionDescription);
                }

                //@ts-ignore
                function onCreateSessionDescriptionError(error) {
                    debugger;
                    //trace('Failed to create session description: ' + error.toString());
                }

                //@ts-ignore
                function handleRemoteStreamAdded(event) {
                    console.log('Remote stream added.');
                    remoteStream = event.stream;
                    //@ts-ignore
                    remoteVideo.srcObject = remoteStream;
                }

                //@ts-ignore
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
                    //@ts-ignore
                    pc = null;
                }

                window.onbeforeunload = function () {
                    sendMessage('bye');
                };

                return () => {
                    sendMessage('bye');
                };
            });
        }
    }, [ hasStart, hasInit ]);

    return { isGuest, start };
};

export default useWebRTCCanvasShare;
