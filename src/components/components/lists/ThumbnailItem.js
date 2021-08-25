import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import { getMediaFromDatabase } from '../../../utils/db';

/**
 * Render thumbnail list item
 */
const ThumbnailItem = ({
    media, offline, onClick,
}) => {
    const [imageUrl, setImageUrl] = useState(undefined);

    /**
     * Set image URL
     *
     * @param {Object} element Image
     */
    const setUrl = async (element) => {
        let img;
        if (offline) {
            const blob = await getMediaFromDatabase(element.id);
            if (blob instanceof Blob) img = URL.createObjectURL(blob);
            //  URL.revokeObjectURL(img);
        } else if (typeof element === 'object' && element.mediaElement) {
            img = element.mediaElement[0].url;
        } else {
            img = `${process.env.REACT_APP_KEY_API_URL}/media/thumbnails/${element}`;
        }
        setImageUrl(img);
    };

    /**
     * Set media URL
     */
    useEffect(() => {
        setUrl(media);
    }, [media]);

    return (
        <ListItem
            key={media.id || media}
            onClick={() => onClick()}
        >
            {imageUrl && (
                <img
                    className="h-24 mt-6 mr-4 rounded"
                    alt="Thumbnail"
                    src={imageUrl}
                />
            )}
        </ListItem>
    );
};

export default ThumbnailItem;
