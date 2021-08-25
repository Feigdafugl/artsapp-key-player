import React, { useContext, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import LanguageContext from '../../../context/LanguageContext';
import { getLanguage } from '../../../utils/language';
import { getKeyMedia } from '../../../utils/media';
import ListAvatar from '../ListAvatar';
import KeyFilter from '../inputs/KeyFilter';
import FilterButton from '../buttons/FilterButton';

/**
 * Render key list with search filter
 */
const KeyList = ({
    keys, groups, collections, error, offline,
    showFilter, showRemove, onClickListItem, onClickInfo, onClickRemove,
}) => {
    const { language } = useContext(LanguageContext);
    const [filter, setFilter] = useState({ title: '', groupId: undefined, collectionId: undefined });
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);

    /**
     * Scroll to top on launch
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /**
    * Filter keys
    */
    useEffect(() => {
        if (keys) {
            if (filter.title === '' && !filter.groupId && !filter.collectionId) {
                setFilteredKeys(keys);
            } else {
                let filtered = [...keys];
                if (filter.title) {
                    filtered = filtered.filter((element) => {
                        if (typeof element.title === 'string') {
                            const title = element.title.toUpperCase();
                            if (title.includes(filter.title.toUpperCase())) return true;
                            return false;
                        }
                        const no = element.title.no ? element.title.no.toUpperCase() : undefined;
                        const en = element.title.en ? element.title.en.toUpperCase() : undefined;
                        if (typeof filter.title === 'string') {
                            if (no && no.includes(filter.title.toUpperCase())) return true;
                            if (en && en.includes(filter.title.toUpperCase())) return true;
                        }
                        return false;
                    });
                }
                if (filter.groupId) {
                    filtered = filtered.filter((element) => {
                        const isInGroup = element.classification && element.classification.find(
                            (group) => group.id === filter.groupId,
                        );
                        if (isInGroup) return true;
                        return false;
                    });
                }
                if (filter.collectionId) {
                    filtered = filtered.filter((element) => {
                        const isInCollection = element.collections && element.collections.find(
                            (id) => id === filter.collectionId,
                        );
                        if (isInCollection) return true;
                        return false;
                    });
                }
                setFilteredKeys(filtered);
            }
        }
    }, [keys, filter]);

    /**
     * Render search bar or error alert
     *
     * @returns JSX
     */
    const renderSearchBar = () => (
        <div className="fixed top-16 lg:top-0 lg:right-48 pt-2 lg:pt-1 w-full lg:w-96 px-2 h-16 bg-white z-20">
            {error ? (
                <Alert elevation={6} variant="filled" severity="error">{error}</Alert>
            ) : (
                <TextField
                    id="outlined-full-width"
                    placeholder={language.dictionary.labelSearch}
                    fullWidth
                    autoComplete="off"
                    variant="outlined"
                    value={filter.title}
                    onChange={(e) => setFilter({ ...filter, title: e.target.value })}
                />
            )}
        </div>
    );

    /**
     * Render filter button and selects
     *
     * @returns JSX
     */
    const renderFilter = () => (
        <>
            <KeyFilter
                open={openFilter}
                filter={filter}
                groups={groups}
                collections={collections}
                onChange={(key, value) => setFilter({ ...filter, [key]: value })}
                onReset={() => setFilter({ title: filter.title })}
                onClose={() => setOpenFilter(false)}
            />
            {!error && (
                <FilterButton
                    openFilter={openFilter}
                    filter={filter}
                    onOpenFilter={(val) => setOpenFilter(val)}
                />
            )}
        </>
    );

    return (
        <>
            {renderSearchBar()}
            {showFilter && renderFilter()}
            <div className="overflow-y-auto mt-20 lg:mt-0 pb-8 lg:pb-0 px-2">
                <List>
                    {filteredKeys.map((key) => (
                        <ListItem
                            key={key.id}
                            className="rounded cursor-pointer bg-gray-100 hover:bg-blue-100 h-24 mb-2 shadow-md"
                            onClick={() => onClickListItem(key.filename || key.id)}
                        >
                            <ListAvatar
                                media={getKeyMedia(key)}
                                offline={offline}
                            />
                            <ListItemText
                                primary={(
                                    <span className="block w-full px-1 lg:px-3">
                                        {getLanguage(key.title, language.language.split('_')[0])}
                                    </span>
                                )}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="info"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClickInfo(key.filename || key.id);
                                    }}
                                >
                                    <InfoOutlined />
                                </IconButton>
                                {showRemove && (
                                    <span className="ml-2 text-red-600">
                                        <IconButton
                                            edge="end"
                                            aria-label="remove"
                                            color="inherit"
                                            onClick={() => onClickRemove(key.id)}
                                        >
                                            <DeleteOutlined />
                                        </IconButton>
                                    </span>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                {filteredKeys.length === 0 && <p>{language.dictionary.noMatchingKeys}</p>}
            </div>
        </>
    );
};

export default KeyList;
