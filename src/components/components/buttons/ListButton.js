import React from 'react';
import Button from '@material-ui/core/Button';

/**
 * Render list button
 */
const ListButton = ({ label, selected, onClick }) => (
    <li>
        <Button
            variant="text"
            size="small"
            color={selected ? 'secondary' : 'inherit'}
            onClick={() => onClick(0)}
        >
            <span className="text-lg py-3">{label}</span>
        </Button>
    </li>
);

export default ListButton;
