import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import LanguageContext from '../../../context/LanguageContext';
import { getLanguage } from '../../../utils/language';

/**
 * Render download keys list
 */
const DownloadKeysList = ({
    keys, selected, onClickListItem,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="mt-2">
            <List>
                {keys.map((key) => (
                    <ListItem
                        key={key.id}
                        className="rounded cursor-pointer bg-gray-100 hover:bg-blue-100 h-16 mb-4 shadow-md"
                        onClick={() => onClickListItem(key.filename || key.id)}
                    >
                        {selected && (
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selected.includes(key.filename || key.id)}
                                    tabIndex={-1}
                                    disableRipple
                                    color="primary"
                                />
                            </ListItemIcon>
                        )}
                        <ListItemText
                            primary={(
                                <span className="block w-full px-1 lg:px-3">
                                    {getLanguage(key.title, language.language.split('_')[0])}
                                </span>
                            )}
                        />
                    </ListItem>
                ))}
            </List>
            {keys.length === 0 && <p>{language.dictionary.noKeysDownload}</p>}
        </div>
    );
};

export default DownloadKeysList;
