import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import AspectRatio from "../AspectRatio";
import CloseButton from "./CloseButton";
import {usePrevious} from "../../../utils";

const getStreamById = (streams: any, streamId: string) =>
    streams.filter((stream: any) => stream.id === streamId)[0];

const Container = styled.div`
    background: black;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
`;

const FullScreenElement = styled.div`
     width: 100%;
     height: 100%;
`;

const TopButtonsContainer = styled.div`
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    height: 50px;
    text-align: center;
    z-index: 10;
`;

const handleClose = (setFullScreenStreamId: (streamId: string) => void) => () => {
    setFullScreenStreamId('');
};

interface FullScreenViewProps {
    streamId: any;
    streams: any;
    subscribe: any;
    unsubscribe: any;
    setFullScreenStreamId: (streamId: string) => void;
    session: any;
}
const FullScreenView = (props: FullScreenViewProps) => {
    const { streamId, setFullScreenStreamId } = props;
    const streamElementRef = useRef<Element | null>(null)

    useEffect(() => {
        const streamElement = document.querySelector(`#stream-${streamId}`);
        const container = document.querySelector('#fullscreen');
        if(streamElement) {
            container?.appendChild(streamElement);
            streamElementRef.current = streamElement;
        }

        return () => {
            const container = document.querySelector(`#container-${streamId}`);
            //@ts-ignore
            container?.appendChild(streamElementRef.current);
        }
    }, [streamId]);

    return (
        <Container >
            <TopButtonsContainer>
                <CloseButton onClick={handleClose(setFullScreenStreamId)} />
            </TopButtonsContainer>
                <FullScreenElement id={"fullscreen"} key={streamId}/>
        </Container>
    );
};

export default FullScreenView;
