import { nGlobalKeys } from "./keys/globalKey";
import Utils from "./Utils";
import analytics from '@react-native-firebase/analytics';
import { store } from "../srcRedux/store";
import { nkey } from "./keys/keyStore";
import AppCodeConfig from "./AppCodeConfig";
import { TypeUserChat } from "../srcRedux/reducers/Auth";
import KeyAnalytics from "./KeyAnalytics";
import { GetSetMaScreen, SetTypeUserChat } from "../srcRedux/actions/auth/Auth";
import { appConfig } from "./Config";
import { ROOTGlobal } from "./data/dataGlobal";

import { Alert, Linking, Platform } from "react-native";
import { check, request, PERMISSIONS } from 'react-native-permissions';
import Voice from '@react-native-community/voice';
import { versionIOS } from "../styles/styles";
function getScreenTitle(keyScreens, defaultVal = '') {
    //-Đã check cả 2 trường hợp cho cả V3 và V5
    let MenuApp = Utils.getGlobal(nGlobalKeys.objMenu, {}); // object Menu đã đổi. Nếu dùng menu cũ thì phải kt lại
    for (const property in MenuApp) {
        itemObjTemp = MenuApp[property]; //array
        for (let i = 0; i < itemObjTemp.length; i++) {
            const item = itemObjTemp[i];
            if (keyScreens == item.goscreen || item.params?.screen == keyScreens)
                return item.name;
        }
    }
    return defaultVal;
}

async function onSetLoginSuccess_Chung(typeLogin = 0, data = {}, nthis = {}, nthisIsLoading = {}) {
    //Liên kết của VTU
    let keyToken = 'TokenCurrent' //TokenCurrent: đây là token của DVC còn: TokenCB là của VTU
    try {
        //--Xử lý riêng NẾU CÓ--
        let ggTypeLogin = "---";
        switch (typeLogin) {
            case 0: //Login Phonenumber PAHT
                ggTypeLogin = KeyAnalytics.login_method_cd;

                //--Set App CHAT
                Utils.setGlobal(nGlobalKeys.loginToken, data[`${keyToken}`], AppCodeConfig.APP_CHAT)
                Utils.setGlobal(nGlobalKeys.Id_user, data.IdLienKet, AppCodeConfig.APP_CHAT)
                await Utils.nsetStore(nkey.loginToken, data[`${keyToken}`], AppCodeConfig.APP_CHAT)
                store.dispatch(SetTypeUserChat(TypeUserChat.USER_DH));

                nthis.setState({ MKhau: '' });
                break;
            case 1: //Login Phonenumber FB
                ggTypeLogin = KeyAnalytics.login_method_fbcd;

                break;
            case 2: //Login ViettelID
                ggTypeLogin = KeyAnalytics.login_method_viettelid;
                Utils.nsetStore(nkey.accessTokenViettelID, nthis.accessTokenTemp);
                break;
            case 3: //Login QR CCCD
                ggTypeLogin = KeyAnalytics.login_method_viettelid;

                break;
        }
        //--Xử lý data Login CHUNG--
        await analytics().logLogin({
            method: ggTypeLogin
        });
        await GetSetMaScreen(false, appConfig.manhinhCongDan, true);
        if (data[`${keyToken}`] && data.IdLienKet) {
            await GetSetMaScreen(false, appConfig.manHinhADmin, true);
            Utils.setGlobal(nGlobalKeys.loginToken, data[`${keyToken}`] ? data[`${keyToken}`] : '', AppCodeConfig.APP_ADMIN)
            Utils.setGlobal(nGlobalKeys.Id_user, data.IdLienKet, AppCodeConfig.APP_ADMIN)
            await Utils.nsetStore(nkey.loginToken, data[`${keyToken}`] ? data[`${keyToken}`] : '', AppCodeConfig.APP_ADMIN);
            await Utils.nsetStore(nkey.Id_user, data.IdLienKet, AppCodeConfig.APP_ADMIN);

            await nthis.props.SetTokenApp(AppCodeConfig.APP_ADMIN, data[`${keyToken}`]);
            nthis.props.SetRuleAppCanBo(data.AppCanBo)
            nthis.props.Set_Menu_CanBo(data.AppCanBo, data[`${keyToken}`]); // Check list rule app cán bộ để render menu
            nthis.props.loadMenuApp({
                listObjectMenuDVC: data.AppCanBo
            })
        }
        //công dân
        Utils.setGlobal(nGlobalKeys.loginToken, data.Token);
        Utils.setGlobal(nGlobalKeys.Id_user, data.Id);
        Utils.setGlobal(nGlobalKeys.NumberPhone, data.SDT);
        // setstore
        await Utils.nsetStore(nkey.token, data.Token);
        await Utils.nsetStore(nkey.Id_user, data.Id);
        await Utils.nsetStore(nkey.loginToken, data.Token);
        await Utils.nsetStore(nkey.NumberPhone, data.SDT);
        await nthis.props.SetTokenApp(AppCodeConfig.APP_CONGDAN, data.Token);
        await nthis.props.SetUserApp(AppCodeConfig.APP_CONGDAN, data);
        await nthis.props.GetDataUserDH();
        //check moij app dcv
        nthis.props.checkAppAdmin();
        nthis.props.Set_Menu_CongDong([]) // Chưa có check quyền cộng đồng
        nthis.props.GetThongBaoCongDong()
        //Load thông báo sàn việc làm ====================================
        nthis.props.LoadListMailBox() // thông báo người lao động
        nthis.props.LoadListMailBoxEnterprise() // thông báo doanh nghiệp
        //================================================================
        nthis.props.DangKyOneSignal(true)
        //load check điều kiện show app G. - Khi đã Login, mà ko có quyền G sẽ ẩn luôn menu App G
        // nthis.props.loadMenuApp({})

        ROOTGlobal.dataGlobal._tabbarChange(true);
        ROOTGlobal.dataGlobal._onRefreshDaGui();
        ROOTGlobal.dataGlobal._onPressAvatar();

        //Dem lai so thong bao
        nthis.props.GetCountNotification()
        await nthis._CapNhatAvatar();
        try {
            nthisIsLoading.hide();
        } catch (error) {
        }
        if (!nthis.isSendPA)
            Utils.goscreen(nthis, 'ManHinh_Home');
        else {
            Utils.goscreen(nthis, 'sc_CaNhan');
        }
    } catch (error) {
        try {
            nthisIsLoading.hide();
        } catch (error) {
        }
        //Lỗi ngoài ý muốn...
        Utils.nlog("errorLogin:", error);
        Alert.alert("Thông báo", "Vui lòng thử đăng nhập bằng phương thức khác!")
    }
}

