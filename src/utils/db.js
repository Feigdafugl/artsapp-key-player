import { openDB } from 'idb';
import axios from 'axios';
import { getKey, getKeyInfo } from './api';

/**
 * Create database and object stores
 *
 * @param {string} dbName Database name
 * @param {Array} stores Store names
 */
const initDatabase = async (dbName, stores) => {
    const db = await openDB(dbName, 1, {
        upgrade(db) {
            stores.forEach((store) => {
                if (!db.objectStoreNames.contains(store)) db.createObjectStore(store);
            });
        },
    });
    return db;
};

/**
 * Get correct media element
 *
 * @param {Object} media Media object
 * @returns {Object} Media element object
 */
const getMediaElement = (media) => {
    let mediaObject;
    if (typeof media === 'object' && Array.isArray(media.mediaElement)) {
        if (media.mediaElement.length > 1) {
            mediaObject = { id: media.id, url: media.mediaElement[1].url };
        } else if (media.mediaElement.length > 0) {
            mediaObject = { id: media.id, url: media.mediaElement[0].url };
        }
    }
    // else mediaObject = { id: media, url: `${process.env.REACT_APP_KEY_API_URL}/media/${media}` };
    return mediaObject;
};

/**
 * Put media object in database store
 *
 * @param {Object} media Media object
 * @param {Object} db Database object
 */
const putMedia = async (media, db) => {
    try {
        const response = await axios.get(media.url, {
            responseType: 'blob',
            timeout: process.env.REACT_APP_HTTP_TIMEOUT,
        });
        if (response && response.data) {
            await db.add(
                process.env.REACT_APP_MEDIA_STORE_NAME,
                response.data,
                media.id,
            );
        }
    } catch (err) { }
};

/**
 * Find media element and put in database store
 *
 * @param {string} mediaId Media ID
 * @param {Array} mediaElements Media elements array
 * @param {Object} db Database object
 */
const findAndPutMedia = async (mediaId, mediaElements, db) => {
    const media = mediaElements.find((el) => el.id === mediaId);
    const mediaObject = getMediaElement(media);
    if (mediaObject) await putMedia(mediaObject, db);
};

/**
 * Remove media from database
 *
 * @param {string} mediaId Media ID
 * @param {Object} db Database object
 */
const removeMedia = async (mediaId, db) => {
    try {
        await db.delete(
            process.env.REACT_APP_MEDIA_STORE_NAME,
            mediaId,
        );
    } catch (err) { }
};

/**
 * Get or remove key and revision media
 *
 * @param {Object} key Key JSON
 * @param {Object} db Database object
 * @param {boolean} remove True if remove media from database
 */
const handleKeyMedia = async (key, db, remove) => {
    const promises = [];
    if (key.media) {
        key.media.forEach((media) => {
            if (remove) {
                promises.push(removeMedia(media.id, db));
            } else {
                const mediaObject = getMediaElement(media);
                if (mediaObject) promises.push(putMedia(mediaObject, db));
            }
        });
    }
    if (key.mediaElements) {
        if (key.taxa) {
            const getTaxaMedia = (taxa) => {
                taxa.forEach((taxon) => {
                    if (taxon.media) {
                        taxon.media.forEach((id) => {
                            if (remove) {
                                promises.push(removeMedia(id, db));
                            } else promises.push(findAndPutMedia(id, key.mediaElements, db));
                        });
                    }
                    if (taxon.children) getTaxaMedia(taxon.children);
                });
            };
            getTaxaMedia(key.taxa);
        }
        if (key.characters) {
            key.characters.forEach((character) => {
                if (character.media) {
                    character.media.forEach((id) => {
                        if (remove) {
                            promises.push(removeMedia(id, db));
                        } else promises.push(findAndPutMedia(id, key.mediaElements, db));
                    });
                }
                if (character.states) {
                    character.states.forEach((state) => {
                        if (state.media) {
                            state.media.forEach((id) => {
                                if (remove) {
                                    promises.push(removeMedia(id, db));
                                } else promises.push(findAndPutMedia(id, key.mediaElements, db));
                            });
                        }
                    });
                }
            });
        }
    }
    await Promise.all(promises);
};

