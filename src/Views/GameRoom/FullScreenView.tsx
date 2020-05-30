import React, {useEffect} from 'react';
import styled from 'styled-components';
import AspectRatio from "./AspectRatio";

const getStreamById = (streams: any, streamId: string) =>
    streams.filter((stream: any) => stream.id === streamId)[0];

const Container = styled.div`
    background: red;
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

interface FullScreenViewProps {
    streamId: any;
    streams: any;
    subscribe: any;
}
const FullScreenView = (props: FullScreenViewProps) => {
    const { subscribe, streamId, streams } = props;

    useEffect(() => {
        subscribe({
            stream: getStreamById(streams, streamId),
            element: 'fullscreen'
        })
    }, []);

    return (
        <Container >
            <AspectRatio ratio={16/9}>
                <FullScreenElement id={"fullscreen"} />
            </AspectRatio>
        </Container>
    );
};

export default FullScreenView;
