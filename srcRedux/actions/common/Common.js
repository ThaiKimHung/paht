import Utils from '../../../app/Utils';
import * as ActionTypes from '../type';
//SAVE_INFO../../../app/Utils
export const SetDesign_App = val => ({
    type: ActionTypes.TypeCommon.SET_DESIGN,
    data: val
});
export const SetConfig_App = val => ({
    type: ActionTypes.TypeCommon.SET_CONFIG,
    data: val
});

export const SetCameraAnNinh = data => ({
    type: ActionTypes.TypeCommon.SET_CAMERA_ANNINH,
    data: data
});

export const SetKeyCamera = data => ({
    type: ActionTypes.TypeCommon.SET_KEY_CAMERA,
    data: data
});
export const SetListCam = data => ({
    type: ActionTypes.TypeCommon.SET_LISTCAM,
    data: data
});



