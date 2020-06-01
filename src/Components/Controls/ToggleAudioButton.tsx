import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';
import {handleTurnOnCamera, isVideoEnabled} from "../../Views/GameRoom/utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
        },
    })
);

const isAudioEnabled = (publisher: any): boolean => {
    console.log('publisher: ', publisher);
    return true;
}

const TurnOffAudio = (publisher: any) => {
    publisher.publishAudio(false);
};

const handleAudioClicked = (
    publisher: any,
    hasAudio: boolean,
    setHasAudio: (arg0: any) => void,
    ) => () => {
    console.log('publisher: ', publisher);
    const actualPublisher = publisher.camera || publisher.screen;
    actualPublisher.publishAudio(!hasAudio);
    setHasAudio((prev: any) => !prev);
};

export default function ToggleAudioButton(
    props: { publisher: any, hasAudio: boolean, setHasAudio: (arg0: boolean) => void }
    ) {
    const { publisher, hasAudio, setHasAudio } = props;
    const classes = useStyles();

    return (
        <Tooltip
            title={hasAudio ? 'Mute Audio' : 'Unmute Audio'}
            placement="top"
            PopperProps={{ disablePortal: true }}
            onClick={handleAudioClicked(publisher, hasAudio, setHasAudio)}
        >
            <Fab className={classes.fab} disabled={!publisher}>
                {hasAudio ? <Mic />: <MicOff />}
            </Fab>
        </Tooltip>
    );
}

/*
<Tooltip
            title={hasAudio ? 'Mute Audio' : 'Unmute Audio'}
            placement="top"
            PopperProps={{ disablePortal: true }}
            onClick={handleAudioClicked(publisher, hasAudio, setHasAudio)}
        >
            <Fab className={classes.fab}>
                {hasAudio ? <MicOff />: <Mic />}
            </Fab>
        </Tooltip>
 */
