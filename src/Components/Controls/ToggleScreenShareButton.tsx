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

import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import Tooltip from '@material-ui/core/Tooltip';
import {handleTurnOnScreenSharing, isScreenSharingEnabled} from "../../Views/GameRoom/utils";

export const SCREEN_SHARE_TEXT = 'Share Screen';
export const STOP_SCREEN_SHARE_TEXT = 'Stop Sharing Screen';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
            '&[disabled]': {
                color: 'rgba(225, 225, 225, 0.8)',
                backgroundColor: 'rgba(175, 175, 175, 0.6);',
            },
        },
    })
);


const TurnOffScreenSharing = (unpublish: any) => {
    unpublish({ name: 'screen' });
};

const handleScreenSharingClicked = (publisher: any, unpublish: any, publish: any) => () => {
    isScreenSharingEnabled(publisher)
        ? TurnOffScreenSharing(unpublish)
        : handleTurnOnScreenSharing(publish)()
};

export default function ToggleScreenShareButton(
    props: { publisher: any, unpublish: any, publish: any }
) {
    const { publisher, unpublish, publish } = props;

    const classes = useStyles();
    const isScreenShared = isScreenSharingEnabled(publisher);

    let tooltipMessage = SCREEN_SHARE_TEXT;

    if (isScreenShared) {
        tooltipMessage = STOP_SCREEN_SHARE_TEXT;
    }

    return (
        <Tooltip
            title={tooltipMessage}
            placement="top"
            PopperProps={{ disablePortal: true }}
            onClick={handleScreenSharingClicked(publisher, unpublish, publish)}
        >
            <div>
                {/* The div element is needed because a disabled button will not emit hover events and we want to display
          a tooltip when screen sharing is disabled */}
                <Fab className={classes.fab}  disabled={false}>
                    {isScreenShared ? <StopScreenShare /> : <ScreenShare />}
                </Fab>
            </div>
        </Tooltip>
    );
}
