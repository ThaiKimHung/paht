import React, { Component, Fragment } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    TouchableOpacity, ScrollView, ImageBackground, TouchableWithoutFeedback, Keyboard, Dimensions, BackHandler, Linking, Alert,
    NativeModules
} from 'react-native';
import { nstyles, Width, Height, paddingTopMul, nwidth, nheight } from '../../../styles/styles';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Images } from '../../images';
import { sizes, reText, isPad } from '../../../styles/size';
import InputCus from '../../../components/ComponentApps/InputCus';
import ButtonCom from '../../../components/Button/ButtonCom';
import { colors } from '../../../styles';
import InputLogin from '../../../components/ComponentApps/InputLogin';
import Api from '../../apis';
import { nkey } from '../../../app/keys/keyStore';
import ModalLoading from './ModalLoading';
import apis from '../../apis';
import { appConfig, appConfigCus } from '../../../app/Config';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppCodeConfig from '../../../app/AppCodeConfig';
import LottieView from 'lottie-react-native';
import { HeaderCus, IsLoading } from '../../../components';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { store } from '../../../srcRedux/store';
import { SetTypeUserChat, GetSetMaScreen, SetTokenListApp, CheckLoginListAppSpecial, SetGlobalStoreApp, SetListUserApp } from '../../../srcRedux/actions/auth/Auth';
import { TypeUserChat } from '../../../srcRedux/reducers/Auth';
import { LoginManager, AccessToken, LoginButton, AppEventsLogger } from 'react-native-fbsdk';
import authFB from '@react-native-firebase/auth';
import { GetDataPageFacebook, getInformationFB } from '../../apis/apiFaceBook'
import { LogiFB } from '../../apis/apiUser';


import analytics from '@react-native-firebase/analytics';
import KeyAnalytics from '../../../app/KeyAnalytics';
import UtilsApp from '../../../app/UtilsApp';

const { ViettelsdkModule } = NativeModules;

const stLogin = StyleSheet.create({
    contentInput: {
        marginHorizontal: '10%',
        backgroundColor: 'transparent',
    },
    textThongbao: {
        color: colors.black,
        fontSize: sizes.sText18,
        textAlign: 'center',
        // paddingBottom: 30,
        // paddingVertical: 30
    }
});


class Login extends Component {
    constructor(props) {
        super(props);
        this.lang = Utils.getGlobal(nGlobalKeys.lang, {});
        this.isOTP = Utils.getGlobal(nGlobalKeys.isOTP, false)
        this.isLoginSDT = Utils.ngetParam(this, "sdt", false)
        this._CapNhatAvatar = Utils.ngetParam(this, "_CapNhatAvatar", () => { })
        this.isSendPA = Utils.ngetParam(this, 'isSendPA', false);
        this.isSendTuVan = Utils.ngetParam(this, 'isSendTuVan', false);
        this.isLoginQR = Utils.getGlobal(nGlobalKeys.isLoginQR, false)
        this.isShowFB = Utils.getGlobal(nGlobalKeys.ShowFB);
        this.conffigViettelID = Utils.getGlobal(nGlobalKeys.conffigViettelID, {});//Utils.getGlobal(nGlobalKeys.ShowFB);
        // this.Username = '';
        this.state = {
            isLoading: false,
            ShowMKhau: true,
            ID: Utils.getGlobal(nGlobalKeys.Id_user, ''),
            Username2: Utils.getGlobal(nGlobalKeys.Username, ''),
            Sdt: Utils.getGlobal(nGlobalKeys.NumberPhone, ''),
            MKhau: '',
            Username: '',
            QuanSelected: ''
        }
    }


    async componentDidMount() {
        // this.refPhone.focus()
        const quanhuyen = Utils.getGlobal(nGlobalKeys.QuanSelected, null);
        const isStarted = await Utils.ngetStore(nkey.idDomain, -1);
        if (quanhuyen && isStarted != -1) {
            this.setState({ QuanSelected: quanhuyen })
        }
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
        Linking.addEventListener("url", this.handleOpenURL);
    }

