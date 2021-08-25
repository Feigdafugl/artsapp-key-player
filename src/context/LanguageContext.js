import { createContext } from 'react';

/**
 * Language context
 */
export default createContext({
    language: {},
    dictionary: {},
    setLanguage: () => { },
});
