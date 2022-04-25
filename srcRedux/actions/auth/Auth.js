import { identity } from 'lodash';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { nkey } from '../../../app/keys/keyStore';
import Utils, { icon_typeToast } from '../../../app/Utils';
import apis from '../../../src/apis';
import * as ActionTypes from '../type';
import ConnectSocket from '../../../chat/RoomChat/Connecttion';
import apisAdmin from '../../../srcAdmin/apis';
import { Platform } from 'react-native';
import { OnSignIn, OnSignOut } from '../../../src/sourcequyhoach/Containers/Login';
import { TypeUserChat } from '../../reducers/Auth';
import { appConfig } from '../../../app/Config';
import { Set_Menu_Canbo } from '../menu/Menu';
import { GetCountNotification } from '../notification/Notification';
import NetInfo from "@react-native-community/netinfo";
import FontSize from '../../../styles/FontSize';
import { SaveTokenHKG } from '../../../srcHKG/api/saveToken';
import { ROOTGlobal } from '../../../app/data/dataGlobal';

//SAVE_INFO../../../app/Utils
export const AcSave_Info = val => ({
    type: ActionTypes.SAVE_INFO,
    data: val
});
export const SetUserApp = (app, val) => ({
    type: ActionTypes.TypeActionAuth.SET_USER_APP,
    data: { app: app, val: val }
})
export const SetListUserApp = (data) => ({
    type: ActionTypes.TypeActionAuth.SET_LIST_USER_APP,
    data: data
})
export const SetTokenApp = (app, val) => ({
    type: ActionTypes.TypeActionAuth.SET_TOKEN_APP,
    data: { app: app, val: val }
})
export const SetTokenListApp = (data) => ({
    type: ActionTypes.TypeActionAuth.SET_TOKEN_LIST_APP,
    data: data
})
export const SetConfigApp = (app, val) => ({
    type: ActionTypes.TypeActionAuth.SET_CONFIG_APP,
    data: { app: app, val: val }
})

export const SetRuleAppCanBo = (data) => ({
    type: ActionTypes.TypeActionAuth.SET_RULE_APPCANBO,
    data: data
})

export const SetTypeUserChat = (data) => ({
    type: ActionTypes.TypeActionAuth.SET_TYPE_USERCHAT,
    data: data
})

export const LogoutApp = (app) => ({
    type: ActionTypes.TypeActionAuth.LOGOUT_APP,
    data: app
})
export const CheckListCam = (numcam) => ({
    type: ActionTypes.TypeCommon.SET_CHECK_LIST_CAM,
    data: numcam
})

