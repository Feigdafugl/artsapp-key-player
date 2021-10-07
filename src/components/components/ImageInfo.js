import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';
import { getLanguage } from '../../utils/language';
import { getContributorName } from '../../utils/metadata';

/**
 * Render image info banner
 */
const ImageInfo = ({ image }) => {
    const { language } = useContext(LanguageContext);

    return (
        <dl className="absolute bottom-2 w-full bg-gray-300 bg-opacity-80 p-2 rounded">
            {image.title && (
                <>
                    <dt className="float-left w-20 font-light tracking-wide">
                        {language.dictionary.labelTitle}
                    </dt>
                    <dd>{getLanguage(image.title, language.language.split('_')[0])}</dd>
                </>
            )}
            {image.creators && image.creators.length > 0 && (
                <>
                    <dt className="float-left w-20 font-light tracking-wide">
                        {language.dictionary.labelCreators}
                    </dt>
                    <dd>
                        {image.creators.map(
                            (creator, index) => `${index === 0 ? '' : ', '}${getContributorName(creator, image.creators)}`,
                        )}
                    </dd>
                </>
            )}
            {image.license && (
                <>
                    <dt className="float-left w-20 font-light tracking-wide">
                        {language.dictionary.labelLicense}
                    </dt>
                    <dd>
                        <a
                            href={image.license}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {image.license}
                        </a>
                    </dd>
                </>
            )}
        </dl>
    );
};

export default ImageInfo;
