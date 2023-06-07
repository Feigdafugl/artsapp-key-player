import {
  getAlternatives, giveAnswers, initKey, isAlternativeAnswered,
} from './logic';

/**
* Initialize key content
*
* @param {Object} element Key content
* @returns {Object} Initialized key content
*/
export const initKeyContent = (element) => {
  const mode = element.mode || parseInt(process.env.REACT_APP_DEFAULT_KEY_MODE, 10);
  const tmpKey = initKey(element, mode === 2);
  return tmpKey;
};

/**
* Get selected/remaining characters and current progress
*
* @param {Object} key Key object
* @returns {Object} Current progress (0-100) and arrays of selected and remaining characters
*/
export const getCharacterState = (key) => {
  let selected = [];
  let remaining = [];
  let prog = 0;
  if (key.relevantTaxaCount === 1) {
      prog = 100;
  } else {
      const fraction = (key.relevantTaxaCount / key.taxaCount) * 100;
      prog = 100 - fraction;
  }
  selected = key.characters.filter(
      (character) => character.isAnswered || isAlternativeAnswered(character),
  );
  remaining = key.characters.filter(
      (character) => !character.isAnswered
          && !isAlternativeAnswered(character)
          && character.relevant !== false,
  );
  return {
      key, selected, remaining, prog,
  };
};

/**
* Set character state answers
*
* @param {Object} key Key object
* @param {Array} states States array
* @param {string} filterRelevant Filter only on characters that are relevant for all taxa
* @param {string} characterId Character ID
* @returns {Object} Updated key object
*/
export const setStateAnswers = (key, states, filterRelevant, characterId) => {
  let tmpKey = { ...key };
  if (characterId) {
      const character = tmpKey.characters.find((element) => element.id === characterId);
      character.states = getAlternatives(character);
      character.states = states.map((state) => {
          const charState = character.states.find((element) => element.id === state.id);
          return ({ ...charState, ...state });
      });
  }
  tmpKey = giveAnswers(key, states, filterRelevant === 'all' || false);
  return tmpKey;
};

/**
 * Initialize key
 *
 * @param {Object} element Key element
 * @param {boolean} forceRefresh Pull key from API even if a local copy exists
 */
export const initialize = async (element, forceRefresh) => {
    const storedKey = window.localStorage.getItem(element.id);
    let init;
    if (!forceRefresh && storedKey && storedKey !== 'undefined') {
        init = await getCharacterState(JSON.parse(storedKey));
        return init;
    }
    const tmpKey = await initKeyContent(element);
    init = await getCharacterState(tmpKey);
    return init;
};
