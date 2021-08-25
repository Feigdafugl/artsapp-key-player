import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ImageSwiper from '../components/ImageSwiper';

/**
 * Render image gallery dialog
 */
const GalleryDialog = ({
    media, index, offline, onClose,
}) => (
    <Dialog
        fullScreen
        scroll="paper"
        open={media !== undefined}
        onClose={() => onClose()}
        onClick={(e) => e.stopPropagation()}
    >
        <DialogContent>
            <ImageSwiper
                media={media}
                index={index}
                offline={offline}
                onClose={onClose}
            />
        </DialogContent>
    </Dialog>
);

export default GalleryDialog;
