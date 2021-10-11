import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
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
    <div className="h-full my-10">
        <CloseButton onClick={() => onClose()} />
        {media && (
            <Swiper
                navigation={media.length > 1}
                loop={media.length > 1}
                zoom
                initialSlide={index || 0}
            >
                {media.map((element, i) => (
                    <SwiperSlide key={i}>
                        <ImageSlide
                            media={element}
                            offline={offline}
                            onClose={onClose}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        )}
    </div>
);

export default ImageSwiper;
