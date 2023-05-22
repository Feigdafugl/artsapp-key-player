// (un)dismisses a taxon or the descendant by taxon id if present in this branch
const toggleDismiss = (taxon, taxonId) => {
    if (taxon.id === taxonId) {
        taxon.dismissed = !taxon.dismissed;
    } else if (taxon.children) {
        taxon.children = taxon.children.map(
            (child) => toggleDismiss(child, taxonId),
        );
    }
    return taxon;
};

/**
 * Get array of alternatives for the character
 *
 * @param {Object} character Character object
 * @returns {Array} Character alternatives
 */
export const getAlternatives = (character) => {
    let { states } = character;
    if (!states) {
        states = character.alternatives;
    }
    if (!Array.isArray(states)) return [states];
    return states;
};

// calculates the relevances of a taxon and it's children
const setBranchRelevances = (taxon, alreadyIrrelevant) => {
    // by default, a taxon is relevant if it is not the child of an irrelevant taxon,
    // has not been dismissed and does not have any conflicts
    taxon.isRelevant = !alreadyIrrelevant && !taxon.dismissed && !taxon.conflicts.length;
    // by default, irrelevance is the opposite of relevance
    // (but this may change if it has irrelevant children)
    taxon.isIrrelevant = !taxon.isRelevant;

    if (taxon.children) {
        // if it has children, set the (ir)relevances for those
        taxon.children = setTaxonRelevances(taxon.children, taxon.isIrrelevant);

        // a relevant taxon stays relevant only if it has any relevant children
        taxon.isRelevant = taxon.isRelevant && taxon.children.some((child) => child.isRelevant);

        // a taxon becomes irrelevant if it is a result with no relevant children (morphs),
        // or not a result with any irrelevant children
        taxon.isIrrelevant = taxon.isIrrelevant || (taxon.isResult
            ? !taxon.children.some((child) => child.isRelevant)
            : taxon.children.some((child) => child.isIrrelevant));
    }
    return taxon;
};

// sets the relevances and irrelevances of taxa (as endpoint or parent of an endpoint)
const setTaxonRelevances = (taxa, alreadyIrrelevant = false) => taxa.map(
    (taxon) => setBranchRelevances(taxon, alreadyIrrelevant),
);

// for a list of taxa, see if there is a statement from a given list
// (usually for one character) for all relevant taxa
const isRelevantForAllTaxa = (taxa, statements) => {
    // if there are no taxa, the answer is no
    if (taxa === undefined || !taxa.length) {
        return false;
    }

    // only consider taxa that are not excluded
    taxa = taxa.filter((taxon) => !(taxon.dismissed || taxon.conflicts.length));

    for (const taxon of taxa) {
        // if it has a statement or does not have to be considered,
        // everything is okay with this branch
        if (statements.some((s) => s.taxonId === taxon.id) || !taxon.isRelevant) {
            continue;
        }

        // if not, the children (if any) have to be checked
        if (!isRelevantForAllTaxa(taxon.children, statements)) {
            return false;
        }
    }

    // if no taxon returned false, it must be true
    return true;
};

// checks if a taxon id is present in a taxon tree
const isRelevantTaxon = (taxonId, taxa) => {
    if (!taxa) {
        return false;
    }

    for (const taxon of taxa) {
        if (taxon.id === taxonId) {
            return taxon.isRelevant;
        }
        if (isRelevantTaxon(taxonId, taxon.children)) {
            return true;
        }
    }
    return false;
};

const setTaxaConflicts = (taxa, alternative, relevantStatements) => taxa.map((taxon) => {
    if (alternative.unit) {
        // If numerical character, check for any relevant statements
        // No relevant statement = conflict
        if (relevantStatements.filter(
            (statement) => statement.taxonId === taxon.id && statement.frequency > 0,
        ).length === 0) {
            taxon.conflicts = [...taxon.conflicts, alternative.id];
        } else {
            taxon.conflicts = taxon.conflicts.filter(
                (conflict) => conflict !== alternative.id,
            );
        }
    } else if (
        // If exclusive/multistate character
        alternative.isAnswered
        && alternative.answerIs !== undefined
        && !taxon.conflicts.includes(alternative.id)
        && relevantStatements.some(
            (statement) => statement.taxonId === taxon.id
                && statement.frequency === +!alternative.answerIs,
        )
    ) {
        taxon.conflicts = [...taxon.conflicts, alternative.id];
    } else if (!alternative.isAnswered || alternative.answerIs === undefined) {
        taxon.conflicts = taxon.conflicts.filter(
            (conflict) => conflict !== alternative.id,
        );
    }

    if (taxon.children) {
        taxon.children = setTaxaConflicts(
            taxon.children,
            alternative,
            relevantStatements,
        );
    }
    return taxon;
});

