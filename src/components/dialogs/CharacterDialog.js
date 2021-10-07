import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import History from '@material-ui/icons/History';
import PlaylistAddCheckOutlined from '@material-ui/icons/PlaylistAddCheckOutlined';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../context/LanguageContext';
import { getLanguage, hasContent } from '../../utils/language';
import StateList from '../components/lists/StateList';
import InfoDialog from './InfoDialog';
import { getAlternatives } from '../../utils/logic';
import OperatorButton from '../components/buttons/OperatorButton';
import CloseButton from '../components/buttons/CloseButton';

/**
 * Render character dialog
 */
const CharacterDialog = ({
    openDialog, character, edit, offline,
    onClose, onSelectStates, onRemoveState, onRemoveCharacter,
}) => {
    const { language } = useContext(LanguageContext);
    const [defaultStates, setDefaultStates] = useState([]);
    const [operator, setOperator] = useState(true);
    const [openInfo, setOpenInfo] = useState(undefined);
    const [states, setStates] = useState([]);

    /**
     * Initialize state values and set existing values
     */
    useEffect(() => {
        let op = true;
        if (character) {
            const tmpStates = JSON.parse(JSON.stringify(getAlternatives(character)));
            tmpStates.forEach((state) => {
                if (state.isAnswered) {
                    op = state.answerIs;
                    state.selected = state.answerIs;
                }
            });
            setDefaultStates(JSON.parse(JSON.stringify(tmpStates)));
            setStates(tmpStates);
        }
        setOperator(op);
    }, [character]);

    /**
     * Close dialog if the character has no selected alternatives left
     *
     * @param {string} id State ID (remove all if undefined)
     */
    const handleRemoveState = (id) => {
        if (id) {
            onRemoveState(id);
            if (states.filter((element) => element.isAnswered).length === 0) onClose();
        } else {
            onRemoveCharacter(character.id);
            onClose();
        }
    };

    /**
     * Handle adding selected state
     *
     * @param {string} id State ID (undefined if numerical)
     * @param {boolean} value True if selected, false if dismissed
     */
    const handleSelectState = (id, value) => {
        const tmpStates = [...states];
        if (character.type === 'numerical') {
            if (value[0] !== parseFloat(states[0].min) || value[1] !== parseFloat(states[0].max)) {
                tmpStates[0].selected = value;
            } else tmpStates[0].selected = undefined;
            setStates(tmpStates);
        } else {
            const state = tmpStates.find((element) => element.id === id);
            if (state.selected === operator) {
                state.selected = undefined;
            } else state.selected = operator;
            if (edit) {
                tmpStates.forEach((element) => {
                    if (state.selected === undefined && element.answerIs === false) {
                        element.answerIs = undefined;
                    }
                });
            }
            const { length } = tmpStates.filter((element) => element.answerIs === false
                || element.selected !== undefined);
            if (length < tmpStates.length) setStates(tmpStates);
        }
    };

    /**
     * Toggle is/is not operator
     */
    const handleToggleOperator = () => {
        const tmpStates = [...states];
        tmpStates.forEach((element) => {
            if (element.selected !== undefined) element.selected = !element.selected;
            if (element.answerIs === false) element.answerIs = undefined;
        });
        setStates(tmpStates);
        setOperator(!operator);
    };

    /**
     * Check if selected array is changed
     *
     * @returns {boolean} True if array is changed
     */
    const isSelectedChanged = () => {
        const every = defaultStates.every((v) => {
            if (states.find((o) => o.id === v.id && o.selected === v.selected)) return true;
            return false;
        });
        if (every) return false;
        return true;
    };

    /**
     * Check if any states are selected
     *
     * @returns {boolean} True if states are selected
     */
    const isSelectedValid = () => {
        if (states.filter((element) => element.selected !== undefined).length < 1) return false;
        return true;
    };

    /**
     * Render confirm alternatives button
     *
     * @returns JSX
     */
    const renderConfirmButton = () => {
        if (edit) {
            return (
                <>
                    <span className="absolute left-4">
                        <IconButton
                            title={language.dictionary.btnReset}
                            edge="start"
                            aria-label="reset"
                            color="primary"
                            onClick={() => handleRemoveState()}
                        >
                            <History fontSize="medium" />
                        </IconButton>
                    </span>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<PlaylistAddCheckOutlined />}
                        type="button"
                        onClick={() => {
                            onRemoveCharacter(character.id);
                            onSelectStates(character.id, states);
                            onClose();
                        }}
                        disabled={(!edit
                            && states.filter(
                                (element) => element.selected !== undefined,
                            ).length < 1)
                            || (edit && !isSelectedChanged())}
                    >
                        {language.dictionary.btnConfirmChanges}
                    </Button>
                </>
            );
        }
        return (
            <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<PlaylistAddCheckOutlined />}
                type="button"
                onClick={() => { onSelectStates(character.id, states); onClose(); }}
                disabled={!isSelectedValid()}
            >
                {language.dictionary.btnConfirmSelection}
            </Button>
        );
    };

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose()}
        >
            <DialogTitle disableTypography>
                <h2 className="text-base font-bold mr-6">
                    {character && getLanguage(character.title, language.language.split('_')[0])}
                </h2>
            </DialogTitle>
            <DialogContent>
                <CloseButton onClick={() => onClose()} />
                {character && hasContent(character.description) && (
                    <span className="absolute top-10 left-3">
                        <Button
                            variant="text"
                            color="primary"
                            size="large"
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setOpenInfo(character); }}
                        >
                            {language.dictionary.btnReadMore}
                        </Button>
                    </span>
                )}
                {character && character.type !== 'numerical' && (
                    <OperatorButton
                        operator={operator}
                        disabled={!isSelectedValid()}
                        onClick={() => handleToggleOperator()}
                    />
                )}
                <StateList
                    states={states}
                    type={character ? character.type : 'none'}
                    offline={offline}
                    onSelectState={(id, value) => handleSelectState(id, value)}
                    onOpenInfo={(state) => setOpenInfo(state)}
                />
            </DialogContent>
            <DialogActions>
                {character && renderConfirmButton()}
            </DialogActions>
            <InfoDialog entity={openInfo} onClose={() => setOpenInfo(undefined)} />
        </Dialog>
    );
};

export default CharacterDialog;
