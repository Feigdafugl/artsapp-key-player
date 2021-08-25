import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

/**
 * Render publisher list
 */
const ContributorList = ({ contributors }) => (
    <List>
        {contributors && contributors.map((contributor, index) => (
            <ListItem key={index}>
                <ListItemText
                    primary={contributor}
                />
            </ListItem>
        ))}
    </List>
);

export default ContributorList;
