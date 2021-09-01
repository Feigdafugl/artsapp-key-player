import React, { useContext, useEffect } from 'react';
import logo from '../../images/artsapp-key-player-logo-black.png';
import LanguageContext from '../../context/LanguageContext';
import LanguageButton from '../components/buttons/LanguageButton';
import AboutApp from '../components/AboutApp';

/**
 * Render about page
 */
const About = ({ onSetTitle, onPageView }) => {
    const { language } = useContext(LanguageContext);

    /**
     * Scroll to top on launch, track page view if consent is given and set page title
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onPageView(language.dictionary.about);
        onSetTitle(language.dictionary.about);
    }, []);

    return (
        <div className="py-14 px-4 lg:w-10/12 m-auto">
            <span className="absolute lg:fixed right-0 lg:right-2 lg:top-3 z-40">
                <LanguageButton />
            </span>
            <img className="m-auto mt-8 ml-2" src={logo} alt="ArtsApp logo" height={46} />
            <AboutApp />
            <p className="mt-10">{`${language.dictionary.labelVersion}: ${process.env.REACT_APP_VERSION}`}</p>
        </div>
    );
};

export default About;
