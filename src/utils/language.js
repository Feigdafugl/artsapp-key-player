/**
 * Get string in correct language
 *
 * @param {Object} text Text object
 * @param {string} languageCode Language code
 * @returns {string} Language string
 */
export const getLanguage = (text, languageCode) => {
    if (!text) return '';
    if (typeof text === 'string') return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    let languageString = text[languageCode];
    if (languageString) return languageString;
    if (languageCode === 'no') {
        languageString = text.en;
    } else if (languageCode === 'en') {
        languageString = text.no;
    }
    return languageString;
};

/**
 * Check if multilingual object has content
 *
 * @param {Object} content Multilingual content object
 * @returns {boolean} True if has content
 */
export const hasContent = (content) => {
    if (!content) return false;
    if (typeof text === 'string') return true;
    if (Object.entries(content).length > 0) return true;
    return false;
};
