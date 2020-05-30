import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import Tooltip from '@material-ui/core/Tooltip';
import {handleTurnOnScreenSharing} from "../../Views/GameRoom/utils";

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

const isScreenSharingEnabled = (publisher: any): boolean => !!publisher.screen;

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

    console.log('publisher: ', !!publisher.screen);

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
