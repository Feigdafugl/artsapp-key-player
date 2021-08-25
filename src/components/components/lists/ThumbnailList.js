import React from 'react';
import List from '@material-ui/core/List';
import ThumbnailItem from './ThumbnailItem';

/**
 * Render thumbnail list
 */
const ThumbnailList = ({
    media, selectable, offline, onClickThumbnail,
}) => (
    <List className={`flex w-max ${selectable ? 'cursor-pointer' : ''}`}>
        {media && media.map(
            (element, index) => (
                <ThumbnailItem
                    key={element.id || element}
                    media={element}
                    offline={offline}
                    onClick={() => onClickThumbnail(index)}
                />
            ),
        )}
    </List>
);

export default ThumbnailList;
