import React, {
  StrictMode, useCallback, useEffect, useState,
} from 'react';
import './styles/tailwind.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
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
  const languageValue = { language, setLanguage };

  // Set default page
  const [page, setPage] = useState(pageState);
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
  const handlePageView = useCallback(
    debounce(async (title) => trackPageView(title), 500), [],
  );

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
   * Render page with component
   *
   * @param {Object} Component Component to render
   */
  const renderPage = (Component) => (
    <div className="h-full lg:ml-56 mb-10 lg:mb-0 bg-white z-50 text-darkGrey">
      <Component
        onSetTitle={(title) => setPageTitle(title)}
        onPageView={(title) => handlePageView(title)}
      />
    </div>
  );

  return (
    <StrictMode>
      <BrowserRouter basename={process.env.REACT_APP_URL_BASE}>
        <LanguageContext.Provider value={languageValue}>
          <PageContext.Provider value={pageValue}>
            <ThemeProvider theme={materialTheme}>
              <Nav title={pageTitle} />
              {updateReady && renderUpdateNotification()}
              <Switch>
                <Route path="/" exact component={() => renderPage(Keys)} />
                <Route path="/info/:keyId" exact component={() => renderPage(KeyInfo)} />
                <Route path="/keys/:keyId" exact component={() => renderPage(Key)} />
                <Route path="/taxon/:taxonId" exact component={() => renderPage(Taxon)} />
                <Route path="/observations" exact component={() => renderPage(Observations)} />
                <Route path="/observations/:observationId" exact component={() => renderPage(Observation)} />
                <Route path="/downloads" exact component={() => renderPage(Downloads)} />
                <Route path="/preview/:revisionId" exact component={() => renderPage(Key)} />
                <Route path="/about" exact component={() => renderPage(About)} />
                <Route path="/help" exact component={() => renderPage(Help)} />
                <Route component={() => renderPage(NoMatch)} />
              </Switch>
              <CookieNotice onConsent={() => setCookieConsent(getCookieConsentValue())} />
            </ThemeProvider>
          </PageContext.Provider>
        </LanguageContext.Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
