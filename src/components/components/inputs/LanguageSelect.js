import React, { useContext, useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render language select input
 */
const LanguageSelect = ({ options, onChangeLanguage }) => {
    const { language } = useContext(LanguageContext);
    const [open, setOpen] = useState(false);

    return (
        <FormControl>
            <InputLabel id="language-label">
                <span className="text-white">
                    {language.dictionary.labelLanguage}
                </span>
            </InputLabel>
            <Select
                className="mb-20"
                labelId="language-label"
                id="language"
                name="language"
                value={language.language}
                variant="standard"
                fullWidth
                onChange={(e) => onChangeLanguage(e.target.value)}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
            >
                {Object.keys(options).map((key) => (
                    <MenuItem key={key} value={key}>
                        <span className={open ? 'text-darkGrey' : 'lg:text-white'}>
                            {options[key]}
                        </span>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguageSelect;
