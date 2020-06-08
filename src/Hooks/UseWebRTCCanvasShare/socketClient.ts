
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
};

export default initSocketClient;
