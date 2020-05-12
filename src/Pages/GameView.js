import React from 'react';
import useWebRTCCanvasShare from "./useWebRTCCanvasShare";
import {Route, useParams} from "react-router-dom";

const GameView = () => {
    const { gamename, roomid } = useParams();
    console.log('GameView: ', roomid, gamename);
    const {isGuest} = useWebRTCCanvasShare(
        'gameIframe',
        'remoteCursor',
        'remoteVideo',
        'https://rust-sandpaper.glitch.me',
        roomid,
    );

    return (
        <>
            <iframe
                id={'gameIframe'}
                src={`/${gamename}/index.html`} width={"100%"} height={"100%"}
                style={{display: isGuest ? 'none' : 'initial', border: 'none'}}
            />
            <video id={"remoteVideo"} autoPlay muted playsinline/>
        </>
    );
};

export default GameView;
