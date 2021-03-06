import React, { Component, createRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl, Keyboard } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AppgetGlobal, ROOTGlobal } from '../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { nkey } from '../../../app/keys/keyStore';
import Api from '../../apis';
import InputT from '../../../components/ComponentApps/InputT';
import { Images } from '../../images';
import apis from '../../apis';
import ModalLoading from './ModalLoading';
import { ButtonCom, HeaderCus } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputLogin from '../../../components/ComponentApps/InputLogin';
import { reText } from '../../../styles/size';
import { Width } from '../../../styles/styles';
import AppCodeConfig from '../../../app/AppCodeConfig';
const stLogin = StyleSheet.create({
    contentInput: {
        marginHorizontal: '10%',
        backgroundColor: 'transparent'
    },
    textThongbao: {
        color: colors.black_80,
        fontSize: sizes.sizes.sText18,
        fontWeight: 'bold',

    },
    viewcontainer: {
        paddingVertical: 20,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#f3fdf5",
    },
    textTitleItem: {
        paddingHorizontal: 35,
        color: colors.black_80,
        fontSize: sizes.sizes.sText16,
        fontWeight: 'bold',
        paddingVertical: 10

    },
    styButton: {
        color: colors.black_20,
        fontSize: sizes.sizes.sText16,
        fontWeight: '600',

    },
    text: {
        fontSize: sizes.sizes.sText16,
        fontWeight: '600',
    },
    textValueItem: {
        paddingHorizontal: 30,
        color: colors.black_80,
        fontSize: sizes.sizes.sText16,
        fontWeight: '300',

    }
});
class DoiMatKhau extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, "data", {})
        this._CapNhatAvatar = Utils.ngetParam(this, "_CapNhatAvatar", () => { })
        this.state = {
            OnEdit: false,
            refreshing: false,
            dataPass: {},
            OldPass: '',
            Pass: '',
            RePass: '',
            isLoading: false,

            showOldPass: true,
            showPass: true,
            showRePass: true,
        };
    }
    componentDidMount() {

    }

    goback = () => {
        Utils.goback(this)
    }

    _DoiMatKhau = async () => {
        const { data, Pass, RePass, OldPass } = this.state
        if (OldPass == '') {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "Vui l??ng nh???p m???t kh???u c??", 'X??c nh???n');
            return;
        }
        if (Pass == '') {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "Vui l??ng nh???p m???t kh???u m???i", 'X??c nh???n');
            return;
        }
        if (RePass == '') {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "Vui l??ng nh???p x??c nh???n l???i m???t kh???u m???i", 'X??c nh???n');
            return;
        }
        if (Pass != RePass) {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "X??c nh???n m???t kh???u b??? sai", 'X??c nh???n');
            return;
        }
        var item = { Password: Pass, RePassword: RePass, OldPassword: OldPass };
        this.setState({ isLoading: true })
        const res = await apis.ApiUser.CDChangePass(item)
        Utils.nlog("res change Password", res)
        if (res.status == 1) {
            this.props.logoutAppCheckInterNet(true);
            this.props.logoutAppCheckInterNet(false);
            // ??o???n logout c?? =======
            // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
            // this.props.LogoutApp(AppCodeConfig.APP_ADMIN)
            // this.props.LogoutApp(AppCodeConfig.APP_DVC)
            // this.props.Set_Menu_CanBo([], '')
            // this.props.Set_Menu_CongDong([])

            // Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN)
            // Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN)
            // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
            // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);

            // this.setState({ isLoading: false })
            // Utils.setGlobal(nGlobalKeys.loginToken, '');
            // Utils.setGlobal(nGlobalKeys.Id_user, '');
            // Utils.setGlobal(nGlobalKeys.Email, '');
            // Utils.setGlobal(nGlobalKeys.NumberPhone, '');

            // await Utils.nsetStore(nkey.loginToken, '');
            // Utils.nsetStore(nkey.token, '');
            // Utils.nsetStore(nkey.Id_user, '');
            // // Utils.nsetStore(nkey.Email, '');
            // Utils.nsetStore(nkey.NumberPhone, '');
            // await Utils.nsetStore(nkey.TimeTuNgay, '');
            // this._CapNhatAvatar(false)
            // ??o???n logout c?? =======
            Utils.showMsgBoxOK(this, "Th??ng b??o", "Thay ?????i m???t kh???u th??nh c??ng", "X??c nh???n", () => {
                ROOTGlobal.dataGlobal._tabbarChange(true);
                ROOTGlobal.dataGlobal._onRefreshDaGui();
                Utils.goscreen(this, "tab_Person");
            })
        } else {
            this.setState({ isLoading: false })
            Utils.showMsgBoxOK(this, "Th??ng b??o", res.error ? res.error.message : "L???i thay ?????i m???t kh???u", 'X??c nh???n')
        }
    }
    _checkMK = (val) => {

        if (val.length == 0) {
            return true
        }
        return Utils.validateMK(val)
    }
    _checkRePass = (val) => {
        const { Pass } = this.state
        return Pass == val ? true : false
    }
    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }

    onChangeOldPass = (text) => {
        this.setState({ OldPass: text })
    }

    onChangeNewPass = (text) => {
        this.setState({ Pass: text.trim() })
    }

    onChangeConfirmPass = (text) => {
        this.setState({ RePass: text })
    }

    _setShowOldPass = () => {
        this.setState({ showOldPass: !this.state.showOldPass })
    }
    _setShowNewPass = () => {
        this.setState({ showPass: !this.state.showPass })
    }
    _setShowConfirmPass = () => {
        this.setState({ showRePass: !this.state.showRePass })
    }
    render() {
        const { isLoading, showPass, showOldPass, showRePass, OldPass, Pass, RePass } = this.state
        let { theme } = this.props
        return (
            <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
                <HeaderCus
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    title={'?????i m???t kh???u'}
                    styleTitle={{ color: colors.white }}
                />
                <KeyboardAwareScrollView
                    showsHorizontalScrollIndicator={false}
                    style={{ padding: 13 }}
                >
                    <View>
                        {OldPass.length > 0 ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nh???p m???t kh???u c??</Text> : null}
                        <InputLogin
                            value={OldPass}
                            secureTextEntry={true}
                            placeholder={"Nh???p m???t kh???u c??"}
                            onChangeText={text => {
                                this.setState({ OldPass: text.trim() })
                            }}
                            placeholderTextColor={colors.colorTextGray}
                            icon={Images.icPass}
                            icShowPass={true}
                            isShowPassOn={showOldPass}
                            iconShowPass={showOldPass == true ? Images.icShowPass : Images.icHidePass}
                            showIcon={true}
                            secureTextEntry={showOldPass}
                            setShowPass={this._setShowOldPass}
                            colorUnline={colors.brownGreyThree}
                            placeholderTextColor={colors.colorTextGray}
                            colorUnlineFoCus={theme.colorLinear.color[0]}
                            styleInput={{ color: theme.colorLinear.color[0], fontSize: reText(14), fontWeight: 'normal' }}
                            colorPassOn={theme.colorLinear.color[0]}
                            styleFrame={{ padding: 3 }}

                        />
                        <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }} >Vui l??ng nh???p <Text style={{ fontWeight: 'bold' }}>m???t kh???u c??</Text></Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {Pass.length > 0 ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nh???p m???t kh???u m???i</Text> : null}
                        <InputLogin
                            value={Pass}
                            secureTextEntry={true}
                            placeholder={"Nh???p m???t kh???u m???i"}
                            onChangeText={text => this.onChangeNewPass(text)}
                            placeholderTextColor={colors.colorTextGray}
                            icon={Images.icPass}
                            icShowPass={true}
                            isShowPassOn={showPass}
                            iconShowPass={showPass == true ? Images.icShowPass : Images.icHidePass}
                            showIcon={true}
                            secureTextEntry={showPass}
                            icTextInput={false}
                            setShowPass={this._setShowNewPass}
                            colorUnline={colors.brownGreyThree}
                            placeholderTextColor={colors.colorTextGray}
                            colorUnlineFoCus={theme.colorLinear.color[0]}
                            styleInput={{ color: theme.colorLinear.color[0], fontSize: reText(14), fontWeight: 'normal' }}
                            colorPassOn={theme.colorLinear.color[0]}
                            styleFrame={{ padding: 3 }}

                        />
                        <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui l??ng nh???p <Text style={{ fontWeight: 'bold' }}>m???t kh???u m???i</Text></Text>
                        {
                            this._checkMK(Pass) ? null : <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: this._checkMK(Pass) ? 'gray' : 'red' }}>{Utils.getGlobal(nGlobalKeys.txtErrPass)}</Text>
                        }

                    </View>
                    <View style={{ marginTop: 10 }}>
                        {RePass.length > 0 ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>X??c nh???n m???t kh???u</Text> : null}
                        <InputLogin
                            value={RePass}
                            secureTextEntry={true}
                            placeholder={"X??c nh???n m???t kh???u"}
                            onChangeText={text => this.onChangeConfirmPass(text)}
                            icon={Images.icPass}
                            icShowPass={true}
                            isShowPassOn={showRePass}
                            iconShowPass={showRePass == true ? Images.icShowPass : Images.icHidePass}
                            showIcon={true}
                            secureTextEntry={showRePass}
                            icTextInput={false}
                            setShowPass={this._setShowConfirmPass}
                            colorUnline={colors.brownGreyThree}
                            placeholderTextColor={colors.colorTextGray}
                            colorUnlineFoCus={theme.colorLinear.color[0]}
                            styleInput={{ color: theme.colorLinear.color[0], fontSize: reText(14), fontWeight: 'normal' }}
                            colorPassOn={theme.colorLinear.color[0]}
                            styleFrame={{ padding: 3 }}

                        />
                        <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui l??ng nh???p <Text style={{ fontWeight: 'bold' }}>l???i m???t kh???u m???i</Text></Text>
                        {
                            this._checkRePass(RePass) ? null : <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: this._checkRePass(RePass) ? 'gray' : 'red' }}>{'M???t kh???u ph???i tr??ng m???t kh???u m???i'}</Text>
                        }
                    </View>
                    <View style={[nstyles.nstyles.nrow, { justifyContent: 'space-around', paddingTop: 10 }]}>
                        <ButtonCom
                            text={'Quay l???i'}
                            Linear={true}
                            colorChange={[colors.brownGreyThree, colors.grayLight]}
                            style={{ borderRadius: 5, flex: 1, marginRight: 5 }}
                            onPress={() => Utils.goback(this)}
                        />
                        <ButtonCom
                            text={'?????i m???t kh???u'}
                            style={{ borderRadius: 5, flex: 1 }}
                            onPress={this._DoiMatKhau}
                        />
                    </View>
                </KeyboardAwareScrollView>
                {
                    isLoading == true ? <ModalLoading enLoading={this._enLoading} /> : <View />
                }
            </View>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(DoiMatKhau, mapStateToProps, true);

