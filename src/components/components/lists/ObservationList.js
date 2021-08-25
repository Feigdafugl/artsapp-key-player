import React, { useContext, useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import formatDate from '../../../utils/format-date';
import ListAvatar from '../ListAvatar';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render observation list
 */
const ObservationList = ({ observations, error, onClickListItem }) => {
    const { language } = useContext(LanguageContext);
    const [filter, setFilter] = useState({ title: '' });
    const [filteredObs, setFilteredObs] = useState([]);

    /**
     * Filter observations array on scientific name or multilingual vernacular name
     *
     * @returns {Array} Filtered observations array
     */
    const filterObservations = () => {
        const arr = observations.filter((element) => {
            if (element.scientificName
                && element.scientificName.toUpperCase().includes(filter.title.toUpperCase())) {
                return true;
            }
            if (typeof element.vernacularName === 'string') {
                const title = element.vernacularName.toUpperCase();
                if (title.includes(filter.toUpperCase())) return true;
                return false;
            }
            const titleNo = element.vernacularName.no
                ? element.vernacularName.no.toUpperCase() : undefined;
            const titleEn = element.vernacularName.en
                ? element.vernacularName.en.toUpperCase() : undefined;
            if (titleNo && titleNo.includes(filter.title.toUpperCase())) return true;
            if (titleEn && titleEn.includes(filter.title.toUpperCase())) return true;
            return false;
        });
        return arr;
    };

    /**
     * Set filtered observations array
     */
    useEffect(() => {
        if (observations) {
            if (filter.title === '') {
                setFilteredObs(observations);
            } else setFilteredObs(filterObservations());
        }
    }, [filter, observations]);

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

    return (
        <>
            {renderSearchBar()}
            <div className="overflow-y-auto mt-20 lg:mt-0 px-2">
                <List>
                    {filteredObs.map((observation) => (
                        <ListItem
                            key={observation.id}
                            className="h-24 mb-2 rounded shadow-md bg-gray-100 cursor-pointer hover:bg-blue-100"
                            onClick={() => onClickListItem(observation)}
                        >
                            {observation.media && observation.media.length > 0
                                && <ListAvatar media={observation.media} />}
                            <ListItemText
                                primary={<span className="px-3">{observation.scientificName}</span>}
                                secondary={<span className="ml-2">{formatDate(observation.createdAt)}</span>}
                            />
                        </ListItem>
                    ))}
                </List>
                {filteredObs.length === 0 && <p>{language.dictionary.noMatchingObs}</p>}
            </div>
        </>
    );
};

export default ObservationList;
