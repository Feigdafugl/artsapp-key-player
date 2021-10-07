import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Alert from '@material-ui/lab/Alert';
import PlayArrowOutlined from '@material-ui/icons/List';
import Fab from '@material-ui/core/Fab';
import LanguageContext from '../../context/LanguageContext';
import DownloadDialog from '../dialogs/DownloadDialog';
import { getCollections, getKeys } from '../../utils/api';
import ProgressIndicator from '../components/ProgressIndicator';
import { addKeyToDatabase, getKeysFromDatabase, removeKeyFromDatabase } from '../../utils/db';
import KeyList from '../components/lists/KeyList';
import ConfirmDelete from '../dialogs/ConfirmDelete';

/**
 * Render downloads page
 */
const Downloads = ({ onSetTitle, onPageView }) => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const [downloadedKeys, setDownloadedKeys] = useState(undefined);
    const [keys, setKeys] = useState(undefined);
    const [collections, setCollections] = useState(undefined);
    const [openKeyList, setOpenKeyList] = useState(false);
    const [error, setError] = useState(undefined);
    const [showProgress, setShowProgress] = useState(true);
    const [online, setOnline] = useState(navigator.onLine);
    const [confirmDelete, setConfirmDelete] = useState(undefined);

    /**
     * Get downloaded keys from device and list of availble keys from API
     */
    useEffect(() => {
        if (navigator.onLine) {
            setOnline(true);
        } else setOnline(false);
        if (!downloadedKeys) {
            onSetTitle(language.dictionary.downloads);
            getKeysFromDatabase().then((downloads) => {
                setDownloadedKeys(downloads);
                setShowProgress(false);
            }).catch(() => {
                setError(language.dictionary.storageError);
                setShowProgress(false);
            });
        } else if (!keys) {
            getKeys().then((elements) => {
                const availableKeys = elements.filter(
                    (element) => !downloadedKeys.some((el) => el.id === element.id),
                );
                setKeys(availableKeys);
            }).catch(() => { });
        }
    }, [downloadedKeys, keys, online]);

    /**
     * Get collections from API
     */
    useEffect(() => {
        if (!collections) {
            getCollections(language.language.split('_')[0]).then((elements) => {
                setCollections(elements);
            }).catch(() => { });
        }
    }, [collections]);

    /**
     * Scroll to top on launch and track page view if consent is given
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onPageView(language.dictionary.downloads);
    }, []);

    /**
     * Remove key from local database
     *
     * @param {string} id Key ID
     */
    const handleRemoveKey = async (id) => {
        try {
            await removeKeyFromDatabase(id);
            setDownloadedKeys(undefined);
            setKeys(undefined);
        } catch (err) {
            setError(language.dictionary.storageError);
        }
        setShowProgress(false);
    };

    /**
     * Download keys from API
     *
     * @param {Array} arr Keys to download
     */
    const downloadKeys = async (arr) => {
        if ('indexedDB' in window) {
            for (const element of arr) {
                try {
                    const key = keys.find((el) => el.id === element);
                    await addKeyToDatabase(key.id);
                } catch (err) {
                    setError(language.dictionary.storageError);
                }
            }
            setDownloadedKeys(undefined);
            setKeys(undefined);
        } else setError(language.dictionary.storageError);
        setOpenKeyList(false);
    };

    /**
     * Prepare keys array and download keys
     *
     * @param {Array} selected Selected keys/collections
     * @param {int} filter Filter value (0 if keys, 1 if collections)
     */
    const handleDownloadKeys = (selected, filter) => {
        setShowProgress(true);
        let arr = [];
        selected.forEach((id) => {
            if (filter === 0) {
                arr = [...selected];
            } else {
                keys.forEach((key) => {
                    if (key.collections && key.collections.includes(id)) arr.push(key.id);
                });
            }
        });
        const set = new Set(arr);
        arr = [...set];
        downloadKeys(arr);
    };

    return (
        <div className="py-14 lg:pt-16 lg:w-10/12 m-auto overflow-hidden">
            {error && <Alert className="mt-4 mx-2" elevation={6} variant="filled" severity="error">{error}</Alert>}
            {!error && downloadedKeys && downloadedKeys.length > 0 ? (
                <KeyList
                    keys={downloadedKeys}
                    showRemove
                    offline
                    onClickListItem={(id) => history.push(`/keys/${id}?offline=true`)}
                    onClickInfo={(id) => history.push(`/info/${id}?offline=true`)}
                    onClickRemove={(id) => setConfirmDelete(id)}
                />
            ) : <p className="es:text-center p-4">{language.dictionary.noOfflineKeys}</p>}
            <div className="lg:hidden fixed bottom-16 right-2 z-50 h-16">
                <Fab
                    variant="circular"
                    color="secondary"
                    disabled={!online}
                    onClick={() => setOpenKeyList(true)}
                >
                    <PlayArrowOutlined />
                </Fab>
            </div>
            <ProgressIndicator open={showProgress} />
            {openKeyList && (
                <DownloadDialog
                    openDialog={openKeyList}
                    keys={keys}
                    collections={collections}
                    onClose={() => setOpenKeyList(false)}
                    onDownload={(arr, filter) => handleDownloadKeys(arr, filter)}
                />
            )}
            <ConfirmDelete
                openDialog={confirmDelete !== undefined}
                index={confirmDelete}
                message={language.dictionary.deleteDownloaded}
                onClose={() => setConfirmDelete(undefined)}
                onConfirm={(id) => { setShowProgress(true); handleRemoveKey(id); }}
            />
        </div>
    );
};

export default Downloads;
