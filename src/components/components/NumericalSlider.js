import React, { useContext } from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { getLanguage } from '../../utils/language';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render slider for numerical characters
 */
const NumericalSlider = ({ state, value, onChange }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="w-full mx-4 mt-10">
            <Slider
                color="secondary"
                value={value}
                aria-labelledby="numerical-value-slider"
                valueLabelDisplay="on"
                step={parseFloat(state.stepSize)}
                min={parseFloat(state.min)}
                max={parseFloat(state.max)}
                marks
                onChange={(e, val) => onChange(val)}
            />
            <Typography id="discrete-slider" className="text-center" gutterBottom>
                {getLanguage(state.unit, language.language.split('_')[0])}
            </Typography>
        </div>
    );
};

export default NumericalSlider;
