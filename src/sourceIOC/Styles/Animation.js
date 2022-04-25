import {Dimensions,Platform} from 'react-native'

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const isIOS = Platform.OS === 'ios';

const configDefault  = {
    friction: 10,
    duration: 300,
    useNativeDriver:true
};

const SEARCH_HEIGHT = HEIGHT - 20;
const SEARCH_START_VALUE = SEARCH_HEIGHT - 78; // 78

// animated value for search banner
const SEARCH_BANNER_OFF = {
    ...configDefault,
    toValue: SEARCH_START_VALUE,
};

const SEARCH_BANNER_MEDIUM_ON = {
    ...configDefault,
    toValue: SEARCH_HEIGHT - 110 ,
};

const SEARCH_BANNER_ON = {
    ...configDefault,
    toValue: 0 ,
};

// animated value for picker area location banner
const AREA_BANNER_OFF = {
    ...configDefault,
    toValue: HEIGHT- 152,
};

const RESULT_BANNER_OFF = {
    ...configDefault,
    toValue: HEIGHT - 98,
};

//animated value for info banner
const INFO_OFF = {
    ...configDefault,
    toValue: HEIGHT,
};
const INFO_MEDIUM = {
    ...configDefault
};
const INFO_ON = {
    ...configDefault,
    toValue: 0,
};

const OPTION_OFF = {
    ...configDefault,
    toValue: WIDTH,
};

const LOCATION_OFF = {
    ...configDefault,
    toValue: HEIGHT,
};

const MENU_INFO_OFF = {
    ...configDefault,
    toValue: HEIGHT,
}



export default {
    SEARCH_BANNER_OFF,
    SEARCH_BANNER_ON,
    SEARCH_HEIGHT,
    SEARCH_START_VALUE,
    SEARCH_BANNER_MEDIUM_ON,
    AREA_BANNER_OFF,
    AREA_BANNER_ON:SEARCH_BANNER_ON,
    SCREEN_HEIGHT:HEIGHT,
    SCREEN_WIDTH: WIDTH,
    RESULT_BANNER_OFF,
    INFO_OFF,
    INFO_MEDIUM,
    INFO_ON,
    OPTION_ON:INFO_ON,
    OPTION_OFF,
    LOCATION_OFF,
    MENU_INFO_OFF
}