/**
 * Remove conflicts from taxa where the taxon is still true for other states (multistate)
 *
 * @param {string} alternativeId Alternative ID
 * @param {Object} character Character object
 * @param {Array} taxa Taxa array
 * @param {Array} statements Statements array
 * @returns {Array} Updated taxa array
 */
// eslint-disable-next-line function-paren-newline
const removeMultistateConflicts = (
    alternativeId, character, taxa, statements,
// eslint-disable-next-line function-paren-newline
) => taxa.map((taxon) => {
    if (taxon.conflicts.length > 0) {
        const index = taxon.conflicts.findIndex((element) => element === alternativeId);
        if (index > -1) {
            const taxonStatements = statements.filter(
                (statement) => statement.taxonId === taxon.id
                    && statement.characterId === character.id
                    && statement.frequency > 0,
            );
            const answered = character.states.filter((element) => element.answerIs !== undefined);
            if (answered.length === character.states.length) {
                const remaining = taxonStatements.filter((statement) => {
                    const answer = character.states.find(
                        (element) => element.id === statement.value,
                    );
                    if (answer && !answer.answerIs) return true;
                    return false;
                });
                if (remaining.length > answered.length) taxon.conflicts = [];
            }
        }
    }
    if (taxon.children) {
        taxon.children = removeMultistateConflicts(
            alternativeId,
            character,
            taxon.children,
            statements,
        );
    }
    return taxon;
});

/**
 * Check if any of the character's alternatives are answered
 *
 * @param {Object} character Character object
 * @returns {boolean} True if any of the character's alternatives are answered
 */
export const isAlternativeAnswered = (character) => {
    const states = getAlternatives(character);
    for (const state of states) {
        if (state.isAnswered) return true;
    }
    return false;
};

/**
 * Check if numerical character statement value is in the selected interval
 *
 * @param {Array} value Min, max
 * @param {Array} interval Min, max
 */
const isInInterval = (value, interval) => {
    if (interval && ((interval[0] >= parseFloat(value[0]) && interval[0] <= parseFloat(value[1]))
        || (interval[1] >= parseFloat(value[0]) && interval[1] <= parseFloat(value[1])))) {
        return true;
    }
    return false;
};

/**
 * Set value for state and set character status as answered/not answered
 *
 * @param {Object} key Key object
 * @param {string} alternativeId Alternative ID
 * @param {boolean} value True/false or undefined
 * @returns {Object} Updated key object
 */
const setFact = (key, alternativeId, value) => {
    let stateCharacter;
    // give the alternative the new value, remembering the old one
    key.characters = key.characters.map((character) => {
        let isTargetCharacter = false;
        const alternatives = getAlternatives(character);
        alternatives.map((alternative) => {
            if (alternative.id === alternativeId) {
                alternative.answerIs = value;
                isTargetCharacter = true;
                stateCharacter = character;
            }
            return alternative;
        });
        // mark the character as answered if true and containing any answer,
        // unanswered if it just went from true to undefined
        if (isTargetCharacter) {
            if (value && alternatives.some((alternative) => alternative.isAnswered)) {
                character.isAnswered = true;
            } else if (!alternatives.some((alternative) => alternative.answerIs)) {
                character.isAnswered = false;
            }
        }
        return character;
    });

    let relevantAlternative;
    for (const c of key.characters) {
        const alternatives = getAlternatives(c);
        relevantAlternative = alternatives.find((a) => a.id === alternativeId);
        if (relevantAlternative) {
            break;
        }
    }

    const relevantStatements = key.statements.filter((s) => {
        if (stateCharacter && stateCharacter.type === 'numerical') {
            if (s.characterId === stateCharacter.id
                && (!Array.isArray(value) || isInInterval(s.value, value))) {
                return true;
            }
            return false;
        }
        if (s.value === alternativeId) return true;
        return false;
    });

    // add or remove conflicting *alternatives*
    key.taxa = setTaxaConflicts(
        key.taxa,
        relevantAlternative,
        relevantStatements,
    );

    if (process.env.REACT_APP_ALLOW_MULTISTATE) {
        key.taxa = removeMultistateConflicts(
            relevantAlternative.id,
            stateCharacter,
            key.taxa,
            key.statements,
        );
    }

    key.taxa = setTaxonRelevances(key.taxa);

    return key;
};

