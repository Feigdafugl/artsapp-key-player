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
import { initialize } from '../../utils/key';

/**
 * Render taxon page
 */
const Taxon = ({ onSetTitle, onPageView }) => {
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
     * Scroll to top on launch
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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
        onPageView(isPreview ? language.dictionary.headerPreview : element.scientificName);
    };

    /**
     * Get taxon and key from API
     */
    const getKeyTaxon = async () => {
        const params = new URLSearchParams(location.search);
        const keyId = params.get('key');
        const revisionId = params.get('rev');
        let tmpKey;
        try {
            if (keyId) {
                setOffline(params.get('offline') === 'true');
                if (params.get('offline') === 'true') {
                    try {
                        tmpKey = await getKeyFromDatabase(keyId);
                    } catch (err) {
                        setError(language.dictionary.storageError);
                    }
                } else if (keyId.split('.').length > 1) {
                    tmpKey = await getExternalKey(keyId);
                } else tmpKey = await getKey(keyId);
            } else if (revisionId) {
                tmpKey = await getKeyRevision(revisionId);
            } else setError(language.dictionary.internalAPIError);
            if (tmpKey) {
                const init = await initialize(tmpKey);
                if (init && init.key) handleSetTaxon(init.key, revisionId);
            }
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        } finally {
            setShowProgress(false);
        }
    };

    /**
     * Get key and taxon from API
     */
    useEffect(() => {
        if (!taxon) getKeyTaxon();
    }, [taxonId, taxon]);

    /**
     * Save observation to local storage
     */
    const saveObservation = () => {
        try {
            let observations = window.localStorage.getItem('observations');
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
            window.localStorage.setItem('observations', JSON.stringify(observations));
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

    /**
     * Render number of observations
     *
     * @param {Object} counts Number of observations
     * @returns JSX
     */
    const renderObservations = (counts) => (
        <div>
            <h2 className="mt-4 text-base">{language.dictionary.observations}</h2>
            <ul className="flex">
                <li>{`${language.dictionary.labelLocal} ${counts.small}`}</li>
                <li className="ml-4">{`${language.dictionary.labelRegional} ${counts.medium}`}</li>
                <li className="ml-4">{`${language.dictionary.labelNational} ${counts.large}`}</li>
            </ul>
        </div>
    );

    return (
        <div className="py-14 px-4 lg:w-10/12 m-auto h-screen">
            {occurrences && occurrences.observations && occurrences.observations.Counts
                && renderObservations(occurrences.observations.Counts)}
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
