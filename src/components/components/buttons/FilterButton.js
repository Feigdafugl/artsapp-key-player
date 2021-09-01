import React, { useContext } from 'react';
import FilterList from '@material-ui/icons/FilterList';
import Close from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render filter button
 */
const FilterButton = ({ openFilter, filter, onOpenFilter }) => {
    const { language } = useContext(LanguageContext);

    if (openFilter) {
        return (
            <>
                <div className="lg:hidden fixed bottom-16 right-2 z-50 h-16">
                    <Fab
                        variant="circular"
                        color="secondary"
                        onClick={() => onOpenFilter(false)}
                    >
                        <Close />
                    </Fab>
                </div>
                <div className="hidden lg:inline fixed z-50 top-2 right-32 h-16">
                    <IconButton
                        title={language.dictionary.btnFilter}
                        edge="start"
                        aria-label="filter"
                        color="primary"
                        onClick={() => onOpenFilter(false)}
                    >
                        <Close fontSize="medium" />
                    </IconButton>
                </div>
            </>
        );
    }

    if (filter.groupId || filter.collectionId) {
        return (
            <>
                <div className="lg:hidden fixed bottom-16 right-2 z-50 h-16">
                    <Badge
                        variant="dot"
                        color="primary"
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Fab
                            variant="circular"
                            color="secondary"
                            onClick={() => onOpenFilter(true)}
                        >
                            <FilterList />
                        </Fab>
                    </Badge>
                </div>
                <div className="hidden lg:inline fixed z-50 top-1 right-32 h-16">
                    <Badge
                        variant="dot"
                        color="primary"
                        overlap="circle"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Fab
                            variant="circular"
                            color="secondary"
                            onClick={() => onOpenFilter(true)}
                            style={{ boxShadow: 'none' }}
                        >
                            <FilterList />
                        </Fab>
                    </Badge>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="lg:hidden fixed bottom-16 right-2 z-40 h-16">
                <Fab
                    variant="circular"
                    color="secondary"
                    onClick={() => onOpenFilter(true)}
                >
                    <FilterList />
                </Fab>
            </div>
            <div className="hidden lg:inline fixed z-50 top-2 right-32 h-16">
                <IconButton
                    title={language.dictionary.btnFilter}
                    edge="start"
                    aria-label="filter"
                    color="primary"
                    onClick={() => onOpenFilter(true)}
                >
                    <FilterList fontSize="medium" />
                </IconButton>
            </div>
        </>
    );
};

export default FilterButton;
