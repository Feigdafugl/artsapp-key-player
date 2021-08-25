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
    const [imageUrl, setImageUrl] = useState(undefined);
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
        } else setOpenGallery(media);
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
        setImageUrl(img);
    };

    /**
     * Set media URL
     */
    useEffect(() => {
        setUrl(media);
    }, [media]);

    return (
        <>
            <ListItemAvatar className={`m-auto ${size !== 'small' && 'lg:hidden'}`}>
                {imageUrl ? (
                    <Avatar
                        alt="Avatar"
                        src={imageUrl}
                        variant="rounded"
                        className={`${classes.small} cursor-pointer m-auto`}
                        onClick={handleClick}
                    />
                ) : (
                    <Avatar
                        alt="Avatar"
                        variant="rounded"
                        className={classes.small}
                    >
                        <ImageIcon color="primary" />
                    </Avatar>
                )}
            </ListItemAvatar>
            <ListItemAvatar className={`m-auto hidden ${size !== 'small' && 'lg:inline'}`}>
                {imageUrl ? (
                    <Avatar
                        alt="Avatar"
                        src={imageUrl}
                        variant="rounded"
                        className={`${classes.large} cursor-pointer m-auto`}
                        onClick={handleClick}
                    />
                ) : (
                    <Avatar
                        alt="Avatar"
                        variant="rounded"
                        className={classes.large}
                    >
                        <ImageIcon color="primary" />
                    </Avatar>
                )}
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
