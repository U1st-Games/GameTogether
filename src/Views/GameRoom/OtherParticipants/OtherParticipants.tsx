import React, {useEffect} from 'react';
import styled from 'styled-components';
import FullScreenButton from "./FullScreenButton";

const getPublisherId = (publisher: any): string => {
    const thingBeingPublished = publisher.camera || publisher.screen;
    if (!thingBeingPublished) return '';
    return thingBeingPublished.stream.id;
};

const Stream = styled.div`
    width: 300px;
    height: 169px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    box-sizing: border-box;
`;

const Container = styled.div`
    width: 300px;
    height: 169px;
    position: relative;
`;

const BottomButtonsContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    text-align: right;
    z-index: 1;
`;

const fullScreenClickHandler = (
    setFullScreenStreamId: (streamId: string) => void,
    streamId: string,
    fullScreenStreamId: string
) => () => {
    if(streamId === fullScreenStreamId) {
        setFullScreenStreamId('');
    } else {
        setFullScreenStreamId(streamId);
    }
};

const OtherParticipant = (props: any) => {
    const {stream, subscribe, setFullScreenStreamId, fullScreenStreamId} = props;

    useEffect(() => {
        subscribe({
            stream,
            element: stream.id,
        })
    }, []);

    return (
        <Container>
            <Stream id={stream.id} key={stream.id}>
            </Stream>
            <BottomButtonsContainer>
                <FullScreenButton
                    onClick={fullScreenClickHandler(setFullScreenStreamId, stream.id, fullScreenStreamId)}
                    fullScreenStreamId={fullScreenStreamId}
                    streamId={stream.id}
                />
            </BottomButtonsContainer>
        </Container>
    );
};

const filterStreams = (streams: any, publisher: any) =>
    streams
        .filter((stream: any) => stream.id !== getPublisherId(publisher))
        .filter((stream: any) => !((stream.videoType === 'screen') && (stream.publisher !== null)));

interface OtherParticipantsProps {
    streams: any;
    publisher: any;
    subscribe: any;
    setFullScreenStreamId: (streamId: string) => void;
    fullScreenStreamId: any;
}
const OtherParticipants = (props: OtherParticipantsProps) => {
    const { streams, publisher, subscribe, setFullScreenStreamId, fullScreenStreamId } = props;
    return (
        <div>
            {filterStreams(streams, publisher)
                .map((stream: any) =>
                        <OtherParticipant
                            {...{stream, subscribe, setFullScreenStreamId, fullScreenStreamId}}
                        />
                    )}
        </div>
    );
};

export default OtherParticipants;