export const CheckConnectChat = () => {
    return async (dispatch, getState) => {
        const _state = getState().DataChat;
        if (_state.status == 1) {

        } else {
            ConnectSocket.KetNoi();
        }
    }
}
export const GetDataUserDH = (dataRule) => {

    return async (dispatch, getState) => {
        let res = await apisAdmin.ApiUser.GetInfoUser();
        Utils.nlog("GetInfoUser", res);
        if (res.status == 1 && res.data) {
            dispatch(SetUserApp(AppCodeConfig.APP_ADMIN, { ...res.data, Rules: dataRule || [] }));
        }
    }
}
export const GetDataUserCD = (userId) => {
    return async (dispatch, getState) => {
        if (userId) {
            let res = await apis.ApiUser.GetInFoUser(userId);
            Utils.nlog("GetInfoUser", userId, res);
            if (res.status == 1 && res.data) {
                dispatch(SetUserApp(AppCodeConfig.APP_CONGDAN, res.data));
            } else {
                dispatch(logoutAppCheckInterNet(true))
            }
        }
    }
}
export const checkAppAdmin = () => {
    return async (dispatch, getState) => {
        const auth = getState().auth;
        if (auth.tokenDH) {
            const res = await apisAdmin.ApiUser.CheckSession(auth.tokenDH);
            Utils.nlog('[LOG] check seeion', res)
            if (res.data && res.status == 1 && res.data.kq == true) {
                Utils.setGlobal(nGlobalKeys.loginToken, auth.tokenDH, AppCodeConfig.APP_ADMIN)
                await Utils.nsetStore(nkey.loginToken, auth.tokenDH, AppCodeConfig.APP_ADMIN)
                dispatch(GetDataUserDH(res.data.Roles))
                dispatch(CheckConnectChat())
                dispatch(loadMenuApp({
                    listRuleDH: res.data.Roles
                }))
                dispatch(DangKyOneSignal(false))
                await GetSetMaScreen(false, appConfig.manHinhADmin, true)
                await GetSetMaScreen(false, appConfig.manHinhCachLy, true)
            } else {
                dispatch(logoutAppCheckInterNet(false))
            }

        }
    }
}
export const GetSetMaScreen = async (isGet = false, Ma = '', isAdd = true, isDeleteAll = false) => {
    if (isDeleteAll == true) {
        await Utils.nsetStore(nkey.MaScreen, '');
        return;
    } else {
        let MaScreen = await Utils.ngetStore(nkey.MaScreen, '');
        Utils.nlog("[MaScreen]:", MaScreen)
        if (isGet) {
            return MaScreen;
        }
        if (isAdd) {
            if (MaScreen && `${MaScreen}`.includes(Ma)) {
                return MaScreen;
            } else {
                MaScreen += "," + Ma;
                await Utils.nsetStore(nkey.MaScreen, MaScreen)
                return MaScreen;

            }
        } else {
            if (MaScreen && MaScreen.length > 0) {
                MaScreen = MaScreen.split(`,`);
                MaScreen = MaScreen.filter(item => item != Ma).join(',')
                await Utils.nsetStore(nkey.MaScreen, MaScreen)
                return MaScreen;
            } else {
                return;
            }

        }
    }

}
export const CheckLienKet = (body) => {
    return async (dispatch, getState) => {
        let res = await apis.ApiDVC.AutoLienKet(body)
        Utils.nlog('api check lien ket', res);
        if (res.status == 1 && res.data) {
            dispatch({
                type: ActionTypes.TypeActionAuth.SET_DATA_LIENKET,
                data: res.data
            })
            dispatch({
                type: ActionTypes.TypeMenu.SET_MENU_CANBO,
                data: { dataRule: body.AppCanBo, tokenCB: res.data.tokenG }
            })
            dispatch(CheckLoginListAppSpecial(body))
            // Utils.nlog("giá trị app CB", body.AppCanBo)
            //ưu tiên set global trước
            Utils.setGlobal(nGlobalKeys.loginToken, res.data.token);
            Utils.setGlobal(nGlobalKeys.Id_user, res.data.user);
            Utils.setGlobal(nGlobalKeys.loginToken, res.data.tokenG, AppCodeConfig.APP_ADMIN)
            Utils.setGlobal(nGlobalKeys.Id_user, res.data.user1022G, AppCodeConfig.APP_ADMIN)

            await Utils.nsetStore(nkey.loginToken, res.data.token);
            await Utils.nsetStore(nkey.Id_user, res.data.user);

            await GetSetMaScreen(false, appConfig.manHinhHoSo, true);
            await GetSetMaScreen(false, appConfig.manhinhCongDan, true)

            if (res.data.tokenG) {
                //xác định đây có G----
                await GetSetMaScreen(false, appConfig.manHinhADmin, true)

                await Utils.nsetStore(nkey.loginToken, res.data.tokenG, AppCodeConfig.APP_CHAT);
                await Utils.nsetStore(nkey.loginToken, res.data.tokenG, AppCodeConfig.APP_ADMIN)
                await Utils.nsetStore(nkey.Id_user, res.data.user1022G, AppCodeConfig.APP_ADMIN);

                await dispatch(SetTokenApp(AppCodeConfig.APP_CHAT, res.data.tokenG));
                await dispatch(SetUserApp(AppCodeConfig.APP_CHAT, res.data.user1022G));
                await dispatch(SetTypeUserChat(TypeUserChat.USER_DH))


            } else {
                await Utils.nsetStore(nkey.loginToken, res.data.tokenDVC, AppCodeConfig.APP_CHAT);
                await dispatch(SetTypeUserChat(TypeUserChat.USER_DVC))
                await dispatch(SetTokenApp(AppCodeConfig.APP_CHAT, res.data.tokenDVC));
                await dispatch(SetUserApp(AppCodeConfig.APP_CHAT, { Id: res.data.userDVC, UserID: res.data.userDVC, ...res.data.userDVC }));
            }
            dispatch(SetTokenApp(AppCodeConfig.APP_CONGDAN, res.data.token))
            dispatch(SetTokenApp(AppCodeConfig.APP_ADMIN, res.data.tokenG))
            await dispatch(checkAppAdmin())
            await dispatch(GetDataUserCD(res.data.user))
            dispatch(CheckConnectChat())
            dispatch(DangKyOneSignal(true))
            //check nếu có menu thì mới gọi

        }
    }
}

