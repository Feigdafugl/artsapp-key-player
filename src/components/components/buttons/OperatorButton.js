import React, { useContext } from 'react';
import Flip from '@material-ui/icons/Flip';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import LanguageContext from '../../../context/LanguageContext';

const useStyles = makeStyles(() => ({
    isNot: {
        background: 'red',
        color: 'white',
    },
    is: {
        background: '#5FBB5A',
    },
}));

/**
 * Render toggle operator button
 */
const OperatorButton = ({ operator, disabled, onClick }) => {
    const classes = useStyles();
    const { language } = useContext(LanguageContext);

    return (
        <span className="absolute right-4 top-16">
            <Button
                variant="contained"
                className={operator ? classes.isNot : classes.is}
                size="medium"
                endIcon={<Flip />}
                type="button"
                onClick={onClick}
                disabled={disabled}
            >
                {language.dictionary.btnToggleOperator}
            </Button>
        </span>
    );
};

export default OperatorButton;
