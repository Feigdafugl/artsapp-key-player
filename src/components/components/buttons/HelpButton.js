import React from 'react';
import HelpOutline from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render help button
 */
const HelpButton = ({ onClick }) => (
    <span className="fixed top-1 sm:top-2 right-1 lg:right-8 text-white lg:text-primary z-40">
        <IconButton
            edge="start"
            aria-label="help"
            color="inherit"
            onClick={() => onClick()}
        >
            <HelpOutline />
        </IconButton>
    </span>
);

export default HelpButton;
