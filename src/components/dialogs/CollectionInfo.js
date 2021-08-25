import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import DownloadKeysList from '../components/lists/DownloadKeysList';
import { getLanguage } from '../../utils/language';

/**
 * Render collection info dialog
 */
const CollectionInfo = ({ openDialog, keys, onClose }) => {
    const { language } = useContext(LanguageContext);
    const [collectionKeys, setCollectionKeys] = useState(undefined);

    /**
     * Set keys in collection
     */
    useEffect(() => {
        if (!collectionKeys) {
            const arr = keys.filter((key) => key.collections
                && key.collections.includes(openDialog.id));
            setCollectionKeys(arr);
        }
    }, [collectionKeys, keys]);

    return (
        <Dialog
            fullWidth
            open={openDialog !== undefined}
            onClose={() => onClose()}
        >
            <DialogTitle disableTypography>
                <h2 className="text-base font-bold">{getLanguage(openDialog.collection_info.name, language.language.split('_')[0])}</h2>
            </DialogTitle>
            <DialogContent>
                <CloseButton onClick={() => onClose()} />
                <p>{openDialog.collection_info.description}</p>
                <h2 className="text-base font-light mt-6">{language.dictionary.infoCollection}</h2>
                {collectionKeys && collectionKeys.length > 0 && (
                    <DownloadKeysList
                        keys={collectionKeys}
                        onClickListItem={() => { }}
                    />
                )}
                {collectionKeys && collectionKeys.length === 0 && <p className="py-4">{language.dictionary.emptyCollection}</p>}
            </DialogContent>
        </Dialog>
    );
};

export default CollectionInfo;
