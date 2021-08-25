import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Alert from '@material-ui/lab/Alert';
import LanguageContext from '../../context/LanguageContext';
import {
    getCollections, getExternalKeys, getGroups, getKeys,
} from '../../utils/api';
import KeyList from '../components/lists/KeyList';
import ProgressIndicator from '../components/ProgressIndicator';
import WelcomeDialog from '../dialogs/WelcomeDialog';
import { getKeysFromDatabase } from '../../utils/db';

/**
 * Render keys page
 */
const Keys = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const [keys, setKeys] = useState(undefined);
    const [externalKeys, setExternalKeys] = useState(undefined);
    const [externalTree, setExternalTree] = useState(undefined);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [error, setError] = useState(undefined);
    const [showProgress, setShowProgress] = useState(true);
    const [openWelcome, setOpenWelcome] = useState(false);
    const [groups, setGroups] = useState(undefined);
    const [collections, setCollections] = useState(undefined);
    const [online, setOnline] = useState(navigator.onLine);

    /**
     * Get keys from ArtsApp and ADB API
     */
    useEffect(() => {
        if (navigator.onLine) {
            setOnline(true);
        } else setOnline(false);
        if (!keys) {
            onSetTitle(language.dictionary.keys);
            if (online) {
                getKeys().then((elements) => {
                    setKeys(elements);
                }).catch(() => {
                    setShowProgress(false);
                });
            } else {
                getKeysFromDatabase().then((downloads) => {
                    setKeys(downloads);
                    setExternalKeys([]);
                }).catch(() => {
                    setError(language.dictionary.storageError);
                    setShowProgress(false);
                });
            }
        }
        if (!keys && !externalKeys && online) {
            getExternalKeys().then((response) => {
                setExternalKeys(response.keys);
                setExternalTree(response.tree);
            }).catch(() => setExternalKeys([]));
        }
        if (keys) setShowProgress(false);
        if (keys && externalKeys) {
            let arr = [...keys];
            arr = arr.concat(externalKeys);
            setKeys(arr);
            setFilteredKeys(arr);
            setExternalKeys(undefined);
        }
    }, [keys, externalKeys, online]);

    /**
     * Get key groups and collections from API
     */
    useEffect(() => {
        if (!groups) {
            getGroups(language.language.split('_')[0]).then((elements) => {
                setGroups(elements);
            }).catch(() => { });
        }
        if (!collections) {
            getCollections(language.language.split('_')[0]).then((elements) => {
                setCollections(elements);
            }).catch(() => { });
        }
    }, [groups, collections]);

    /**
     * Open welcome dialog if first launch
     */
    useEffect(() => {
        if (!openWelcome && !localStorage.getItem('welcome')) setOpenWelcome(true);
    }, [openWelcome]);

    /**
     * Close welcome dialog
     */
    const handleCloseWelcome = () => {
        localStorage.setItem('welcome', true);
        setOpenWelcome(false);
    };

    return (
        <div className="py-14 lg:pt-16 lg:w-10/12 m-auto overflow-hidden">
            {keys && (
                <KeyList
                    keys={filteredKeys}
                    groups={groups}
                    collections={collections}
                    error={error}
                    showFilter={online}
                    offline={!online}
                    onClickListItem={(id) => history.push(`/keys/${id}${online ? '' : '?offline=true'}`)}
                    onClickInfo={(id) => history.push(`/info/${id}${online ? '' : '?offline=true'}`)}
                />
            )}
            {!online && (
                <Alert className="fixed bottom-16 mx-2" elevation={6} variant="filled" severity="info">
                    {language.dictionary.infoOffline}
                </Alert>
            )}
            <ProgressIndicator open={showProgress} />
            <WelcomeDialog openDialog={openWelcome} onClose={() => handleCloseWelcome()} />
        </div>
    );
};

export default Keys;
