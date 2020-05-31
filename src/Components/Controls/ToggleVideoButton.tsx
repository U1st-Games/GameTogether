import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import {handleTurnOnCamera, isVideoEnabled} from "../../Views/GameRoom/utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
        },
    })
);

const TurnOffCamera = (unpublish: any) => {
    unpublish({ name: 'camera' });
};

const handleVideoClicked = (publisher: any, unpublish: any, publish: any) => () => {
    isVideoEnabled(publisher)
        ? TurnOffCamera(unpublish)
        : handleTurnOnCamera(publish)()
};

export default function ToggleVideoButton(
    props: { publisher: any, unpublish: any, publish: any }
    ) {
    const { publisher, unpublish, publish } = props;

    const classes = useStyles();

    return (
        <Tooltip
            title={isVideoEnabled ? 'Mute Video' : 'Unmute Video'}
            placement="top"
            PopperProps={{ disablePortal: true }}
            onClick={handleVideoClicked(publisher, unpublish, publish)}
        >
            <Fab className={classes.fab}>
                {isVideoEnabled(publisher) ? <VideocamOff />: <Videocam /> }
            </Fab>
        </Tooltip>
    );
}