const removeInferrences = (key) => {
    key.characters.forEach((character) => {
        const alternatives = getAlternatives(character);
        alternatives.forEach((alternative) => {
            if (!alternative.isAnswered) {
                key = setFact(key, alternative.id, undefined);
            }
        });
    });
    return key;
};

const answer = (key, alternativeId, value) => {
    // mark alternative as answered/unanswered
    key.characters.map((character) => {
        const alternatives = getAlternatives(character);
        alternatives.map((alternative) => {
            if (alternative.id === alternativeId) {
                alternative.isAnswered = value !== undefined;
            }
            return alternative;
        });
        return character;
    });

    // set the value of the alternative,
    // the answered state of the character, and add/remove conflicts
    key = setFact(key, alternativeId, value);

    // if removing answer, for every earlier inferrence, undo with setFact
    if (value === undefined) {
        key = removeInferrences(key);
    }

    // moving to giveAnswers
    // stateObject = inferAlternatives(stateObject);

    return key;
};

const getAnswer = (alternativeId, characters) => {
    // eslint-disable-next-line no-restricted-syntax, no-unreachable-loop
    for (const character of characters) {
        const alternatives = getAlternatives(character);
        const alternative = alternatives.find(
            (a) => a.id === alternativeId,
        );
        if (alternative) {
            return alternative.answerIs;
        }
        return null;
    }
    return null;
};

const checkLogicalPremise = (premise, characters) => {
    if (Array.isArray(premise) && premise.length === 1) {
        premise = premise[0];
    }

    if (typeof premise === 'string') {
        return getAnswer(premise, characters);
    }

    if (premise.NOT) {
        return !checkLogicalPremise(premise.NOT, characters);
    }

    if (premise.AND) {
        if (premise.AND.length === 1) {
            return checkLogicalPremise(premise.AND, characters);
        }
        return (
            checkLogicalPremise(premise.AND[0], characters)
            && checkLogicalPremise({ AND: premise.AND.slice(1) }, characters)
        );
    }

    if (premise.OR) {
        if (premise.OR.length === 1) {
            return checkLogicalPremise(premise.OR, characters);
        }
        return (
            checkLogicalPremise(premise.OR[0], characters)
            || checkLogicalPremise({ OR: premise.OR.slice(1) }, characters)
        );
    }

    if (premise['<']) {
        return getAnswer(premise['<'][0], characters) < premise['<'][1];
    }

    if (premise['>']) {
        return getAnswer(premise['>'][0], characters) > premise['>'][1];
    }

    return undefined;
};

// if taxon has id that is right, return entire thing
// if it has id but not the right one:
// if it has no children with ids, set it to dismissed
// otherwise, map the children
const setTaxaRelevancesByIds = (taxa, ids) => taxa
    .map((taxon) => {
        if (taxon.externalReference && !ids.find(
            (x) => x === `${taxon.externalReference.externalId}`
                || (taxon.HigherClassification
                    && taxon.HigherClassification.find((h) => h.ScientificNameId === x)
                ),
        )) {
            if (!taxon.children || !taxon.children.find((c) => c.externalReference)) {
                // taxon.dismissed = true;
                taxon = undefined;
            } else {
                taxon.children = filterTaxaByIds(taxon.children, ids);
                taxon = !!taxon.children.length ? taxon : undefined;
            }
        }
        return taxon;
    })
    .filter((taxon) => !!taxon);

// marks all taxa that don't include or are part of a list of taxa (as ids) as dismissed
export const filterTaxaByIds = (taxa, ids) => {
    taxa = setTaxaRelevancesByIds(taxa, ids);
    return setTaxonRelevances(taxa);
};

const dismissAllExcept = (taxa, taxaToKeep) => taxa.map((taxon) => {
    if (taxon.isResult || !taxon.children) {
        if (!taxaToKeep.includes(taxon.scientificName)) {
            taxon.dismissed = true;
        }
    } else if (taxon.children) {
        taxon.children = dismissAllExcept(taxon.children, taxaToKeep);
    }
    return taxon;
});

