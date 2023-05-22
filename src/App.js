/* eslint-disable */ 

import React, {
  StrictMode, useCallback, useEffect, useState,
} from 'react';
import './styles/tailwind.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getCookieConsentValue } from 'react-cookie-consent';
import debounce from 'lodash/debounce';
import { ThemeProvider } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import LanguageContext from './context/LanguageContext';
import PageContext from './context/PageContext';
import { dictionary } from './languages/language';
import materialTheme from './styles/material-ui';
import Nav from './components/nav/Nav';
import NoMatch from './components/pages/NoMatch';
import Keys from './components/pages/Keys';
import Observations from './components/pages/Observations';
import About from './components/pages/About';
import Observation from './components/pages/Observation';
import KeyInfo from './components/pages/KeyInfo';
import Key from './components/pages/Key';
import Help from './components/pages/Help';
import Taxon from './components/pages/Taxon';
import Downloads from './components/pages/Downloads';
import CookieNotice from './components/components/CookieNotice';
import trackPageView from './utils/analytics';

const App = () => {
  const languageState = {
    language: 'no_bm',
    dictionary: dictionary.no_bm,
  };

  const pageState = {
    index: undefined,
  };

  // Set default language
  const [language, setLanguage] = useState(languageState);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const languageValue = { language, setLanguage };

  // Set default page
  const [page, setPage] = useState(pageState);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const pageValue = { page, setPage };

  const [pageTitle, setPageTitle] = useState(undefined);
  const [cookieConsent, setCookieConsent] = useState(getCookieConsentValue());
  const [updateReady, setUpdateReady] = useState(false);

  /**
   * Check for previously selected language
   */
  useEffect(() => {
    const selectedLanguage = localStorage.getItem('language');
    if (selectedLanguage && (selectedLanguage !== language.language)) {
      setLanguage({ language: selectedLanguage, dictionary: dictionary[selectedLanguage] });
    }
  }, [language]);

  /**
   * Check for cookie consent and initialize Google Analytics
   */
  useEffect(() => {
    if (getCookieConsentValue() !== cookieConsent) {
      setCookieConsent(getCookieConsentValue());
    }
  }, [cookieConsent]);

  /**
   * Add listener for update ready events
   */
  useEffect(() => {
    document.addEventListener('updateready', () => setUpdateReady(true));
    return () => window.removeEventListener('updateready', () => setUpdateReady(true));
  }, []);

  /**
   * Handle page view tracking
   */
  const handlePageView = useCallback(debounce(async (title) => trackPageView(title), 500), []);

  /**
   * Render notification if update is available
   *
   * @returns JSX
   */
  const renderUpdateNotification = () => (
    <div className="fixed bottom-20 left-2 lg:left-72 lg:right-auto mr-2 z-50">
      <Alert elevation={6} variant="filled" severity="info">
        {language.dictionary.updateAvailable}
      </Alert>
    </div>
  );


  /**
   * Render page with css wrapper
   *
   * @param {Object} children Component to render
   */
  const Wrapper = ({ children }) => (
    <div className="h-full lg:ml-44 mb-10 lg:mb-0 bg-white z-50 text-darkGrey">
      {children}
    </div>
  );

  /**
   * adding Props to Components
   *
   */
  const commonProps = {
    onSetTitle: (title) => setPageTitle(title),
    onPageView: (title) => handlePageView(title)
  };

  /* TODO
  ###DONE Wrappe alle route elements i wrapper
  ###DONE Fikse 4 siste route element lik de over, ikke bruke renderPage 
  ###DONE delete renderPage


  TODO annet
  ###DONE Tailwind
  Observations --> feilmelding --> localStorage ???

  ###DONE Feilmelding error, artside strandkrabbe http://localhost:3000/player/taxon/3099?key=8f89e421-8063-4ade-9662-dab9c02d40cb 
  */

  return (
    <StrictMode>
      <BrowserRouter basename={process.env.REACT_APP_URL_BASE}>
        <LanguageContext.Provider value={languageValue}>
          <PageContext.Provider value={pageValue}>
            <ThemeProvider theme={materialTheme}>
              <Nav title={pageTitle} />
              {updateReady && renderUpdateNotification()}
              <Routes>
                <Route path="/" element={<Wrapper><Keys {...commonProps} /></Wrapper>}/>
                <Route path="/info/:keyId" element={<Wrapper><KeyInfo {...commonProps} /></Wrapper>} />
                <Route path="/keys/:keyId" element={<Wrapper><Key {...commonProps}/></Wrapper>} />
                <Route path="/taxon/:taxonId" element={<Wrapper><Taxon {...commonProps}/></Wrapper>} />
                <Route path="/observations" element={<Wrapper><Observations {...commonProps}/></Wrapper>} />
                <Route path="/observations/:observationId" exact element={<Wrapper><Observation {...commonProps}/></Wrapper>} />
                <Route path="/downloads" element={<Wrapper><Downloads {...commonProps}/></Wrapper>} />
                <Route path="/preview/:revisionId" element={<Wrapper><Key {...commonProps}/></Wrapper>} />
                <Route path="/about" element={<Wrapper><About {...commonProps}/></Wrapper>} />
                <Route path="/help" element={<Wrapper><Help {...commonProps}/></Wrapper>} />
                <Route element={<Wrapper><NoMatch {...commonProps}/></Wrapper>} />
              </Routes>
              <CookieNotice onConsent={() => setCookieConsent(getCookieConsentValue())} />
            </ThemeProvider>
          </PageContext.Provider>
        </LanguageContext.Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
