import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render confirm delete dialog
 */
const ConfirmDelete = ({
    openDialog, index, message, onClose, onConfirm,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render action buttons
     *
     * @returns JSX
     */
    const renderButtons = () => (
        <DialogActions>
            <div className="flex m-auto pb-6">
                <span className="mr-4">
                    <Button
                        variant="contained"
                        color="default"
                        size="medium"
                        type="button"
                        onClick={() => { onClose(); onConfirm(index); }}
                    >
                        {language.dictionary.btnYes}
                    </Button>
                </span>
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    type="button"
                    onClick={() => onClose()}
                >
                    {language.dictionary.btnNo}
                </Button>
            </div>
        </DialogActions>
    );

    return (
        <Dialog
            open={openDialog}
            onClose={() => onClose()}
        >
            <DialogContent>
                <p className="my-4 text-center">{message}</p>
            </DialogContent>
            {renderButtons()}
        </Dialog>
    );
};

export default ConfirmDelete;
