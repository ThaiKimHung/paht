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
        var mess = 'Mật khẩu phải ít nhất 8 ký tự bao gồm chữ số, chữ hoa, chữ thường và ký tự đặc biệt'
        if (!oldPass) {
            noti += 'Vui lòng nhập mật khẩu cũ\n'
        }
        if (!newPass) {
            noti += 'Vui lòng nhập mật khẩu mới\n'
        }
        if (!confirmPass) {
            noti += 'Vui lòng nhập xác nhận mật khẩu'
        }
        if (noti) {
            this.setState({ ShowError: noti })
            // Utils.showMsgBoxOK(this, 'Thông báo', noti)
        }
        else {
            //thực hiện postapi đổi mật khẩu đồng thời đăng xuất
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
                    //Chỉ xóa token,iduser
                    //code mới tùy trường hợp mà mở đoạn code này ra: sẽ logout toàn app kể cả khi đang ở bên admin
                    // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
                    //Đoạn logout này cũ =================================
                    // this.props.LogoutApp(AppCodeConfig.APP_ADMIN) // chỉ logout bên admin
                    // Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN);
                    // Utils.setGlobal(nGlobalKeys.rules, '', AppCodeConfig.APP_ADMIN);
                    // Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.rules, '', AppCodeConfig.APP_ADMIN);
                    // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
                    //Đoạn logout này cũ =================================

                    this.props.logoutAppCheckInterNet(false);

                    // Utils.goscreen(this, 'sw_Login');
                    // Utils.goscreen(this, 'ManHinh_Home');
                    // this.setState({ SuccessPass: true })
                    // return 1; //log out thanh cong
                } else {
                    //code mới tùy trường hợp mà mở đoạn code này ra: sẽ logout toàn app kể cả khi đang ở bên admin
                    // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
                    //Đoạn logout này cũ =================================
                    // this.props.LogoutApp(AppCodeConfig.APP_ADMIN) // chỉ logout bên admin
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
                    //Đoạn logout này cũ =================================

                    this.props.logoutAppCheckInterNet(false);
                    
                    // Utils.goscreen(this, 'sw_Login');
                    // Utils.goscreen(this, 'ManHinh_Home');
                    // this.setState({ SuccessPass: true })
                    // return 1; //log out thanh cong
                }

                Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đăng xuất', () => Utils.goscreen(this, 'ManHinh_Home'))
            }
            else {
                this.setState({ ShowError: res.error.message })
                // Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Xác nhận')
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
                    title={'Đổi mật khẩu'}
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
                                    >Đổi mật khẩu người dùng {'\n' + this.HoTen}</Text>
                                    <View>
                                        {isOldPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nhập mật khẩu cũ</Text> : null}
                                        <InputLogin
                                            value={oldPass}
                                            secureTextEntry={true}
                                            placeholder={"Nhập mật khẩu cũ"}
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
                                        <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }} >Vui lòng nhập <Text style={{ fontWeight: 'bold' }}>mật khẩu cũ</Text></Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        {isNewPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nhập mật khẩu mới</Text> : null}
                                        <InputLogin
                                            value={newPass}
                                            secureTextEntry={true}
                                            placeholder={"Nhập mật khẩu mới"}
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
                                        <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui lòng nhập <Text style={{ fontWeight: 'bold' }}>mật khẩu mới</Text></Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        {isConfirmPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Xác nhận mật khẩu</Text> : null}
                                        <InputLogin
                                            value={confirmPass}
                                            secureTextEntry={true}
                                            placeholder={"Xác nhận mật khẩu"}
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
                                        <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui lòng nhập <Text style={{ fontWeight: 'bold' }}>lại mật khẩu mới</Text></Text>
                                        {/* {Erorr} */}
                                        {ShowError.length > 0 ?
                                            <View>
                                                <Text style={{ fontSize: sizes.sText14, paddingTop: 5, color: theme.colorLinear.color[0], lineHeight: 25 }}><Text style={{ fontWeight: 'bold' }}>{'⚠️ Cảnh báo:'}</Text></Text>
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
                                        >Thông báo</Text>
                                        <Text style={{ fontSize: sizes.sText14, paddingTop: 5, lineHeight: 25 }}><Text style={{ fontWeight: 'bold' }}>{'Đổi mật khẩu thành công. Vui lòng đăng xuất đăng nhập lại !'}</Text></Text>
                                    </View>
                                </Fragment>
                        }

                    </View>
                    <View style={[nstyles.nrow, { justifyContent: 'space-around', paddingTop: 10 }]}>
                        {
                            <Fragment>
                                <ButtonCom
                                    text={'Quay lại'}
                                    Linear={true}
                                    colorChange={[colors.brownGreyThree, colors.grayLight]}
                                    style={{ borderRadius: 5, width: Width(40) }}
                                    onPress={() => Utils.goback(this)}
                                />
                                <ButtonCom
                                    text={'Đổi mật khẩu'}
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
