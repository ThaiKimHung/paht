import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import * as ActionTypes from '../type';
export const Set_Color_Linear = colorLinear => ({
    type: ActionTypes.TypeThemeHeader.SET_COLOR_LINEAR,
    data: colorLinear
});

export const Set_Background_Home = val => ({
    type: ActionTypes.TypeThemeHeader.SET_BACKGROUND_HOME,
    data: val
});

export const Set_Blur_Background = val => ({
    type: ActionTypes.TypeThemeHeader.SET_BLUR_BACKGROUND,
    data: val
});

export const Set_Background_Online = val => ({
    type: ActionTypes.TypeThemeHeader.SET_BACKGROUND_ONLINE,
    data: val
})

export const Set_Background_Full = val => ({
    type: ActionTypes.TypeThemeHeader.SET_BACKGROUND_FULL,
    data: val
})

export const Set_Image_Header_Menu = val => ({
    type: ActionTypes.TypeThemeHeader.SET_IMAGE_HEADER_MENU,
    data: val
})

export const Set_Type_Menu = val => ({
    type: ActionTypes.TypeThemeHeader.SET_TYPE_MENU,
    data: val
})

export const Set_Transparent_Area_Menu = val => ({
    type: ActionTypes.TypeThemeHeader.SET_TRANSPAENT_AREA_MENU,
    data: val
})

export const SetShowModalNoti = val => ({
    type: ActionTypes.TypeThemeHeader.SHOW_MODAL_NOTI,
    data: Utils.getGlobal(nGlobalKeys.anHomeAdmin, false) && val ? false : val
})

export const SetLandsCape = val => ({
    type: ActionTypes.TypeThemeHeader.SET_LANDSCAPE,
    data: val
})

export const SetIMGHome = val => ({
    type: ActionTypes.TypeThemeHeader.SET_IMGHOME,
    data: val
})