async function StartVoice(nthis = {}, Stop = false, keyState = 'noiDungGui') { //mặc định là gửi phản ánh state noiDungGui
    // Muốn dùng startVoice thì yêu cầu dùng biến state là noiDungGui hoặc NoiDung để lấy được text
    if (!Stop) { // trường StartVoice
        try {
            if (nthis.state.isLoading)
                return;
            nthis.oldContent = nthis.state[keyState]
            nthis.newContent = '';
            let checkPerMic = false;
            let isVoiceOK = await Voice.isAvailable();
            if (Platform.OS == 'ios') {
                checkPerMic = await check(PERMISSIONS.IOS.MICROPHONE);
                if (!(checkPerMic == 'granted' && isVoiceOK == 1 || nthis.checkMicFirst)) {
                    if (checkPerMic == 'denied' && !nthis.checkMicFirst) {
                        let tempMic = await request(PERMISSIONS.IOS.MICROPHONE);
                        //--FIx TH iphone 5s
                        if (tempMic == 'denied' && versionIOS) {
                            try {
                                await Voice.start('vi');
                                setTimeout(() => {
                                    nthis.checkMicFirst = true;
                                    Voice.stop();
                                }, 1500);
                            } catch (error) {

                            }
                        }
                        //--
                    }
                    else {
                        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn cần cấp quyền nhận dạng giọng nói và microphone để sử dụng chức năng này.', 'Đến cài đặt', 'Quay lại', () => { Linking.openURL('app-settings:') });
                    }
                    return;
                }
            } else { //Android
                const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
                if (result === 'denied') {
                    await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
                    return;
                }
                if (result === 'blocked') {
                    Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn cần cấp quyền  microphone để sử dụng chức năng này.', 'Đến cài đặt', 'Quay lại', () => { Linking.openSettings() });
                    return;
                }
            }
            //--Code OK...
            // nthis.setState({ isLoading: true })
            await Voice.start('vi')
        } catch (error) {
            return;
        }
    }
    else { // StopVoice
        try {
            await Voice.stop();
            // nthis.setState({ isLoading: false })
        } catch (error) {
            return;

        }
    }
}

//-------END---------
export default {
    getScreenTitle, onSetLoginSuccess_Chung, StartVoice
};


