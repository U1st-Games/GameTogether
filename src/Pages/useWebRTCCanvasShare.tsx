import {useEffect, useState, useRef} from 'react';
import {Socket} from "socket.io";
import { v4 as uuidv4 } from 'uuid';

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const setPeerConnectionId = (pc: PeerConnection, connectionId: string) => {
    pc.connectionId = connectionId;
};

const deepClone = (objectToClone: any) => JSON.parse(JSON.stringify(objectToClone));

function sendMessage(socket: Socket, message: string) {
    console.log('Client sending message: ', message);
    socket.emit('message', message);
}

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

const createMouseDataChannel = (pc: RTCPeerConnection) => {
    const mouseDc = pc.createDataChannel('mousePosition', {
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
};

const createKeypressDataChannel = (pc: RTCPeerConnection) => {
    //setup click data channel
    const clickDc = pc.createDataChannel('keyPress', {
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
};

const getPeerConnection = (peerConnections: RTCPeerConnection[], peerConnection: RTCPeerConnection, message: any) => {
    if(message.type === 'offer') {
        return peerConnection;
    }
};

const onDataChannelHandler = (myIframe: HTMLIFrameElement, cursor: Element) =>
    ({ channel }: { channel: any }) =>
    {
    channel.onmessage = (e: any) => {
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

//@ts-ignore
const handleIceCandidate = (socket: Socket, peerConnection: any) => (event:any) => {
    console.log('icecandidate event: ', event);
    if (event.candidate) {
        sendMessage(
            socket,
            //@ts-ignore
            {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            connectionId: peerConnection.connectionId,
        });
    } else {
        console.log('End of candidates.');
    }
};

//@ts-ignore
const handleRemoteStreamAdded = (remoteVideo: any) => (event: any) => {
    console.log('Remote stream added.');
    //@ts-ignore
    remoteVideo.srcObject = event.stream;
};

//@ts-ignore
const handleRemoteStreamRemoved = (event) => {
    console.log('Remote stream removed. Event: ', event);
};

const createPeerConnection = (
    socket: Socket,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLElement,
): PeerConnection | undefined => {
    try {
        const pc = new RTCPeerConnection();
        //@ts-ignore
        pc.connectionId = uuidv4();
        pc.onicecandidate = handleIceCandidate(socket, pc);
        //@ts-ignore
        pc.onaddstream = handleRemoteStreamAdded(remoteVideo);
        //@ts-ignore
        pc.onremovestream = handleRemoteStreamRemoved;
        pc.ondatachannel = onDataChannelHandler(myIframe, cursor);

        console.log('Created RTCPeerConnnection');
        //createMouseDataChannel(pc);
        //createKeypressDataChannel(pc);
        return pc as PeerConnection;
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
};

const getPeerConnectionById = (peerConnections: PeerConnection[], peerConnectionId: string) => {
    return peerConnections.find(pc => pc.connectionId === peerConnectionId);
};

const onCreateSessionDescriptionError = (error: any) => {
    console.log('Failed to create session description: ' + error.toString());
};

//@ts-ignore
const setLocalAndSendMessage = (pc: PeerConnection, socket: Socket) => (sessionDescription) => {
    pc?.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    let sessionDescriptionClone = deepClone(sessionDescription);
    sessionDescriptionClone.connectionId = pc?.connectionId;
    socket.emit(
        sessionDescription.type,
        sessionDescriptionClone,
    );
};

const handleCreateOfferError = (event: any) => {
    console.log('createOffer() error: ', event);
};

const doCall = (pc: PeerConnection, socket: Socket) => {
    console.log('Sending offer to peer');
    //@ts-ignore
    pc.createOffer(setLocalAndSendMessage(pc, socket), handleCreateOfferError);
};

const addPeerConnection = (
    peerConnections: PeerConnection[],
    socket: Socket,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLElement,
) => {
    const newPeerConnection = createPeerConnection(socket, myIframe, cursor, remoteVideo);
    if (newPeerConnection) {
        peerConnections.push(newPeerConnection);
    } else {
        console.error('unable to create new peer connection');
    }
};

const initHost = (
    socket: any,
    Start: any,
    peerConnections: PeerConnection[],
) => {
    socket.on('gotUserMedia', function() {
        Start();
    });
    socket.on('answer', function(message: any) {
        console.log('answer: ', message);
        peerConnections[0]?.setRemoteDescription(new RTCSessionDescription(message));
    });
};

const initGuest = (
    socket: any,
    peerConnections: any,
    pc: any,
    isStarted: any,
    doAnswer: any,
    myIframe: any,
    cursor: any,
    remoteVideo: any,
) => {
    addPeerConnection(peerConnections, socket, myIframe, cursor, remoteVideo);

    socket.on('offer', function(message: any) {
        console.log('offer message: ', message);
        setPeerConnectionId(peerConnections[0], message.connectionId);
        peerConnections[0]?.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
    });
};

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

    //This is so consumer can control when the hook starts
    const start = () => {
        if (!hasStart) {
            setHasStart(true);
        }
    };

    useEffect(() => {
        const cursor = document.querySelector('#' + remoteCursorId) as HTMLElement;
        const remoteVideo = document.querySelector('#' + remoteVideoId) as HTMLElement;
        const peerConnections: PeerConnection[] = [];

        if (hasStart && !hasInit) {
            setHasInit(true);

            const myIframe = document.getElementById(iframeId) as HTMLIFrameElement;

            const onIframeLoaded = () => {
                //@ts-ignore
                let socket = window.io.connect(socketUrl);


                const canvass = myIframe?.contentWindow?.document.getElementById('myCanvas');

                let localStream: MediaStream;

                let isChannelReady = false;
                let isInitiator = false;
                let isStarted = false;

                //Begin socket.io --------------------------------------------
                let room = roomid;


                if (!roomid) {
                    console.error('no roomid');
                    return;
                }

                socket.emit('create or join', room);
                //@ts-ignore
                console.log('Attempted to create or  join room', room);

                socket.on('created', function (room: string) {
                    console.log('Created room ' + room);
                    initHost(socket, Start, peerConnections);
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
                    initGuest(
                        socket,
                        peerConnections,
                        peerConnections[0],
                        isStarted,
                        doAnswer,
                        myIframe,
                        cursor,
                        remoteVideo,
                    );
                    isChannelReady = true;
                    setIsGuest(true);
                    socket.emit('gotUserMedia');
                });

                socket.on('log', function (array: any) {
                    console.log(array);
                });

                // This client receives a message
                //@ts-ignore
                socket.on('message', function (message) {
                    //@ts-ignore
                    console.log('Client received message:', message);
                    if (message.type === 'candidate' && isStarted) {
                        var candidate = new RTCIceCandidate({
                            sdpMLineIndex: message.label,
                            candidate: message.candidate,
                        });
                        const test = getPeerConnectionById(peerConnections, message.connectionId);
                        //debugger;
                        console.log('test', test);
                        getPeerConnectionById(peerConnections, message.connectionId)?.addIceCandidate(candidate);
                    } else if (message === 'bye' && isStarted) {
                        handleRemoteHangup();
                    }
                });
                //End socket.io -----------------------------------------------------------

                //@ts-ignore
                localStream = canvass.captureStream();
                console.log('Got stream from canvas');

                function Start() {
                    addPeerConnection(peerConnections, socket, myIframe, cursor, remoteVideo);
                    console.log('start: ', peerConnections[0]);

                    if(!isStarted) {
                        //@ts-ignore
                        peerConnections[0].addStream(localStream);
                        isStarted = true;
                        console.log('isInitiator', isInitiator);
                        doCall(peerConnections[0], socket);
                    }
                    if(isStarted) {
                        console.log('second call');
                    }
                }

                function doAnswer() {
                    console.log('Sending answer to peer.');
                    peerConnections[0]?.createAnswer()
                        .then(setLocalAndSendMessage(peerConnections[0], socket), onCreateSessionDescriptionError);
                }

                function hangup() {
                    console.log('Hanging up.');
                    stop();
                    sendMessage(socket, 'bye');
                }

                function handleRemoteHangup() {
                    console.log('Session terminated.');
                    stop();
                    isInitiator = false;
                }

                function stop() {
                    isStarted = false;
                    peerConnections[0]?.close();
                    //@ts-ignore
                    peerConnections[0] = null;
                }

                window.onbeforeunload = function () {
                    sendMessage(socket, 'bye');
                };

                return () => {
                    sendMessage(socket, 'bye');
                };
            };
            myIframe.addEventListener('load', onIframeLoaded);
        }
    }, [hasStart, hasInit]);
    return {isGuest, start};
};

export default useWebRTCCanvasShare;
