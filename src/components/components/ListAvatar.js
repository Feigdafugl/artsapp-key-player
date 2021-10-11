import React, { useState, useEffect } from 'react';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ImageIcon from '@material-ui/icons/Image';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import GalleryDialog from '../dialogs/GalleryDialog';
import { getMediaFromDatabase } from '../../utils/db';

const useStyles = makeStyles(() => ({
    large: {
        width: '5rem',
        height: '5rem',
        background: 'white',
    },
    small: {
        width: '3rem',
        height: '3rem',
        background: 'white',
    },
}));

/**
 * Render list avatar
 */
const ListAvatar = ({
    id, media, size, offline,
}) => {
    const classes = useStyles();
    const [thumbnailUrl, setThumbnailUrl] = useState(undefined);
    const [openGallery, setOpenGallery] = useState(undefined);

    /**
     * Handle click avatar
     *
     * @param {Object} e Event
     */
    const handleClick = (e) => {
        e.stopPropagation();
        if (id) {
            setOpenGallery([id]);
        } else setOpenGallery(media.filter((element) => element.width !== 128));
    };

    /**
     * Set image URL
     *
     * @param {Object} element Image
     */
    const setUrl = async (element) => {
        let img;
        if (id) {
            img = `${process.env.REACT_APP_KEY_API_URL}/media/thumbnails/${id}`;
        } else if (element && element.length > 0) {
            if (offline) {
                const blob = await getMediaFromDatabase(element[0].id);
                if (blob instanceof Blob) img = URL.createObjectURL(blob);
                //  URL.revokeObjectURL(img);
            } else if (typeof element === 'object') {
                if (element[0].mediaElement) {
                    img = element[0].mediaElement[0].url;
                } else img = element[0].url;
            }
        }
        setThumbnailUrl(img);
    };

    /**
     * Set media URL
     */
    useEffect(() => {
        setUrl(media);
    }, [media]);

    /**
     * Render avatar icon
     *
     * @param {Object} style MUI style class
     * @param {boolean} clickable True if clickable
     * @returns JSX
     */
    const renderAvatar = (style, clickable) => {
        if (clickable) {
            return (
                <Avatar
                    alt="Avatar"
                    src={thumbnailUrl}
                    variant="rounded"
                    className={`${style} cursor-pointer m-auto`}
                    onClick={handleClick}
                />
            );
        }
        return (
            <Avatar
                alt="Avatar"
                variant="rounded"
                className={style}
            >
                <ImageIcon color="primary" />
            </Avatar>
        );
    };

    return (
        <>
            <ListItemAvatar className={`m-auto ${size !== 'small' && 'lg:hidden'}`}>
                {thumbnailUrl ? renderAvatar(classes.small, true) : renderAvatar(classes.small)}
            </ListItemAvatar>
            <ListItemAvatar className={`m-auto hidden ${size !== 'small' && 'lg:inline'}`}>
                {thumbnailUrl ? renderAvatar(classes.large, true) : renderAvatar(classes.large)}
            </ListItemAvatar>
            <GalleryDialog
                media={openGallery}
                offline={offline}
                onClose={() => setOpenGallery(undefined)}
            />
        </>
    );
};

export default ListAvatar;
