import React from 'react';
import styled from 'styled-components';

import EndCallButton from './EndCallButton';
import ToggleAudioButton from './ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton';
import ToggleScreenShareButton from './ToggleScreenShareButton';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height:  150px;
    background: rgba(0, 0, 0, 0.5);
`;

interface ControlsProps {
    unpublish: (streamName: string) => void;
    publisher: any;
    publish: any;
}

export default function Controls(props: ControlsProps) {
    const { unpublish, publisher, publish } = props;
    return (
        <Container>
            <ToggleAudioButton />
            <ToggleVideoButton {...{ unpublish, publisher, publish }} />
            <ToggleScreenShareButton {...{ unpublish, publisher, publish }} />
            <EndCallButton />
        </Container>
    );
}
