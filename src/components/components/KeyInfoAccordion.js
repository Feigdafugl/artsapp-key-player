import React, { useContext } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { getLanguage } from '../../utils/language';
import PublisherList from './lists/PublisherList';
import ContributorList from './lists/ContributorList';
import formatDate from '../../utils/format-date';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render key info accordion
 */
const KeyInfoAccordion = ({ keyInfo, keys, organizations }) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render key classification
     *
     * @returns JSX
     */
    const renderClassification = () => (
        <AccordionDetails>
            <ul className="p-4">
                {keyInfo.classification.map(
                    (element) => <li key={element.id}>{element.scientificName}</li>,
                )}
            </ul>
        </AccordionDetails>
    );

    /**
     * List names of keys with the same key group
     *
     * @returns JSX
     */
    const renderRelatedKeys = () => {
        const arr = [];
        let i = keyInfo.classification.length - 1;
        while (i > -1) {
            keys.forEach((element) => {
                if (element.classification) {
                    const related = element.classification.find(
                        (c) => c.id === keyInfo.classification[i].id,
                    );
                    if (related) arr.push(element);
                }
                return false;
            });
            if (arr.length > 0) break;
            i -= 1;
        }
        if (arr.length > 0) {
            return (
                <ul className="p-4">
                    {arr.map((element) => (
                        <li key={element.id}>
                            <a href={`/info/${element.id}`}>
                                {getLanguage(element.title, language.language.split('_')[0])}
                            </a>
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="p-4">{language.dictionary.noRelated}</p>;
    };

    return (
        <div className="mb-32 inline-block w-full">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="ownership-panel-content"
                    id="ownership-panel-header"
                    className="font-light"
                >
                    {language.dictionary.labelPublishers}
                </AccordionSummary>
                <AccordionDetails>
                    <PublisherList
                        publishers={keyInfo.publishers}
                        organizations={organizations}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="ownership-panel-content"
                    id="ownership-panel-header"
                    className="font-light"
                >
                    {language.dictionary.labelContributors}
                </AccordionSummary>
                <AccordionDetails>
                    <ContributorList contributors={keyInfo.contributors} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="version-panel-content"
                    id="version-panel-header"
                    className="font-light"
                >
                    {language.dictionary.labelVersion}
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        <dl className="p-4 lg:w-96">
                            {keyInfo.version && (
                                <>
                                    <dt className="float-left w-40 font-light tracking-wide">
                                        {language.dictionary.labelVersionName}
                                    </dt>
                                    <dd>{keyInfo.version}</dd>
                                </>
                            )}
                            <dt className="float-left w-40 font-light tracking-wide">
                                {language.dictionary.labelModified}
                            </dt>
                            <dd>
                                {keyInfo.lastModified && formatDate(keyInfo.lastModified, true)}
                            </dd>
                        </dl>
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="related-panel-content"
                    id="related-panel-header"
                    className="font-light"
                >
                    {language.dictionary.labelTaxonomy}
                </AccordionSummary>
                {keyInfo.classification && renderClassification()}
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="related-panel-content"
                    id="related-panel-header"
                    className="font-light"
                >
                    {language.dictionary.labelRelatedKeys}
                </AccordionSummary>
                {keys && keyInfo.classification && renderRelatedKeys()}
            </Accordion>
        </div>
    );
};

export default KeyInfoAccordion;
