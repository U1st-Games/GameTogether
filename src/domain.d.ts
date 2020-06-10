declare module 'react-use-opentok';

type UpdateGameLog = (nexMessage: string) => void;

interface PeerConnection extends RTCPeerConnection {
    connectionId: string;
    dataChannel: RTCDataChannel;
    addStream: any;
}
