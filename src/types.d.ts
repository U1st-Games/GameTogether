export type UpdateGameLog = (nexMessage: string) => void;

export interface DataChannels {
    fastDataChannel: RTCDataChannel;
    reliableDataChannel: RTCDataChannel;
}

export interface PeerConnection extends RTCPeerConnection {
    connectionId: string;
    dataChannels: DataChannels;
    addStream: any;
}

export interface ByeMessage {
    type: 'bye',
    connectionId: string,
    roomId: string,
}

export interface KeypressData {
    name: string
    keyCode: number;
}

export interface MousepositionData {
    normalizedWidth: number;
    normalizedHeight: number;
}

export interface MouseclickData {

}

export interface DataChannelMessage {
    type: 'keypress' | 'mousePosition' | 'mouseClick';
    data: KeypressData | MousepositionData | MouseclickData;
}
