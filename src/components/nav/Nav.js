import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import HelpOutline from '@material-ui/icons/HelpOutline';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import logo from '../../images/artsapp-key-player-logo.png';
import LanguageContext from '../../context/LanguageContext';
import PageContext from '../../context/PageContext';
import { dictionary, options } from '../../languages/language';
import TitleBar from './TitleBar';
import FooterNav from './FooterNav';
import LanguageSelect from '../components/inputs/LanguageSelect';

/**
 * Render navigation menu
 */
const Nav = ({ title }) => {
    const { language, setLanguage } = useContext(LanguageContext);
    const { page, setPage } = useContext(PageContext);
    const history = useHistory();
    const location = useLocation();
    const [showHelpIcon, setShowHelpIcon] = useState(true);

    /**
     * Check URL path and highlight correct navigation element
     */
    useEffect(() => {
        const path = location.pathname.split('/');
        const query = location.search.split('=');
        if (path.length < 2) {
            setPage({ index: 0 });
            setShowHelpIcon(true);
        } else {
            switch (path[1]) {
                case 'observations':
                    setPage({ index: 1 });
                    setShowHelpIcon(true);
                    break;
                case 'downloads':
                    setPage({ index: 2 });
                    setShowHelpIcon(true);
                    break;
                case 'about':
                    setPage({ index: 3 });
                    setShowHelpIcon(false);
                    break;
                case 'help':
                    if (query.length > 0) {
                        if (query[query.length - 1] === 'observations') {
                            setPage({ index: 1 });
                        } else if (query[query.length - 1] === 'downloads') {
                            setPage({ index: 2 });
                        } else setPage({ index: 0 });
                    }
                    setShowHelpIcon(false);
                    break;
                default:
                    setPage({ index: 0 });
                    setShowHelpIcon(true);
                    break;
            }
        }
    }, [location]);

    /**
     * Show confirm dialog before setting new page if page has a form
     *
     * @param {int} index Nav index
     */
    const handleSelect = (index) => {
        const path = window.location.pathname.split('/');
        let prevPage;
        if (path.length > 0) {
            const currentPage = path[path.length - 1];
            switch (index) {
                case 0:
                    if (currentPage !== '') history.push('/');
                    break;
                case 1:
                    if (currentPage !== 'observations') history.push('/observations');
                    break;
                case 2:
                    if (currentPage !== 'downloads') history.push('/downloads');
                    break;
                case 3:
                    history.push('/about');
                    break;
                case 4:
                    if (path.length > 2) prevPage = path[2];
                    history.push(`/help?page=${prevPage}`);
                    break;
                default:
                    break;
            }
        }
    };

    /**
     * Change language
     *
     * @param {string} languageCode Language code
     */
    const handleSetLanguage = (languageCode) => {
        setLanguage({ language: languageCode, dictionary: dictionary[languageCode] });
        localStorage.setItem('language', languageCode);
    };

    return (
        <nav>
            <TitleBar title={title} />
            {showHelpIcon && (
                <span className="fixed top-1 sm:top-2 right-1 lg:right-8 text-white lg:text-primary z-40">
                    <IconButton
                        edge="start"
                        aria-label="help"
                        color="inherit"
                        onClick={() => handleSelect(4)}
                    >
                        <HelpOutline />
                    </IconButton>
                </span>
            )}
            <div className="fixed h-full hidden lg:inline w-56 xl:w-64 bg-artsapp-web bg-no-repeat bg-cover z-10 text-white">
                <button type="button" onClick={() => handleSelect(0)}>
                    <img className="mt-4 mr-4" src={logo} alt="ArtsApp logo" height={46} />
                </button>
                <ul className="xl:px-2 py-14 text-left">
                    <li>
                        <Button
                            variant="text"
                            size="small"
                            color={page.index === 0 ? 'secondary' : 'inherit'}
                            onClick={() => handleSelect(0)}
                        >
                            <span className="text-lg py-3">{language.dictionary.keys}</span>
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="text"
                            size="small"
                            color={page.index === 1 ? 'secondary' : 'inherit'}
                            onClick={() => handleSelect(1)}
                        >
                            <span className="py-3 text-lg">{language.dictionary.observations}</span>
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="text"
                            size="small"
                            color={page.index === 3 ? 'secondary' : 'inherit'}
                            onClick={() => handleSelect(3)}
                        >
                            <span className="py-3 text-lg">{language.dictionary.about}</span>
                        </Button>
                    </li>
                </ul>
                <div className="fixed bottom-3 px-3 xl:px-6 text-sm">
                    <LanguageSelect
                        options={options}
                        onChangeLanguage={(val) => handleSetLanguage(val)}
                    />
                    <a
                        href="https://artsapp.uib.no"
                        target="_self"
                        rel="noopener noreferrer"
                        className="block mt-8 text-white"
                    >
                        <span className="align-middle">{language.dictionary.goArtsApp}</span>
                        &nbsp;
                        <ExitToApp color="primary" />
                    </a>
                </div>
            </div>
            <FooterNav
                selected={page.index}
                onSelect={(index) => handleSelect(index)}
            />
        </nav>
    );
};

export default Nav;
