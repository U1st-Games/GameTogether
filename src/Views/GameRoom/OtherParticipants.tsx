import React, {ReactComponentElement, useEffect} from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const getPublisherId = (publisher: any): string => {
    const thingBeingPublished = publisher.camera || publisher.screen;
    if (!thingBeingPublished) return '';
    return thingBeingPublished.stream.id;
};

const Container = styled.div`
    width: 300px;
    height: 169px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    background-color: black;
    background-image: url(/blank-profile-picture.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto 100%;
    border: 1px solid white;
    box-sizing: border-box;
`;

interface OtherParticipantProps {
    id: string;
}
const OtherParticipant = (props: any) => {
    const {stream, subscribe} = props;

    useEffect(() => {
        subscribe({
            stream,
            element: stream.id
        })
    }, []);

    return (
        <Container id={stream.id} key={stream.id}>
        </Container>
    );
};

interface OtherParticipantsProps {
    streams: any;
    publisher: any;
    subscribe: any;
}
const OtherParticipants = (props: OtherParticipantsProps) => {
    const { streams, publisher, subscribe } = props;
    console.log('props: ', props);
    return (
        <div>
            {streams
                .filter((stream: any) => stream.id !== getPublisherId(publisher))
                .map((stream: any) => <OtherParticipant {...{stream, subscribe}} />)}
        </div>
    );
};

export default OtherParticipants;
