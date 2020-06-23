import React, {useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
        },
    })
);

const handleAudioClicked = (
    publisher: any,
    hasAudio: any,
    setHasAudio: any,
    ) => () => {
    publisher.camera.publishAudio(!hasAudio);
    setHasAudio(!hasAudio);
};

export default function ToggleAudioButton(
    props: { publisher: any }
    ) {
    const { publisher } = props;
    const classes = useStyles();
    const [ hasAudio, setHasAudio ] = useState(true);

    return (
        <Tooltip
            title={hasAudio ? 'Mute Audio' : 'Unmute Audio'}
            placement="top"
            PopperProps={{ disablePortal: true }}
            onClick={handleAudioClicked(publisher, hasAudio, setHasAudio)}
        >
            <Fab className={classes.fab} disabled={!publisher}>
                {hasAudio ? <MicOff />: <Mic />}
            </Fab>
        </Tooltip>
    );
}
