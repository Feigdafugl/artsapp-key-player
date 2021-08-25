import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

/**
 * Render publisher list
 */
const PublisherList = ({ publishers, organizations }) => {
    const [publisherOrgs, setPublisherOrgs] = useState(undefined);

    /**
     * Find organization info and set publisher list
     */
    useEffect(() => {
        if (!publisherOrgs && publishers && organizations) {
            const arr = [];
            publishers.forEach((publisher) => {
                const organization = organizations.find((element) => element.id === publisher);
                if (organization && organization.organization_info) arr.push(organization);
            });
            setPublisherOrgs(arr);
        }
    }, [publishers, organizations]);

    return (
        <List>
            {publisherOrgs && publisherOrgs.map((publisher) => (
                <ListItem key={publisher.id}>
                    <ListItemText
                        primary={`${publisher.organization_info.fullName} (${publisher.organization_info.shortName})`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default PublisherList;
