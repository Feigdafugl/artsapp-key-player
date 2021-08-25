import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import PlayArrowOutlined from '@material-ui/icons/PlayArrowOutlined';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../context/LanguageContext';
import logo from '../../images/artsapp-key-player-logo-black.png';
import LanguageButton from '../components/buttons/LanguageButton';
import AboutApp from '../components/AboutApp';

/**
 * Render welcome dialog
 */
const WelcomeDialog = ({ openDialog, onClose }) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose()}
        >
            <DialogContent>
                <img className="m-auto mt-4 ml-2" src={logo} alt="ArtsApp logo" height={46} />
                <DialogTitle>
                    {language.dictionary.welcome}
                </DialogTitle>
                <AboutApp />
            </DialogContent>
            <DialogActions>
                <span className="absolute left-2">
                    <LanguageButton />
                </span>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<PlayArrowOutlined />}
                    type="button"
                    onClick={() => onClose()}
                >
                    {language.dictionary.btnStart}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WelcomeDialog;
