import React, { Component } from 'react'
import { Text, TextInput, View, Image, TouchableOpacity, Platform, Keyboard } from 'react-native'
import { Height, Width } from '../../../styles/styles'
import LottieView from 'lottie-react-native';
import apis from '../../apis'
// import { nGlobalKeys } from '../../app/keys/globalKey'
// import { nkey } from '../../app/keys/keyStore'
// import { ROOTGlobal } from '../../app/data/dataGlobal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nkey } from '../../../app/keys/keyStore';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { store } from '../../../srcRedux/store';
import { GetSetMaScreen } from '../../../srcRedux/actions/auth/Auth';
import { appConfig } from '../../../app/Config';
import UtilsApp from '../../../app/UtilsApp';
import RNOtpVerify from 'react-native-otp-verify';

class ModalOTP extends Component {
    constructor(props) {
        super(props)
        this.infoUser = Utils.ngetParam(this, 'infoUser')
        this.DevicesToken = Utils.ngetParam(this, 'DevicesToken')
        this.data = Utils.ngetParam(this, 'data', [])
        this._CapNhatAvatar = Utils.ngetParam(this, "_CapNhatAvatar", () => { })
        this.state = {
            timeOTP: 60,// biến thay đổi
            timeMax: 60,//biến so sánh
            isPress: false,// ngăn chặn nhấn gửi lại nhiều lần
            codeOtp: '',
            sdt: '',
            isSDT: false,//nếu false thì cho nhập sdt, true: se nhập mã OTP
        }
    }

