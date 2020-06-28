import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { getPeerConnectionById, stop } from '../webRTCHelpers';

export type UpdateGameLog = (nexMessage: string) => void;

export interface PeerConnection extends RTCPeerConnection {
    connectionId: string;
    dataChannel: RTCDataChannel;
    addStream: any;
}

export interface ByeMessage {
    type: 'bye';
    connectionId: string;
    roomId: string;
}

type SetIsStarted = (nextIsStarted: boolean) => void;
type SetIsInitiator = (nextIsInitiator: boolean) => void;
type SetIsChannelReady = (nextIsChannelReady: boolean) => void;

const socketEvents = ['gotUserMedia', 'answer', 'offer', 'created', 'full', 'join', 'joined', 'log', 'message', 'bye'];

// WASD = 87, 65, 83, 68
// arrow keys = 37, 38, 39, 40
const clientKeyMap = {
    87: 38,
    65: 37,
    83: 40,
    68: 39,
};

let socket: Socket;

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

export function sendMessage(socket: Socket, message: any, roomid: string, event = 'message') {
    console.log('Client sending message: ', message);
    socket.emit(event, roomid, message);
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
    console.log('Remote stream added: ', event);
    //@ts-ignore
    remoteVideo.srcObject = event.stream;
};

//@ts-ignore
const handleRemoteStreamRemoved = event => {
    console.log('Remote stream removed. Event: ', event);
};

const createElement = (connectionId: string, canvass: HTMLCanvasElement, iFrame: HTMLIFrameElement) => {
    const div = document.createElement('div');
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.backgroundColor = 'red';
    div.style.position = 'absolute';
    div.style.zIndex = '100';
    //div.id = 'connectionId';
    div.id = connectionId;
//    canvass.appendChild(div);
    let canvasContainer = iFrame?.contentWindow?.document.getElementById('canvas-container');
    canvasContainer?.appendChild(div);
    console.log('canvascontaienr: ', canvasContainer);
    return div;
}

const hostDataChannelHandler = (
    myIframe: HTMLIFrameElement,
    cursor: Element,
    updateGameLog: UpdateGameLog,
    peerConnections: PeerConnection[],
    pc: PeerConnection,
    canvass: HTMLCanvasElement
) => ({ channel }: { channel: any }) => {
    channel.onmessage = (e: any) => {
        console.log('channel: ', channel);
        console.log('event: ', e);
        console.log('onDataChannelHandler: ', e.data);

        if (channel.label === 'keyPress') {
            //console.log('keyPress: ', e.data);

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
                simulateKey(clientKeyMap[recievedKeycode]);
            }
        }
        if (channel.label === 'mousePosition') {
            let mouseElement = myIframe?.contentWindow?.document.getElementById(pc.connectionId);

            if(!mouseElement) {
                console.log('create mouse element')
                mouseElement = createElement(pc.connectionId, canvass, myIframe);
            }

            const mousePositionData = JSON.parse(e.data);

            //const split = e.data && e.data.split(',');
            console.log('probe: ', mouseElement);
            //@ts-ignore
            mouseElement.style.left = mousePositionData.normalizedWidth + 'px';
            //@ts-ignore
            mouseElement.style.top = mousePositionData.normalizedHeight + 'px';
        }
    };
};

const onDataChannelHandler = (
    myIframe: HTMLIFrameElement,
    cursor: Element,
    updateGameLog: UpdateGameLog,
    pc: PeerConnection
) => ({
                                                                                                                  channel,
                                                                                                              }: {
    channel: any;
},
) => {
    channel.onmessage = (e: any) => {
        //console.log('onDataChannelHandler: ', e.data);

        if (channel.label === 'keyPress') {
            //console.log('keyPress: ', e.data);
            const keypressData = JSON.parse(e.data);
            updateGameLog(keypressData.name + ' pressed ' + keypressData.keyCode);
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
    return { normalizedWidth, normalizedHeight };
};

const createMousePositionNetworkData = (
    normalizedMousePosition: any,
    connectionId: any,
    ) => {
    return JSON.stringify({...normalizedMousePosition, connectionId});
}

const createKeypressNetworkData = () => {

}

const createMouseClickNetworkData = () => {

}

const createDataChannel = (
    pc: PeerConnection,
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
        //keyDataChannel.send('Key Hello World!');
    };
    keyDataChannel.onclose = () => {
        console.log('Key The Data Channel is Closed');
    };
    //@ts-ignore
    document.onclick = e => {
      console.log('onClick');
      try {
        keyDataChannel.send(e.clientX + ',' + e.clientY);
      } catch (e) {
        console.error('failed to send click');
      }
    };

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
                mousePositionDataChannel.send(
                    createMousePositionNetworkData(normalizeMousePosition(canvas, e), pc.connectionId)
                );
            } catch (e) {
                console.error('failed to send mouse position');
            }
        });
    } else {
        videoElement.addEventListener('mousemove', e => {
            try {
                mousePositionDataChannel.send(
                    createMousePositionNetworkData(normalizeMousePosition(videoElement, e), pc.connectionId)
                );
            } catch (e) {
                console.error('failed to send mouse position');
            }
        });
    }

    return keyDataChannel;
};

