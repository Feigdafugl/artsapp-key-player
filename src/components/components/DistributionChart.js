import React, { useContext, useEffect, useState } from 'react';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import OpenWith from '@material-ui/icons/OpenWith';
import LanguageContext from '../../context/LanguageContext';
import GalleryDialog from '../dialogs/GalleryDialog';
import ProgressIndicator from './ProgressIndicator';

/**
 * Render distribution chart
 */
const DistributionChart = ({ taxonId, position }) => {
    const { language } = useContext(LanguageContext);
    const [nationalDistUrl, setNationalDistUrl] = useState(undefined);
    const [localDistUrl, setLocalDistUrl] = useState(undefined);
    const [openGallery, setOpenGallery] = useState({ media: undefined, index: undefined });
    const [loadNational, setLoadNational] = useState(true);
    const [loadLocal, setLoadLocal] = useState(true);
    const [noPosition, setNoPosition] = useState(false);

    useEffect(() => {
        if (position && position.longitude && position.latitude) {
            setNationalDistUrl(`${process.env.REACT_APP_V3_API_URL}/distribution/country/medium/?speciesId=${taxonId}&lon=${position.longitude}&lat=${position.latitude}`);
            setLocalDistUrl(`${process.env.REACT_APP_V3_API_URL}/distribution/local/medium/?speciesId=${taxonId}&lon=${position.longitude}&lat=${position.latitude}`);
            setNoPosition(false);
        } else {
            setNationalDistUrl(`${process.env.REACT_APP_V3_API_URL}/distribution/country/medium/?speciesId=${taxonId}`);
            setNoPosition(true);
            setLoadLocal(false);
        }
    }, [position]);

    /**
     * Set media element and open gallery dialog
     *
     * @param {int} index Image index
     */
    const handleOpenGallery = (index) => {
        setOpenGallery({
            index,
            media: [
                { mediaElement: [{ url: index === 0 ? nationalDistUrl : localDistUrl }] },
            ],
        });
    };

    return (
        <div className="p-4">
            <ImageList rowHeight={250} cols={1}>
                {nationalDistUrl && (
                    <ImageListItem
                        cols={1}
                        className="text-white"
                        onClick={() => handleOpenGallery(0)}
                    >
                        <img
                            alt="National distribution chart"
                            className="m-auto rounded cursor-pointer"
                            src={nationalDistUrl}
                            onLoad={() => setLoadNational(false)}
                            onError={() => setLoadNational(false)}
                        />
                        <ImageListItemBar
                            title={language.dictionary.nationalChart}
                            subtitle={language.dictionary.nationalDist}
                            actionIcon={(
                                <IconButton
                                    color="inherit"
                                    onClick={() => handleOpenGallery(0)}
                                >
                                    <OpenWith />
                                </IconButton>
                            )}
                        />
                        <ProgressIndicator open={loadNational} />
                    </ImageListItem>
                )}
                {localDistUrl && (
                    <ImageListItem
                        cols={1}
                        className="text-white"
                        onClick={() => handleOpenGallery(1)}
                    >
                        <img
                            alt="Local distribution chart"
                            className="m-auto mt-4 rounded cursor-pointer"
                            src={localDistUrl}
                            onLoad={() => setLoadLocal(false)}
                            onError={() => setLoadNational(false)}
                        />
                        <ImageListItemBar
                            title={language.dictionary.localChart}
                            subtitle={language.dictionary.localDist}
                            actionIcon={(
                                <IconButton
                                    color="inherit"
                                    onClick={() => handleOpenGallery(1)}
                                >
                                    <OpenWith />
                                </IconButton>
                            )}
                        />
                        <ProgressIndicator open={loadLocal} />
                    </ImageListItem>
                )}
            </ImageList>
            {noPosition && <p className="mt-4">{language.dictionary.allowForMap}</p>}
            <p className="mt-4">{language.dictionary.expandChart}</p>
            <GalleryDialog
                media={openGallery.media}
                index={openGallery.index}
                onClose={() => setOpenGallery({ media: undefined, index: undefined })}
            />
        </div>
    );
};

export default DistributionChart;
