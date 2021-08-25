import React, { useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import LanguageContext from '../../../context/LanguageContext';
import { getLanguage } from '../../../utils/language';
import CollectionInfo from '../../dialogs/CollectionInfo';

/**
 * Render download collections list
 */
const CollectionsList = ({
    collections, selected, keys, onClickListItem,
}) => {
    const { language } = useContext(LanguageContext);
    const [openInfo, setOpenInfo] = useState(undefined);

    return (
        <div className="mt-2">
            <List>
                {collections.map((collection) => (
                    <ListItem
                        key={collection.id}
                        className="rounded cursor-pointer bg-gray-100 hover:bg-blue-100 h-16 mb-2 shadow-md"
                        onClick={() => onClickListItem(collection.id)}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={selected.includes(collection.id)}
                                tabIndex={-1}
                                disableRipple
                                color="primary"
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={(
                                <span className="block w-full px-1 lg:px-3">
                                    {getLanguage(collection.collection_info.name, language.language.split('_')[0])}
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
                                    setOpenInfo(collection);
                                }}
                            >
                                <InfoOutlined />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            {collections.length === 0 && <p>{language.dictionary.noCollectionsDownload}</p>}
            {openInfo && (
                <CollectionInfo
                    openDialog={openInfo}
                    keys={keys}
                    onClose={() => setOpenInfo(undefined)}
                />
            )}
        </div>
    );
};

export default CollectionsList;
