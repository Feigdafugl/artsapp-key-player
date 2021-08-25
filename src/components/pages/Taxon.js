import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../context/LanguageContext';
import {
    getExternalKey, getKey, getKeyRevision, getOccurences,
} from '../../utils/api';
import TaxonInfo from '../components/TaxonInfo';
import ProgressIndicator from '../components/ProgressIndicator';
import { getTaxon } from '../../utils/logic';
import LocationDialog from '../dialogs/LocationDialog';
import ActionButton from '../components/buttons/ActionButton';
import { getKeyFromDatabase } from '../../utils/db';
import initialize from '../../utils/key';

/**
 * Render taxon page
 */
const Taxon = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const { taxonId } = useParams();
    const location = useLocation();
    const [taxon, setTaxon] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [showProgress, setShowProgress] = useState(true);
    const [saved, setSaved] = useState(false);
    const [position, setPosition] = useState({
        latitude: '', longitude: '', county: '', municipality: '', locality: '',
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [offline, setOffline] = useState(undefined);
    const [preview, setPreview] = useState(false);
    const [occurrences, setOccurrences] = useState(undefined);

    /**
     * Set geolocation coordinates
     *
     * @param {Object} geo Geolocation position object
     */
    const handleSetPosition = async (geo) => {
        const keyId = new URLSearchParams(location.search).get('key');
        let occ = await getOccurences(
            keyId,
            geo.coords.longitude,
            geo.coords.latitude,
        );
        if (typeof occ !== 'object') {
            occ = undefined;
        } else if (occ.arter) {
            occ.observations = occ.arter.find((art) => `${art.TaxonId}` === taxonId);
        }
        setOccurrences(occ);
        setPosition({
            latitude: geo.coords.latitude,
            longitude: geo.coords.longitude,
            county: occ ? occ.fylke : undefined,
            municipality: occ ? occ.kommune : undefined,
            locality: occ ? occ.lokalitet : undefined,
        });
    };

    /**
     * Get geolocation
     */
    useEffect(() => {
        if ('geolocation' in navigator) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(handleSetPosition, undefined, {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 0,
                });
            }
        }
    }, []);

    /**
     * Find and set taxon object and page title
     *
     * @param {Object} key Key object
     * @param {boolean} isPreview True if preview
     */
    const handleSetTaxon = (key, isPreview) => {
        const element = getTaxon(taxonId, key.taxa);
        setTaxon(element);
        onSetTitle(isPreview ? language.dictionary.headerPreview : element.scientificName);
    };

    /**
     * Get key and taxon from API
     */
    useEffect(() => {
        if (!taxon) {
            const keyId = new URLSearchParams(location.search).get('key');
            const revisionId = new URLSearchParams(location.search).get('rev');
            const off = new URLSearchParams(location.search).get('offline');
            if (keyId) {
                if (off) {
                    getKeyFromDatabase(keyId).then((key) => {
                        initialize(key).then((init) => {
                            if (init && init.key) handleSetTaxon(init.key);
                        }).catch(() => {
                            setError(language.dictionary.internalAPIError);
                            setShowProgress(false);
                        });
                        setOffline(true);
                    }).catch(() => {
                        setShowProgress(false);
                        setError(language.dictionary.storageError);
                    });
                } else if (keyId.split('.').length > 1) {
                    getExternalKey(keyId).then((key) => {
                        initialize(key).then((init) => {
                            if (init && init.key) handleSetTaxon(init.key);
                        }).catch(() => {
                            setError(language.dictionary.internalAPIError);
                            setShowProgress(false);
                        });
                        setOffline(false);
                    }).catch(() => {
                        setError(language.dictionary.internalAPIError);
                        setShowProgress(false);
                    });
                } else {
                    getKey(keyId).then((key) => {
                        initialize(key).then((init) => {
                            if (init && init.key) handleSetTaxon(init.key);
                        }).catch(() => {
                            setError(language.dictionary.internalAPIError);
                            setShowProgress(false);
                        });
                        setOffline(false);
                    }).catch(() => {
                        setError(language.dictionary.internalAPIError);
                        setShowProgress(false);
                    });
                }
            } else if (revisionId) {
                getKeyRevision(revisionId).then((key) => {
                    initialize(key).then((init) => {
                        if (init && init.key) handleSetTaxon(init.key, true);
                    }).catch(() => {
                        setError(language.dictionary.internalAPIError);
                        setShowProgress(false);
                    });
                    setPreview(true);
                    setOffline(false);
                }).catch(() => {
                    setError(language.dictionary.internalAPIError);
                    setShowProgress(false);
                });
            } else {
                setError(language.dictionary.internalAPIError);
                setShowProgress(false);
            }
        }
        if (taxon) setShowProgress(false);
    }, [taxonId, taxon]);

    /**
     * Save observation to local storage
     */
    const saveObservation = () => {
        try {
            let observations = localStorage.getItem('observations');
            if (observations) observations = JSON.parse(observations);
            if (!Array.isArray(observations)) observations = [];
            const date = new Date();
            observations.push({
                id: observations.length + 1,
                taxonId: taxon.id,
                scientificName: taxon.scientificName,
                vernacularName: taxon.vernacularName,
                media: taxon.media,
                position,
                createdAt: date.toISOString(),
            });
            localStorage.setItem('observations', JSON.stringify(observations));
            setSaved(true);
        } catch (err) {
            setError(language.dictionary.storageError);
        }
    };

    /**
     * Render internal/external description
     *
     * @returns JSX
     */
    const renderTaxonInfo = () => {
        if (taxon.descriptionUrl) {
            return (
                <object
                    className="mt-4"
                    aria-label="External page Artsdatabanken"
                    type="text/html"
                    data={taxon.descriptionUrl}
                    width="100%"
                    height="100%"
                />
            );
        }
        return (
            <TaxonInfo
                taxon={taxon}
                position={position}
                offline={offline}
            />
        );
    };

    const renderObservartions = (counts) => (
        <div>
            <h2 className="mt-4 text-base">{language.dictionary.observations}</h2>
            <ul className="flex">
                <li>
                    {language.dictionary.labelLocal}
                    &nbsp;
                    {counts.small}
                </li>
                <li className="ml-4">
                    {language.dictionary.labelRegional}
                    &nbsp;
                    {counts.medium}
                </li>
                <li className="ml-4">
                    {language.dictionary.labelNational}
                    &nbsp;
                    {counts.large}
                </li>
            </ul>
        </div>
    );

    return (
        <div className="py-14 px-4 lg:w-10/12 m-auto h-screen">
            {occurrences && occurrences.observations && occurrences.observations.Counts
                && renderObservartions(occurrences.observations.Counts)}
            {taxon && renderTaxonInfo()}
            {error && <Alert className="mt-4" elevation={6} variant="filled" severity="error">{error}</Alert>}
            {saved && (
                <div className="fixed bottom-16 left-2 right-2 lg:left-72 lg:right-auto">
                    <Alert elevation={6} variant="filled" severity="success">{language.dictionary.observationSaved}</Alert>
                </div>
            )}
            {!saved && !preview && (
                <div className="fixed bottom-20 left-2 lg:left-72 lg:right-auto">
                    <Alert elevation={6} variant="filled" severity="info">
                        {position.latitude
                            ? language.dictionary.infoLocation
                            : language.dictionary.infoNoLocation}
                        &nbsp;
                        <div className="inline-block">
                            <Button
                                variant="text"
                                color="inherit"
                                size="small"
                                type="button"
                                onClick={() => setOpenDialog(true)}
                            >
                                {language.dictionary.labelChange}
                            </Button>
                        </div>
                    </Alert>
                </div>
            )}
            {!saved && !error && !preview && <ActionButton type="save" onClick={() => saveObservation()} />}
            <LocationDialog
                openDialog={openDialog}
                position={position}
                onChange={(values) => setPosition(values)}
                onClose={() => setOpenDialog(false)}
            />
            <ProgressIndicator open={showProgress} />
        </div>
    );
};

export default Taxon;
