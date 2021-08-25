import React, { useContext, useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LanguageContext from '../../context/LanguageContext';
import { getLanguage } from '../../utils/language';
import ThumbnailList from './lists/ThumbnailList';
import GalleryDialog from '../dialogs/GalleryDialog';
import DistributionChart from './DistributionChart';

/**
 * Render taxon info
 */
const TaxonInfo = ({ taxon, position, offline }) => {
    const { language } = useContext(LanguageContext);
    const [openGallery, setOpenGallery] = useState({ media: undefined, index: undefined });

    /**
    * Render info panel
    *
    * @returns JSX
    */
    const renderInfo = () => (
        <div className="my-8 overflow-y-auto pb-40">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="ownership-panel-content"
                    id="ownership-panel-header"
                >
                    {language.dictionary.labelDescription}
                </AccordionSummary>
                <AccordionDetails>
                    <div className="mt-6 mb-8" dangerouslySetInnerHTML={{ __html: taxon && getLanguage(taxon.description, language.language.split('_')[0]) }} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="ownership-panel-content"
                    id="ownership-panel-header"
                >
                    {language.dictionary.labelDistributionCharts}
                </AccordionSummary>
                <AccordionDetails>
                    <DistributionChart
                        taxonId={taxon.id}
                        position={position}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    );

    if (taxon) {
        return (
            <>
                <ThumbnailList
                    media={taxon.media}
                    selectable
                    offline={offline}
                    onClickThumbnail={(index) => setOpenGallery({ media: taxon.media, index })}
                />
                <h1 className="mt-6">{getLanguage(taxon.vernacularName, language.language.split('_')[0])}</h1>
                {renderInfo()}
                <GalleryDialog
                    media={openGallery.media}
                    index={openGallery.index}
                    onClose={() => setOpenGallery({ media: undefined, index: undefined })}
                />
            </>
        );
    }
    return null;
};

export default TaxonInfo;
