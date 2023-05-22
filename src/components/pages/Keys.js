import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
const Keys = ({ onSetTitle, onPageView }) => {
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [keys, setKeys] = useState(undefined);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [error, setError] = useState(undefined);
    const [showProgress, setShowProgress] = useState(true);
    const [openWelcome, setOpenWelcome] = useState(false);
    const [groups, setGroups] = useState(undefined);
    const [collections, setCollections] = useState(undefined);

    /**
     * Scroll to top on launch and track page view if consent is given
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onPageView(language.dictionary.keys);
    }, []);

    /**
     * Get keys from API or local DB
     *
     * @param {boolean} isOnline True if device is online
     */
    const getAllKeys = async (isOnline) => {
        onSetTitle(language.dictionary.keys);
        let tmpKeys;
        if (isOnline) {
            try {
                tmpKeys = await getKeys();
                if (process.env.REACT_APP_GET_EXT_KEYS === 'true') {
                    const extKeys = await getExternalKeys();
                    tmpKeys = tmpKeys.concat(extKeys.keys);
                }
                const tmpGroups = await getGroups(language.language.split('_')[0]);
                const tmpCollections = await getCollections(language.language.split('_')[0]);
                setGroups(tmpGroups);
                setCollections(tmpCollections);
            } catch (err) {
                setShowProgress(false);
            }
        } else {
            try {
                tmpKeys = await getKeysFromDatabase();
            } catch (err) {
                setError(language.dictionary.storageError);
                setShowProgress(false);
            }
        }
        setKeys(tmpKeys);
        setFilteredKeys(tmpKeys);
        setShowProgress(false);
    };

    /**
     * Get keys from ArtsApp and ADB API
     */
    useEffect(() => {
        if (!keys) getAllKeys(navigator.onLine);
    }, [keys, navigator.onLine]);

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
                    showFilter={navigator.onLine}
                    offline={!navigator.onLine}
                    onClickListItem={(id) => navigate(`/keys/${id}${navigator.onLine ? '' : '?offline=true'}`)}
                    onClickInfo={(id) => navigate(`/info/${id}${navigator.onLine ? '' : '?offline=true'}`)}
                />
            )}
            {!navigator.onLine && (
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
