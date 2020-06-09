import { Socket } from 'socket.io';
import {v4 as uuidv4} from "uuid";
import {getPeerConnectionById, stop} from "../webRTCHelpers";

type SetIsStarted = (nextIsStarted: boolean) => void;
type SetIsInitiator = (nextIsInitiator: boolean) => void;
type SetIsChannelReady = (nextIsChannelReady: boolean) => void;

let socket: any;

// WASD = 87, 65, 83, 68
// arrow keys = 37, 38, 39, 40
const clientKeyMap = {
    87: 38,
    65: 37,
    83: 40,
    68: 39
}

const setPeerConnectionId = (pc: PeerConnection, connectionId: string) => {
    pc.connectionId = connectionId;
};

const deepClone = (objectToClone: any) => JSON.parse(JSON.stringify(objectToClone));


type sendKeypressFn = (name: string, keyCode: number, dataChannel: RTCDataChannel) => void;
const sendKeypress: sendKeypressFn = (name, keyCode, dataChannel) => {
    try {
        dataChannel.send(
            JSON.stringify({
                name,
                keyCode,
            })
        );
    } catch (e) {
        console.error('Failed to send keypress: ', e);
    }
};

const sendKeypressToAllGuests = (peerConnections: PeerConnection[], name: string, keyCode: number) => {
    peerConnections.map(pc => {
        sendKeypress(name, keyCode, pc.dataChannel);
    });
};

export function sendMessage(socket: Socket, message: any, roomid: string) {
    console.log('Client sending message: ', message);
    socket.emit('message', roomid, message);
}

//@ts-ignore
const handleIceCandidate = (socket: Socket, peerConnection: any, roomid: string) => (event: any) => {
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
            },
            roomid
        );
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
const handleRemoteStreamRemoved = event => {
    console.log('Remote stream removed. Event: ', event);
};

