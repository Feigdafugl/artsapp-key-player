import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
/* Importing unstable_ to get rid of findDOMNode warnings in strict mode.
 * Should be fixed in material-ui v5.
 */

/**
 * Create Material UI theme
 */
const materialTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#3079B6',
        },
        secondary: {
            main: '#F0A00C',
        },
    },
    overrides: {
        MuiButton: {
            contained: {
                textTransform: 'inherit',
            },
            containedSizeSmall: {
                padding: '0.5rem',
                fontSize: '1rem',
            },
            containedSizeLarge: {
                padding: '0.75rem',
            },
            text: {
                textTransform: 'inherit',
                color: '#3079B6',
                fontSize: '1rem',
            },
            textSizeSmall: {
                justifyContent: 'left',
                width: '100%',
                paddingLeft: '1rem',
            },
        },
        MuiFab: {
            extended: {
                textTransform: 'inherit',
            },
        },
        MuiTextField: {
            root: {
                display: 'block',
                paddingBottom: '2rem',
            },
        },
        MuiAccordionDetails: {
            root: {
                padding: 0,
            },
        },
        MuiTreeItem: {
            root: {
                '&$selected:focus > $content $label, &$selected > $content $label': {
                    backgroundColor: '#BFDBFE',
                },
            },
            label: {
                borderRadius: '0.5rem',
            },
        },
        MuiDialogTitle: {
            root: {
                paddingBottom: '0.5rem',
            },
        },
        MuiDialogContent: {
            root: {
                paddingTop: 0,
                paddingLeft: '0.6rem',
                paddingRight: '0.6rem',
            },
        },
        MUIRichTextEditor: {
            root: {
                overflow: 'hidden',

            },
            editor: {
                paddingLeft: '0.5rem',
                overflow: 'auto',
                height: '265px',
            },
            toolbar: {
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #D1D5DB',
            },
            placeHolder: {
                paddingLeft: '0.5rem',
            },
        },
        MuiBottomNavigation: {
            root: {
                backgroundColor: '#3079B6',
                fontSize: '1.25rem',
            },
        },
        MuiBottomNavigationAction: {
            root: {
                fontSize: '2rem',
                color: '#FFF',
                '&$selected': {
                    color: '#F0A00C',
                },
            },
            label: {
                fontSize: '0.9rem',
            },
        },
        MuiLinearProgress: {
            root: {
                height: '1rem',
            },
        },
    },
});

export default materialTheme;
