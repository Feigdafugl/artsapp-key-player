import React, { useContext, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import LanguageContext from '../../../context/LanguageContext';
import TaxonItem from './TaxonItem';
import { getAllTaxonIds, getResultTaxa } from '../../../utils/logic';

/**
 * Render taxa list
 */
const TaxaList = ({
    taxa, count, relevantCount, offline, onClickListItem, onDismissTaxon,
}) => {
    const { language } = useContext(LanguageContext);
    const [expanded, setExpanded] = useState(undefined);

    /**
     * Expand or close accordion
     *
     * @param {int} index Accordion index
     */
    const handleExpand = (index) => {
        if (expanded !== index) {
            setExpanded(index);
        } else setExpanded(undefined);
    };

    /**
     * Render tree item
     *
     * @param {string} relevance Relevant or irrelevant
     * @returns JSX
     */
    const renderItem = (relevance) => {
        let variable = 'isRelevant';
        if (relevance === 'irrelevant') variable = 'isIrrelevant';
        return (
            <div className="mr-4">
                {taxa && taxa
                    .filter((taxon) => taxon[variable])
                    .map((taxon) => (
                        <TaxonItem
                            taxon={taxon}
                            key={taxon.id}
                            relevance={relevance}
                            offline={offline}
                            onClick={(t) => onClickListItem(t)}
                            onDismiss={() => onDismissTaxon(taxon.id)}
                        />
                    ))}
            </div>
        );
    };

    /**
     * Render tree view
     *
     * @param {string} relevance Relevant or irrelevant
     * @param {boolean} shrink Shrink list when identification successfull
     * @returns JSX
     */
    const renderTreeView = (relevance, shrink) => (
        <TreeView
            className={`w-full overflow-y-auto ${shrink && relevantCount === 1 ? 'h-28' : 'h-96'}`}
            defaultExpanded={getAllTaxonIds(taxa)}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            disableSelection
        >
            {renderItem(relevance)}
        </TreeView>
    );

    /**
     * Render identification result
     *
     * @returns JSX
     */
    const renderResult = () => {
        const taxaResult = getResultTaxa(taxa);
        if (taxaResult.length > 0) {
            return (
                <div className="w-full mr-4">
                    <TaxonItem
                        taxon={taxaResult[0]}
                        key={taxaResult[0].id}
                        relevance="relevant"
                        offline={offline}
                        onClick={(t) => onClickListItem(t)}
                        onDismiss={() => onDismissTaxon(taxaResult[0].id)}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className={`w-full fixed right-0 top-16 mt-2 lg:mt-0 lg:top-0 lg:relative z-20 lg:z-0 ${expanded !== undefined ? 'h-full bg-blue-100 bg-opacity-80 lg:bg-white' : 'bg-white'} ${expanded === 0 && 'pt-4 lg:pt-0'}`}
            onClick={() => setExpanded(undefined)}
            role="button"
            tabIndex={0}
        >
            <div className="lg:hidden">
                <Accordion
                    expanded={expanded === 0 || relevantCount === 1}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (relevantCount > 0) handleExpand(0);
                    }}
                    className={`${expanded === 1 && 'hidden lg:inline'}`}
                    disabled={relevantCount === 0}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="remaining-panel-content"
                        id="remaining-panel-header"
                    >
                        {`${language.dictionary.labelRemaining} (${relevantCount})`}
                    </AccordionSummary>
                    <AccordionDetails>
                        {relevantCount === 1 ? renderResult() : renderTreeView('relevant', true)}
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    expanded={expanded === 1}
                    onClick={(e) => {
                        e.stopPropagation();
                        if ((count - relevantCount) > 0) handleExpand(1);
                    }}
                    className={`${expanded === 0 && 'hidden lg:inline'}`}
                    disabled={count - relevantCount === 0}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="eliminated-panel-content"
                        id="eliminated-panel-header"
                    >
                        {`${language.dictionary.labelEliminated} (${count - relevantCount})`}
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderTreeView('irrelevant', true)}
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className="hidden lg:inline">
                <Accordion expanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="remaining-panel-content"
                        id="remaining-panel-header"
                    >
                        {`${language.dictionary.labelRemaining} (${relevantCount})`}
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderTreeView('relevant')}
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="eliminated-panel-content"
                        id="eliminated-panel-header"
                    >
                        {`${language.dictionary.labelEliminated} (${count - relevantCount})`}
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderTreeView('irrelevant')}
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
};

export default TaxaList;
