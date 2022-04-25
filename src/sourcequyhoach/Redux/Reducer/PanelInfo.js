import {Animated} from 'react-native';
import Animation from '../../Styles/Animation';

const initState = {
    showingMode: 'off',
    data: {},
    animatedTranslateY: new Animated.Value(Animation.INFO_OFF.toValue),
    currentValue : Animation.INFO_OFF.toValue,
    heightBanner : 0,
    zoneList:[],

}

export const Type = {
    "SHOWING_MODE":"SHOWING_MODE",
    "DATA":"DATA",
    "ANIMATED_TRANSLATE_Y":"ANIMATED_TRANSLATE_Y",
    "CURRENT_ANIMATED_VALUE":"CURRENT_ANIMATED_VALUE",
    "HEIGHT_BANNER":"HEIGHT_BANNER",
    "ZONE_LIST":"ZONE_LIST"
}

const PanelInfoReducer = (state = initState, {type,value}) => {
    switch (type)
    {
        case Type.SHOWING_MODE:
            return {
                ...state,
                showingMode:value
            }
        case Type.ANIMATED_TRANSLATE_Y:
            return {
                ...state,
                animatedTranslateY: value
            }
        case Type.DATA:
            return {
                ...state,
                data: value
            }
        case Type.CURRENT_ANIMATED_VALUE:
            return {
                ...state,
                currentValue: value
            }
        case Type.HEIGHT_BANNER:
            return {
                ...state,
                heightBanner: value
            }
        case Type.ZONE_LIST:
            return  {
                ...state,
                zoneList: [...state.zoneList,value]
            }
        default:
            return state
    }

};

export default PanelInfoReducer
