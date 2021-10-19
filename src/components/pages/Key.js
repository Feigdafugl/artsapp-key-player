import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import LanguageContext from '../../context/LanguageContext';
import { getExternalKey, getKey, getKeyRevision } from '../../utils/api';
import { getAlternatives, toggleTaxonDismissed } from '../../utils/logic';
import CharacterStateList from '../components/lists/CharacterStateList';
import TaxaList from '../components/lists/TaxaList';
import ProgressIndicator from '../components/ProgressIndicator';
import KeyOptionsButton from '../components/buttons/KeyOptionsButton';
import { getLanguage } from '../../utils/language';
import CharacterList from '../components/lists/CharacterList';
import WebWorker from '../../workers/index';
import { getKeyFromDatabase } from '../../utils/db';
import initialize from '../../utils/key';

/**
 * Render key player page
 */
const Key = ({ onSetTitle, onPageView }) => {
    const worker = new WebWorker();
    const { language } = useContext(LanguageContext);
    const { keyId } = useParams();
    const { revisionId } = useParams();
    const history = useHistory();
    const location = useLocation();
    const [key, setKey] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(undefined);
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [remainingCharacters, setRemainingCharacters] = useState([]);
    const [showProgress, setShowProgress] = useState(true);
    const filterRelevant = 'all';
    const [offline, setOffline] = useState(undefined);

    /**
     * Scroll to top on launch
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /**
     * Get key from API
     *
     * @param {string} id Key ID
     */
    const getKeyFromAPI = async () => {
        let element;
        if (keyId) {
            if (keyId.split('.').length > 1) {
                element = await getExternalKey(keyId);
            } else element = await getKey(keyId);
            onSetTitle(getLanguage(element.title, language.language.split('_')[0]));
            onPageView(getLanguage(element.title, language.language.split('_')[0]));
        } else if (revisionId) {
            element = await getKeyRevision(revisionId);
            onSetTitle(language.dictionary.headerPreview);
            onPageView(language.dictionary.headerPreview);
        }
        return element;
    };

    /**
     * Update remaining/answered characters
     *
     * @param {Object} updatedKey Updated key state
     * @param {string} id Key ID
     */
    const updateRemainingCharacters = async (updatedKey, id) => {
        if (updatedKey) {
            const {
                key, selected, remaining, prog,
            } = updatedKey;
            setSelectedCharacters(selected);
            setRemainingCharacters(remaining);
            setProgress(prog);
            localStorage.setItem(id, JSON.stringify(key));
            setKey(key);
        } else {
            setProgress(0);
            localStorage.setItem(id, undefined);
            setKey(undefined);
        }
        return key;
    };

    /**
     * Get key JSON from device or API
     */
    const getKeyJSON = async () => {
        const params = new URLSearchParams(location.search);
        setOffline(params.get('offline') === 'true');
        if (params.get('offline') === 'true') {
            try {
                const tmpKey = await getKeyFromDatabase(keyId);
                try {
                    const init = await initialize(tmpKey);
                    updateRemainingCharacters(init, init.key.id);
                    onSetTitle(getLanguage(tmpKey.title, language.language.split('_')[0]));
                } catch (err) {
                    localStorage.removeItem(keyId);
                    setError(language.dictionary.storageError);
                }
            } catch (err) {
                setError(language.dictionary.storageError);
            }
        } else {
            try {
                const tmpKey = await getKeyFromAPI();
                const init = await initialize(tmpKey, revisionId);
                updateRemainingCharacters(init, init.key.id);
            } catch (err) {
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Get key from ArtsApp API, ADB API or device
     */
    useEffect(() => {
        if (!key) {
            getKeyJSON();
        } else setShowProgress(false);
    }, [key, keyId, location]);

    /**
     * Remove all selected states for the character
     *
     * @param {string} id Character ID
     */
    const handleResetCharacter = async (id) => {
        setShowProgress(true);
        let tmpKey = { ...key };
        if (selectedCharacters.length > 1) {
            const states = getAlternatives(
                tmpKey.characters.find((character) => character.id === id),
            );
            const arr = [];
            states.forEach((state) => {
                if (state.isAnswered) arr.push(state);
                state.selected = undefined;
            });
            if (arr.length > 0) {
                tmpKey = await worker.setStateAnswers(
                    key,
                    arr.map((element) => ({ id: element.id })),
                    filterRelevant,
                );
                const init = await worker.getCharacterState(tmpKey);
                tmpKey = await updateRemainingCharacters(init, key.id);
            }
        } else updateRemainingCharacters(undefined, key.id);
        return tmpKey;
    };

    /**
     * Select character state(s)
     *
     * @param {Array} states State IDs and values
     */
    const handleSelectStates = async (characterId, states) => {
        setShowProgress(true);
        let tmpKey = { ...key };
        if (selectedCharacters.find((element) => element.id === characterId)) {
            tmpKey = await handleResetCharacter(characterId);
        }
        tmpKey = await worker.setStateAnswers(
            tmpKey,
            states.map((state) => ({ id: state.id, value: state.selected })),
            filterRelevant,
            characterId,
        );
        const init = await worker.getCharacterState(tmpKey);
        updateRemainingCharacters(init, key.id);
    };

    /**
     * Remove selected state
     *
     * @param {string} id State ID
     */
    const handleRemoveState = async (id) => {
        setShowProgress(true);
        const tmpKey = await worker.setStateAnswers(
            key,
            [{ id }],
            filterRelevant,
        );
        const init = await worker.getCharacterState(tmpKey);
        updateRemainingCharacters(init, key.id);
    };

    /**
     * Dismiss the taxon
     *
     * @param {string} id Taxon ID
     */
    const handleDismissTaxon = async (id) => {
        let tmpKey = { ...key };
        tmpKey = toggleTaxonDismissed(key, id, filterRelevant === 'all' || false);
        const init = await worker.getCharacterState(tmpKey);
        updateRemainingCharacters(init, key.id);
    };

    /**
     * Render characters
     *
     * @returns JSX
     */
    const renderCharacters = () => {
        if (key.relevantTaxaCount > 1) {
            return (
                <CharacterList
                    characters={remainingCharacters}
                    offline={offline}
                    onDismiss={(id) => toggleTaxonDismissed(key, id)}
                    onSelectStates={(characterId, states) => {
                        handleSelectStates(characterId, states);
                    }}
                />
            );
        }
        if (key.relevantTaxaCount === 1) {
            return <h3 className="overflow-y-auto mt-72 lg:mt-20 w-full">{language.dictionary.taxonIdentified}</h3>;
        }
        return <h3 className="overflow-y-auto mt-72 lg:mt-20 w-full">{language.dictionary.noTaxonIdentified}</h3>;
    };

    /**
     * Render identification key content
     *
     * @returns JSX
     */
    const renderKey = () => (
        <div className={`lg:flex lg:mt-10 ${selectedCharacters.length > 0 ? 'lg:bottom-20' : 'lg:bottom-0'} w-full`}>
            {key && renderCharacters()}
            <div className="overflow-y-auto w-full ml-4">
                {key && key.taxa && (
                    <TaxaList
                        taxa={key.taxa}
                        count={key.taxaCount}
                        relevantCount={key.relevantTaxaCount}
                        offline={offline}
                        onClickListItem={(taxon) => {
                            if (revisionId) {
                                history.push(`/taxon/${taxon.id}?rev=${revisionId}`);
                            } else history.push(`/taxon/${taxon.id}?key=${keyId}${offline ? '&offline=true' : ''}`);
                        }}
                        onDismissTaxon={(id) => handleDismissTaxon(id)}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="py-14 px-4 lg:ml-24 m-auto">
            <div className="fixed top-10 left-0 lg:left-56 xl:left-64 my-4 w-full z-10">
                <LinearProgress color="secondary" variant="determinate" value={progress} />
            </div>
            {key && !error && renderKey()}
            <KeyOptionsButton
                selectedCharacters={selectedCharacters}
                hideInfo={revisionId !== undefined}
                onClickReset={() => {
                    setShowProgress(true);
                    updateRemainingCharacters(undefined, key.id);
                }}
            />
            <CharacterStateList
                characters={selectedCharacters}
                onSelectStates={(characterId, states) => handleSelectStates(characterId, states)}
                offline={offline}
                onRemoveState={(id) => handleRemoveState(id)}
                onRemoveCharacter={(id) => handleResetCharacter(id)}
            />
            {error && <Alert className="mt-4" elevation={6} variant="filled" severity="error">{error}</Alert>}
            <ProgressIndicator open={showProgress} />
        </div>
    );
};

export default Key;