    backAction = () => {
        if (!this.isSendPA)
            Utils.goscreen(this, 'tab_Person');
        else {
            if (this.isSendTuVan) {
                Utils.goscreen(this, 'tab_TuVanF0CaNhan');
            } else {
                Utils.goscreen(this, 'sc_CaNhan');
            }
        }
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
            Linking.removeEventListener("url", this.handleOpenURL);
        } catch (error) {

        }
    }

    handleOpenURL = async (event) => {
        Utils.nlog("DEEPLINK - CALL: ", event);
        //--L???y dc deeplink login ViettelID
        let urlResponse = event.url;
        if (urlResponse.includes("?accessToken=")) {
            try {
                let accessTokenTemp = urlResponse.split("?accessToken=")[1];
                let res = await apis.ApiViettelID.loginViettelID(accessTokenTemp);
                Utils.nlog("loginViettelID:", res, accessTokenTemp);
                this.accessTokenTemp = accessTokenTemp;
                if (res?.status == 1) {
                    var { data = {} } = res;
                    //--Khi login Th??nh C??ng th?? t???t c??? ?????u ph???i x??? l?? trong H??m n??y. Kh??ng dc vi???t ngo??i.
                    await UtilsApp.onSetLoginSuccess_Chung(2, data, this, nthisIsLoading);
                }
                else {
                    nthisIsLoading.hide();
                    await GetSetMaScreen(false, appConfig.manhinhCongDan, false)
                    Utils.showMsgBoxOK(this, '????ng nh???p th???t b???i', res?.error?.message ? res?.error?.message : 'Vui l??ng th??? ????ng nh???p b???ng ph????ng th???c kh??c!', 'X??c nh???n')
                }

            } catch (error) {
                nthisIsLoading.hide();
                alert("????ng nh???p th???t b???i. Vui l??ng th??? c??ch kh??c.")
            }
        }
    }

    callback = async (otp) => {
        Utils.setToggleLoading(true)
        const res = await Api.ApiUser.Login_Smart({
            dienthoai: this.state.Sdt,
            otp: otp
        });
        Utils.setToggleLoading(false);
        Utils.nlog("[res--------OTP_Smart]", res);
        if (res.status == 1) {
            await analytics().logLogin({
                method: KeyAnalytics.login_method_phonenumber
            })
            const data = res.data.loginData;
            await SetGlobalStoreApp(data, true)
            //c??ng d??n
            await store.dispatch(SetTokenListApp({
                [AppCodeConfig.APP_CHAT]: data.Token,
                [AppCodeConfig.APP_CONGDAN]: data.Token,
            }));
            await store.dispatch(SetListUserApp({
                [AppCodeConfig.APP_CHAT]: { Id: data.userDVCInfo?.Id || data.userDVCInfo?.UserID || data.userDVCInfo?.UserId, UserID: data.userDVCInfo?.Id || data.userDVC?.UserID || data.userDVCInfo?.UserId, ...data.userDVCInfo },
                [AppCodeConfig.APP_CONGDAN]: data
            }));
            await this.props.loadMenuApp({
                listObjectMenuDVC: res.data.smart.AppCanBo
            })
            await store.dispatch(CheckLoginListAppSpecial(res.data.smart));

            store.dispatch(SetTypeUserChat(TypeUserChat.USER_DVC));
            //check moij app dcv
            this.props.Set_Menu_CongDong([]) // Ch??a c?? check quy???n c???ng ?????ng
            this.props.GetThongBaoCongDong()
            this.props.DangKyOneSignal(true)

            //Load th??ng b??o s??n vi???c l??m ====================================
            this.props.LoadListMailBox() // th??ng b??o ng?????i lao ?????ng
            this.props.LoadListMailBoxEnterprise() // th??ng b??o doanh nghi???p
            //================================================================

            ROOTGlobal.dataGlobal._tabbarChange(true);
            ROOTGlobal.dataGlobal._onRefreshDaGui();
            ROOTGlobal.dataGlobal._onPressAvatar();
            //Dem lai so thong bao
            this.props.GetCountNotification()
            this.setState({ isLoading: false, MKhau: '', });
            nthisIsLoading.hide()
            await this._CapNhatAvatar();
            nthisIsLoading.hide()

            Utils.goscreen(this, 'ManHinh_Home');
        } else {
            Utils.showToastMsg("Th??ng b??o", res.error ? res.error.message : '????ng nh???p th???t b???i', icon_typeToast.warning);
        }

    }
    onLoginSmart = async () => {
        let warning = '', showWarning = false;
        if (!this.state.Sdt.trim()) {
            warning += 'S??? ??i???n tho???i l?? b???t bu???c!\n';
            showWarning = true;
        } else {
            const check = Utils.validatePhone(this.state.Sdt.trim());
            if (!check) {
                warning += 'S??? ??i???n tho???i kh??ng h???p l???!\n';
                showWarning = true;
            } else showWarning = false;
        }
        // OTP_Smart
        Utils.setToggleLoading(true)
        const res = await Api.ApiUser.OTP_Smart({
            dienthoai: this.state.Sdt
        });
        Utils.setToggleLoading(false);
        Utils.nlog("res--------loginsmart", res)
        if (res.status == 1) {
            Utils.goscreen(this, "ModalComfirm", { callback: this.callback })
        } else {
            Utils.showToastMsg("Th??ng b??o", res.error ? res.error.message : '????ng nh???p th???t b???i', icon_typeToast.warning);
        }
    }
    onLogin = async () => {
        if (this.isLoginSDT) {
            this.onLoginSmart();
        } else {


            let warning = '', showWarning = false;
            // Utils.nlog("gia tri ", this.state.Username.length)

            if (!this.state.Sdt.trim()) {
                warning += 'S??? ??i???n tho???i l?? b???t bu???c!\n';
                showWarning = true;
            } else {
                const check = Utils.validatePhone(this.state.Sdt.trim());
                if (!check) {
                    warning += 'S??? ??i???n tho???i kh??ng h???p l???!\n';
                    showWarning = true;
                } else showWarning = false;
            }
            //xuwr ly neu la sdt thi k can check mk
            if (!this.isLoginSDT) {
                if (this.state.MKhau.length <= 0) {
                    warning += 'M???t kh???u kh??ng h???p l???!';
                    showWarning = true;
                }
            }
            Utils.nlog('warning', warning);
            if (showWarning == true) {
                Utils.showMsgBoxOK(this, 'C???nh b??o', warning, 'X??c nh???n');
                return;
            }
            // Utils.nlog("gia tri cua sdt = mk", this.state.Sdt.trim(), this.state.MKhau)
            this.setState({ isLoading: true })
            nthisIsLoading.show()

            const res = await Api.ApiUser.LoginGYPA(this.state.Sdt, this.state.MKhau);
            Utils.nlog('UserLogin', res);
            if (res.status == 1 && res.data) {
                var { data = {} } = res;
                //--Khi login Th??nh C??ng th?? t???t c??? ?????u ph???i x??? l?? trong H??m n??y. Kh??ng dc vi???t ngo??i.
                await UtilsApp.onSetLoginSuccess_Chung(0, data, this, nthisIsLoading);

            } else {
                await GetSetMaScreen(false, appConfig.manhinhCongDan, false)
                nthisIsLoading.hide()
                this.setState({ isLoading: false })
                var { error = {} } = res;
                Utils.showMsgBoxOK(this, 'Kh??ng th??? ????ng nh???p', error ? error.message : 'L???i ????ng nh???p', 'X??c nh???n');
            }
        }
    }

    _setShowPass = () => {
        Utils.nlog("vao set state")
        this.setState({ ShowMKhau: !this.state.ShowMKhau })
    }
    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }

    onChangeConfig = async () => {
        if (this.state.MKhau != 'vts@123') {
            return
        }
        let tempConfig = appConfigCus['live'].mode;
        if (appConfig.mode == tempConfig)
            tempConfig = appConfigCus['test'].mode;
        await Utils.nsetStore('appConfigCus', tempConfig);
        //--Set config: Ch???nh trong Login, RootSceen
        Utils.goscreen(this, 'sw_Root');
        setTimeout(() => {
            alert('Vui l??ng t???t APP m??? l???i ????? v??o chuy???n ch??? ?????!');
        }, 1000);
    }

    _checkPhone = (val) => {
        const check = Utils.validatePhone(val)
        this.checkSDT = !check;
        return check;
    }

    _goscreenHome = async () => {
        await this._CapNhatAvatar();
        if (ROOTGlobal.dataGlobal._onPressAvatar) {
            ROOTGlobal.dataGlobal._onPressAvatar()
        }
        Utils.goscreen(this, 'ManHinh_Home')
    }

    _onChangeArea = async () => {
        // sw_Root
        let IDTemp = this.state.QuanSelected.IDQuan;
        await Utils.nsetStore(nkey.idDomain, '');
        Utils.goscreen(this, 'sw_Root', { IdDomainSelect: IDTemp })
    }

    _loginFB = async () => {
        LoginManager.setLoginBehavior(Platform.OS == 'ios' ? 'browser' : 'native_with_fallback')
        nthisIsLoading.show()
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            nthisIsLoading.hide()
            return;
        }

        // Once signed in, get the users AccesToken
        const data1 = await AccessToken.getCurrentAccessToken();
        await Utils.nsetStore(nkey.accessToken, data1.accessToken);
        // Create a Firebase credential with the AccessToken
        // const facebookCredential = await authFB.FacebookAuthProvider.credential(data1.accessToken);
        // console.log('=========> facebookCredential: ', facebookCredential)
        // let temp = await authFB().signInWithCredential(facebookCredential);
        // console.log('=====>>>>> d??? li???u facebook l???y v???: ', temp)

        let val = `first_name, last_name, middle_name, name_format, picture, short_name, link, name, email`
        const GetInfoFB = await getInformationFB(data1.userID, val, data1.accessToken)
        console.log("=-=-=GetInfoFB", GetInfoFB)

        const res = await LogiFB(GetInfoFB.name, GetInfoFB.email ? GetInfoFB.email : GetInfoFB.id, `https://graph.facebook.com/${GetInfoFB.id}/picture`, GetInfoFB.id)
        console.log('=====>>>>> d??? li???u ????ng nh???p facebook res: ', res)
        if (res.status == 1 && res.data) {
            var { data = {} } = res;
            //--Khi login Th??nh C??ng th?? t???t c??? ?????u ph???i x??? l?? trong H??m n??y. Kh??ng dc vi???t ngo??i.
            await UtilsApp.onSetLoginSuccess_Chung(1, data, this, nthisIsLoading);

        } else {
            await GetSetMaScreen(false, appConfig.manhinhCongDan, false)
            nthisIsLoading.hide()
            var { error = {} } = res;
            Utils.showMsgBoxOK(this, 'Kh??ng th??? ????ng nh???p', error ? error.message : 'L???i ????ng nh???p', 'X??c nh???n');
        }
        // return authFB().signInWithCredential(facebookCredential);
    }

    _loginViettelID = async () => {
        let { cient_code, secret_code } = this.conffigViettelID;

        let linkStore = "https://apps.apple.com/vn/app/viettelid/id1563664354?l=vi";
        nthisIsLoading.show();

        if (Platform.OS === 'android') {
            //--Code t??ch h???p SDK
            let requiredLevel = 3; // quy???n h???n t??i kho???n
            ViettelsdkModule.setSdk(cient_code, secret_code, requiredLevel).then(
                res => {
                    this.handleOpenURL({ url: "xxx?accessToken=" + res });
                }

            )
        }
        else { // IOS
            // // NativeModules.AppDelegate.pushVC('ViettelsdkController');
            // NativeModules.ChangeViewBridge.changeToNativeView();
            // let tempval = await ViettelsdkModule.setSdk();
            // ViettelsdkModule.openViettelIdSdk((val) => console.log("XXXX-ViettelsdkModule:", val));
            // alert(tempval)
            // nthisIsLoading.hide();   

            //--Code KO T??ch h???p SDK
            let deeplink = `comviettelvdid://?client_id=${cient_code}&secret_code=${secret_code}&schema=${appConfig.deeplinkApp}`;
            Linking.openURL(deeplink).catch((err) => {
                nthisIsLoading.hide();
                Utils.showMsgBoxYesNo(this, "Th??ng b??o", "Kh??ng th??? ????ng nh???p b???ng ViettelID. Vui l??ng c??i ?????t ???ng d???ng tr?????c!", "C??i ?????t", "Quay l???i", () => {
                    Linking.openURL(linkStore);
                })
                Utils.nlog("_loginViettelID: ", err, deeplink);
            });
            //---Khi L???y th??nh C??ng Token th?? s??? x??? l?? Ti???p => handleOpenURL
        }
    }

    render() {
        var { ShowMKhau, isLoading, ID } = this.state
        let { theme } = this.props
        let isLoginOption = this.isShowFB == 1 || (this.isLoginQR && this.isOTP) || this.conffigViettelID?.isViettelID;
        return (

            <ImageBackground
                // source={theme.background ? { uri: `data:image/png;base64,${theme.background}` } : Images.imgSmartCity}
                style={[{ flex: 1, }]}>
                <HeaderCus
                    title={'????ng nh???p h??? th???ng'}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={this._goscreenHome}
                />
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView
                        // behavior='padding'
                        viewIsInsideTabBar={true}
                        scrollToOverflowEnabled={true}
                        showsVerticalScrollIndicator={false}
                        // contentContainerStyle={{ flex: 1 }}
                        style={{
                            flex: 1, backgroundColor: colors.BackgroundHome,
                            paddingHorizontal: 10,
                        }}
                    >
                        {/* {??o???n code x??? l?? ch???n qu???n huy???n khi app c?? nhi???u khu v???c, ????? ????y khi c???n m??? ra design l???i} */}
                        {
                            this.state.QuanSelected ?
                                <View>
                                    <TouchableOpacity onPress={this._onChangeArea} opacity={0.5} style={{ padding: 10 }}>
                                        <Text style={{ color: theme.colorLinear.color[0], fontWeight: 'bold', fontSize: reText(16) }}>
                                            {`${this.state.QuanSelected ? this.state.QuanSelected.TenQuan : 'Ch???n khu v???c'} ???`}
                                        </Text>
                                    </TouchableOpacity>
                                </View> : null
                        }
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ borderRadius: 6, paddingBottom: 10 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        {/* <Image
                                            // defaultSource={Images.iconApp}
                                            source={{ uri: Utils.getGlobal(nGlobalKeys.LogoAppHome, '') }}
                                            style={{ width: Height(20), height: Height(20) }} resizeMode='contain' /> */}
                                        <Text style={{ fontWeight: 'bold', textAlign: 'center', padding: 10, fontSize: reText(18), lineHeight: 30 }}>{Utils.getGlobal(nGlobalKeys.TenApp, 'PAHT').toUpperCase()}</Text>
                                        <LottieView
                                            source={require('../../images/login.json')}
                                            style={{ width: nwidth(), height: nheight() / 6, justifyContent: "center", alignSelf: 'center' }}
                                            loop={true}
                                            autoPlay={true}
                                        />
                                    </View>
                                    <Text style={stLogin.textThongbao}>{"Vui l??ng s??? d???ng t??i kho???n ???? ????ng k?? ????? ????ng nh???p"}</Text>
                                    <Fragment>
                                        <InputLogin
                                            Fcref={refs => this.refPhone = refs}
                                            icon={Images.icLogin}
                                            value={this.state.Sdt}
                                            showIcon={true}
                                            placeholder={"S??? ??i???n tho???i"}
                                            onChangeText={text => this.setState({ Sdt: text.trim() })}
                                            customStyle={stLogin.contentInput}
                                            icShowPass={false}
                                            colorUnline={colors.brownGreyThree || 'transparent'}
                                            colorUnlineFoCus={theme.colorLinear.color[0] || 'transparent'}
                                            placeholderTextColor={colors.brownGreyTwo}
                                            keyboardType='phone-pad'
                                            styleInput={{ color: theme.colorLinear.color[0] }}
                                            onCheckError={(text) => {
                                                if (text.trim().length <= 0) {
                                                    return 'S??? ??i???n tho???i l?? b???t bu???c!'
                                                }
                                                else {
                                                    const check = Utils.validatePhone(text.trim());
                                                    Utils.nlog('gia tri check', check)
                                                    if (!check)
                                                        return 'S??? ??i???n tho???i kh??ng h???p l???!'
                                                }
                                            }}
                                        />
                                        {
                                            this.isLoginSDT ? null : <InputLogin
                                                Fcref={refs => this.refPass = refs}
                                                value={this.state.MKhau}
                                                icon={Images.icPass}
                                                icShowPass={true}
                                                isShowPassOn={ShowMKhau}
                                                iconShowPass={ShowMKhau == true ? Images.icHidePass : Images.icShowPass}
                                                showIcon={true}
                                                secureTextEntry={ShowMKhau}
                                                placeholder={"Nh???p m???t kh???u"}
                                                setShowPass={this._setShowPass}
                                                onChangeText={text => this.setState({ MKhau: text.trim() })}
                                                customStyle={stLogin.contentInput}
                                                colorUnline={colors.brownGreyThree || 'transparent'}
                                                colorUnlineFoCus={theme.colorLinear.color[0] || 'transparent'}
                                                placeholderTextColor={colors.brownGreyTwo}
                                                styleInput={{ color: theme.colorLinear.color[0] }}
                                                colorPassOn={theme.colorLinear.color[0]}
                                                onCheckError={(text) => {
                                                    if (text.length <= 0) {
                                                        return 'M???t kh???u kh??ng h???p l???!'
                                                    }
                                                }
                                                }
                                            />
                                        }

                                    </Fragment>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: Height(1.2) }}>
                                        <ButtonCom
                                            onPress={async () => {
                                                if (this.refPass) {
                                                    this.refPass.blur()
                                                }
                                                // alert("100")
                                                this.onLogin()
                                            }}
                                            sizeIcon={30}
                                            txtStyle={{ color: colors.white }}
                                            style={
                                                {
                                                    ...stLogin.contentInput,
                                                    marginTop: Height(2), borderRadius: 5,
                                                    alignSelf: 'center', paddingHorizontal: 20,
                                                    backgroundColor: colors.colorBlue
                                                }}
                                            text={'????NG NH???P'}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: this.isOTP == true ? 'space-between' : 'center', marginTop: 5, marginBottom: Height(2.5) }}>
                                        {
                                            isLoginOption ?
                                                <TouchableOpacity onPress={() => { Utils.goscreen(this, 'dangkytk') }}>
                                                    <Text style={[{ color: colors.blueFaceBook, fontSize: reText(16) }]}>????ng k?? t??i kho???n!</Text>
                                                </TouchableOpacity>
                                                :
                                                <View />
                                        }
                                        {
                                            this.isOTP == true ?
                                                <View style={{}}>
                                                    <TouchableOpacity onPress={() => Utils.goscreen(this, 'quenmatkhau')}>
                                                        <Text style={[{ color: colors.black, fontSize: reText(14) }]}>{'Qu??n m???t kh???u'}</Text>
                                                    </TouchableOpacity>
                                                </View> : null
                                        }
                                    </View>
                                    {/* {this.isLoginQR && this.isOTP ?
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <ButtonCom
                                                onPress={async () => {
                                                    // this.refPass.blur()
                                                    Utils.goscreen(this, 'ModalScanQR')
                                                }}
                                                sizeIcon={30}
                                                txtStyle={{ color: colors.white }}
                                                style={
                                                    {
                                                        ...stLogin.contentInput,
                                                        borderRadius: 5,
                                                        alignSelf: 'center', paddingHorizontal: 20,
                                                        // backgroundColor: colors.colorBlue
                                                        flexDirection: 'row'
                                                    }}
                                                iconLeft={Images.icQR}
                                                text={'SCAN QR CODE'}
                                            />
                                        </View> : null} */}

                                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
                                        <TouchableOpacity onPress={() => Utils.goscreen(this, "Modal_DangKyNhanh")}>
                                            <Text style={{ textDecorationLine: 'underline', color: colors.redpink, fontSize: sizes.sText14 }}>{`T???o t??i kho???n?`}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
                                        <TouchableOpacity onPress={() => Utils.goscreen(this, "ModalComfirm")}>
                                            <Text style={{ textDecorationLine: 'underline', color: colors.redpink, fontSize: sizes.sText14 }}>{`T???o t??i kho???n?`}</Text>
                                        </TouchableOpacity>
                                    </View> */}
                                    {/* ModalComfirm */}
                                    {isLoginOption ?
                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <TouchableOpacity style={{
                                                flexDirection: 'row', marginBottom: Height(2.5),
                                                alignItems: 'center', justifyContent: 'center'
                                            }}
                                                activeOpacity={1}
                                                onPress={this.onChangeConfig}>
                                                <View style={{ height: 1, width: Width(8), backgroundColor: colors.black_50 }} />
                                                <Text style={{ color: colors.black_50, marginHorizontal: 10, fontSize: 14 }}>{'Ho???c ????ng nh???p nhanh v???i'}</Text>
                                                <View style={{ height: 1, width: Width(8), backgroundColor: colors.black_50 }} />
                                            </TouchableOpacity>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: isPad ? '40%' : '85%' }}>
                                                {this.isShowFB == 1 ?
                                                    <TouchableOpacity onPress={this._loginFB}
                                                        style={{ flexDirection: "row", backgroundColor: colors.blueFaceBook, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, flex: 1 }}>
                                                        <Image source={Images.icFB} style={nstyles.nIcon30} />
                                                        <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: reText(15), marginLeft: 3, color: colors.white, fontWeight: 'bold', flex: 1 }}>FACEBOOK</Text>
                                                    </TouchableOpacity> : null}
                                                {this.isLoginQR && this.isOTP ?
                                                    <TouchableOpacity onPress={() => Utils.goscreen(this, 'ModalScanQR')}
                                                        style={{ flexDirection: "row", backgroundColor: '#47ACB2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, flex: 1, marginTop: 5 }}>
                                                        <Image source={Images.icQrCode} style={nstyles.nIcon30} />
                                                        <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: reText(15), marginLeft: 3, color: colors.white, fontWeight: 'bold', flex: 1 }}>QR CCCD</Text>
                                                    </TouchableOpacity> : null}
                                                {this.conffigViettelID?.isViettelID ?
                                                    <TouchableOpacity onPress={this._loginViettelID}
                                                        style={{ flexDirection: "row", backgroundColor: '#6C0E36', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, flex: 1, marginTop: 5, paddingLeft: 8 }}>
                                                        <Image source={Images.icViettelID} style={[nstyles.nIcon34]} />
                                                        <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: reText(15), marginLeft: 3, color: colors.white, fontWeight: 'bold', flex: 1 }}>Viettel ID</Text>
                                                    </TouchableOpacity> : null}
                                            </View>
                                        </View> : null}
                                </View>
                                {
                                    isLoginOption ? null :
                                        <View style={{
                                            width: '100%', alignItems: 'center', flexDirection: 'column', marginTop: -20
                                        }}>
                                            <View style={{
                                                flexDirection: 'row', marginTop: '5%', marginBottom: Height(2.5),
                                                alignItems: 'center'
                                            }}>
                                                <View style={{ height: 1, width: '26%', backgroundColor: colors.black, opacity: 0.9 }} />
                                                <Text style={{ color: colors.black, marginHorizontal: 10 }}>{'B???n ch??a c?? t??i kho???n?'}</Text>
                                                <View style={{ height: 1, width: '26%', backgroundColor: colors.black, opacity: 0.9 }} />
                                            </View>
                                            <TouchableOpacity onPress={() => { Utils.goscreen(this, 'dangkytk') }}>
                                                <Text style={[stLogin.textThongbao, { color: colors.blueFaceBook }]}>{'????ng k?? t??i kho???n!'}</Text>
                                                <View style={{ height: 1, backgroundColor: colors.blueFaceBook, marginTop: 2 }} />
                                            </TouchableOpacity>
                                        </View>
                                }
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAwareScrollView>
                    <View style={{ backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5, paddingHorizontal: 25 }} >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ alignSelf: 'flex-end', }}
                            onPress={this.onChangeConfig}>
                            <Text style={{ fontSize: sizes.sText12, color: colors.black }}>
                                {'Phi??n b???n: ' + appConfig.version + ' - ' + appConfig.mode}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* {
                    isLoading == true ? <ModalLoading enLoading={this._enLoading} /> : <View />
                } */}
                <IsLoading />
            </ImageBackground>
        );
    }
}
const mapStateToProps = state => ({
    isLogin: state.setlogin.isLogin,
    theme: state.theme,
    menu: state.menu
});
export default Utils.connectRedux(Login, mapStateToProps, true);