const containsTaxon = (taxon, scientificNames) => {
    if (taxon.isResult || !taxon.children) {
        return scientificNames.includes(taxon.scientificName);
    }
    if (taxon.children) {
        return taxon.children.some((child) => containsTaxon(child, scientificNames));
    }
    return false;
};

const dismissAllExceptCommonTaxon = (taxa, taxaToKeep) => taxa.map((taxon) => {
    if (!containsTaxon(taxon, taxaToKeep)) {
        taxon.dismissed = true;
    }
    return taxon;
});

export const getResultTaxa = (taxon) => {
    if (Array.isArray(taxon)) {
        return taxon
            .map((t) => getResultTaxa(t))
            .filter((t) => t !== null)
            .flat();
    }

    if (taxon.isRelevant) {
        if (taxon.children && !taxon.isResult) {
            return getResultTaxa(taxon.children);
        }
        return taxon;
    }

    return null;
};

export const getRelevantTaxaCount = (taxa) => {
    if (Array.isArray(taxa)) {
        return taxa
            .map((t) => getRelevantTaxaCount(t))
            .reduce((acc, tax) => acc + tax, 0);
    }

    if (!taxa.isRelevant) {
        return 0;
    }

    if (taxa.isResult || !taxa.children) {
        return 1;
    }

    return getRelevantTaxaCount(taxa.children);
};

/**
 * Get taxa IDs with suffix
 *
 * @param {Array} taxa Taxa
 * @returns {Array} Taxa with new IDs
 */
export const getAllTaxonIds = (taxa) => {
    const taxonIds = [];
    const getTaxonIds = (arr) => {
        arr.forEach((element) => {
            taxonIds.push(`${element.id}_relevant`);
            taxonIds.push(`${element.id}_irrelevant`);
            if (element.children) getTaxonIds(element.children);
        });
    };
    getTaxonIds(taxa);
    return taxonIds;
};

/**
 * Deducts the answers for unanswered alternatives and marks the character relevant/irrelevant
 *
 * @param {Object} key Key
 * @param {boolean} relevantOnly True if return only characters that are relevant for all taxa
 * @returns {Object} Updated key object
 */
export const inferAlternatives = (key, relevantOnly) => {
    const relevantStatements = key.statements.filter(
        (sm) => isRelevantTaxon(sm.taxonId, key.taxa),
    );

    /**
     * Set negatives for character alternatives:
     * if no relevant statement or if a related alternative is true, set relevance negative
     */
    key.characters.forEach((character) => {
        const alternatives = getAlternatives(character);
        // character not displayed if true
        const isRelatedAnswer = alternatives.some((sibling) => sibling.answerIs);
        const negatives = alternatives.filter((alternative) => {
            if (character.type === 'numerical') {
                if (alternative.answerIs === undefined
                    && (isRelatedAnswer || !relevantStatements.some(
                        (sm) => sm.characterId === character.id && sm.frequency !== 0,
                    ))) {
                    return true;
                }
                return false;
            }
            if (alternative.answerIs === undefined && (isRelatedAnswer || !relevantStatements.some(
                (sm) => sm.value === alternative.id && sm.frequency !== 0,
            ))) {
                return true;
            }
            return false;
        });

        negatives.forEach((alternative) => {
            key = setFact(key, alternative.id, false);
        });
    });

    /**
     * Set positives for character alternatives:
     * if the alternative is the only one remaining or if all relevant statements are true,
     * set relevance positive
     */
    const notAnswered = key.characters.filter((character) => !character.isAnswered);
    notAnswered.forEach((character) => {
        const alternatives = getAlternatives(character);
        const remaining = alternatives.filter((sibling) => sibling.answerIs === undefined);
        const positives = alternatives.filter((alternative) => {
            if (character.type === 'numerical') {
                if (alternative.answerIs === undefined && (!relevantStatements.some(
                    (sm) => sm.characterId === character.id && sm.frequency !== 1,
                ))) {
                    return true;
                }
                return false;
            }
            if (alternative.answerIs === undefined
                && (remaining.length === 1
                    || !relevantStatements.some(
                        (sm) => sm.value === alternative.id && sm.frequency !== 1,
                    ))) {
                return true;
            }
            return false;
        });
        positives.forEach((alternative) => { key = setFact(key, alternative.id, true); });
    });

    /**
     * Set character relevance:
     * Irrelevant if no character alternatives are answered
     * and either a currently relevant taxon has no statement for it or everything is known
     */
    key.characters = key.characters.map((character) => {
        const alternatives = getAlternatives(character);
        const characterStatements = relevantStatements.filter(
            (sm) => sm.characterId === character.id,
        );
        if (!alternatives.some((alternative) => alternative.isAnswered)
            && (!alternatives.some((alternative) => alternative.answerIs === undefined)
                || (relevantOnly && !isRelevantForAllTaxa(key.taxa, characterStatements))
            )
        ) {
            character.relevant = false;
        } else {
            character.relevant = !character.logicalPremise
                || !!checkLogicalPremise(character.logicalPremise, key.characters);
        }
        return character;
    });

    return key;
};

