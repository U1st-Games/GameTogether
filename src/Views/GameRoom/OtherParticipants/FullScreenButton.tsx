import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            marginRight: theme.spacing(1),
        },
    })
);

export default function FullScreenButton(
    props: { disabled?: boolean, onClick: () => void, fullScreenStreamId: string, streamId: string }
    ) {
    const { onClick, fullScreenStreamId, streamId } = props;
    const classes = useStyles();

    return (
        <Tooltip
            title="Expand"
            placement="top"
            PopperProps={{ disablePortal: true }}
            onClick={onClick}
        >
            <Fab
                className={classes.fab}
                disabled={props.disabled}
                data-cy-audio-toggle
                size={"small"}
            >
                {(fullScreenStreamId === streamId) ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </Fab>
        </Tooltip>
    );
}
