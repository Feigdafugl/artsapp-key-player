import React from 'react';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render back button
 */
const BackButton = ({ onClick }) => (
    <IconButton
        edge="start"
        aria-label="back"
        color="inherit"
        onClick={() => onClick()}
    >
        <NavigateBefore color="inherit" fontSize="large" />
    </IconButton>
);

export default BackButton;
