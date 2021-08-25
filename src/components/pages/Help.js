import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render help page
 */
const Help = ({ onSetTitle }) => {
    const { language } = useContext(LanguageContext);
    const location = useLocation();
    const [content, setContent] = useState(undefined);

    /**
     * Set help content based on previous page
     */
    useEffect(() => {
        if (!content) {
            onSetTitle(language.dictionary.help);
            const page = new URLSearchParams(location.search).get('page');
            switch (page) {
                case 'info':
                    setContent(language.dictionary.sectionKeyInfo);
                    break;
                case 'keys':
                    setContent(language.dictionary.sectionKey);
                    break;
                case 'taxon':
                    setContent(language.dictionary.sectionTaxon);
                    break;
                case 'observations':
                    setContent(language.dictionary.sectionObservations);
                    break;
                case 'downloads':
                    setContent(language.dictionary.helpDownload);
                    break;
                default:
                    setContent(language.dictionary.sectionKeys);
                    break;
            }
        }
    }, [content]);

    return (
        <div className="py-14 px-4 lg:w-10/12 m-auto">
            <p className="mt-4 lg:mt-10">{content}</p>
        </div>
    );
};

export default Help;
