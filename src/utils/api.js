import axios from 'axios';

/**
 * Get key info
 *
 * @param {string} id Key id
 * @param {string} language Language code
 * @returns {Object} Key
 */
export const getKeyInfo = async (id, language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_KEY_API_URL}/keys/info/${id}${language ? `?language=${language}` : ''}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get key in JSON schema format
 *
 * @param {string} id Key ID
 * @returns {Object} Key
 */
export const getKey = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_KEY_API_URL}/keys/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get all keys
 *
 * @returns {Array} Key list
 */
export const getKeys = async () => {
    const response = await axios.get(
        `${process.env.REACT_APP_KEY_API_URL}/keys`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get key in JSON schema format
 *
 * @param {fileName} filename File name
 * @returns {Object} Key
 */
export const getExternalKey = async (fileName) => {
    const response = await axios.get(
        `${process.env.REACT_APP_ADB_API_URL}/${fileName}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get all keys from external provider (Artsdatabanken)
 *
 * @returns {Array} Key list
 */
export const getExternalKeys = async () => {
    const response = await axios.get(
        `${process.env.REACT_APP_ADB_API_URL}/keys.json`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get key in JSON schema format by revision ID
 *
 * @param {string} id Revision ID
 * @returns {Object} Key
 */
export const getKeyRevision = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_KEY_API_URL}/keys/revision/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get all organizations
 *
 * @param {string} language Language code
 * @returns {Array} Organization list
 */
export const getOrganizations = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_KEY_API_URL}/metadata/organizations?language=${language}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get all key groups
 *
 * @param {string} language Language code
 * @returns {Array} Key group list
 */
export const getGroups = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_KEY_API_URL}/metadata/groups?language=${language}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get all key collections
 *
 * @param {string} language Language code
 * @returns {Array} Key collection list
 */
export const getCollections = async (language) => {
    const response = await axios.get(
        `${process.env.REACT_APP_KEY_API_URL}/metadata/collections?language=${language}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get occurence info
 *
 * @param {string} keyId Key ID
 * @param {float} longitude Longitude
 * @param {float} latitude Latitude
 * @returns {Object} Occurence data
 */
export const getOccurences = async (keyId, longitude, latitude) => {
    const response = await axios.get(
        `${process.env.REACT_APP_V3_API_URL}/geo/occurence/${keyId}?lon=${longitude}&lat=${latitude}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};
