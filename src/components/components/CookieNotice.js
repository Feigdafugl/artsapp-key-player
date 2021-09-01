import React, { useContext } from 'react';
import CookieConsent from 'react-cookie-consent';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render cookie notice
 */
const CookieNotice = ({ onConsent }) => {
    const { language } = useContext(LanguageContext);

    return (
        <CookieConsent
            contentClasses="p-5"
            containerClasses="font-sans pb-6"
            buttonClasses="h-10 w-24"
            declineButtonClasses="h-10 w-24"
            buttonText={language.dictionary.btnAccept}
            declineButtonText={language.dictionary.btnReject}
            enableDeclineButton
            flipButtons
            overlay
            buttonStyle={{ borderRadius: '4px' }}
            declineButtonStyle={{ borderRadius: '4px' }}
            onAccept={() => onConsent()}
            onDecline={() => onConsent()}
        >
            <h1>{language.dictionary.cookieHeader}</h1>
            <h3 className="mt-4 mb-2">{language.dictionary.cookieNotice}</h3>
            <p className="pl-0">{language.dictionary.cookieAccept}</p>
        </CookieConsent>
    );
};

export default CookieNotice;
