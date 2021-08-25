import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import BackButton from '../components/buttons/BackButton';
import LogoButton from '../components/buttons/LogoButton';

/**
 * Render top title bar
 */
const TitleBar = ({ title }) => {
    const history = useHistory();
    const location = useLocation();
    const [showReturn, setShowReturn] = useState(false);

    /**
     * Check URL path and show return button if nested path
     */
    useEffect(() => {
        const path = location.pathname.split('/');
        if (path.length > 2 || path.includes('about') || location.search.includes('page')) {
            setShowReturn(true);
        } else setShowReturn(false);
    }, [location]);

    /**
     * Render toolbar
     *
     * @returns JSX
     */
    const renderToolbar = () => (
        <Toolbar>
            <span className="lg:hidden">
                {showReturn
                    ? <BackButton onClick={() => history.goBack()} />
                    : <LogoButton onClick={() => history.push('/about')} />}
            </span>
            <h1 className="font-normal ml-2 w-48 lg:w-96 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {title}
            </h1>
        </Toolbar>
    );

    return (
        <>
            <div className="fixed w-full z-20 lg:left-56 xl:left-64 lg:hidden">
                <AppBar position="static" color="primary" variant="elevation">
                    {renderToolbar()}
                </AppBar>
            </div>
            <div className="fixed w-full z-20 lg:left-56 xl:left-64 hidden lg:inline">
                <AppBar position="static" color="inherit" variant="outlined">
                    {renderToolbar()}
                </AppBar>
            </div>
        </>
    );
};

export default TitleBar;