const createPeerConnection = async (
    socket: Socket,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLVideoElement,
    roomid: string,
    canvas: HTMLCanvasElement,
    isHost: boolean,
    updateGameLog: UpdateGameLog,
    peerConnections: PeerConnection[],
    canvass: HTMLCanvasElement
): Promise<PeerConnection | undefined> => {
    let response;

    try {
        response = await axios.get('/stunturntoken');
    } catch (e) {
        console.log('error getting stun token: ', e);
    }

    try {
        console.log('createPeerConnection');
        let iceServers;

        if(response) {
            iceServers = response.data.iceServers;
        } else {
            iceServers = [{
                'urls': 'stun:stun.l.google.com:19302'
            }];
        }

        const configuration = { iceServers, iceCandidatePoolSize: 255 };

        console.log('configuration: ', configuration);

        const pc = new RTCPeerConnection(configuration) as PeerConnection;
        //@ts-ignore
        pc.connectionId = uuidv4();
        pc.onicecandidate = handleIceCandidate(socket, pc, roomid);
        pc.onicecandidateerror = (e) => {
            console.log('icecandidateerror: ', e)
        }
        //@ts-ignore
        pc.onaddstream = handleRemoteStreamAdded(remoteVideo);
        //@ts-ignore
        pc.onremovestream = handleRemoteStreamRemoved;

        pc.oniceconnectionstatechange = function(ev) {
            console.log('iceconnectionstatechange: ', ev);
            if (pc.iceConnectionState == 'disconnected') {
                console.log('Peer connection Disconnected !!!');
                try {
                    stop(pc.connectionId, peerConnections);
                } catch (e) {
                    console.error('stop error: ', e);
                }
                console.log('after stop');
            }
        };

        if (isHost) {
            pc.ondatachannel = hostDataChannelHandler(myIframe, cursor, updateGameLog, peerConnections, pc, canvass);
        } else {
            pc.ondatachannel = onDataChannelHandler(myIframe, cursor, updateGameLog, pc);
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

const addPeerConnection = async (
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
    const newPeerConnection = await createPeerConnection(
        socket,
        myIframe,
        cursor,
        remoteVideo,
        roomid,
        canvas,
        isHost,
        updateGameLog,
        peerConnections,
        canvas
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

const Start: StartFn = async (
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
    await addPeerConnection(peerConnections, socket, myIframe, cursor, remoteVideo, roomid, canvas, true, updateGameLog);
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
    socket.on('answer', async function(message: any) {
        console.log('answer: ', message);
        peerConnections[peerConnections.length - 1]?.setRemoteDescription(new RTCSessionDescription(message));
    });

    myIframe?.contentWindow?.addEventListener('keydown', (e: any) => {
        //console.log('host keydown: ', e);
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

const initGuest = async (
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
    await addPeerConnection(peerConnections, socket, myIframe, cursor, remoteVideo, roomid, canvas, false, updateGameLog);

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

const closeAllPeerConnections = (peerConnections: PeerConnection[]) => {
    peerConnections.map((peerConnection: PeerConnection) => {
        peerConnection.close();
        return null;
    });
    peerConnections.length = 0;
};

const teardown = (peerConnections: PeerConnection[]) => {
    closeAllPeerConnections(peerConnections);
    console.log('teardown: ', peerConnections);
    // socketEvents.map(eventName => {
    //     socket?.off(eventName);
    // });
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
    socketUrl: string | undefined,
    externalStop: React.MutableRefObject<() => void>
) => {
    let localStream: MediaStream;
    let isInitiator = false;
    let isStarted = false;
    const setIsStarted: SetIsStarted = nextIsStarted => {
        isStarted = nextIsStarted;
    };

    let isChannelReady = false;
    const setIsChannelReady: SetIsChannelReady = nextIsChannelReady => {
        isChannelReady = nextIsChannelReady;
    };

    setIsGuest(false);

    //@ts-ignore
    socket = window.io.connect(socketUrl, { timeout: 600000 });

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

    socket.on('joined', async function(room: string) {
        console.log('joined: ' + room);

        await initGuest(
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
        socket?.emit('gotUserMedia', room);
    });

    socket.on('log', function(array: any) {
        console.log(array);
    });

    // This client receives a message
    //@ts-ignore
    socket.on('message', function(message) {
        //@ts-ignore
        console.log('Client received message:', message);
        if (message.type === 'candidate') {
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate,
            });
            try {
                getPeerConnectionById(peerConnections, message.connectionId)?.addIceCandidate(candidate);
            } catch (e) {
                console.error('error adding ice candidate: ', e);
            }
        } else if (message.type === 'bye') {
            handleRemoteHangup(message.connectionId);
        }
    });

    socket.on('bye', function() {
        console.log('bye recieved');
        teardown(peerConnections);
        //@ts-ignore
        externalStop.current = initSocketClient(
            roomId,
            peerConnections,
            myIframe,
            cursor,
            remoteVideo,
            canvass,
            updateGameLog,
            userName,
            setIsGuest,
            socketUrl,
            externalStop
        );
    });

    // socket.on('disconnect', (reason: string) => {
    //   console.log('disconnect: ', reason);
    //   if (reason === 'io server disconnect') {
    //     // the disconnection was initiated by the server, you need to reconnect manually
    //     //socket.connect();
    //   }
    //   // else the socket will automatically try to reconnect
    // });

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
        console.log('onbeforeunload');
        sendMessage(
            //@ts-ignore
            socket,
            { type: 'bye', connectionId: peerConnections[0].connectionId },
            roomId,
            'bye'
        );
        teardown(peerConnections);
    };

    return () => {
        console.log('externalStop called');
        sendMessage(
            //@ts-ignore
            socket,
            { type: 'bye', roomId },
            roomId,
            'bye'
        );
        teardown(peerConnections);
    };
};

export default initSocketClient;
