import React from 'react';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

/**
 * Render close button
 */
const CloseButton = ({ onClick }) => (
    <span className="absolute top-1 right-4 z-20">
        <IconButton
            edge="end"
            aria-label="close"
            onClick={onClick}
        >
            <Close />
        </IconButton>
    </span>
);

export default CloseButton;
