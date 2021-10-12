import WebWorker from '../workers/index';

const worker = new WebWorker();

/**
 * Initialize key
 *
 * @param {Object} element Key element
 * @param {boolean} forceRefresh Pull key from API even if a local copy exists
 */
const initialize = async (element, forceRefresh) => {
    const storedKey = localStorage.getItem(element.id);
    let init;
    if (!forceRefresh && storedKey && storedKey !== 'undefined') {
        init = await worker.getCharacterState(JSON.parse(storedKey));
        return init;
    }
    const tmpKey = await worker.initKeyContent(element);
    init = await worker.getCharacterState(tmpKey);
    return init;
};

export default initialize;
