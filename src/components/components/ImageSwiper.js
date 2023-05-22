import React from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import CloseButton from './buttons/CloseButton';
import ImageSlide from './ImageSlide';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
                // install Swiper modules
                modules={[Navigation, Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                navigation={media.length > 1}
                loop={media.length > 1}
                zoom={{ maxRatio: '3' }}
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
