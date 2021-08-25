import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MyLocation from '@material-ui/icons/MyLocation';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import LanguageContext from '../../context/LanguageContext';
import CloseButton from '../components/buttons/CloseButton';

/**
 * Render geolocation dialog
 */
const LocationDialog = ({
    openDialog, position, occurrences, onChange, onClose,
}) => {
    const { language } = useContext(LanguageContext);
    const [formValues, setFormValues] = useState({ latitude: '', longitude: '' });
    const [error, setError] = useState(undefined);

    /**
     * Set position values and reset error message
     */
    useEffect(() => {
        setError(undefined);
        if (position) {
            setFormValues({
                ...formValues,
                latitude: position.latitude || '',
                longitude: position.longitude || '',
            });
        }
    }, [position, openDialog]);

    /**
     * Handle set position
     *
     * @param {Object} e Event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        let exists = 0;
        if (formValues.latitude && formValues.latitude !== '') exists += 1;
        if (formValues.longitude && formValues.longitude !== '') exists += 1;
        if (exists !== 1) {
            onChange(formValues);
            onClose();
        } else setError(language.dictionary.positionInputError);
    };

    /**
     * Render form inputs
     *
     * @returns JSX
     */
    const renderInputs = () => (
        <>
            <TextField
                fullWidth
                id="latitude"
                name="latitude"
                type="number"
                label={language.dictionary.labelLatitude}
                variant="outlined"
                value={formValues.latitude}
                onChange={(e) => setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                })}
                inputProps={{ min: -90, max: 90, step: 0.000001 }}
            />
            <TextField
                fullWidth
                id="longitude"
                name="longitude"
                type="number"
                label={language.dictionary.labelLongitude}
                variant="outlined"
                value={formValues.longitude}
                onChange={(e) => setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                })}
                inputProps={{ min: -180, max: 180, step: 0.000001 }}
            />
        </>
    );

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose()}
        >
            <form autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>
                    {language.dictionary.headerPosition}
                </DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    {position && position.county && (
                        <p className="text-primary mb-4">{`${position.locality}, ${position.municipality}, ${position.county} (${position.latitude}, ${position.longitude})`}</p>
                    )}
                    <p className="mb-6">{language.dictionary.sectionPosition}</p>
                    {renderInputs()}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={<MyLocation />}
                        type="submit"
                    >
                        {language.dictionary.btnSetLocation}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LocationDialog;
