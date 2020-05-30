import React, {useEffect} from 'react';
import styled from 'styled-components';
import AspectRatio from "../AspectRatio";
import CloseButton from "./CloseButton";

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
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    text-align: right;
    z-index: 1;
`;

const handleClose = (setFullScreenStreamId: (streamId: string) => void) => () => {
    setFullScreenStreamId('');
};

interface FullScreenViewProps {
    streamId: any;
    streams: any;
    subscribe: any;
    setFullScreenStreamId: (streamId: string) => void;
}
const FullScreenView = (props: FullScreenViewProps) => {
    const { subscribe, streamId, streams, setFullScreenStreamId } = props;

    useEffect(() => {
        subscribe({
            stream: getStreamById(streams, streamId),
            element: 'fullscreen'
        })
    }, []);

    return (
        <Container >
            <TopButtonsContainer>
                <CloseButton onClick={handleClose(setFullScreenStreamId)} />
            </TopButtonsContainer>
            <AspectRatio ratio={16/9}>
                <FullScreenElement id={"fullscreen"} />
            </AspectRatio>
        </Container>
    );
};

export default FullScreenView;
