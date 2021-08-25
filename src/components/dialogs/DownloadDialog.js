import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import GetApp from '@material-ui/icons/GetApp';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';
import DownloadKeysList from '../components/lists/DownloadKeysList';
import CollectionsList from '../components/lists/CollectionsList';

/**
 * Render download keys dialog
 */
const DownloadDialog = ({
    openDialog, keys, collections, onClose, onDownload,
}) => {
    const { language } = useContext(LanguageContext);
    const filters = [
        {
            value: 0,
            label: language.dictionary.labelKeys,
        },
        {
            value: 1,
            label: language.dictionary.labelCollections,
        },
    ];
    const [filter, setFilter] = useState(filters[0].value);
    const [selected, setSelected] = useState([]);

    /**
     * Add/remove item from array of selected elements
     *
     * @param {string} item Item to add/remove
     */
    const handleSelectItem = (item) => {
        const arr = [...selected];
        const index = arr.findIndex((element) => element === item);
        if (index > -1) {
            arr.splice(index, 1);
        } else arr.push(item);
        setSelected(arr);
    };

    /**
     * Change filter and reset selected array
     *
     * @param {int} value Filter value
     */
    const handleChangeFilter = (value) => {
        setFilter(value);
        setSelected([]);
    };

    /**
     * Render select filter input
     *
     * @returns JSX
     */
    const renderFilterSelect = () => (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="download-label">
                {language.dictionary.labelShow}
            </InputLabel>
            <Select
                labelId="download-label"
                id="download"
                name="download"
                value={filter}
                variant="outlined"
                fullWidth
                label={language.dictionary.labelShow}
                onChange={(e) => handleChangeFilter(e.target.value)}
            >
                {filters.map((element) => (
                    <MenuItem key={element.value} value={element.value}>{element.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    /**
     * Render keys or key collections list
     *
     * @returns JSX
     */
    const renderList = () => {
        if (filter === 0 && keys) {
            return (
                <DownloadKeysList
                    keys={keys}
                    selected={selected}
                    onClickListItem={(item) => handleSelectItem(item)}
                />
            );
        }
        if (filter === 1 && collections) {
            return (
                <CollectionsList
                    collections={collections}
                    selected={selected}
                    keys={keys}
                    onClickListItem={(item) => handleSelectItem(item)}
                />
            );
        }
        return null;
    };

    return (
        <Dialog
            open={openDialog}
            onClose={() => onClose()}
        >
            <DialogTitle disableTypography>
                <h2 className="text-base font-bold">{language.dictionary.labelDownload}</h2>
            </DialogTitle>
            <DialogContent>
                <CloseButton onClick={() => onClose()} />
                <p className="mb-6 mt-2">{language.dictionary.infoDownload}</p>
                {renderFilterSelect()}
                {renderList()}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<GetApp />}
                    type="button"
                    onClick={() => onDownload(selected, filter)}
                    disabled={selected.length === 0}
                >
                    {language.dictionary.labelDownload}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DownloadDialog;
