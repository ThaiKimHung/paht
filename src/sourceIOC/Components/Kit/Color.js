const COLOR = {
    primary: '#2D74FA',
    secondary: '#F4417D',
    black: '#212121',
    gray10: '#faf9f8',
    gray30: '#edebe9',
    gray50: '#d2d0ce',
    gray70: '#bebbb8',
    gray90: '#a19f9d',
    gray100: '#797775',
    red: '#e53935',
    red10: '#FE2E2E',
    white: '#ffffff',
    danger: "#e53935",
    warning: '#F1AE29',
    transparent: 'transparent',
    orange: '#FF6F00',
    deepOrange: '#FF5722',
    green: '#4CAF50',
    green30: '#207F3B',
    purple: '#9C27B0',
    cyan: '#00BCD4',
    yellow10: '#FFBF00'
};

export const ButtonFit = {
    smoothMain: {
        backgroundColor: 'rgba(0,178,145,.15)',
        text: '#00B291',
        borderColor: COLOR.transparent
    },
    smoothSecondary: {
        backgroundColor: 'rgba(244,65,125,.15)',
        text: COLOR.secondary,
        borderColor: COLOR.transparent
    },
    smoothPrimary: {
        backgroundColor: 'rgba(66,133,244,.24)',
        text: '#1a73e8',
        borderColor: COLOR.transparent
    },
    smoothWarning: {
        backgroundColor: 'rgba(251,188,4,.24)',
        text: '#F1AE29',
        borderColor: COLOR.transparent
    },
    smoothDanger: {
        backgroundColor: 'rgba(229,57,53,.24)',
        text: '#e53935',
        borderColor: COLOR.transparent
    },
    smoothDisabled: {
        backgroundColor: 'rgba(158,158,158,.24)',
        text: '#9E9E9E',
        borderColor: COLOR.transparent
    },
    fillPrimary: {
        backgroundColor: COLOR.primary,
        text: COLOR.white,
        borderColor: '#1a73e8'
    },
    fillSecondary: {
        backgroundColor: COLOR.secondary,
        text: COLOR.white,
        borderColor: COLOR.secondary
    },
    fillWarning: {
        backgroundColor: '#F1AE29',
        text: COLOR.white,
        borderColor: '#F1AE29'
    },
    fillDanger: {
        backgroundColor: '#e53935',
        text: COLOR.white,
        borderColor: '#e53935'
    },
    outlinePrimary: {
        backgroundColor: COLOR.transparent,
        text: '#1a73e8',
        borderColor: 'rgba(66,133,244,.24)'
    },
    outlineWarning: {
        backgroundColor: COLOR.transparent,
        text: '#F1AE29',
        borderColor: 'rgba(251,188,4,.24)'
    },
    outlineDanger: {
        backgroundColor: COLOR.transparent,
        text: '#e53935',
        borderColor: 'rgba(229,57,53,.24)'
    },
    textPrimary: {
        backgroundColor: COLOR.transparent,
        text: '#1a73e8',
        borderColor: COLOR.transparent
    },
    textWarning: {
        backgroundColor: COLOR.transparent,
        text: '#F1AE29',
        borderColor: COLOR.transparent
    },
    textDanger: {
        backgroundColor: COLOR.transparent,
        text: '#e53935',
        borderColor: COLOR.transparent
    }
}


export default COLOR;
