import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import LanguageContext from '../../context/LanguageContext';
import formatDate from '../../utils/format-date';
import TaxonInfo from '../components/TaxonInfo';
import ConfirmDelete from '../dialogs/ConfirmDelete';
import ActionButton from '../components/buttons/ActionButton';

/**
 * Render observation info page
 */
const Observation = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const { observationId } = useParams();
    const navigate = useNavigate();
    const [observation, setObservation] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [online, setOnline] = useState(navigator.onLine);

    /**
     * Get observation from local storage
     */
    const getObservation = () => {
        let observations = window.localStorage.getItem('observations');
        if (observations) observations = JSON.parse(observations);
        if (Array.isArray(observations)) {
            return observations.find((element) => `${element.id}` === observationId);
        }
        return undefined;
    };

    /**
     * Set observation object
     */
    useEffect(() => {
        if (navigator.onLine) {
            setOnline(true);
        } else setOnline(false);
        if (!observation) {
            try {
                const obs = getObservation();
                if (obs) {
                    setObservation(obs);
                    onSetTitle(obs.scientificName);
                } else setError(language.dictionary.storageError);
            } catch (err) {
                setError(language.dictionary.storageError);
            }
        }
    }, [observation]);

    /**
     * Remove observation from local storage
     */
    const handleRemoveObservation = () => {
        try {
            let observations = window.localStorage.getItem('observations');
            if (observations) observations = JSON.parse(observations);
            if (Array.isArray(observations)) {
                observations = observations.filter((element) => element.id !== observation.id);
                window.localStorage.setItem('observations', JSON.stringify(observations));
                navigate('/observations', { replace: true });
                navigate(-1);
            } else setError(language.dictionary.storageError);
        } catch (err) {
            setError(language.dictionary.storageError);
        }
    };

    /**
     * Render observation info
     *
     * @returns JSX
     */
    const renderInfo = () => (
        <dl className="lg:w-96 mb-8">
            <dt className="float-left w-40 font-light tracking-wide">
                {language.dictionary.labelSaved}
            </dt>
            <dd>{formatDate(observation.createdAt)}</dd>
            <dt className="float-left w-40 font-light tracking-wide">
                {language.dictionary.labelArea}
            </dt>
            <dd>{observation.position.county ? `${`${observation.position.locality}, ${observation.position.municipality}, ${observation.position.county}`}` : language.dictionary.unknown}</dd>
            <dt className="float-left w-40 font-light tracking-wide">
                {language.dictionary.labelLatitude}
                :
            </dt>
            <dd>{observation.position.latitude || language.dictionary.unknown}</dd>
            <dt className="float-left w-40 font-light tracking-wide">
                {language.dictionary.labelLongitude}
                :
            </dt>
            <dd>{observation.position.longitude || language.dictionary.unknown}</dd>
        </dl>
    );

    return (
        <div className="py-14 px-4 lg:w-10/12 m-auto">
            <TaxonInfo
                taxon={observation}
                offline={!online}
            />
            {observation && renderInfo()}
            {error && <Alert elevation={6} variant="filled" severity="error">{error}</Alert>}
            <ActionButton type="delete" onClick={() => setConfirmDelete(true)} />
            <ConfirmDelete
                openDialog={confirmDelete}
                message={language.dictionary.deleteObservation}
                onClose={() => setConfirmDelete(false)}
                onConfirm={() => handleRemoveObservation()}
            />
        </div>
    );
};

export default Observation;
