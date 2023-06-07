import React, { useContext } from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { getLanguage } from '../../../utils/language';
import LanguageContext from '../../../context/LanguageContext';
import { getRelevantTaxaCount } from '../../../utils/logic';
import { getTaxonMedia } from '../../../utils/media';
import ListAvatar from '../ListAvatar';

const TaxonItem = ({
    taxon, relevance, offline, onClick, onDismiss,
}) => {
    const { language } = useContext(LanguageContext);

    let children = [];
    let taxaCount;
    if (taxon.children && taxon.children.length > 0) {
        if (relevance !== 'irrelevant') {
            children = taxon.children.filter((child) => child.isRelevant);
            taxaCount = getRelevantTaxaCount(taxon);
        } else children = taxon.children.filter((child) => child.isIrrelevant);
    }

    return (
        <TreeItem
            nodeId={`${taxon.id}_${relevance}`}
            onLabelClick={(e) => {
                e.stopPropagation();
                onClick(taxon);
            }}
            onClick={(e) => e.stopPropagation()}
            label={(
                <div className="bg-gray-100 flex py-2 pr-4 pl-2 w-full h-24 mb-3 rounded hover:bg-blue-100">
                    <div className="m-auto">
                        <ListAvatar
                            media={getTaxonMedia(taxon)}
                            offline={offline}
                        />
                    </div>
                    <ul className="px-4 mt-4 w-full">
                        {language.language === 'en' ? (
                            <>
                                <li>
                                    {taxon.scientificName}
                                    {taxaCount && ` (${taxaCount})`}
                                </li>
                                <li className="text-sm">{getLanguage(taxon.vernacularName, language.language.split('_')[0])}</li>
                            </>
                        ) : (
                            <>
                                <li>
                                    {getLanguage(taxon.vernacularName, language.language.split('_')[0])}
                                    {taxaCount && ` (${taxaCount})`}
                                </li>
                                <li className="text-sm">{taxon.scientificName}</li>
                            </>
                        )}
                    </ul>
                    {relevance === 'relevant' && (
                        <IconButton
                            edge="end"
                            aria-label="dismiss"
                            color="inherit"
                            onClick={(e) => { e.stopPropagation(); onDismiss(taxon.id); }}
                        >
                            <Close />
                        </IconButton>
                    )}
                </div>
            )}
        >
            {!taxon.isResult ? children.map((child) => (
                <TaxonItem
                    taxon={child}
                    key={child.id}
                    relevance={relevance}
                    offline={offline}
                    onClick={(t) => onClick(t)}
                    onDismiss={() => onDismiss(taxon.id)}
                />
            )) : ''}
        </TreeItem>
    );
};

export default TaxonItem;
