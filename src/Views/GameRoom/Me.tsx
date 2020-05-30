import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

type publishFn = (arg0: any) => void;

interface MeProps {
    publish: publishFn;
}

const handleTurnOnScreenSharing = (publish: publishFn) => () => {
    publish({
        name: 'screen',
        element: 'me',
        options: {
            insertMode: 'replace',
            width: '300px',
            height: '169px',
            videoSource: 'screen',
        },
    });
};

const handleTurnOnCamera = (publish: publishFn) => () => {
    publish({
        name: 'camera',
        element: 'me',
        options: {
            insertMode: 'replace',
            width: '300px',
            height: '169px',
        }
    });
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

const Me = (props: MeProps) => {
    const { publish } = props;
    return (
        <Container id="me" >
            <Button
                variant="contained" color="primary"
                onClick={handleTurnOnCamera(publish)}
            >
                Turn on camera
            </Button>
            <Button
                variant="contained" color="primary"
                onClick={handleTurnOnScreenSharing(publish)}
            >
                Turn on screen sharing
            </Button>
        </Container>
    );
};

export default Me;