export const DangKyOneSignal = (isCD = false, isOut = false, MaScreen = '') => {
    return async (dispatch, getState) => {
        let auth = getState().auth;
        let userDH = auth.userDH
        let tokenDH = auth.tokenDH
        let userCD = auth.userCD
        let userDVC = auth.userDVC
        let tokenCD = auth.tokenCD
        // Utils.nlog('token DH', auth);
        let DevicesInfo = Platform.OS == 'ios' ? 'ios' : 'android'
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        const IdPA = 0
        if (isCD) {
            if (isOut) {
                let resCD = await apis.ApiUser.RegisDeviceToken(true, DevicesInfo, DevicesToken, IdPA, 0, 0, '', '');
            } else {
                let resCD = await apis.ApiUser.RegisDeviceToken(true, DevicesInfo, DevicesToken, IdPA, userCD.IdHuyen || 0, userCD.Id || userCD.UserID, userCD.SDT || 0, '', userDVC.SoDinhDanh ? userDVC.SoDinhDanh : '');
            }
        } else {
            if (isOut) {
                const resDH = await apisAdmin.ApiUser.RegisDeviceToken(DevicesInfo, DevicesToken, 0, 0, 0, '');
            } else if (tokenDH.length > 0) {
                const resDH = await apisAdmin.ApiUser.RegisDeviceToken(DevicesInfo, DevicesToken, 0, userDH.IdHuyen || 0, userDH.Id, userDH.SDT || 0, '');
                // Utils.nlog('dk onesignal DH', resDH)
            }
        }

    }
}
// LOAD_MENU
export const loadMenuApp = (data) => ({
    type: ActionTypes.TypeMenu.LOAD_MENU,
    data: data
})

