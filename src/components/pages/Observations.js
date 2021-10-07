import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import LanguageContext from '../../context/LanguageContext';
import ObservationList from '../components/lists/ObservationList';

/**
 * Render observations page
 */
const Observations = ({ onSetTitle, onPageView }) => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const [observations, setObservations] = useState(undefined);
    const [error, setError] = useState(undefined);

    /**
     * Scroll to top on launch and track page view if consent is given
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onPageView(language.dictionary.observations);
    }, []);

    /**
     * Get observations from local storage
     */
    useEffect(() => {
        if (!observations) {
            onSetTitle(language.dictionary.observations);
            try {
                let obs = localStorage.getItem('observations');
                if (obs) obs = JSON.parse(obs);
                if (Array.isArray(obs)) setObservations(obs);
            } catch (err) {
                setError(language.dictionary.storageError);
            }
        }
    }, [observations]);

    return (
        <div className="py-14 lg:pt-16 lg:w-10/12 m-auto overflow-hidden">
            {observations && observations.length > 0 ? (
                <ObservationList
                    observations={observations}
                    error={error}
                    onClickListItem={(observation) => history.push(`observations/${observation.id}`)}
                />
            ) : <p className="es:text-center p-4">{language.dictionary.noSavedObservations}</p>}
        </div>
    );
};

export default Observations;
