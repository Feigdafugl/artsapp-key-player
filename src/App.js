import React, { StrictMode, useEffect, useState } from 'react';
import './styles/tailwind.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
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
   * Render page with component
   *
   * @param {Object} Component Component to render
   */
  const renderPage = (Component) => (
    <div className="h-full lg:ml-56 mb-10 lg:mb-0 bg-white z-50 text-darkGrey">
      <Component onSetTitle={(title) => setPageTitle(title)} />
    </div>
  );

  return (
    <StrictMode>
      <BrowserRouter basename={process.env.REACT_APP_URL_BASE}>
        <LanguageContext.Provider value={languageValue}>
          <PageContext.Provider value={pageValue}>
            <ThemeProvider theme={materialTheme}>
              <Nav title={pageTitle} />
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
            </ThemeProvider>
          </PageContext.Provider>
        </LanguageContext.Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
