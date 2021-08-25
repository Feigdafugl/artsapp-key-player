import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListAlt from '@material-ui/icons/ListAlt';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CloudDone from '@material-ui/icons/CloudDone';

/**
 * Render bottom navigation menu
 */
const FooterNav = ({ selected, onSelect }) => (
    <div className="fixed w-full bottom-0 lg:hidden z-10">
        <BottomNavigation
            value={selected}
            onChange={(e, val) => {
                onSelect(val);
            }}
            showLabels
        >
            <BottomNavigationAction icon={<ListAlt />} />
            <BottomNavigationAction icon={<LibraryBooks />} />
            <BottomNavigationAction icon={<CloudDone />} />
        </BottomNavigation>
    </div>
);

export default FooterNav;