    componentDidMount() {
        // Utils.nlog("InfoUser:", this.infoUser, this.DevicesToken, this.data)
        if (this.data.data.SDT) {
            this.setState({ isSDT: true }, () => this._CreateOTP())
        }
        if (Platform.OS === 'android') {
            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(this.otpHandler))
                .catch(p => console.log('catch get otp from message', p));
        }
    }
    otpHandler = (message) => {
        try {
            console.log('message', message)
            let otp = /(\d{6})/g.exec(message)[1];
            console.log('otp', otp)
            this.setState({ codeOtp: otp });
            Keyboard.dismiss();
        } catch (error) {
            console.log('error', error)
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android')
            RNOtpVerify.removeListener();
    }

    _CreateOTP = async () => {
        const hashOTP = await Utils.getHashOTP()
        let resOTP = await apis.ApiUser.CreateOTPScanQRLogin(this.data.userid, this.data.data.SDT, hashOTP)
        Utils.nlog("OTP:", resOTP)
        if (resOTP.status != 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', resOTP.error.message, 'Xác nhận', () => {
                Utils.goscreen(this, 'sw_Login')
            })
        }
    }

    _GuiLaiOTP = async () => {
        this.setState({ isPress: true })
        if (this.state.timeOTP == this.state.timeMax) {
            const hashOTP = await Utils.getHashOTP()
            const res = await apis.ApiUser.CreateOTPScanQRLogin(this.data.userid, this.data.data.SDT && this.data.data.SDT != '' ? this.data.data.SDT : this.state.sdt, hashOTP)
            if (res.status == 1) {
                var Number = setInterval(() => {
                    let val = this.state.timeOTP - 1;
                    this.setState({ timeOTP: val })
                    if (val == 0) {
                        this.setState({ timeOTP: this.state.timeMax, isPress: false })
                        clearInterval(Number);
                    }
                }, 1000);
            }
            else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra xin hãy thử lại!', 'Xác nhận', () => {
                    this.setState({ isPress: false })
                })
            }
        }
    }

    _GuiOTP = async () => {
        if (this.state.sdt == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập số điện thoại", "Xác nhận")
            return;
        }
        let res = await apis.ApiUser.CreateOTPScanQRLogin(this.data.userid, this.state.sdt)
        if (res.status == 1) {
            this.setState({ isSDT: true })
            this.refOTP.focus()
        }
        else {
            Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message, 'Xác nhận')
        }
    }

    _SendOTP = async () => {
        const res = await apis.ApiUser.XacThucScanQRLogin(this.data.userid, this.DevicesToken, this.state.codeOtp)
        // Utils.nlog("------------SendOTP:", res)
        if (res?.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Xác thực tài khoản thành công', 'Xác nhận', async () => {
                var { data = {} } = res;
                //--Khi login Thành Công thì tất cả đều phải xử lý trong Hàm này. Không dc viết ngoài.
                await UtilsApp.onSetLoginSuccess_Chung(3, data, this, nthisIsLoading);
            })
        }
        else {
            await GetSetMaScreen(false, appConfig.manhinhCongDan, false)
            Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message, 'Xác nhận')
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: colors.black_30, paddingTop: Height(20) }}>
                <View style={{ backgroundColor: colors.white, width: '100%', alignSelf: 'center', borderRadius: 25, padding: 15 }}>

                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Utils.goscreen(this, 'ManHinh_Home')}>
                        <Image source={Images.icBack} style={{ width: 20, height: 20, alignSelf: 'center', tintColor: colors.colorTrueGreen }} />
                        <Text style={{ marginLeft: 5, fontSize: reText(20), color: colors.colorTrueGreen, fontWeight: 'bold' }}>Thoát</Text>
                    </TouchableOpacity>
                    <LottieView style={{ height: Height(25), alignSelf: 'center' }} source={require('../../images/LoginOTP.json')} autoPlay loop />
                    {/* <KeyboardAwareScrollView> */}
                    {!this.state.isSDT ?
                        <>
                            <Text style={{ fontSize: reText(14), marginTop: 15, marginBottom: 5 }}>Số điện thoại xác thực</Text>
                            <TextInput
                                // underlineColorAndroid={"transparent"}
                                style={{
                                    color: colors.black, width: '100%', height: Height(6), borderWidth: 1, borderRadius: 5,
                                    fontSize: reText(18), paddingHorizontal: 10
                                }}
                                placeholderTextColor={colors.black_20}
                                placeholder={'Vui lòng nhập số điện thoại để xác thực'}
                                maxLength={15}
                                value={this.state.sdt}
                                keyboardType={'numeric'}
                                onChangeText={(text) => this.setState({ sdt: text })}
                            />
                            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => this._GuiOTP()}
                                    style={{
                                        backgroundColor: colors.colorTrueGreen, width: Width(43), justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10,
                                        paddingVertical: 10, borderRadius: 20
                                    }}>
                                    <Text style={{ color: colors.white, fontSize: reText(17), fontWeight: 'bold' }}>Nhận mã OTP</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                        :
                        <>
                            <Text style={{ fontSize: reText(14), marginTop: 15, marginBottom: 5 }}>Mã OTP đã được gửi về số điện thoại
                                <Text style={{ fontSize: reText(16), color: colors.colorTrueGreen, fontWeight: 'bold' }}> {this.data.data.SDT ? this.data.data.SDT : this.state.sdt}</Text>
                            </Text>

                            <TextInput
                                // underlineColorAndroid={"transparent"}
                                ref={ref => this.refOTP = ref}
                                style={{
                                    color: colors.black, width: '100%', height: Height(6), borderWidth: 1, borderRadius: 5,
                                    fontSize: reText(18), paddingHorizontal: 10
                                }}
                                placeholderTextColor={colors.black_20}
                                placeholder={'Vui lòng nhập mã OTP để kích hoạt'}
                                maxLength={20}
                                value={this.state.codeOtp}
                                // keyboardType={'numeric'}
                                textContentType={'oneTimeCode'}
                                onChangeText={(text) => this.setState({ codeOtp: text })}
                            />
                            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    disabled={this.state.isPress}
                                    onPress={() => this._GuiLaiOTP()}
                                    style={{
                                        backgroundColor: colors.brownishGreyTwo, width: Width(43), justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10,
                                        paddingVertical: 10, borderRadius: 20
                                    }}>
                                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(17) }}>{this.state.timeOTP == this.state.timeMax ? 'Gửi lại OTP' : 'Gửi lại sau' + ' (' + this.state.timeOTP + 's)'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this._SendOTP()}
                                    style={{
                                        backgroundColor: colors.colorTrueGreen, width: Width(43), justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10,
                                        paddingVertical: 10, borderRadius: 20
                                    }}>
                                    <Text style={{ color: colors.white, fontSize: reText(17), fontWeight: 'bold' }}>Gửi</Text>
                                </TouchableOpacity>
                            </View>
                        </>}
                    {/* </KeyboardAwareScrollView> */}
                </View>

            </KeyboardAwareScrollView >
        )
    }
}

const mapStateToProps = state => ({
    isLogin: state.setlogin.isLogin,

});
export default Utils.connectRedux(ModalOTP, mapStateToProps, true);