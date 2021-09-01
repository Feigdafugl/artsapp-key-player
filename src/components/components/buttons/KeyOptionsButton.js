import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Backdrop from '@material-ui/core/Backdrop';
import IconButton from '@material-ui/core/IconButton';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import History from '@material-ui/icons/History';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/core/styles';
import LanguageContext from '../../../context/LanguageContext';

const useStyles = makeStyles(() => ({
    staticTooltipLabel: {
        width: '8.5rem',
        textAlign: 'right',
    },
}));

/**
 * Render key options button
 */
const KeyOptionsButton = ({
    selectedCharacters, hideInfo, onClickReset,
}) => {
    const classes = useStyles();
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const actions = [
        { index: 0, icon: <History />, name: language.dictionary.btnReset },
        { index: 1, icon: <InfoOutlined />, name: language.dictionary.btnAboutKey },
    ];

    /**
     * Handle button click
     *
     * @param {int} index Action index
     */
    const handleClick = (index) => {
        setOpen(false);
        if (index === 0) {
            onClickReset();
        } else if (index === 1) {
            const path = location.pathname.split('/');
            if (path.length > 0) { history.push(`/info/${path[path.length - 1]}`); }
        }
    };

    return (
        <>
            <div className={`lg:hidden fixed right-2 z-40 ${selectedCharacters.length > 0 ? 'bottom-36' : 'bottom-16'}`}>
                <Backdrop open={open} />
                <SpeedDial
                    ariaLabel="Key options"
                    icon={<SpeedDialIcon />}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    direction="up"
                >
                    {actions.map((action) => {
                        if (action.index === 1 && hideInfo) return null;
                        return (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                classes={classes}
                                tooltipOpen
                                onClick={() => handleClick(action.index)}
                            />
                        );
                    })}
                </SpeedDial>
            </div>
            <div className="hidden lg:inline fixed right-32 h-16 z-40 top-2">
                {!hideInfo && (
                    <span className="mr-4">
                        <IconButton
                            title={language.dictionary.btnAboutKey}
                            edge="start"
                            aria-label="info"
                            color="primary"
                            onClick={() => handleClick(1)}
                        >
                            <InfoOutlined fontSize="medium" />
                        </IconButton>
                    </span>
                )}
                <IconButton
                    title={language.dictionary.btnReset}
                    edge="start"
                    aria-label="reset"
                    color="primary"
                    onClick={() => handleClick(0)}
                >
                    <History fontSize="medium" />
                </IconButton>
            </div>
        </>
    );
};

export default KeyOptionsButton;
