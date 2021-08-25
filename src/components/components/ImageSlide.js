import React, { useContext, useEffect, useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import SwiperCore, {
    Pagination, Navigation,
} from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';
import LanguageContext from '../../context/LanguageContext';
import { getLanguage } from '../../utils/language';
import { getMediaFromDatabase } from '../../utils/db';

SwiperCore.use([Pagination, Navigation]);

/**
 * Render image swiper
 */
const ImageSlide = ({ media, offline }) => {
    const { language } = useContext(LanguageContext);
    const [imageUrl, setImageUrl] = useState(undefined);

    /**
     * Render image info
     *
     * @param {Object} element Image
     * @returns JSX
     */
    const renderImageInfo = (element) => (
        <dl className="absolute bottom-6 w-full bg-gray-300 bg-opacity-80 p-2 rounded">
            {element.title && (
                <>
                    <dt className="float-left w-20 font-light tracking-wide">
                        {language.dictionary.labelTitle}
                    </dt>
                    <dd>{getLanguage(element.title, language.language.split('_')[0])}</dd>
                </>
            )}
            {element.creators && element.creators.length > 0 && (
                <>
                    <dt className="float-left w-20 font-light tracking-wide">
                        {language.dictionary.labelCreators}
                    </dt>
                    <dd>{element.creators.map((creator, index) => `${index === 0 ? '' : ', '}${creator}`)}</dd>
                </>
            )}
            {element.license && (
                <>
                    <dt className="float-left w-20 font-light tracking-wide">
                        {language.dictionary.labelLicense}
                    </dt>
                    <dd>{element.license}</dd>
                </>
            )}
        </dl>
    );

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
            if (element.mediaElement) {
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
        <SwiperSlide key={media.id || media}>
            {imageUrl && (
                <>
                    <img
                        alt="Entity media"
                        className="m-auto"
                        src={imageUrl}
                    />
                    {(media.title || media.license || (media.creators && media.creators.length > 0))
                        && renderImageInfo(media)}
                </>
            )}
        </SwiperSlide>
    );
};

export default ImageSlide;
