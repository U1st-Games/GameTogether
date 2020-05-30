import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(1),
        },
    })
);

export default function CloseButton(props: { disabled?: boolean, onClick: () => void }) {
    const { onClick } = props;
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
                <HighlightOffIcon />
            </Fab>
        </Tooltip>
    );
}
