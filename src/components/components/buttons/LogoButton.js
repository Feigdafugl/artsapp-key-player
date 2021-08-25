import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../../images/artsapp-logo.png';

/**
 * Render ArtsApp logo button
 */
const LogoButton = ({ onClick }) => (
    <IconButton
        edge="start"
        aria-label="back"
        color="inherit"
        onClick={() => onClick()}
    >
        <img
            src={logo}
            alt="ArtsApp logo"
            height={40}
            width={40}
        />
    </IconButton>
);

export default LogoButton;
