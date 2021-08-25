import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    backdrop: {
        zIndex: 2000,
        color: '#fff',
    },
}));

/**
 * Render progress indicator
 */
const ProgressIndicator = ({ open }) => {
    const classes = useStyles();

    return (
        <Backdrop open={open} className={classes.backdrop}>
            <CircularProgress size={50} />
        </Backdrop>
    );
};

export default ProgressIndicator;
