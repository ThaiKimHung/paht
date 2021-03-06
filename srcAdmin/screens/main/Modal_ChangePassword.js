import React, { Component, Fragment } from 'react'
import { Text, View } from 'react-native'
import { colors } from '../../../styles'
import Utils from '../../../app/Utils'
import { Width, nstyles, khoangcach } from '../../../styles/styles'
import { ButtonCom, HeaderCom, HeaderCus } from '../../../components'
import HeaderModal from '../PhanAnhHienTruong/components/HeaderModal'
import { Images } from '../../images'
import { reText, sizes } from '../../../styles/size'
import InputLogin from '../../../components/ComponentApps/InputLogin'
import ButtonCus from '../../../components/ComponentApps/ButtonCus'
import ItemNoiDung from '../PhanAnhHienTruong/components/ItemNoiDung'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import apis from '../../apis'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nkey } from '../../../app/keys/keyStore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppCodeConfig from '../../../app/AppCodeConfig'
import { GetSetMaScreen } from '../../../srcRedux/actions/auth/Auth'
import { appConfig } from '../../../app/Config'

export class Modal_ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.HoTen = Utils.ngetParam(this, 'UserName', {})
        this.state = {
            oldPass: '',
            newPass: '',
            confirmPass: '',
            isOldPass: true,
            isNewPass: true,
            isConfirmPass: true,
            ShowOldMKhau: true,
            ShowNewMKhau: true,
            ShowConfirmMKhau: true,
            ShowError: '',
            SuccessPass: false
        }
    }

    goback = () => {
        Utils.goback(this)
    }

    onChangeOldPass = (text) => {
        this.setState({ oldPass: text, isOldPass: text ? true : false })
    }

    onChangeNewPass = (text) => {
        this.setState({ newPass: text, isNewPass: text ? true : false })
    }

    onChangeConfirmPass = (text) => {
        this.setState({ confirmPass: text, isConfirmPass: text ? true : false })
    }

    _setShowOldPass = () => {
        this.setState({ ShowOldMKhau: !this.state.ShowOldMKhau })
    }
    _setShowNewPass = () => {
        this.setState({ ShowNewMKhau: !this.state.ShowNewMKhau })
    }
    _setShowConfirmPass = () => {
        this.setState({ ShowConfirmMKhau: !this.state.ShowConfirmMKhau })
    }

    CapNhatMatKhau = async () => {
        var { oldPass, newPass, confirmPass } = this.state;
        var noti = ''
        var mess = 'M???t kh???u ph???i ??t nh???t 8 k?? t??? bao g???m ch??? s???, ch??? hoa, ch??? th?????ng v?? k?? t??? ?????c bi???t'
        if (!oldPass) {
            noti += 'Vui l??ng nh???p m???t kh???u c??\n'
        }
        if (!newPass) {
            noti += 'Vui l??ng nh???p m???t kh???u m???i\n'
        }
        if (!confirmPass) {
            noti += 'Vui l??ng nh???p x??c nh???n m???t kh???u'
        }
        if (noti) {
            this.setState({ ShowError: noti })
            // Utils.showMsgBoxOK(this, 'Th??ng b??o', noti)
        }
        else {
            //th???c hi???n postapi ?????i m???t kh???u ?????ng th???i ????ng xu???t
            const bodyChangePass = {
                "Id": Utils.getGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN),
                "OldPassword": oldPass,
                "NewPassword": newPass,
                "RePassword": confirmPass,
                "Logout": true
            }
            let res = await apis.ApiUser.ChangePassword(bodyChangePass);
            Utils.nlog('doi mat khau', res)
            if (res.status == 1) {
                await GetSetMaScreen(false, appConfig.manHinhADmin, false);
                if (Utils.getGlobal(nGlobalKeys.rememberPassword, '', AppCodeConfig.APP_ADMIN)) {
                    //Ch??? x??a token,iduser
                    //code m???i t??y tr?????ng h???p m?? m??? ??o???n code n??y ra: s??? logout to??n app k??? c??? khi ??ang ??? b??n admin
                    // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
                    //??o???n logout n??y c?? =================================
                    // this.props.LogoutApp(AppCodeConfig.APP_ADMIN) // ch??? logout b??n admin
                    // Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN);
                    // Utils.setGlobal(nGlobalKeys.rules, '', AppCodeConfig.APP_ADMIN);
                    // Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.rules, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
                    //??o???n logout n??y c?? =================================

                    this.props.logoutAppCheckInterNet(false);

                    // Utils.goscreen(this, 'sw_Login');
                    // Utils.goscreen(this, 'ManHinh_Home');
                    // this.setState({ SuccessPass: true })
                    // return 1; //log out thanh cong
                } else {
                    //code m???i t??y tr?????ng h???p m?? m??? ??o???n code n??y ra: s??? logout to??n app k??? c??? khi ??ang ??? b??n admin
                    // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
                    //??o???n logout n??y c?? =================================
                    // this.props.LogoutApp(AppCodeConfig.APP_ADMIN) // ch??? logout b??n admin
                    // Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN)
                    // Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN)
                    // Utils.setGlobal(nGlobalKeys.rules, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.rules, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.Username, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.Password, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.setGlobal(nGlobalKeys.Username, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.setGlobal(nGlobalKeys.Password, '', AppCodeConfig.APP_ADMIN);
                    //??o???n logout n??y c?? =================================

                    this.props.logoutAppCheckInterNet(false);
                    
                    // Utils.goscreen(this, 'sw_Login');
                    // Utils.goscreen(this, 'ManHinh_Home');
                    // this.setState({ SuccessPass: true })
                    // return 1; //log out thanh cong
                }

                Utils.showMsgBoxOK(this, 'Th??ng b??o', res.error.message, '????ng xu???t', () => Utils.goscreen(this, 'ManHinh_Home'))
            }
            else {
                this.setState({ ShowError: res.error.message })
                // Utils.showMsgBoxOK(this, 'Th??ng b??o', res.error.message, 'X??c nh???n')
            }
        }
    }
    render() {
        var { isOldPass, isNewPass, isConfirmPass, ShowOldMKhau, ShowNewMKhau, ShowConfirmMKhau, ShowError, SuccessPass, oldPass, newPass, confirmPass } = this.state
        let { theme } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    title={'?????i m???t kh???u'}
                    styleTitle={{ color: colors.white }}
                />
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={[{ backgroundColor: colors.white }]}
                >
                    <View style={{
                        paddingTop: 20, paddingHorizontal: 20, backgroundColor: colors.nocolor
                    }}>
                        {
                            SuccessPass == false ?
                                <Fragment>
                                    <Text style={{
                                        color: theme.colorLinear.color[0],
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        fontSize: sizes.sText18
                                    }}
                                    >?????i m???t kh???u ng?????i d??ng {'\n' + this.HoTen}</Text>
                                    <View>
                                        {isOldPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nh???p m???t kh???u c??</Text> : null}
                                        <InputLogin
                                            value={oldPass}
                                            secureTextEntry={true}
                                            placeholder={"Nh???p m???t kh???u c??"}
                                            onChangeText={text => this.onChangeOldPass(text)}
                                            placeholderTextColor={colors.colorTextGray}
                                            icon={Images.icPass}
                                            icShowPass={true}
                                            isShowPassOn={ShowOldMKhau}
                                            iconShowPass={ShowOldMKhau == true ? Images.icShowPass : Images.icHidePass}
                                            showIcon={true}
                                            secureTextEntry={ShowOldMKhau}
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
                                        {isNewPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nh???p m???t kh???u m???i</Text> : null}
                                        <InputLogin
                                            value={newPass}
                                            secureTextEntry={true}
                                            placeholder={"Nh???p m???t kh???u m???i"}
                                            onChangeText={text => this.onChangeNewPass(text)}
                                            placeholderTextColor={colors.colorTextGray}
                                            icon={Images.icPass}
                                            icShowPass={true}
                                            isShowPassOn={ShowNewMKhau}
                                            iconShowPass={ShowNewMKhau == true ? Images.icShowPass : Images.icHidePass}
                                            showIcon={true}
                                            secureTextEntry={ShowNewMKhau}
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
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        {isConfirmPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>X??c nh???n m???t kh???u</Text> : null}
                                        <InputLogin
                                            value={confirmPass}
                                            secureTextEntry={true}
                                            placeholder={"X??c nh???n m???t kh???u"}
                                            onChangeText={text => this.onChangeConfirmPass(text)}
                                            icon={Images.icPass}
                                            icShowPass={true}
                                            isShowPassOn={ShowConfirmMKhau}
                                            iconShowPass={ShowConfirmMKhau == true ? Images.icShowPass : Images.icHidePass}
                                            showIcon={true}
                                            secureTextEntry={ShowConfirmMKhau}
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
                                        {/* {Erorr} */}
                                        {ShowError.length > 0 ?
                                            <View>
                                                <Text style={{ fontSize: sizes.sText14, paddingTop: 5, color: theme.colorLinear.color[0], lineHeight: 25 }}><Text style={{ fontWeight: 'bold' }}>{'?????? C???nh b??o:'}</Text></Text>
                                                <Text style={{ fontSize: sizes.sText14, paddingTop: 5, color: theme.colorLinear.color[0], lineHeight: 25 }}><Text style={{ fontWeight: 'bold' }}>{ShowError}</Text></Text>
                                            </View>
                                            : null}
                                    </View>
                                </Fragment> :
                                <Fragment>
                                    <View>
                                        <Text style={{
                                            color: theme.colorLinear.color[0],
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            fontSize: sizes.sText18
                                        }}
                                        >Th??ng b??o</Text>
                                        <Text style={{ fontSize: sizes.sText14, paddingTop: 5, lineHeight: 25 }}><Text style={{ fontWeight: 'bold' }}>{'?????i m???t kh???u th??nh c??ng. Vui l??ng ????ng xu???t ????ng nh???p l???i !'}</Text></Text>
                                    </View>
                                </Fragment>
                        }

                    </View>
                    <View style={[nstyles.nrow, { justifyContent: 'space-around', paddingTop: 10 }]}>
                        {
                            <Fragment>
                                <ButtonCom
                                    text={'Quay l???i'}
                                    Linear={true}
                                    colorChange={[colors.brownGreyThree, colors.grayLight]}
                                    style={{ borderRadius: 5, width: Width(40) }}
                                    onPress={() => Utils.goback(this)}
                                />
                                <ButtonCom
                                    text={'?????i m???t kh???u'}
                                    style={{ borderRadius: 5, width: Width(40) }}
                                    onPress={this.CapNhatMatKhau}
                                />
                            </Fragment>
                        }
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(Modal_ChangePassword, mapStateToProps, true);
