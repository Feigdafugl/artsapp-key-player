import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render error page
 */
const NoMatch = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="pt-8 pb-14 text-black text-center leading-normal">
            <p>{language.dictionary.noMatch}</p>
        </div>
    );
};

export default NoMatch;