//Menu menuCon
export const SetMenuChild = (data, key) => ({
    type: ActionTypes.TypeActionAuth.SET_MENU_DICHBENH,
    data: data,
    key: key
})
//CHECK login list app speacil
export const CheckLoginListAppSpecial = (body = {}) => {
    const { AppCanBo = [] } = body
    return async (dispatch, getState) => {
        for (let i = 0; i < AppCanBo.length; i++) {
            const element = AppCanBo[i];
            switch (element.Ma) {
                case AppCodeConfig.APP_HKG:
                    SaveTokenHKG.saveToken('hkg', element.Khoa);
                    await GetSetMaScreen(false, appConfig.manHinhHKG, true)
                    break;
                case AppCodeConfig.APP_IOC:
                    OnSignIn({ PhoneNumber: body.SoDienThoai || "", PersonId: "" })
                    break;
                case AppCodeConfig.ILIS:

                    break;
                case AppCodeConfig.APP_CHAT: {
                    let res = await apis.ApiDVC.Tim_Tai_Khoan(body.SoDienThoai);
                    if (res.status == 1) {
                        // alert("200")
                    } else {
                        Utils.showToastMsg("Thông báo", res.error ? res.error.message : 'Có lỗi trong quá tình lấy thông tin chat.Vui lòng đăng nhập lại', icon_typeToast.danger);
                    }
                }
                default:
                    break;
            }

        }
    }
}
//CHECK login list app speacil
export const SetGlobalStoreApp = async (data = {}, isCongDan = true) => {
    // return async (dispatch, getState) => {
    if (isCongDan) {
        Utils.setGlobal(nGlobalKeys.loginToken, data.Token);
        Utils.setGlobal(nGlobalKeys.Id_user, data.Id);
        Utils.setGlobal(nGlobalKeys.NumberPhone, data.SDT);

        // setstore
        await Utils.nsetStore(nkey.token, data.Token);
        await Utils.nsetStore(nkey.Id_user, data.Id);
        await Utils.nsetStore(nkey.loginToken, data.Token);
        await Utils.nsetStore(nkey.NumberPhone, data.SDT);

    } else {

    }
    // }
}
//logout -----------app công dân
export const logoutAppCheckInterNet = (isCongDan = true, callback) => {
    return async (dispatch, getState) => {
        NetInfo.fetch().then(async (state) => {
            console.log("Is connected?", state.isConnected, state.isInternetReachable);
            if (state.isConnected) {
                if (isCongDan) {
                    //---logout công dân
                    let deviceToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
                    let res = await apis.ApiUser.LogoutGYPA(deviceToken, false);
                    Utils.nlog("gia tri đăng xuất CD", res, deviceToken)
                    dispatch(LogoutApp(AppCodeConfig.APP_CONGDAN))
                    dispatch(LogoutApp(AppCodeConfig.APP_DVC)) // logout luôn DVC
                    dispatch(loadMenuApp({ isLogoutDVC: true }))
                    dispatch(Set_Menu_Canbo([], ''))
                    //global
                    Utils.setGlobal(nGlobalKeys.loginToken, '');
                    Utils.setGlobal(nGlobalKeys.Id_user, '');
                    Utils.setGlobal(nGlobalKeys.Email, '');
                    Utils.setGlobal(nGlobalKeys.NumberPhone, '');
                    Utils.setGlobal(nGlobalKeys.TokenSSO, '');
                    Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
                    Utils.setGlobal(nGlobalKeys.UseCookieSSO, true);
                    ROOTGlobal.dataGlobal._tabbarChange(true);
                    ROOTGlobal.dataGlobal._onRefreshDaGui();
                    ROOTGlobal.dataGlobal._onPressAvatar();
                    //store
                    await Utils.nsetStore(nkey.UseCookieSSO, true)
                    await Utils.nsetStore(nkey.InfoUserSSO, '')
                    await Utils.nsetStore(nkey.loginToken, '');
                    Utils.nsetStore(nkey.token, '');
                    Utils.nsetStore(nkey.Id_user, '');
                    Utils.nsetStore(nkey.NumberPhone, '');
                    await Utils.nsetStore(nkey.TimeTuNgay, '');
                    //Dem lai so thong bao
                    dispatch(GetCountNotification())
                } else {
                    //---logout admin
                    dispatch(DangKyOneSignal(false, true));
                    let deviceToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
                    let resDH = await apisAdmin.ApiUser.LogOut(deviceToken);
                    dispatch(LogoutApp(AppCodeConfig.APP_ADMIN))
                    //global
                    Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN)
                    Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN)
                    //store
                    await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
                    await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
                    OnSignOut() // logout quy hoach
                    dispatch(loadMenuApp({ isLogouDH: true }))
                    //Dem lai so thong bao
                    dispatch(GetCountNotification())
                }
            } else {
                Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra kết nối internet", icon_typeToast.warning);
            }
        });


    }
}




