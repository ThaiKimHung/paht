import * as ActionTypes from '../actions/type';
import { produce } from 'immer';
import { colors } from '../../styles';
import { stubFalse } from 'lodash';
import { Dimensions } from 'react-native';

const ListColor = [
    {
        key: 1,
        color: ['#2E3192', '#1BFFFF']
    },
    {
        key: 2,
        color: ['#D4145A', '#FBB03B']
    },
    {
        key: 3,
        color: ['#ED1C24', '#FCEE21']
    },
    {
        key: 4,
        color: ['#00A8C5', '#FFFF7E']
    },
    {
        key: 5,
        color: ['#31236C', '#852D91']
    },
    {
        key: 6,
        color: ['#009E00', '#FFFF96']
    },
    {
        key: 7,
        color: ['#00FFA1', '#00FFFF']
    },
    {
        key: 8,
        color: ['#8E78FF', '#FC7D7B']
    },
    {
        key: 9,
        color: ['#DC0910', '#FF3D43']
    },
    {
        key: 10,
        color: ['#EC953E', '#F4A746']
    },
    {
        key: 11,
        color: ['#157EFB', 'rgba(68,107,236,0.9)']
    },
    {
        key: 12,
        color: ['#006064', '#027A7F']
    },
]
export const initialStateTheme = {
    colorLinear: ListColor[0],
    ListColor: ListColor,
    background: '',
    blur: 0,
    backGroundOnline: true,
    imgHeaderMenu: true,
    typeMenu: 2,
    backGroundFull: false, // Chỉnh menu full backgroud
    colorHeaderAdmin: ['#01638d', '#01638d'], // màu của header
    colorSliderAdmin: '#25313F', // màu của sider
    transparentMenuCongAn: false, // no color nền menu đối với source công an,
    showModalNoti: false, // modal noti
    isLandscape: false, // biến để biến có xoay ngang thiết bị hay không
    Windows: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    imgBgrHome: ''
};

function ThemeReducer(state = initialStateTheme, action) {
    return produce(state, draft => {
        switch (action.type) {
            case ActionTypes.TypeThemeHeader.SET_COLOR_LINEAR: {
                draft.colorLinear = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_BACKGROUND_HOME: {
                draft.background = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_BLUR_BACKGROUND: {
                draft.blur = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_BACKGROUND_ONLINE: {
                draft.backGroundOnline = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_IMAGE_HEADER_MENU: {
                draft.imgHeaderMenu = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_TYPE_MENU: {
                draft.typeMenu = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_TRANSPAENT_AREA_MENU: {
                draft.transparentMenuCongAn = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_BACKGROUND_FULL: {
                draft.backGroundFull = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SHOW_MODAL_NOTI: {
                draft.showModalNoti = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_LANDSCAPE: {
                draft.Windows = {
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height
                }
                draft.isLandscape = action.data;
                break;
            }
            case ActionTypes.TypeThemeHeader.SET_IMGHOME: {
                draft.imgBgrHome = action.data;
                break;
            }
        }
    })
}


export default ThemeReducer;
