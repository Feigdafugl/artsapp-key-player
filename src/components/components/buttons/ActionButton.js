import React, { useContext } from 'react';
import Fab from '@material-ui/core/Fab';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render floating action button for save/delete
 */
const ActionButton = ({ type, onClick }) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render button icon and text
     *
     * @returns JSX
     */
    const renderContent = () => {
        if (type === 'save') {
            return (
                <>
                    <SaveOutlined />
                    {language.dictionary.btnSave}
                </>
            );
        }
        if (type === 'delete') {
            return (
                <>
                    <DeleteOutlined />
                    {language.dictionary.btnDelete}
                </>
            );
        }
        return null;
    };

    return (
        <>
            <div className="lg:hidden fixed bottom-16 right-2 z-50 h-16">
                <Fab
                    variant="extended"
                    color={type === 'delete' ? 'inherit' : 'secondary'}
                    onClick={() => onClick()}
                >
                    {renderContent()}
                </Fab>
            </div>
            <div className="hidden lg:inline fixed z-50 top-2 right-32 h-16">
                <IconButton
                    title={type === 'delete' ? language.dictionary.btnDelete : language.dictionary.btnSave}
                    edge="start"
                    aria-label="filter"
                    color="primary"
                    onClick={() => onClick()}
                >
                    {type === 'delete' ? <DeleteOutlined /> : <SaveOutlined />}
                </IconButton>
            </div>
        </>
    );
};

export default ActionButton;
