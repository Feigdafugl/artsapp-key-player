import React, { useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import { getLanguage } from '../../../utils/language';
import LanguageContext from '../../../context/LanguageContext';
import CharacterDialog from '../../dialogs/CharacterDialog';
import { getCharacterMedia } from '../../../utils/media';
import ListAvatar from '../ListAvatar';
import { getAlternatives } from '../../../utils/logic';

/**
 * Render character list
 */
const CharacterList = ({ characters, onSelectStates, offline }) => {
    const { language } = useContext(LanguageContext);
    const [selectedCharacter, setSelectedCharacter] = useState(undefined);

    /**
     * Render character list item
     *
     * @param {Object} character Character object
     * @returns JSX
     */
    const renderItem = (character) => {
        const states = getAlternatives(character);
        const total = states.length;
        const irrelevant = states.reduce((acc, state) => {
            if (state.answerIs === false) acc += 1;
            return acc;
        }, 0);
        const remaining = total - irrelevant;
        return (
            <ListItem
                key={character.id}
                className="rounded cursor-pointer bg-gray-100 hover:bg-blue-100 h-24 mb-2 shadow-md"
                onClick={() => setSelectedCharacter(character)}
            >
                {character.type === 'numerical' ? <ListAvatar media={getCharacterMedia(character, states)} /> : (
                    <Badge
                        badgeContent={`${remaining}/${total}`}
                        color={remaining !== total ? 'secondary' : 'primary'}
                        overlap="rectangular"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <ListAvatar
                            media={getCharacterMedia(character, states)}
                            offline={offline}
                        />
                    </Badge>
                )}
                <ListItemText
                    primary={(
                        <p className="w-full px-3 max-h-20">
                            {getLanguage(character.title, language.language.split('_')[0])}
                        </p>
                    )}
                />
            </ListItem>
        );
    };

    return (
        <div className="h-full pr-2 overflow-y-auto mb-28 mt-28 lg:mt-0">
            {characters && characters.length > 0 && (
                <List className="w-full lg:w-96">
                    {characters.map((character) => renderItem(character))}
                </List>
            )}
            <CharacterDialog
                openDialog={selectedCharacter !== undefined}
                character={selectedCharacter}
                offline={offline}
                onClose={() => setSelectedCharacter(undefined)}
                onSelectStates={(characterId, states) => onSelectStates(characterId, states)}
            />
        </div>
    );
};

export default CharacterList;
