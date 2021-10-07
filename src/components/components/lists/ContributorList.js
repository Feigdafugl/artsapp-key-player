import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getContributorName } from '../../../utils/metadata';

/**
 * Render publisher list
 */
const ContributorList = ({ contributors, persons }) => (
    <List>
        {contributors && contributors.map((contributor, index) => (
            <ListItem key={contributor.id || index}>
                <ListItemText
                    primary={getContributorName(contributor, persons)}
                />
            </ListItem>
        ))}
    </List>
);

export default ContributorList;
