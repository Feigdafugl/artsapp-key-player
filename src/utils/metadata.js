/**
 * Get contributor name from ID
 *
 * @param {string} contributor Contributor ID or name
 * @param {Array} persons Array of person IDs and names
 * @returns {string} Contributor name
 */
export const getContributorName = (contributor, persons) => {
    let person = contributor;
    if (persons) {
        if (typeof person === 'object') person = person.id;
        person = persons.find((element) => element.id === person);
        if (person && person.name) person = person.name;
    }
    return person;
};
