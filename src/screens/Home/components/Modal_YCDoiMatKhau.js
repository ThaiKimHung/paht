import React, { Component } from 'react'
import { BackHandler, Text, View, TextInput, StyleSheet, Platform } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import Utils from '../../../../app/Utils';
import { ButtonCom, HeaderCus } from '../../../../components';
import InputLogin from '../../../../components/ComponentApps/InputLogin';
import { colors } from '../../../../styles';
import FontSize from '../../../../styles/FontSize';
import { nstyles } from '../../../../styles/styles';
import apis from '../../../apis';
import { Images } from '../../../images';

export class Modal_YCDoiMatKhau extends Component {
    constructor(props) {
        super(props)

        this.state = {
            HoTen: '',
            SoDienThoai: '',
            NoiDung: '',
            ShowMKhau: true,
        }
    }
    async componentDidMount() {
        if (this.props.auth.userCD) {
            this.setState({ HoTen: this.props.auth.userCD.FullName, SoDienThoai: this.props.auth.userCD.PhoneNumber })
        }
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }
    _setShowPass = () => {
        Utils.nlog("vao set state")
        this.setState({ ShowMKhau: !this.state.ShowMKhau })
    }
    _sendGopYIOC = () => {
        let { HoTen, SoDienThoai, NoiDung, selectedType } = this.state
        let warning = ''
        if (!HoTen) {
            warning += 'Họ và tên bắt buộc nhập \n'
        }
        if (!SoDienThoai || SoDienThoai.length < 10) {
            warning += 'Số điện thoại chưa hợp lệ \n'
        }
        if (!NoiDung) {
            warning += 'Nội dung bắt buộc nhập'
        }
        if (warning.length > 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', warning, 'Xác nhận')
        } else {
            Utils.showMsgBoxYesNo(this, 'Xác nhận yêu cầu', 'Gửi yêu cầu đổi mật khẩu'
                , 'Gửi yêu cầu', 'Xem lại', () => this.GuiYeuCauDoiMK()
            )
        }
    }
    GuiYeuCauDoiMK = async () => {
        nthisIsLoading.show()
        let { HoTen, SoDienThoai, NoiDung, } = this.state
        let dataBoDy = new FormData();
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        Utils.nlog("giá trị DevicesToken", DevicesToken);
        dataBoDy.append("Temp", true);
        dataBoDy.append('HoTen', HoTen)
        dataBoDy.append('SDT', SoDienThoai)
        dataBoDy.append('NoiDung', NoiDung)
        dataBoDy.append('DevicesToken', DevicesToken)
        Utils.nlog('data body==============', dataBoDy)
        let res = await apis.ApiUpLoad.GuiGopYIOC(dataBoDy)
        nthisIsLoading.hide()
        Utils.nlog('res gui yeu cau DMK=========', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi yêu cầu đổi mật khẩu thành công!', 'Xác nhận', () => {
                Utils.goscreen(this, 'ManHinh_Home')
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi yêu cầu đổi mật khẩu thất bại!', 'Xác nhận')
        }
    }
    render() {
        const { HoTen, SoDienThoai, NoiDung, ShowMKhau } = this.state
        let { theme } = this.props
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, }]}>
                <View style={[nstyles.nbody, {}]}>
                    <HeaderCus
                        Sleft={{ width: 18, height: 18, tintColor: colors.white }}
                        iconLeft={Images.icBack}
                        title={`Yêu cầu đổi mật khẩu`}
                        styleTitle={{ color: colors.white }}
                        onPressLeft={() => { Utils.goback(this, null); }}
                    />
                    <View style={{ backgroundColor: colors.white, flex: 1, paddingVertical: 10, paddingHorizontal: 15, paddingBottom: isIphoneX() ? 20 : 10 }}>
                        <KeyboardAwareScrollView>
                            <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                                <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'Họ và tên '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                                <InputLogin
                                    Fcref={refs => this.refPhone = refs}
                                    icon={Images.icLogin}
                                    value={HoTen}
                                    showIcon={true}
                                    placeholder={"Họ và tên"}
                                    onChangeText={text => this.setState({ HoTen: text })}
                                    customStyle={stYCDoiMK.content}
                                    icShowPass={false}
                                    colorUnline={colors.brownGreyThree || 'transparent'}
                                    colorUnlineFoCus={theme.colorLinear.color[0] || 'transparent'}
                                    placeholderTextColor={colors.brownGreyTwo}
                                    styleInput={{ color: theme.colorLinear.color[0] }}
                                />
                            </View>
                            <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                                <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'Số điện thoại '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                                <InputLogin
                                    Fcref={refs => this.refPhone = refs}
                                    icon={Images.icCall}
                                    value={SoDienThoai}
                                    showIcon={true}
                                    placeholder={"Số điện thoại"}
                                    onChangeText={text => this.setState({ SoDienThoai: text.trim() })}
                                    customStyle={stYCDoiMK.content}
                                    icShowPass={false}
                                    colorUnline={colors.brownGreyThree || 'transparent'}
                                    colorUnlineFoCus={theme.colorLinear.color[0] || 'transparent'}
                                    placeholderTextColor={colors.brownGreyTwo}
                                    keyboardType='phone-pad'
                                    styleInput={{ color: theme.colorLinear.color[0] }}
                                />
                            </View>
                            <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                                <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'Mật khẩu '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                                <InputLogin
                                    Fcref={refs => this.refPass = refs}
                                    value={NoiDung}
                                    icon={Images.icPass}
                                    icShowPass={true}
                                    isShowPassOn={ShowMKhau}
                                    iconShowPass={ShowMKhau == true ? Images.icHidePass : Images.icShowPass}
                                    showIcon={true}
                                    secureTextEntry={ShowMKhau}
                                    placeholder={"Nhập mật khẩu"}
                                    setShowPass={this._setShowPass}
                                    onChangeText={text => this.setState({ NoiDung: text.trim() })}
                                    customStyle={stYCDoiMK.content}
                                    colorUnline={colors.brownGreyThree || 'transparent'}
                                    colorUnlineFoCus={theme.colorLinear.color[0] || 'transparent'}
                                    placeholderTextColor={colors.brownGreyTwo}
                                    styleInput={{ color: theme.colorLinear.color[0] }}
                                    colorPassOn={theme.colorLinear.color[0]}
                                />
                            </View>
                            <ButtonCom
                                text={'Gửi yêu cầu'}
                                onPress={this._sendGopYIOC}
                                style={{ borderRadius: 5, marginHorizontal: 10, marginTop: 10 }}
                                txtStyle={{ fontSize: Platform.OS == 'ios' ? FontSize.reText(15) : FontSize.reText(12) }}
                            />
                        </KeyboardAwareScrollView>
                    </View>

                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme,
    menu: state.menu,
    auth: state.auth
});
const stYCDoiMK = StyleSheet.create({
    content: {
        marginHorizontal: '10%',
        backgroundColor: 'transparent',
    }
})
export default Utils.connectRedux(Modal_YCDoiMatKhau, mapStateToProps, true);