/**
 * Add key to database store
 *
 * @param {string} keyId Key ID
 */
export const addKeyToDatabase = async (keyId) => {
    const key = await getKey(keyId);
    const keyInfo = await getKeyInfo(keyId);
    const db = await openDB(process.env.REACT_APP_DB_NAME, 1);
    const transaction = db.transaction(
        [
            process.env.REACT_APP_KEY_STORE_NAME,
            process.env.REACT_APP_KEY_INFO_STORE_NAME,
        ],
        'readwrite',
    );
    const dbKey = await transaction.objectStore(
        process.env.REACT_APP_KEY_STORE_NAME,
    ).get(keyId);
    if (dbKey) throw new Error('Key already exists');
    await transaction.objectStore(process.env.REACT_APP_KEY_STORE_NAME).add(key, key.id);
    await transaction.objectStore(process.env.REACT_APP_KEY_INFO_STORE_NAME).add(keyInfo, key.id);
    transaction.done.catch(() => { throw new Error('Could not add key to database store'); });
    await handleKeyMedia(key, db);
    db.close();
};

/**
 * Remove key from database
 *
 * @param {string} keyId Key ID
 */
export const removeKeyFromDatabase = async (keyId) => {
    const db = await openDB(process.env.REACT_APP_DB_NAME, 1);
    const key = await getKey(keyId);
    const transaction = db.transaction(
        [
            process.env.REACT_APP_KEY_STORE_NAME,
            process.env.REACT_APP_KEY_INFO_STORE_NAME,
        ],
        'readwrite',
    );
    transaction.objectStore(process.env.REACT_APP_KEY_STORE_NAME).delete(keyId);
    transaction.objectStore(process.env.REACT_APP_KEY_INFO_STORE_NAME).delete(keyId);
    transaction.done.catch(() => { throw new Error('Could not remove key from database store'); });
    await handleKeyMedia(key, db, true);
    db.close();
};

/**
 * Get key info from the database
 *
 * @param {string} keyId Key ID
 * @returns {Object} Key info
 */
export const getKeyInfoFromDatabase = async (keyId) => {
    const db = await openDB(process.env.REACT_APP_DB_NAME, 1);
    const key = db.get(process.env.REACT_APP_KEY_INFO_STORE_NAME, keyId);
    db.close();
    return key;
};

/**
 * Get key from the database
 *
 * @param {string} keyId Key ID
 * @returns {Object} Key
 */
export const getKeyFromDatabase = async (keyId) => {
    const db = await openDB(process.env.REACT_APP_DB_NAME, 1);
    const key = db.get(process.env.REACT_APP_KEY_STORE_NAME, keyId);
    db.close();
    return key;
};

/**
 * Get all keys from the database
 *
 * @returns {Array} Keys
 */
export const getKeysFromDatabase = async () => {
    const db = await initDatabase(
        process.env.REACT_APP_DB_NAME,
        [
            process.env.REACT_APP_KEY_STORE_NAME,
            process.env.REACT_APP_KEY_INFO_STORE_NAME,
            process.env.REACT_APP_MEDIA_STORE_NAME,
        ],
    );
    const keys = db.getAll(process.env.REACT_APP_KEY_STORE_NAME);
    db.close();
    return keys;
};

/**
 * Get media from the database
 *
 * @param {string} mediaId Media ID
 * @returns {Array} Media
 */
export const getMediaFromDatabase = async (mediaId) => {
    const db = await openDB(process.env.REACT_APP_DB_NAME, 1);
    const media = db.get(process.env.REACT_APP_MEDIA_STORE_NAME, mediaId);
    db.close();
    return media;
};
