import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import PlayArrowOutlined from '@material-ui/icons/PlayArrowOutlined';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import LanguageContext from '../../context/LanguageContext';
import {
    getExternalKey, getKeyInfo, getKeys, getOrganizations,
} from '../../utils/api';
import ThumbnailList from '../components/lists/ThumbnailList';
import { getLanguage } from '../../utils/language';
import ProgressIndicator from '../components/ProgressIndicator';
import GalleryDialog from '../dialogs/GalleryDialog';
import KeyInfoAccordion from '../components/KeyInfoAccordion';
import { getKeyInfoFromDatabase } from '../../utils/db';

/**
 * Render key info page
 */
const KeyInfo = ({ onSetTitle, onPageView }) => {
    const { language } = useContext(LanguageContext);
    const { keyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [key, setKey] = useState(undefined);
    const [keys, setKeys] = useState(undefined);
    const [organizations, setOrganizations] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [openGallery, setOpenGallery] = useState({ media: undefined, index: undefined });
    const [showProgress, setShowProgress] = useState(true);
    const [offline, setOffline] = useState(undefined);

    /**
     * Scroll to top on launch
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /**
     * Set key info state and page title
     *
     * @param {Object} info Key info
     */
    const handleSetKeyInfo = (info) => {
        setKey(info);
        onSetTitle(getLanguage(info.title, language.language.split('_')[0]));
        onPageView(`Info - ${getLanguage(info.title, language.language.split('_')[0])}`);
    };

    /**
     * Get list of keys and organizations
     */
    const getKeyMetadata = async () => {
        try {
            const tmpKeys = await getKeys();
            const tmpOrgs = await getOrganizations(language.language.split('_')[0]);
            setKeys(tmpKeys);
            setOrganizations(tmpOrgs);
        } catch (err) {
            setError(language.dictionary.noConnection);
        }
    };

    /**
     * Get info for key
     */
    const getKey = async () => {
        const params = new URLSearchParams(location.search);
        setOffline(params.get('offline') === 'true');
        let keyInfo;
        if (params.get('offline') === 'true') {
            try {
                keyInfo = await getKeyInfoFromDatabase(keyId);
                if (keyInfo[1] && (!keyInfo[0] || language.language.split('_')[0] === 'en')) {
                    keyInfo = keyInfo[1];
                } else keyInfo = keyInfo[0];
            } catch (err) {
                setError(language.dictionary.storageError);
            }
        } else if (keyId.split('.').length > 1) {
            try {
                keyInfo = await getExternalKey(keyId);
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        } else {
            try {
                keyInfo = await getKeyInfo(keyId, language.language.split('_')[0]);
            } catch (errLang) {
                try {
                    keyInfo = await getKeyInfo(keyId, language.language.split('_')[0] === 'en' ? 'no' : 'en');
                } catch (err) {
                    setError(language.dictionary.internalAPIError);
                }
            }
        }
        if (keyInfo) handleSetKeyInfo(keyInfo);
        await getKeyMetadata();
        setShowProgress(false);
    };

    /**
     * Get key from API
     */
    useEffect(() => {
        if (!key) getKey();
    }, [keyId, key]);

    /**
     * Start identification
     */
    const handleStart = () => {
        const params = new URLSearchParams(location.search);
        if (params.get('offline') === 'true') {
          navigate(`/keys/${keyId}?offline=true`);
        } else navigate(`/keys/${keyId}`);
    };

    /**
     * Render info panel
     *
     * @returns JSX
     */
    const renderInfo = () => {
        if (key.descriptionUrl) {
            return (
                <object
                    className="mt-4"
                    aria-label="External page Artsdatabanken"
                    type="text/html"
                    data={key.descriptionUrl}
                    width="100%"
                    height="100%"
                />
            );
        }
        return (
            <div className="px-2 lg:w-10/12">
                {offline !== undefined && (
                    <ThumbnailList
                        media={key && key.media}
                        selectable
                        offline={offline}
                        onClickThumbnail={(index) => setOpenGallery({ media: key.media, index })}
                    />
                )}
                <div className="mb-8 mt-4" dangerouslySetInnerHTML={{ __html: key && key.description }} />
                <KeyInfoAccordion
                    keyInfo={key}
                    keys={keys}
                    organizations={organizations}
                />
            </div>
        );
    };

    /**
     * Render start button
     *
     * @returns JSX
     */
    const renderStartButton = () => (
        <>
            <div className="lg:hidden fixed bottom-16 right-2 z-50 h-16">
                <Fab
                    variant="extended"
                    color="secondary"
                    disabled={error}
                    onClick={() => handleStart()}
                >
                    <PlayArrowOutlined />
                    {language.dictionary.btnStart}
                </Fab>
            </div>
            <div className="hidden lg:inline fixed z-50 top-3 right-32">
                <Button
                    variant="text"
                    color="primary"
                    size="medium"
                    type="button"
                    disabled={error}
                    endIcon={<PlayArrowOutlined />}
                    onClick={() => handleStart()}
                >
                    {language.dictionary.btnStart}
                </Button>
            </div>
        </>
    );

    return (
        <div className="pt-14 lg:pl-14 h-screen overflow-y-auto lg:ml-14">
            {error && <Alert className="mt-4 mx-2" elevation={6} variant="filled" severity="error">{error}</Alert>}
            {key && renderInfo()}
            {renderStartButton()}
            <GalleryDialog
                media={openGallery.media}
                index={openGallery.index}
                offline={offline}
                onClose={() => setOpenGallery({ media: undefined, index: undefined })}
            />
            <ProgressIndicator open={showProgress} />
        </div>
    );
};

export default KeyInfo;
