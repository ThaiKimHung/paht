import Utils from '../../../app/Utils';
import * as ActionTypes from '../type';

export const Set_Object_Menu = objectMenu => ({
    type: ActionTypes.TypeMenu.SET_OBJECT_MENU,
    data: objectMenu
});

export const Set_Menu_Canbo = (dataRule, tokenCB) => ({
    type: ActionTypes.TypeMenu.SET_MENU_CANBO,
    data: { dataRule: dataRule, tokenCB: tokenCB }
});

export const Set_Menu_CongDong = dataRule => ({
    type: ActionTypes.TypeMenu.SET_MENU_CONGDONG,
    data: dataRule
});