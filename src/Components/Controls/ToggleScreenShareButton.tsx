import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import Tooltip from '@material-ui/core/Tooltip';

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

export default function ToggleScreenShareButton(props: { disabled?: boolean }) {
    const classes = useStyles();
    const isScreenShared = false;

    let tooltipMessage = SCREEN_SHARE_TEXT;

    if (isScreenShared) {
        tooltipMessage = STOP_SCREEN_SHARE_TEXT;
    }

    return (
        <Tooltip
            title={tooltipMessage}
            placement="top"
            PopperProps={{ disablePortal: true }}
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
