import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LanguageContext from '../../../context/LanguageContext';
import { dictionary } from '../../../languages/language';

/**
 * Render language button
 */
const LanguageButton = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    const [menuAnchor, setMenuAnchor] = useState(null);

    /**
     * Change language
     *
     * @param {string} languageCode Language code
     */
    const handleSetLanguage = (languageCode) => {
        setLanguage({ language: languageCode, dictionary: dictionary[languageCode] });
        window.localStorage.setItem('language', languageCode);
    };

    return (
        <>
            <Menu
                id="simple-menu"
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
            >
                <MenuItem onClick={() => { setMenuAnchor(null); handleSetLanguage('no_bm'); }}>
                    {language.dictionary.btnBokmal}
                </MenuItem>
                <MenuItem onClick={() => { setMenuAnchor(null); handleSetLanguage('no_ny'); }}>
                    {language.dictionary.btnNynorsk}
                </MenuItem>
            </Menu>
            <Button
                variant="text"
                color="primary"
                size="large"
                type="button"
                onClick={(e) => {
                    if (language.language.split('_')[0] !== 'en') {
                        handleSetLanguage('en');
                    } else setMenuAnchor(e.currentTarget);
                }}
            >
                {language.dictionary.btnChangeLanguage}
            </Button>
        </>
    );
};

export default LanguageButton;
