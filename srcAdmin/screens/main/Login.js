import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    TouchableOpacity, ScrollView, ImageBackground, StatusBar, KeyboardAvoidingView,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';

import { nstyles, Width, Height, heightStatusBar } from '../../../styles/styles';
import Utils from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Images } from '../../images';
import { sizes, reText } from '../../../styles/size';
import InputCus from '../../../components/ComponentApps/InputCus';
import ButtonCom from '../../../components/Button/ButtonCom';
import { colors } from '../../../styles';
import InputLogin from '../../../components/ComponentApps/InputLogin';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import apis from './../../apis/index'
import ModalLoading from '../../../components/ComponentApps/ModalLoading';
import { nkey } from '../../../app/keys/keyStore';
import { appConfig, appConfigCus } from '../../../app/Config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { nkeyCache } from '../../../app/keys/nkeyCache';
import { GetSetMaScreen } from '../../../srcRedux/actions/auth/Auth';


// import Input from "../../components/ComponentApps/Input";

const stLogin = StyleSheet.create({
    contentInput: {
        paddingVertical: 10, backgroundColor: colors.white,
        marginHorizontal: 40, borderRadius: 30, paddingHorizontal: 10, marginTop: 20
    },
    textInput: {
        flex: 1, color: colors.black_80, fontSize: sizes.sText14,
        lineHeight: sizes.sText19, marginLeft: 10,
    }
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.testmode = 0;
        this.QuanSelected = '';
        this.isDomain = -1
        this.state = {
            isLoading: false,
            ShowMKhau: true,
            rememberMKhau: Utils.getGlobal(nkey.rememberPassword, false, AppCodeConfig.APP_ADMIN),
            ImageBG: Utils.getCacheURL(nkeyCache.imgBgrHomeDH),
            Username: Utils.getGlobal(nGlobalKeys.Username, '', AppCodeConfig.APP_ADMIN),
            MKhau: Utils.getGlobal(nGlobalKeys.Password, '', AppCodeConfig.APP_ADMIN),
            isDangKy: Utils.getGlobal(nGlobalKeys.isDangKy, false, AppCodeConfig.APP_ADMIN),
            Tentinh: Utils.getGlobal(nGlobalKeys.TenTinh, '', AppCodeConfig.APP_ADMIN)
        }
    }
    componentDidMount = async () => {
        this.props.SetStatus_Notify(-1)
        const quanhuyen = await Utils.getGlobal(nGlobalKeys.QuanSelected, '', AppCodeConfig.APP_ADMIN);
        let isStarted = await Utils.ngetStore(nkey.idDomain, -1, AppCodeConfig.APP_ADMIN);
        if (quanhuyen) {
            this.QuanSelected = quanhuyen;
            this.isDomain = isStarted
            Utils.nlog('quan huyen=========', quanhuyen)
        }
        let resconfig = await apis.ApiApp.getAppCongig(2);
        Utils.checkVersion(this, resconfig);
        this._GetBackGround();
        // StatusBar.setHidden(true);
    }
    _GetBackGround = async () => {
        const res = await apis.ApiUser.Get_AnhNen();
        // Utils.nlog("gia tri bg", res)
        if (res.status == 1 && res.data) {
            let urlBGRTemp = res.data.Link ? (appConfig.domain + res.data.Link) : '';
            urlBGRTemp = await Utils.setCacheURL(nkeyCache.imgBgrHomeDH, urlBGRTemp);
            this.setState({ ImageBG: urlBGRTemp })
        }
    }

    onLogin = async () => {
        ROOTGlobal[nGlobalKeys.isShowAlertDH] = true;
        const { rememberMKhau } = this.state;
        var warning = '', showWarning = false;
        if (this.state.Username == '') {
            warning += 'Tên người dùng là bắt buộc!\n';
            showWarning = true;
        }
        if (this.state.MKhau == '') {
            warning += 'Mật khẩu không hợp lệ!';
            if (showWarning != true) {
                showWarning = true;
            }
        }
        // Utils.nlog('warning', warning);
        if (showWarning == true) {
            Utils.showMsgBoxOK(this, 'Cảnh báo', warning, 'Xác nhận');
            return;
        }

        this.setState({ isLoading: true })
        const res = await apis.ApiUser.LoginGYPA(this.state.Username, this.state.MKhau)
        Utils.nlog("LoginGYPA_res: ", res)
        if (res.status == 1 && res.data) {
            const { data } = res
            await GetSetMaScreen(false, appConfig.manHinhADmin, true)
            // rules: 'rules',
            if (rememberMKhau == true) {
                Utils.nsetStore(nkey.Username, this.state.Username, AppCodeConfig.APP_ADMIN);
                Utils.nsetStore(nkey.Password, this.state.MKhau, AppCodeConfig.APP_ADMIN);
                Utils.setGlobal(nGlobalKeys.Username, this.state.Username, AppCodeConfig.APP_ADMIN);
                Utils.setGlobal(nGlobalKeys.Password, this.state.MKhau, AppCodeConfig.APP_ADMIN);
            }
            Utils.setGlobal(nGlobalKeys.loginToken, data.Token, AppCodeConfig.APP_ADMIN)
            Utils.setGlobal(nGlobalKeys.rules, data.Rules, AppCodeConfig.APP_ADMIN)
            Utils.setGlobal(nGlobalKeys.Id_user, data.Id, AppCodeConfig.APP_ADMIN)
            Utils.setGlobal(nGlobalKeys.rememberPassword, rememberMKhau, AppCodeConfig.APP_ADMIN)

            await Utils.nsetStore(nkey.loginToken, data.Token, AppCodeConfig.APP_ADMIN)
            await Utils.nsetStore(nkey.rules, data.Rules, AppCodeConfig.APP_ADMIN)
            await Utils.nsetStore(nkey.Id_user, data.Id, AppCodeConfig.APP_ADMIN)
            await Utils.nsetStore(nkey.rememberPassword, rememberMKhau, AppCodeConfig.APP_ADMIN)
            await Utils.nsetStore(nkey.loginToken, data.Token, AppCodeConfig.APP_ADMIN)


            this.props.AcSave_InfoAuth(data);
            this.props.SetUserApp(AppCodeConfig.APP_ADMIN, data);
            this.props.SetTokenApp(AppCodeConfig.APP_ADMIN, data.Token);

            this.props.loadMenuApp({
                listRuleDH: data.Rules
            })
            setTimeout(() => {
                this.props.SetStatus_Notify(1)
            }, 200);

            this.props.DangKyOneSignal(false);

            //insert nhật kí
            const resnk = await apis.ApiUser.Insert_NhatKy(data.Id);
            Utils.nlog("inset nhật kí res", resnk)


            this.setState({ isLoading: false })
            this._getGetList_NguonPhanAnh();
            this._GetList_MucDoAll();
            this._getListLinhVuc();
            this._getListChuyenMuc();
            this.props.SetShowModalNoti(true);
            const isDashboard = data.Rules.find(item => item == 194)
            if (isDashboard) {
                Utils.goscreen(this, 'Dashboard_ThongKe');
            } else {
                Utils.goscreen(this, 'sw_Main');
            }
        } else {
            await GetSetMaScreen(false, appConfig.manHinhADmin, false)
            this.setState({ isLoading: false })
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Đăng nhập thất bại", "Xác nhận");

        }
    }
    //GET DATA MENU SETTING
    _getGetList_NguonPhanAnh = async () => {
        const res = await apis.NguonPhanAnh.GetList_NguonPhanAnh();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_NguonPhanAnh(res.data);
        }
        // Utils.nlog('GetList_NguonPhanAnh', res)
    }
    _GetList_MucDoAll = async () => {
        const res = await apis.Auto.GetList_MucDoAll();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_MucDoAll(res.data);
        }
        // Utils.nlog('GetList_MucDoAll', res)
    }
    _getListLinhVuc = async () => {
        const res = await apis.LinhVuc.GetList_LinhVuc();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_LinhVuc(res.data);
        }
        // Utils.nlog('_getListLinhVuc', res)
    }
    _getListChuyenMuc = async () => {
        const res = await apis.ChuyenMuc.GetList_ChuyenMuc();
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_ChuyenMuc(res.data);

        }
        // Utils.nlog('_getListChuyenMuc', res)

    }
    _setShowPass = () => {
        this.setState({ ShowMKhau: !this.state.ShowMKhau })
    }
    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }
    _QuenMk = () => {
        Utils.goscreen(this, 'st_QuenMk')
    }

    onChangeConfig = async () => {
        this.testmode += 1;
        if (this.testmode >= 7 && this.state.MKhau == 'vts@123') {
            let tempConfig = appConfigCus['live'].mode;
            if (appConfig.mode == tempConfig)
                tempConfig = appConfigCus['test'].mode;
            await Utils.nsetStore('appConfigCus', tempConfig, AppCodeConfig.APP_ADMIN);
            await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
            Utils.goscreen(this, 'sw_Root');
        }
    }
    _onChangeArea = async () => {
        // sw_Root
        let IDTemp = this.QuanSelected.IDQuan;
        await Utils.nsetStore(nkey.idDomain, '', AppCodeConfig.APP_ADMIN);
        Utils.goscreen(this, 'sw_Root', { IdDomainSelect: IDTemp })
    }
    render() {
        const { nrow, nmiddle } = nstyles
        const { ShowMKhau, isLoading, rememberMKhau, Username, MKhau, ImageBG, isDangKy } = this.state
        // Utils.nlog("gia tri sotre ", Username, Password, rememberPassword)
        var link = ImageBG;
        // Utils.nlog("gia tri link", link)
        return (
            // <KeyboardAwareScrollView
            //         ref={scroller => { this.scroller = scroller; }}
            //         style={{ paddingBottom: 60, flex: 1 }}
            //         scrollToOverflowEnabled={true}
            //         showsVerticalScrollIndicator={false}></KeyboardAwareScrollView>
            <KeyboardAvoidingView style={[nstyles.ncontainer,
            { justifyContent: 'center' }]}>
                <View style={{ paddingTop: heightStatusBar(), justifyContent: 'center' }}>
                    <Text style={{
                        textAlign: 'center', fontSize: sizes.sText22,
                        color: '#FF3D43', fontWeight: 'bold', marginHorizontal: '8%', paddingVertical: 20
                    }}>
                        {appConfig.TieuDeApp.toUpperCase() + `\n${this.state.Tentinh.toUpperCase()}`}
                    </Text>
                </View>

                <ImageBackground
                    // defaultSource={Images.icBgr}
                    source={ImageBG ? { uri: link } : Images.icBgr}
                    style={[nstyles.ncontainer, { flex: 1 }]}>
                    {
                        this.isDomain != -1 ? <View style={{ position: 'absolute', right: 0, top: 0 }}>
                            <TouchableOpacity onPress={this._onChangeArea} opacity={0.5} style={{ padding: 10 }}>
                                <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(16) }}>
                                    {/* {`${this.TenQuan ? this.TenQuan.TenQuan : 'Khu vực'}▼`} */}
                                    {`${this.QuanSelected ? 'Quận ' + this.QuanSelected.TenQuan : 'Chọn khu vực'} ▼`}
                                </Text>
                            </TouchableOpacity>
                        </View> : null
                    }

                    <KeyboardAwareScrollView style={{ flex: 1, paddingHorizontal: 13, backgroundColor: colors.black_60, paddingTop: 45 }}>
                        <Text style={{ textAlign: 'center', fontSize: sizes.sText22, color: colors.white, fontWeight: 'bold', marginVertical: 10 }}>{`đăng nhập`.toUpperCase()}</Text>
                        <InputLogin
                            value={Username}
                            stContainerC={stLogin.contentInput}
                            stContainerR={{ width: '100%', }}
                            icon={Images.icLoginUser}
                            showIcon={true}
                            placeholder={"ID đăng nhập"}
                            onChangeText={text => this.setState({ Username: text })}
                            customStyle={stLogin.textInput}
                            icShowPass={false}
                            colorUnline={colors.textGrayLogin}
                            placeholderTextColor={colors.colorTextGray}
                            styleContainer={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                            colorUnline={colors.brownGreyThree}
                            colorUnlineFoCus={colors.colorBlue}
                            placeholderTextColor={colors.brownGreyTwo}
                            styleInput={{ color: colors.black }}
                            colorPassOn={colors.colorBlue}
                        />
                        <InputLogin
                            value={MKhau}
                            customStyle={stLogin.textInput}
                            icon={Images.icPass}
                            icShowPass={true}
                            isShowPassOn={ShowMKhau}
                            iconShowPass={ShowMKhau == true ? Images.icShowPass : Images.icHidePass}
                            showIcon={true}
                            secureTextEntry={ShowMKhau}
                            placeholder={"Nhập mật khẩu"}
                            setShowPass={this._setShowPass}
                            onChangeText={text => this.setState({ MKhau: text })}
                            iconStylePass={{ marginRight: 10, }}
                            placeholderTextColor={colors.colorTextGray}
                            styleContainer={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                            colorUnline={colors.brownGreyThree}
                            colorUnlineFoCus={colors.colorBlue}
                            placeholderTextColor={colors.brownGreyTwo}
                            styleInput={{ color: colors.black }}
                            colorPassOn={colors.colorBlue}
                            colorPassOff={'gray'}

                        />
                        <View style={[nrow, { justifyContent: 'space-between', paddingHorizontal: 50, marginTop: 20 }]}>
                            <View style={[nrow, nmiddle]}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => this.setState({ rememberMKhau: !this.state.rememberMKhau })}>
                                    <Image source={rememberMKhau == true ? Images.icCheck : Images.icUnCheck}
                                        style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.white }]}
                                        resizeMode='contain' />
                                    <Text style={{ color: colors.white, paddingHorizontal: 5, fontSize: sizes.sText14 }}>
                                        {`Ghi nhớ`}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={this._QuenMk}>
                                <Text style={{ textDecorationLine: 'underline', color: colors.white, fontSize: sizes.sText14 }}>{`Quên mật khẩu?`}</Text>
                            </TouchableOpacity>

                        </View>


                        {/* st_DangKyTaiKhoan */}
                        <View style={nmiddle}>
                            <ButtonCom
                                onPress={this.onLogin}
                                text={'Đăng nhập'}
                                style={{ marginVertical: 15, width: Width(40), borderRadius: 5 }}
                            />
                            <ButtonCom
                                onPress={async () => {
                                    Utils.goback(this, null);

                                }}
                                Linear={true}
                                colorChange={[colors.brownGreyThree, colors.grayLight]}
                                text={'Quay lại'}
                                style={{ width: Width(40), borderRadius: 5 }}
                            />
                            {/* <ButtonCus
                                onPressB={this.onLogin}
                                textTitle={`Đăng nhập`}
                                stContainerR={{ backgroundColor: '#FF3D43' }}
                            >
                            </ButtonCus>
                            <ButtonCus
                                onPressB={async () => {
                                    Utils.goback(this, null);

                                }}
                                textTitle={`Quay lại`}
                                stContainerR={{ backgroundColor: colors.grayLight }}
                            >
                            </ButtonCus> */}
                        </View>
                        {
                            isDangKy ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
                                    <TouchableOpacity onPress={() => Utils.goscreen(this, "st_DangKyTaiKhoan")}>
                                        <Text style={{ textDecorationLine: 'underline', color: colors.white, fontSize: sizes.sText14 }}>{`Tạo tài khoản?`}</Text>
                                    </TouchableOpacity>
                                </View> : null
                        }

                        {/* Modal_DangKyNhanh */}
                    </KeyboardAwareScrollView>
                </ImageBackground>
                <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', padding: 4 }}
                // onPress={this.onChangeConfig} //-- DO CHUNG SOURCE CD nên bỏ khúc này, tách riêng thì mở ra
                >
                    <Text style={{
                        color: 'white', marginBottom: 30, marginRight: 30, fontSize: 8,
                        textAlign: 'right'
                    }}>{appConfig.version + '-' + appConfig.mode}</Text>
                </TouchableOpacity>
                {
                    isLoading == true ? <ModalLoading /> : <View />
                }

            </KeyboardAvoidingView >
        );
    }
}
const mapStateToProps = state => ({
    isLogin: state.setlogin.isLogin,
    theme: state.theme,
    auth: state.auth
});
export default Utils.connectRedux(Login, mapStateToProps, true);
