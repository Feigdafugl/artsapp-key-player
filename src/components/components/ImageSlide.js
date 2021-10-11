import React, { useEffect, useState } from 'react';
import SwiperCore, {
    Pagination, Navigation,
} from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';
import { getMediaFromDatabase } from '../../utils/db';
import ImageInfo from './ImageInfo';
import ProgressIndicator from './ProgressIndicator';

SwiperCore.use([Pagination, Navigation]);

/**
 * Render image swiper
 */
const ImageSlide = ({ media, offline }) => {
    const [imageUrl, setImageUrl] = useState(undefined);
    const [load, setLoad] = useState(true);

    /**
     * Render image slide
     *
     * @param {Object} element Media object or media ID
     * @returns JSX
     */
    const setUrl = async (element) => {
        let img;
        if (offline) {
            const blob = await getMediaFromDatabase(element.id);
            if (blob instanceof Blob) img = URL.createObjectURL(blob);
            //  URL.revokeObjectURL(img);
        } else if (typeof element === 'object') {
            if (element.url) {
                img = element.url;
            } else if (element.mediaElement) {
                if (element.mediaElement.length > 1) {
                    img = element.mediaElement[1].url;
                } else if (element.mediaElement.length > 0) {
                    img = element.mediaElement[0].url;
                }
            } else img = `${process.env.REACT_APP_KEY_API_URL}/media/${element.id}`;
        }
        setImageUrl(img);
    };

    /**
     * Set media url
     */
    useEffect(() => {
        setUrl(media);
    }, [media]);

    return (
        <>
            {imageUrl && (
                <>
                    <img
                        alt="Entity media"
                        className="m-auto"
                        src={imageUrl}
                        onLoad={() => setLoad(false)}
                    />
                    {(media.title || media.license || (media.creators && media.creators.length > 0))
                        && <ImageInfo image={media} />}
                </>
            )}
            <ProgressIndicator open={load} />
        </>
    );
};

export default ImageSlide;