/**
 * Answer a set of alternatives with the specified values
 *
 * @param {Object} key Key object
 * @param {Array} answers Array of answers (state IDs and value)
 * @param {boolean} relevantOnly True if return only characters that are relevant for all taxa
 * @returns {Object} Updated key object
 */
export const giveAnswers = (key, answers, relevantOnly) => {
    let tmpKey = { ...key };
    answers.forEach((a) => { tmpKey = answer(key, a.id, a.value); });

    // Set relevant characters/alternatives
    tmpKey = inferAlternatives(tmpKey, relevantOnly);
    tmpKey.relevantTaxaCount = getRelevantTaxaCount(tmpKey.taxa);

    // Show the results if there is one taxon left, or no questions left to ask
    if (tmpKey.relevantTaxaCount === 1 || !tmpKey.characters.reduce(
        (count, char) => count + (!char.isAnswered && char.relevant !== false),
        0,
    )) {
        tmpKey.results = getResultTaxa(tmpKey.taxa);
    }
    return tmpKey;
};

/**
 * Gives a taxon and all of it's children an empty list of conflicts,
 * standard relevance, and a small and a large media url
 *
 * @param {Object} initialElement Key, taxon or character element
 * @param {Array} mediaElements Key media elements
 * @param {*} persons
 * @param {*} organizations
 * @param {string} type Type of element (taxon or character)
 * @returns
 */
export const initElement = (initialElement, mediaElements, persons, organizations, type) => {
    const getObject = (object, objects) => {
        if (typeof object === 'string') {
            object = objects.find((x) => x.id === object);
        } else if (Array.isArray(object)) {
            object = object.map((x) => getObject(x.toString(), objects));
        }
        return object;
    };
    const element = { ...initialElement };
    if (element.statements) { // if the element is the entire key
        ({ mediaElements, persons, organizations } = element);
        element.characters = element.characters.map(
            (x) => initElement(x, mediaElements, persons, organizations, 'character'),
        );
        element.taxa = element.taxa.map(
            (x) => initElement(x, mediaElements, persons, organizations, 'taxon'),
        );
        if (element.mediaElements) {
            element.mediaElements = element.mediaElements.map((file) => {
                if (Array.isArray(file.mediaElement)) {
                    file.mediaElement = file.mediaElement.map(
                        (m) => initElement(m, mediaElements, persons, organizations),
                    );
                }
                return file;
            });
        }
    } else if (type === 'taxon') { // if the element is a taxon
        element.conflicts = [];
        element.isRelevant = true;
        element.isIrrelevant = false;
        if (element.children) {
            element.children = element.children.map(
                (child) => initElement(child, mediaElements, persons, organizations, 'taxon'),
            );
        }
    } else if (type === 'character') { // if the element is a character
        // The terms alternatives and states are interchangeable
        const alternatives = getAlternatives(element);
        element.states = alternatives.map(
            (state) => initElement(state, mediaElements, persons, organizations),
        );
    }
    if (persons) {
        element.creators = getObject(element.creators, persons);
        element.contributors = getObject(element.contributors, persons);
    }
    if (organizations) element.publishers = getObject(element.publishers, organizations);
    if (mediaElements) element.media = getObject(element.media, mediaElements);
    if (element.media) {
        if (Array.isArray(element.media)) {
            element.media = element.media.map((el) => initElement(
                el,
                mediaElements,
                persons,
                organizations,
            ));
        } else {
            element.media = [initElement(
                element.media,
                mediaElements,
                persons,
                organizations,
            )];
        }
    }
    element.init = true;
    return element;
};

/**
 * Toggle taxon status dismissed/not dismissed (opposite of current status)
 *
 * @param {Object} key Key object
 * @param {string} taxonId Taxon ID
 * @param {boolean} relevantOnly True if return only characters that are relevant for all taxa
 * @returns {Object} Updated key object
 */
