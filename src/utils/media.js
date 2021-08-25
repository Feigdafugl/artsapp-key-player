/**
 * Get character media objects (or get media from first alternative)
 *
 * @param {Object} character Character objects
 * @param {Array} states State array
 * @returns {Array} Media objects
 */
export const getCharacterMedia = (character, states) => {
    let media;
    if (character.media
        && character.media.length > 0
        && character.media[0].mediaElement
        && character.media[0].mediaElement.length > 0
    ) {
        media = character.media;
    } else if (states && states.length > 0
        && states[0].media
        && states[0].media.length > 0
        && states[0].media[0].mediaElement
    ) {
        media = states[0].media;
    }
    return media;
};

/**
 * Get charater state media objects
 *
 * @param {Object} state State object
 * @returns {Array} Media objects
 */
export const getStateMedia = (state) => {
    let media;
    if (state.media
        && state.media.length > 0
        && state.media[0].mediaElement
        && state.media[0].mediaElement.length > 0
    ) {
        media = state.media;
    }
    return media;
};

/**
 * Get taxon media objects
 *
 * @param {Object} taxon Taxon
 * @returns {Array} Media objects
 */
export const getTaxonMedia = (taxon) => {
    let media;
    if (taxon.media && taxon.media.length > 0
        && taxon.media[0].mediaElement
        && taxon.media[0].mediaElement.length > 0
    ) {
        media = taxon.media;
    }
    return media;
};

/**
 * Get key media objects
 *
 * @param {Object} key Key
 * @returns {Array} Media objects
 */
export const getKeyMedia = (key) => {
    let media;
    if (key.media && key.media.length > 0) {
        media = key.media;
    } else if (key.mediaElement && key.mediaElement.length > 0) {
        media = key.mediaElement;
    }
    return media;
};
