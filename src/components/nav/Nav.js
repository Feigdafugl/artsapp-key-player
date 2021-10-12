import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import ExitToApp from '@material-ui/icons/ExitToApp';
import logo from '../../images/artsapp-key-player-logo.png';
import LanguageContext from '../../context/LanguageContext';
import PageContext from '../../context/PageContext';
import { dictionary, options } from '../../languages/language';
import TitleBar from './TitleBar';
import FooterNav from './FooterNav';
import LanguageSelect from '../components/inputs/LanguageSelect';
import HelpButton from '../components/buttons/HelpButton';
import ListButton from '../components/buttons/ListButton';

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
        const pageParam = new URLSearchParams(location.search).get('page');
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
                    if (pageParam === 'observations') {
                        setPage({ index: 1 });
                    } else if (pageParam === 'downloads') {
                        setPage({ index: 2 });
                    } else setPage({ index: 0 });
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
            {showHelpIcon && <HelpButton onClick={() => handleSelect(4)} />}
            <div className="fixed h-full hidden lg:inline w-56 xl:w-64 bg-artsapp-web bg-no-repeat bg-cover z-10 text-white">
                <button type="button" onClick={() => handleSelect(0)}>
                    <img className="mt-4 mr-4" src={logo} alt="ArtsApp logo" height={46} />
                </button>
                <ul className="xl:px-2 py-14 text-left">
                    <ListButton
                        label={language.dictionary.keys}
                        selected={page.index === 0}
                        onClick={() => handleSelect(0)}
                    />
                    <ListButton
                        label={language.dictionary.observations}
                        selected={page.index === 1}
                        onClick={() => handleSelect(1)}
                    />
                    <ListButton
                        label={language.dictionary.about}
                        selected={page.index === 3}
                        onClick={() => handleSelect(3)}
                    />
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
                        <span className="align-middle mr-1">{language.dictionary.goArtsApp}</span>
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
