/*
GameTogether © Copyright, Nang Development Limited 2020. All Rights Reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, {useState} from 'react';
import styled from 'styled-components';

import EndCallButton from './EndCallButton';
import ToggleAudioButton from './ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton';
import ToggleScreenShareButton from './ToggleScreenShareButton';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: black;
`;

interface ControlsProps {
    unpublish: (streamName: string) => void;
    publisher: any;
    publish: any;
    opentokProps: any;
}

export default function Controls(props: ControlsProps) {
    const { unpublish, publisher, publish, opentokProps } = props;
    const [hasAudio, setHasAudio] = useState(true);
    return (
        <Container>
            <ToggleAudioButton {...{publisher, hasAudio, setHasAudio}} />
            <ToggleVideoButton {...{unpublish, publisher, publish, opentokProps}} />
            <ToggleScreenShareButton {...{unpublish, publisher, publish}} />
            <EndCallButton />
        </Container>
    );
}
