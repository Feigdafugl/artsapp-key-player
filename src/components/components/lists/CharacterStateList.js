import React, { useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { getLanguage } from '../../../utils/language';
import LanguageContext from '../../../context/LanguageContext';
import CharacterDialog from '../../dialogs/CharacterDialog';
import { getCharacterMedia } from '../../../utils/media';
import ListAvatar from '../ListAvatar';
import { getAlternatives } from '../../../utils/logic';

const useStyles = makeStyles(() => ({
    isNot: {
        width: '20rem',
        cursor: 'pointer',
        borderRadius: '0.25rem',
        marginLeft: '0.5rem',
        color: 'white',
        background: 'red',
    },
    is: {
        width: '20rem',
        cursor: 'pointer',
        borderRadius: '0.25rem',
        marginLeft: '0.5rem',
        background: '#5FBB5A',
    },
}));

/**
 * Render horizontal character list
 */
const CharacterStateList = ({
    characters, onSelectStates, onRemoveState, onRemoveCharacter, offline,
}) => {
    const classes = useStyles();
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
        const media = getCharacterMedia(character, states);
        const selected = states.filter((element) => element.isAnswered);
        return (
            <ListItem
                key={character.id}
                className={selected[0].answerIs ? classes.is : classes.isNot}
                onClick={() => setSelectedCharacter(character)}
            >
                <ListAvatar
                    media={media && media.url ? [{ mediaElement: { url: media.url } }] : []}
                    size="small"
                    offline={offline}
                />
                <ListItemText
                    primary={(
                        <span className="block text-sm w-28 lg:w-60 overflow-hidden overflow-ellipsis whitespace-nowrap pl-2">
                            {getLanguage(character.title, language.language.split('_')[0])}
                        </span>
                    )}
                    secondary={(
                        <span className={`block text-sm w-24 lg:w-56 overflow-hidden overflow-ellipsis whitespace-nowrap -ml-2 pl-2 rounded ${selected[0].answerIs ? 'text-darkGrey' : 'text-white'} `}>
                            {selected.length > 0 && getLanguage(selected[0].title, language.language.split('_')[0])}
                            {selected.length > 0 && character.type === 'numerical' && <p>{`${selected[0].answerIs[0]} - ${selected[0].answerIs[1]} ${getLanguage(selected[0].unit, language.language.split('_')[0])}`}</p>}
                            {selected.length > 1 && '...'}
                        </span>
                    )}
                />
            </ListItem>
        );
    };

    return (characters && characters.length > 0 ? (
        <div className="fixed bottom-14 lg:bottom-0 w-full h-20 left-0 lg:left-56 xl:left-64 z-10 lg:z-30 border-t bg-white">
            {characters && characters.length > 0 && (
                <List className="w-full flex overflow-x-auto overflow-y-hidden">
                    {characters.map((character) => renderItem(character))}
                </List>
            )}
            <CharacterDialog
                openDialog={selectedCharacter !== undefined}
                character={selectedCharacter}
                edit
                offline={offline}
                onClose={() => setSelectedCharacter(undefined)}
                onSelectStates={(characterId, states) => onSelectStates(characterId, states)}
                onRemoveState={(id) => onRemoveState(id)}
                onRemoveCharacter={(id) => onRemoveCharacter(id)}
            />
        </div>
    ) : null
    );
};

export default CharacterStateList;
