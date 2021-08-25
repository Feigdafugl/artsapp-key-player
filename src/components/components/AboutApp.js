import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render about app info
 */
const AboutApp = () => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="mt-4">
            <p className="mb-4">{language.dictionary.sectionAbout}</p>
            <h3>
                {language.dictionary.features}
            </h3>
            <ul className="ml-4">
                <li>
                    {language.dictionary.feature1}
                </li>
                <li>
                    {language.dictionary.feature2}
                </li>
                <li>
                    {language.dictionary.feature3}
                </li>
                <li>
                    {language.dictionary.feature4}
                </li>
            </ul>
        </div>
    );
};

export default AboutApp;
