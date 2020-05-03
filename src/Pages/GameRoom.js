import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {
    useParams,
} from "react-router-dom";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

import useWebRTCCanvasShare from './useWebRTCCanvasShare';

var apiKey = "46617242";
var sessionId = "1_MX40NjYxNzI0Mn5-MTU4NTI3ODQ1MTU3NH43Rm84SWRBbkN2QWh5dkUyUGJMZWlPTE1-fg";
var token = "T1==cGFydG5lcl9pZD00NjYxNzI0MiZzaWc9ZGE0MGJmOThiMmM1MTQyMzFmOTUzZmY3Y2I3MmNlZjI0ZTQzYmYxMDpzZXNzaW9uX2lkPTFfTVg0ME5qWXhOekkwTW41LU1UVTROVEkzT0RRMU1UVTNOSDQzUm04NFNXUkJia04yUVdoNWRrVXlVR0pNWldsUFRFMS1mZyZjcmVhdGVfdGltZT0xNTg1Mjc4NDgwJm5vbmNlPTAuODQxMTM0Mzg4ODA3MTk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg3ODcwNDc5JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

const Container = styled.div`
    width: 100vw;
    height: calc(100% - 64px);
    display: flex;
    overflow: hidden;
`;

const MainArea = styled.div`
    flex: 1;
`;

const SideBar = styled.div`
    width: 300px;
    position: relative;
`;

const Mouse = styled.img`
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
`;

const GameRoom = () => {
    const { gamename } = useParams();

    const isGuest = useWebRTCCanvasShare(
        'gameIframe',
        'remoteCursor',
        'remoteVideo',
        'https://rust-sandpaper.glitch.me',
    );

    return (
        <Container>
            <MainArea>
                <iframe
                    id={'gameIframe'}
                    src={`/${gamename}/index.html`} width={"100%"} height={"100%"}
                    style={{ display: isGuest ? 'none' : 'initial', border: 'none' }}
                />
                {/*<video id={"localVideo"} autoPlay muted playsInline/>*/}
                <video id={"remoteVideo"} autoPlay muted playsInline/>
            </MainArea>
            <SideBar>
                <OTSession apiKey={apiKey} sessionId={sessionId} token={token}>
                    <OTPublisher />
                    <OTStreams>
                        <OTSubscriber />
                    </OTStreams>
                </OTSession>
            </SideBar>
            <Mouse src="/mouse.png" id="remoteCursor" />
        </Container>
    );
};

export default GameRoom;
