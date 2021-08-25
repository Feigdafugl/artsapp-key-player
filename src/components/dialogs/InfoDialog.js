import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../context/LanguageContext';
import { getLanguage } from '../../utils/language';
import CloseButton from '../components/buttons/CloseButton';

/**
 * Render info dialog
 */
const InfoDialog = ({ entity, onClose }) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={entity !== undefined}
            onClose={() => onClose()}
        >
            {entity && (
                <>
                    <DialogTitle>
                        {getLanguage(entity.title, language.language.split('_')[0])}
                    </DialogTitle>
                    <DialogContent>
                        <CloseButton onClick={() => onClose()} />
                        <div className="mb-4" dangerouslySetInnerHTML={{ __html: getLanguage(entity.description, language.language.split('_')[0]) }} />
                    </DialogContent>
                </>
            )}
        </Dialog>
    );
};

export default InfoDialog;
