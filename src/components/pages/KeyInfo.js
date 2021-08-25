import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';
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
const KeyInfo = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const { keyId } = useParams();
    const history = useHistory();
    const location = useLocation();
    const [key, setKey] = useState(undefined);
    const [keys, setKeys] = useState(undefined);
    const [organizations, setOrganizations] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [openGallery, setOpenGallery] = useState({ media: undefined, index: undefined });
    const [showProgress, setShowProgress] = useState(true);
    const [offline, setOffline] = useState(undefined);

    /**
     * Get key from API
     */
    useEffect(() => {
        if (!key) {
            const query = location.search.split('=');
            if (query.length > 0 && query[1] === 'true') {
                getKeyInfoFromDatabase(keyId).then((element) => {
                    if (element[1] && (!element[0] || language.language.split('_')[0] === 'en')) {
                        setKey(element[1]);
                        onSetTitle(getLanguage(element[1].title, language.language.split('_')[0]));
                    } else {
                        setKey(element[0]);
                        onSetTitle(getLanguage(element[0].title, language.language.split('_')[0]));
                    }
                    setOffline(true);
                }).catch(() => {
                    setError(language.dictionary.storageError);
                    setShowProgress(false);
                });
            } else if (keyId.split('.').length > 1) {
                getExternalKey(keyId).then((element) => {
                    setKey(element);
                    setOffline(false);
                }).catch(() => {
                    setError(language.dictionary.internalAPIError);
                    setShowProgress(false);
                });
            } else {
                getKeyInfo(keyId, language.language.split('_')[0]).then((element) => {
                    setKey(element);
                    onSetTitle(getLanguage(element.title, language.language.split('_')[0]));
                    setOffline(false);
                }).catch(() => {
                    getKeyInfo(keyId, language.language.split('_')[0] === 'en' ? 'no' : 'en').then((element) => {
                        setKey(element);
                        onSetTitle(getLanguage(element.title, language.language.split('_')[0]));
                        setOffline(false);
                    }).catch(() => {
                        setError(language.dictionary.internalAPIError);
                        setShowProgress(false);
                    });
                });
            }
        }
        if (!keys) {
            getKeys().then((elements) => {
                setKeys(elements);
            }).catch(() => setError(language.dictionary.noConnection));
        }
        if (!organizations) {
            getOrganizations(language.language.split('_')[0]).then((elements) => {
                setOrganizations(elements);
            }).catch(() => setError(language.dictionary.internalAPIError));
        }
        if (key) setShowProgress(false);
    }, [keyId, key, keys, organizations]);

    /**
     * Scroll to top on launch
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /**
     * Start identification
     */
    const handleStart = () => {
        const query = location.search.split('=');
        if (query.length > 0 && query[1] === 'true') {
            history.push(`/keys/${keyId}?offline=true`);
        } else history.push(`/keys/${keyId}`);
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
        <div className="pt-14 lg:pl-14 h-screen overflow-y-auto">
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
