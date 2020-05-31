/*
GameTogether © Copyright, Nang Development Limited 2020. All Rights Reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

let socket: any;

interface PeerConnection extends RTCPeerConnection {
    connectionId: string;
    dataChannel: RTCDataChannel;
    addStream: any;
}

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

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

const setPeerConnectionId = (pc: PeerConnection, connectionId: string) => {
    pc.connectionId = connectionId;
};

const deepClone = (objectToClone: any) => JSON.parse(JSON.stringify(objectToClone));

function sendMessage(socket: Socket, message: any, roomid: string) {
    console.log('Client sending message: ', message);
    socket.emit('message', message, roomid);
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

const createDataChannel = (
    pc: RTCPeerConnection,
    canvas: HTMLCanvasElement,
    videoElement: HTMLVideoElement,
    isHost: boolean,
    updateGameLog: updateGameLogFn
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

const hostDataChannelHandler = (
    myIframe: HTMLIFrameElement,
    cursor: Element,
    updateGameLog: updateGameLogFn,
    peerConnections: PeerConnection[]
) => ({ channel }: { channel: any }) => {
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

            if (recievedKeycode === 87) {
                //@ts-ignore
                simulateKey(38);
            }
            if (recievedKeycode === 65) {
                //@ts-ignore
                simulateKey(37);
            }
            if (recievedKeycode === 83) {
                //@ts-ignore
                simulateKey(40);
            }
            if (recievedKeycode === 68) {
                //@ts-ignore
                simulateKey(39);
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

const onDataChannelHandler = (myIframe: HTMLIFrameElement, cursor: Element, updateGameLog: updateGameLogFn) => ({
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

const createPeerConnection = (
    socket: Socket,
    myIframe: HTMLIFrameElement,
    cursor: HTMLElement,
    remoteVideo: HTMLVideoElement,
    roomid: string,
    canvas: HTMLCanvasElement,
    isHost: boolean,
    updateGameLog: updateGameLogFn,
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

const getPeerConnectionById = (peerConnections: PeerConnection[], peerConnectionId: string) => {
    return peerConnections.find(pc => pc.connectionId === peerConnectionId);
};

const removePeerConnectionById = (peerConnections: PeerConnection[], peerConnectionId: string) => {
    peerConnections = peerConnections.filter(pc => pc.connectionId !== peerConnectionId);
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
    socket.emit(sessionDescription.type, sessionDescriptionClone, roomid);
};

const handleCreateOfferError = (event: any) => {
    console.log('createOffer() error: ', event);
};

const doCall = (pc: PeerConnection, socket: Socket, roomid: string) => {
    console.log('Sending offer to peer');
    //@ts-ignore
    pc.createOffer(setLocalAndSendMessage(pc, socket, roomid), handleCreateOfferError);
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
    updateGameLog: updateGameLogFn
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

const stop = (connectionId: string, peerConnections: PeerConnection[]) => {
    //isStarted = false;
    //console.log('isStarted: ', isStarted);
    const peerConnection = getPeerConnectionById(peerConnections, connectionId);
    if (!peerConnection) {
        console.error('no peer connection');
        return;
    }
    peerConnection.dataChannel.close();
    peerConnection.close();
    removePeerConnectionById(peerConnections, connectionId);
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
    updateGameLog: updateGameLogFn
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
    updateGameLog: updateGameLogFn,
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
    updateGameLog: updateGameLogFn,
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

type updateGameLogFn = (nexMessage: string) => void;

interface Return {
    isGuest: boolean;
    start: () => void;
    stop: () => void;
    gameLog: string[];
}

const useWebRTCCanvasShare = (
    iframeId: string,
    remoteCursorId: string,
    remoteVideoId: string,
    socketUrl: string,
    roomid: string,
    startOnLoad: boolean = true,
    userName: string = 'someone'
): Return => {
    const [hasInit, setHasInit] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [hasStart, setHasStart] = useState(startOnLoad);
    const [gameLog, setGameLog] = useState<string[]>(['one', 'two', 'three']);
    const updateGameLog: updateGameLogFn = (nextMessage: string) => {
        setGameLog(gameLog => {
            if (gameLog.length < 10) {
                return [...gameLog, nextMessage];
            }
            return [...gameLog.slice(1, gameLog.length), nextMessage];
        });
    };

    const peerConnections: PeerConnection[] = [];

    //This is so consumer can control when the hook starts
    const start = () => {
        if (!hasStart) {
            setHasStart(true);
        }
    };

    const stopOutside = () => {
        if (peerConnections[0]) {
            stop(peerConnections[0].connectionId, peerConnections);
            sendMessage(
                //@ts-ignore
                socket,
                { type: 'bye', connectionId: peerConnections[0].connectionId },
                roomid
            );
        }
    };

    useEffect(() => {
        const cursor = document.querySelector('#' + remoteCursorId) as HTMLElement;
        const remoteVideo = document.querySelector('#' + remoteVideoId) as HTMLVideoElement;

        if (hasStart && !hasInit) {
            setHasInit(true);

            const myIframe = document.getElementById(iframeId) as HTMLIFrameElement;

            const onIframeLoaded = () => {
                if (socket) {
                    socket.disconnect();
                }
                //@ts-ignore
                socket = window.io.connect(socketUrl);

                const canvass = myIframe?.contentWindow?.document.getElementById('myCanvas') as HTMLCanvasElement;

                let localStream: MediaStream;

                let isChannelReady = false;
                let isInitiator = false;
                let isStarted = false;

                const setIsStarted = (nextIsStarted: boolean) => {
                    isStarted = nextIsStarted;
                };

                //Begin socket.io --------------------------------------------
                let room = roomid;

                if (!roomid) {
                    console.error('no roomid');
                    return;
                }

                socket.emit('create or join', room);
                //@ts-ignore
                console.log('Attempted to create or  join room', room);

                socket.on('created', function(room: string) {
                    console.log('Created room ' + room);
                    initHost(
                        setIsStarted,
                        peerConnections,
                        socket,
                        myIframe,
                        cursor,
                        remoteVideo,
                        roomid,
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
                    isChannelReady = true;
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
                        roomid,
                        canvass,
                        updateGameLog,
                        userName
                    );
                    isChannelReady = true;
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
                //End socket.io -----------------------------------------------------------

                //@ts-ignore
                localStream = canvass.captureStream();
                console.log('Got stream from canvas');

                function doAnswer() {
                    console.log('Sending answer to peer.');
                    peerConnections[peerConnections.length - 1]?.createAnswer().then(
                        //@ts-ignore
                        setLocalAndSendMessage(peerConnections[peerConnections.length - 1], socket, roomid),
                        onCreateSessionDescriptionError
                    );
                }

                function hangup() {
                    console.log('Hanging up.');
                    //stop();
                    //sendMessage(socket, 'bye');
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
                        roomid
                    );
                };
            };
            myIframe.addEventListener('load', onIframeLoaded);
        } //hasStart if statement
    }, [hasStart, hasInit]);

    useEffect(() => {
        return () => {
            stopOutside();
        };
    }, []);

    return { isGuest, start, stop: stopOutside, gameLog };
};

export default useWebRTCCanvasShare;