const hostDataChannelHandler = (
    myIframe: HTMLIFrameElement,
    cursor: Element,
    updateGameLog: UpdateGameLog,
    peerConnections: PeerConnection[]
) => ({channel}: { channel: any }) => {
    channel.onmessage = (e: any) => {
        console.log('onDataChannelHandler: ', e.data);

        if (channel.label === 'keyPress') {
            console.log('keyPress: ', e.data);

            const keypressData = JSON.parse(e.data);
            const recievedKeycode = keypressData.keyCode;

            updateGameLog(keypressData.name + ' pressed: ' + recievedKeycode);
            sendKeypressToAllGuests(peerConnections, keypressData.name, recievedKeycode);

            //@ts-ignore
            function simulateKey(keyCode, type, modifiers) {
                console.log('simulate key');
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

            if (recievedKeycode in clientKeyMap) {
                //@ts-ignore
                simulateKey(clientKeyMap[recievedKeycode])
            }
        }
        if (channel.label === 'mousePosition') {
            // const split = e.data && e.data.split(',');
            // //@ts-ignore
            // cursor.style.left = split[0] + 'px';
            // //@ts-ignore
            // cursor.style.top = split[1] + 'px';
        }
    };
};

const onDataChannelHandler = (myIframe: HTMLIFrameElement, cursor: Element, updateGameLog: UpdateGameLog) => ({
                                                                                                                  channel,
                                                                                                              }: {
    channel: any;
}) => {
    channel.onmessage = (e: any) => {
        console.log('onDataChannelHandler: ', e.data);

        if (channel.label === 'keyPress') {
            console.log('keyPress: ', e.data);
            const keypressData = JSON.parse(e.data);
            updateGameLog(keypressData.name + ' pressed ' + keypressData.keyCode);
        }
        if (channel.label === 'mousePosition') {
            // const split = e.data && e.data.split(',');
            // //@ts-ignore
            // cursor.style.left = split[0] + 'px';
            // //@ts-ignore
            // cursor.style.top = split[1] + 'px';
        }
    };
};

const normalizeMousePosition = (displayElement: HTMLCanvasElement | HTMLVideoElement, mouseEvent: MouseEvent) => {
    const displayElementWidth = displayElement.offsetWidth;
    const displayElementHeight = displayElement.offsetHeight;

    const normalizedWidth = mouseEvent.clientX / displayElementWidth;
    const normalizedHeight = mouseEvent.clientY / displayElementHeight;

    console.log('mouseEvent: ', mouseEvent);
    console.log('mouseEventX: ', mouseEvent.clientX);
    console.log('mouseEventY: ', mouseEvent.clientY);

    // console.log('one: ', displayElementWidth);
    // console.log('two: ', displayElementHeight);
    // console.log('three: ', normalizedWidth);
    // console.log('four: ', normalizedHeight);
    // console.log('five: ', displayElement);
    return {normalizedWidth, normalizedHeight};
};

const createDataChannel = (
    pc: RTCPeerConnection,
    canvas: HTMLCanvasElement,
    videoElement: HTMLVideoElement,
    isHost: boolean,
    updateGameLog: UpdateGameLog
) => {
    //setup click data channel
    const keyDataChannel = pc.createDataChannel('keyPress', {
        ordered: false,
        maxRetransmits: 0,
    });
    keyDataChannel.onerror = error => {
        console.log('Key Data Channel Error:', error);
    };
    keyDataChannel.onopen = () => {
        keyDataChannel.send('Key Hello World!');
    };
    keyDataChannel.onclose = () => {
        console.log('Key The Data Channel is Closed');
    };
    //@ts-ignore
    // document.onclick = e => {
    //   console.log('onClick');
    //   try {
    //     keyDataChannel.send(e.clientX + ',' + e.clientY);
    //   } catch (e) {
    //     console.error('failed to send click');
    //   }
    // };

    const mousePositionDataChannel = pc.createDataChannel('mousePosition', {
        ordered: false,
        maxRetransmits: 0,
    });
    mousePositionDataChannel.onerror = error => {
        console.log('Mouse position Data Channel Error:', error);
    };
    mousePositionDataChannel.onopen = () => {
        mousePositionDataChannel.send('Mouse position Hello World!');
    };
    mousePositionDataChannel.onclose = () => {
        console.log('Mouse position The Data Channel is Closed');
    };
    if (isHost) {
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            try {
                mousePositionDataChannel.send(JSON.stringify(normalizeMousePosition(canvas, e)));
            } catch (e) {
                console.error('failed to send mouse position');
            }
        });
    } else {
        videoElement.addEventListener('mousemove', e => {
            try {
                mousePositionDataChannel.send(JSON.stringify(normalizeMousePosition(videoElement, e)));
            } catch (e) {
                console.error('failed to send mouse position');
            }
        });
    }

    return keyDataChannel;
};

