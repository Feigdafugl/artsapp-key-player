import React, { useContext, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { getLanguage, hasContent } from '../../../utils/language';
import LanguageContext from '../../../context/LanguageContext';
import { getStateMedia } from '../../../utils/media';
import NumericalSlider from '../NumericalSlider';
import ListAvatar from '../ListAvatar';

const useStyles = makeStyles(() => ({
    isNot: {
        height: '6rem',
        marginBottom: '0.5rem',
        borderRadius: '0.25rem',
        background: 'red',
        color: 'white',
        cursor: 'pointer',
    },
    is: {
        height: '6rem',
        marginBottom: '0.5rem',
        borderRadius: '0.25rem',
        background: '#5FBB5A',
        cursor: 'pointer',
    },
    root: {
        height: '6rem',
        marginBottom: '0.5rem',
        borderRadius: '0.25rem',
        background: '#F3F4F6',
        cursor: 'pointer',
    },
}));

/**
 * Render categorical state list
 */
const StateList = ({
    states, type, onSelectState, onOpenInfo, offline,
}) => {
    const classes = useStyles();
    const { language } = useContext(LanguageContext);
    const [interval, setInterval] = useState([]);

    /**
     * Set slider interval if numerical character
     */
    useEffect(() => {
        if (states && type === 'numerical') {
            if (states[0].selected) {
                setInterval([parseFloat(states[0].selected[0]), parseFloat(states[0].selected[1])]);
            } else setInterval([parseFloat(states[0].min), parseFloat(states[0].max)]);
        }
    }, [states]);

    /**
     * Render alternative
     *
     * @param {Object} state State object
     * @returns JSX
     */
    const renderAlternative = (state) => (
        <>
            <ListAvatar
                media={getStateMedia(state)}
                offline={offline}
            />
            <ListItemText
                primary={(
                    <div className="lg:px-3 text-sm lg:text-base ml-2 max-h-20">
                        {getLanguage(state.title, language.language.split('_')[0])}
                    </div>
                )}
            />
            {hasContent(state.description) && (
                <span className="absolute bottom-0 right-2">
                    <Button
                        variant="text"
                        color="primary"
                        size="large"
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onOpenInfo(state); }}
                    >
                        {language.dictionary.btnReadMore}
                    </Button>
                </span>
            )}
        </>
    );

    /**
     * Check if state is selectable
     *
     * @param {Object} state State
     * @returns {boolean} True if state should be available
     */
    const isStateAvailable = (state) => {
        if (state.selected === undefined && state.answerIs === false) return false;
        const { length } = states.filter((element) => element.selected !== undefined);
        if (state.selected === undefined && (length === states.length - 1)) {
            return false;
        }
        return true;
    };

    /**
     * Get styling for list item
     *
     * @param {Object} state State object
     * @returns {Object} Style object
     */
    const getListItemStyle = (state) => {
        if (state.selected === true) return classes.is;
        if (((state.selected === false)
            || (state.selected === undefined && state.answerIs === false))) {
            return classes.isNot;
        }
        return classes.root;
    };

    /**
     * Render character state list or slider (for numerical character)
     *
     * @param {Object} state State object
     * @returns JSX
     */
    const renderItem = (state) => {
        let disabled = false;
        if (!state.unit) disabled = !isStateAvailable(state);
        return (
            <ListItem
                disabled={disabled}
                key={state.id}
                className={getListItemStyle(state)}
                style={{ padding: '0.5rem' }}
                onClick={() => { if (type !== 'numerical' && !disabled) onSelectState(state.id); }}
            >
                {state.unit ? (
                    <NumericalSlider
                        state={state}
                        value={interval}
                        onChange={(val) => { setInterval(val); onSelectState(undefined, val); }}
                    />
                ) : renderAlternative(state)}
            </ListItem>
        );
    };

    return (
        <div className="mt-16">
            <List className="w-full">
                {states.map((state) => renderItem(state))}
            </List>
        </div>
    );
};

export default StateList;
