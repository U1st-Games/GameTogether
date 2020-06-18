export type UpdateGameLog = (nexMessage: string) => void;

export interface PeerConnection extends RTCPeerConnection {
    connectionId: string;
    dataChannel: RTCDataChannel;
    addStream: any;
}

export interface ByeMessage {
    type: 'bye',
    connectionId: string,
    roomId: string,
}
