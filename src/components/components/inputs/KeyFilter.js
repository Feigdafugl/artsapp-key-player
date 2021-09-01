import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render key filter
 */
const KeyFilter = ({
    open, filter, groups, collections, onChange, onReset, onClose,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render filter inputs
     *
     * @returns JSX
     */
    const renderInputs = () => (
        <div className="py-4 mt-8">
            <Autocomplete
                id="groupId"
                fullWidth
                value={filter.groupId && groups
                    ? groups.find((element) => element.id === filter.groupId) : null}
                onChange={(e, val) => onChange('groupId', val && val.id)}
                options={groups || []}
                getOptionLabel={(option) => {
                    if (option && option.key_group_info) return option.key_group_info.name;
                    return '';
                }}
                noOptionsText={language.dictionary.noAlternatives}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelKeyGroup} variant="outlined" />}
            />
            <Autocomplete
                id="collectionId"
                fullWidth
                value={filter.collectionId && collections
                    ? collections.find((element) => element.id === filter.collectionId) : null}
                onChange={(e, val) => onChange('collectionId', val && val.id)}
                options={collections || []}
                getOptionLabel={(option) => {
                    if (option && option.collection_info) return option.collection_info.name;
                    return '';
                }}
                noOptionsText={language.dictionary.noAlternatives}
                renderInput={(params) => <TextField {...params} label={language.dictionary.labelCollection} variant="outlined" />}
            />
        </div>
    );

    return (
        <div
            className={`${!open && 'hidden'} fixed top-16 w-full left-0 lg:left-56 xl:left-64 p-2 z-50 lg:w-3/4 bottom-0 bg-blue-100 bg-opacity-80`}
            onClick={() => onClose()}
            role="button"
            tabIndex={0}
        >
            <Collapse in={open} collapsedSize={0}>
                <Paper
                    elevation={4}
                    className="h-80 p-4 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="ml-1 text-base">{language.dictionary.headerFilter}</h2>
                    <span className="absolute top-2 right-0">
                        <Button
                            variant="text"
                            color="secondary"
                            size="large"
                            type="button"
                            onClick={() => { onReset(); onClose(); }}
                        >
                            {language.dictionary.btnReset}
                        </Button>
                    </span>
                    {renderInputs()}
                </Paper>
            </Collapse>
        </div>
    );
};

export default KeyFilter;
