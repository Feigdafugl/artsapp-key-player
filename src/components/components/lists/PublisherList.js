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
                if (organization) {
                    arr.push({
                        id: organization.id,
                        name: organization.name || organization.organization_info.fullName,
                    });
                }
            });
            setPublisherOrgs(arr);
        }
    }, [publishers, organizations]);

    return (
        <List>
            {publisherOrgs && publisherOrgs.map((publisher) => (
                <ListItem key={publisher.id}>
                    <ListItemText
                        primary={publisher.name}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default PublisherList;
