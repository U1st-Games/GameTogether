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

import React, { useState } from 'react';
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

const handleVideoClicked = (
    publisher: any,
    hasVideo: any,
    setHasVideo: any,
    ) => () => {
    publisher.camera.publishVideo(!hasVideo);
    setHasVideo(!hasVideo);
};

export default function ToggleVideoButton(
    props: { publisher: any }
    ) {
    const { publisher } = props;
    const classes = useStyles();
    const [ hasVideo, setHasVideo ] = useState(false);

    return (
        <Tooltip
            title={hasVideo ? 'Mute Video' : 'Unmute Video'}
            placement="top"
            PopperProps={{ disablePortal: true }}
            onClick={handleVideoClicked(publisher, hasVideo, setHasVideo)}
        >
            <Fab className={classes.fab}>
                {hasVideo ? <VideocamOff /> : <Videocam />}
            </Fab>
        </Tooltip>
    );
}
