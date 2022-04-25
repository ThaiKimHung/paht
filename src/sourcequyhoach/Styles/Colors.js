const COLOR =  {
    whiteGray:'#F3F2F1',
    darkGray:'#6B6B70',
    black:'#212121',
    grey:'#9E9E9E',
    darkBlue:'#004576',
    blue:'#0078d4',
    whiteBlue:'#ABD6F5',
    blueBackground:'#D6EAFE',
    white:'#FFFFFF',
    red:'#d32f2f',
    redPink:'#fbaaa0',
    border:'#E0E0E0',
    orange:'#FB8C00',
    yellow:'#FAC15D',
    orangeBackground:'#FCF6F2',
    greenBackground:'#EDF6F4',
    green:'#4CAF50',
    opacityBackground:'rgba(0,0,0,0.3)',
    grayBackground:'#FAF9F8',
    transparent:'transparent'
};

export default COLOR;


const opacityQH = 0.7;
const opacityTD = .05;
const fillColor = {
    yellow: `rgba(255,235,59,${opacityTD})`,
    red: `rgba(244,67,54,${opacityTD})`,
    orange: `rgba(255,152,0,${opacityTD})`,
    'deepOrange': `rgba(255,87,34,${opacityTD})`,
    gray: `rgba(117,117,117,${opacityTD})`,
    pink: `rgba(236,64,122,${opacityTD})`,
    blue: `rgba(33,150,243,${opacityTD})`,
    green: `rgba(76,175,80,${opacityTD})`,
    brown: `rgba(121,85,72,${opacityQH})`,
    redPink:`#fbaaa0`
};


const fillColorQuyHoach = {
    yellow: `rgba(255,235,59,${opacityQH})`,
    red: `rgba(244,67,54,${opacityQH})`,
    orange: `rgba(255,152,0,${opacityQH})`,
    deepOrange: `rgba(255,87,34,${opacityQH})`,
    gray: `rgba(117,117,117,${opacityQH})`,
    pink: `rgba(236,64,122,${opacityQH})`,
    blue: `rgba(33,150,243,${opacityQH})`,
    green: `rgba(76,175,80,${opacityQH})`,
    purple: `rgba(156,39,176,${opacityQH})`,
    deepGreen: `rgba(0,150,136,${opacityQH})`
};

const strokeColor = {
    yellow: '#F57F17',
    red: '#f44336',
    orange: '#FF9800',
    deepOrange: '#FF5722',
    gray: '#757575',
    pink: '#EC407A',
    blue: '#2196F3',
    green: '#4CAF50',
    brown:'#795548',
    purple: '#9C27B0',
    deepGreen:'#009688',
    redPink:'#EF6C00',
};

export const polygonThuaDatStokeColor = {
    "roadmap":"#007B72",
    "hybrid":"#FDD835"
};

const colorMapping = {
    'BHK': 'yellow',
    'BHK+CLN': 'yellow',
    'BHK+LUC': 'yellow',
    'BHK+LUK': 'yellow',
    'CAN': 'red',
    'CLN': 'orange',
    'CLN+BHK': 'orange',
    'CLN+BHK+LUK': 'orange',
    'CLN+LUK': 'orange',
    'CLN+NTS': 'orange',
    'CLN+SKC': 'orange',
    'COC': 'yellow',
    'CQP': 'red',
    'DBV': 'deepOrange',
    'DCH': 'deepOrange',
    'DCS': 'deepOrange',
    'DGD': 'redPink',
    'DGT': 'orange',
    'DHT':'green',
    'DDL': 'orange',
    'DKV': 'deepOrange',
    'DNL': 'deepOrange',
    'DLL': 'deepOrange',
    'DRA': 'deepOrange',
    'DSH': 'deepOrange',
    'DTL': 'blue',
    'DTS': 'deepOrange',
    'DTT': 'deepOrange',
    'DVH': 'deepOrange',
    'DXH': 'deepOrange',
    'DYT': 'deepOrange',
    'HNK': 'yellow',
    'KDT':"deepGreen",
    'LUC': 'yellow',
    'LUC+BHK': 'yellow',
    'LUK': 'yellow',
    'LUK+BHK': 'yellow',
    'LUK+CLN': 'yellow',
    'LUK+NTS': 'yellow',
    'LUN': 'yellow',
    'MNC': 'blue',
    'NHK': 'yellow',
    'NKH': 'yellow',
    'NTD': 'gray',
    'NTS': 'blue',
    'ODT': 'pink',
    'ODT+BHK': 'pink',
    'ODT+CLN': 'pink',
    'ODT+HNK': 'pink',
    'ONT': 'pink',
    'ONT+BHK': 'pink',
    'ONT+BHK+CLN': 'pink',
    'ONT+BHK+LUK': 'pink',
    'ONT+BHK+SKC': 'pink',
    'ONT+CLN': 'pink',
    'ONT+CLN+BHK': 'pink',
    'ONT+CLN+LUK': 'pink',
    'ONT+CLN+NTS': 'pink',
    'ONT+LUC': 'pink',
    'ONT+LUK': 'pink',
    'ONT+NTS': 'pink',
    'ONT+SKC': 'pink',
    'PNK': 'blue',
    'RDD': 'green',
    'RDM': 'green',
    'RPH': 'green',
    'RSX': 'green',
    'SKC': 'purple',
    'SKC+BHK': 'deepOrange',
    'SKC+CLN': 'deepOrange',
    'SKN': 'deepOrange',
    'SKS': 'deepOrange',
    'SKX': 'deepOrange',
    'SON': 'blue',
    'TMD': 'deepOrange',
    'TON': 'deepOrange',
    'TSC': 'redPink',
};

export function getShapeColor(strType) {
    let mapping = "gray";
    if (strType && colorMapping[strType])
        mapping = colorMapping[strType];
    return {strokeColor:strokeColor[mapping],fillColor:fillColor[mapping]}
}

export function getQuyHoachColor(strType) {
    let mapping = "gray";
    if (strType && colorMapping[strType])
        mapping = colorMapping[strType];
    return {strokeColor:strokeColor[mapping],fillColor:fillColorQuyHoach[mapping]}
}

export function getUsedShapeColor(strType) {
    let mapping = "gray";
    if (strType && colorMapping[strType])
        mapping = colorMapping[strType];
    return strokeColor[mapping]
}