const createPeerConnection = (
    socket: Socket,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLVideoElement,
    roomid: string,
    canvas: HTMLCanvasElement,
    isHost: boolean,
    updateGameLog: UpdateGameLog,
    peerConnections: PeerConnection[]
): PeerConnection | undefined => {
    try {
        console.log('createPeerConnection');
        const pc = new RTCPeerConnection() as PeerConnection;
        //@ts-ignore
        pc.connectionId = uuidv4();
        pc.onicecandidate = handleIceCandidate(socket, pc, roomid);
        //@ts-ignore
        pc.onaddstream = handleRemoteStreamAdded(remoteVideo);
        //@ts-ignore
        pc.onremovestream = handleRemoteStreamRemoved;

        if (isHost) {
            pc.ondatachannel = hostDataChannelHandler(myIframe, cursor, updateGameLog, peerConnections);
        } else {
            pc.ondatachannel = onDataChannelHandler(myIframe, cursor, updateGameLog);
        }

        console.log('Created RTCPeerConnnection');
        //createMouseDataChannel(pc);
        pc.dataChannel = createDataChannel(pc, canvas, remoteVideo, isHost, updateGameLog);
        return pc as PeerConnection;
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
};

const onCreateSessionDescriptionError = (error: any) => {
    console.log('Failed to create session description: ' + error.toString());
};

//@ts-ignore
const setLocalAndSendMessage = (pc: PeerConnection, socket: Socket, roomid: string) => sessionDescription => {
    pc?.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    let sessionDescriptionClone = deepClone(sessionDescription);
    sessionDescriptionClone.connectionId = pc?.connectionId;
    socket.emit(sessionDescription.type, roomid, sessionDescriptionClone);
};

const handleCreateOfferError = (event: any) => {
    console.log('createOffer() error: ', event);
};


const addPeerConnection = (
    peerConnections: PeerConnection[],
    socket: Socket,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLVideoElement,
    roomid: string,
    canvas: HTMLCanvasElement,
    isHost: boolean,
    updateGameLog: UpdateGameLog
) => {
    const newPeerConnection = createPeerConnection(
        socket,
        myIframe,
        cursor,
        remoteVideo,
        roomid,
        canvas,
        isHost,
        updateGameLog,
        peerConnections
    );
    if (newPeerConnection) {
        peerConnections.push(newPeerConnection);
    } else {
        console.error('unable to create new peer connection');
    }
};

const doCall = (pc: PeerConnection, socket: Socket, roomid: string) => {
    console.log('Sending offer to peer');
    //@ts-ignore
    pc.createOffer(setLocalAndSendMessage(pc, socket, roomid), handleCreateOfferError);
};


type StartFn = (
    setIsStarted: (arg0: boolean) => void,
    peerConnections: PeerConnection[],
    socket: any,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLVideoElement,
    roomid: string,
    canvas: HTMLCanvasElement,
    localStream: MediaStream,
    updateGameLog: UpdateGameLog
) => void;

const Start: StartFn = (
    setIsStarted,
    peerConnections,
    socket,
    myIframe,
    cursor,
    remoteVideo,
    roomid,
    canvas,
    localStream,
    updateGameLog
) => {
    addPeerConnection(peerConnections, socket, myIframe, cursor, remoteVideo, roomid, canvas, true, updateGameLog);
    peerConnections[peerConnections.length - 1]?.addStream(localStream);
    setIsStarted(true);
    doCall(peerConnections[peerConnections.length - 1], socket, roomid);
};

type InitHostFn = (
    setIsStarted: (arg0: boolean) => void,
    peerConnections: PeerConnection[],
    socket: any,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLVideoElement,
    roomid: string,
    canvas: HTMLCanvasElement,
    localStream: MediaStream,
    updateGameLog: UpdateGameLog,
    userName: string
) => void;

const initHost: InitHostFn = (
    setIsStarted,
    peerConnections,
    socket,
    myIframe,
    cursor,
    remoteVideo,
    roomid,
    canvas,
    localStream,
    updateGameLog,
    userName
) => {
    socket.on('gotUserMedia', function() {
        Start(
            setIsStarted,
            peerConnections,
            socket,
            myIframe,
            cursor,
            remoteVideo,
            roomid,
            canvas,
            localStream,
            updateGameLog
        );
    });
    socket.on('answer', function(message: any) {
        console.log('answer: ', message);
        peerConnections[peerConnections.length - 1]?.setRemoteDescription(new RTCSessionDescription(message));
    });

    myIframe?.contentWindow?.addEventListener('keydown', (e: any) => {
        console.log('host keydown: ', e);
        if (e.isTrusted) {
            updateGameLog(userName + ' pressed: ' + e.keyCode);
        }
        //@ts-ignore
        e = e || window.event;
        // use e.keyCode
        try {
            //@ts-ignore
            if (e.isTrusted) {
                peerConnections.map(pc => {
                    sendKeypress(userName, e.keyCode, pc.dataChannel);
                });
            }
            //@ts-ignore
        } catch (e) {
            console.error('failed to send keypress');
        }
    });
};

const initGuest = (
    socket: any,
    peerConnections: any,
    doAnswer: any,
    myIframe: any,
    cursor: any,
    remoteVideo: any,
    roomid: string,
    canvas: HTMLCanvasElement,
    updateGameLog: UpdateGameLog,
    userName: string
) => {
    let hasInit = false;
    addPeerConnection(peerConnections, socket, myIframe, cursor, remoteVideo, roomid, canvas, false, updateGameLog);

    socket.on('offer', function(message: any) {
        if (!hasInit) {
            console.log('offer message: ', message);
            setPeerConnectionId(peerConnections[peerConnections.length - 1], message.connectionId);
            peerConnections[peerConnections.length - 1]?.setRemoteDescription(new RTCSessionDescription(message));
            doAnswer();
            hasInit = true;
        }
    });

    window.document.addEventListener('keydown', (e: any) => {
        //console.log('keypress: ', peerConnections[0]);
        //@ts-ignore
        e = e || window.event;
        // use e.keyCode
        try {
            //@ts-ignore
            sendKeypress(userName, e.keyCode, peerConnections[0].dataChannel);
            //peerConnections[0].dataChannel.send(e.keyCode);
            //@ts-ignore
        } catch (e) {
            console.error('failed to send keypress: ', e);
        }
    });
};

const initSocketClient = (
    roomId: string,
    peerConnections: PeerConnection[],
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLVideoElement,
    canvass: HTMLCanvasElement,
    updateGameLog: UpdateGameLog,
    userName: string,
    setIsGuest: (isGuest: boolean) => void,
    socketUrl: string
) => {
    let localStream: MediaStream;
    let isInitiator = false;
    let isStarted = false;
    const setIsStarted: SetIsStarted = (nextIsStarted) => {
        isStarted = nextIsStarted;
    };

    let isChannelReady = false;
    const setIsChannelReady: SetIsChannelReady = (nextIsChannelReady) => {
        isChannelReady = nextIsChannelReady;
    };

    //@ts-ignore
    socket = window.io.connect(socketUrl);

    //@ts-ignore
    localStream = canvass.captureStream();
    console.log('Got stream from canvas');

    socket.emit('create or join', roomId);
    console.log('Attempted to create or  join room', roomId);

    socket.on('created', function(roomId: string) {
        console.log('Created room ' + roomId);
        initHost(
            setIsStarted,
            peerConnections,
            socket,
            myIframe,
            cursor,
            remoteVideo,
            roomId,
            canvass,
            localStream,
            updateGameLog,
            userName
        );
        isInitiator = true;
    });

    socket.on('full', function(room: string) {
        console.log('Room ' + room + ' is full');
    });

    socket.on('join', function(room: string) {
        console.log('Another peer made a request to join room ' + room);
        console.log('This peer is the initiator of room ' + room + '!');
        setIsChannelReady(true);
    });

    socket.on('joined', function(room: string) {
        console.log('joined: ' + room);

        initGuest(
            socket,
            peerConnections,
            doAnswer,
            myIframe,
            cursor,
            remoteVideo,
            roomId,
            canvass,
            updateGameLog,
            userName
        );
        setIsChannelReady(true);
        setIsGuest(true);
        socket.emit('gotUserMedia', room);
    });

    socket.on('log', function(array: any) {
        console.log(array);
    });

    // This client receives a message
    //@ts-ignore
    socket.on('message', function(message) {
        //@ts-ignore
        console.log('Client received message:', message);
        if (message.type === 'candidate' && isStarted) {
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate,
            });
            getPeerConnectionById(peerConnections, message.connectionId)?.addIceCandidate(candidate);
        } else if (message.type === 'bye') {
            handleRemoteHangup(message.connectionId);
        }
    });

    function doAnswer() {
        console.log('Sending answer to peer.');
        peerConnections[peerConnections.length - 1]?.createAnswer().then(
            //@ts-ignore
            setLocalAndSendMessage(peerConnections[peerConnections.length - 1], socket, roomId),
            onCreateSessionDescriptionError
        );
    }

    function handleRemoteHangup(connectionId: string) {
        console.log('Session terminated.');
        stop(connectionId, peerConnections);
        isInitiator = false;
    }

    window.onbeforeunload = function() {
        sendMessage(
            //@ts-ignore
            socket,
            { type: 'bye', connectionId: peerConnections[0].connectionId },
            roomId
        );
    };

    return () => {
        if (peerConnections[0]) {
            stop(peerConnections[0].connectionId, peerConnections);
            sendMessage(
                //@ts-ignore
                socket,
                {type: 'bye', connectionId: peerConnections[0].connectionId},
                roomId
            );
        }
    };
};

export default initSocketClient;