export const toggleTaxonDismissed = (key, taxonId, relevantOnly) => {
    let tmpKey = { ...key };
    tmpKey.taxa = tmpKey.taxa.map((taxon) => toggleDismiss(taxon, taxonId));
    tmpKey.taxa = setTaxonRelevances(tmpKey.taxa);
    tmpKey = removeInferrences(tmpKey);
    tmpKey = inferAlternatives(tmpKey, relevantOnly);
    tmpKey.relevantTaxaCount = getRelevantTaxaCount(tmpKey.taxa);
    if (tmpKey.relevantTaxaCount === 1) {
        tmpKey.results = getResultTaxa(tmpKey.taxa);
        tmpKey.modalObject = { results: tmpKey.results };
    }
    return tmpKey;
};

export const isPartOfKey = (taxa, scientificName) => {
    for (const taxon of taxa) {
        if (
            taxon.scientificName === scientificName
            || (taxon.children && isPartOfKey(taxon.children, scientificName))
        ) {
            return true;
        }
    }
    return false;
};

export const filterTaxaByNames = (stateObject, taxaToKeep, keepCommonTaxon) => {
    if (!keepCommonTaxon) {
        stateObject.taxa = dismissAllExcept(stateObject.taxa, taxaToKeep);
    } else {
        stateObject.taxa = dismissAllExceptCommonTaxon(
            stateObject.taxa,
            taxaToKeep,
        );
    }

    stateObject.taxa = setTaxonRelevances(stateObject.taxa);
    stateObject = inferAlternatives(stateObject);

    return stateObject;
};

/**
 * Initialize key object for identification process
 *
 * @param {Object} key Key in JSON format
 * @param {boolean} relevantOnly True if return only characters that are relevant for all taxa
 * @returns {Object} Updated key object
 */
export const initKey = (key, relevantOnly) => {
    let tmpKey = { ...key };
    if (!tmpKey.statements || !tmpKey.characters || !tmpKey.taxa) {
        return undefined;
    }
    tmpKey = initElement(tmpKey);
    // Set statements with undefined frequencies to frequency=1 (i.e. always true)
    tmpKey.statements = tmpKey.statements.map((statement) => {
        if (statement.frequency === undefined) {
            statement.frequency = 1;
        }
        return statement;
    });
    // Add conflicts for taxa that have no answer for the alternative,
    // but do for the character
    const addStatements = [];
    tmpKey.characters.forEach((character) => {
        const characterStatements = tmpKey.statements.filter(
            (sm) => sm.characterId === character.id,
        );
        const taxaWithCharacter = characterStatements.map((sm) => sm.taxonId);
        const alternatives = getAlternatives(character);
        alternatives.forEach((alternative) => {
            const altStatements = tmpKey.statements.filter(
                (sm) => sm.value === alternative.id,
            );
            const taxaWithAlternative = altStatements.map((sm) => sm.taxonId);
            const addTaxa = [
                ...new Set(
                    taxaWithCharacter.filter(
                        (tx) => !taxaWithAlternative.includes(tx),
                    ),
                ),
            ];
            addTaxa.forEach((taxon) => {
                let value = alternative.id;
                if (character.type === 'numerical') value = [alternative.min, alternative.max];
                addStatements.push({
                    id: `statement:${alternative.id}_${taxon}_0`,
                    taxonId: taxon,
                    characterId: character.id,
                    value,
                    frequency: 0,
                });
            });
        });
    });
    tmpKey.statements = tmpKey.statements.concat(addStatements);
    // tmpKey = inferAlternatives(tmpKey);
    // Give an empty answer to trigger logic
    tmpKey = giveAnswers(tmpKey, [], relevantOnly);
    tmpKey.taxaCount = tmpKey.relevantTaxaCount;
    return tmpKey;
};

/**
 * Get taxon object from array
 *
 * @param {string} taxonId Taxon ID
 * @param {Array} taxa Taxa array
 * @returns {Object} Taxon object
 */
export const getTaxon = (taxonId, taxa) => {
    let taxon;
    const findTaxon = (arr) => {
        arr.forEach((element) => {
            if (element.id === taxonId) {
                taxon = element;
            }
            if (!taxon && element.children) {
                findTaxon(element.children);
            }
        });
    };
    findTaxon(taxa);
    return taxon;
};
