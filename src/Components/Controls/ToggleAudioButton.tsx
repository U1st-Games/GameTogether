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
