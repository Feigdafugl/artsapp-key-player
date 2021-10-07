import React from 'react';
import { Swiper } from 'swiper/react';
import SwiperCore, {
    Pagination, Navigation,
} from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';
import CloseButton from './buttons/CloseButton';
import ImageSlide from './ImageSlide';

SwiperCore.use([Pagination, Navigation]);

/**
 * Render image swiper
 */
const ImageSwiper = ({
    media, index, offline, onClose,
}) => (
    <div className="h-full">
        <CloseButton onClick={() => onClose()} />
        <Swiper
            navigation
            loop
            zoom
            initialSlide={index || 0}
            className="mt-10"
        >
            {media && media.map((element, index) => (
                <ImageSlide
                    key={element.id || index}
                    media={element}
                    index={index}
                    offline={offline}
                    onClose={onClose}
                />
            ))}
        </Swiper>
    </div>
);

export default ImageSwiper;
