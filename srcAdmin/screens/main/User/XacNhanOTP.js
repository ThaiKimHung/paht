import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    TouchableOpacity, ScrollView, ImageBackground, StatusBar, Keyboard
} from 'react-native';
import { nstyles, Width, Height } from '../../../../styles/styles';
import Utils from '../../../../app/Utils';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { Images } from '../../../images';
import { sizes } from '../../../../styles/size';
import InputCus from '../../../../components/ComponentApps/InputCus';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { colors } from '../../../../styles';
import InputLogin from '../../../../components/ComponentApps/InputLogin';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import InputT from '../../../../components/ComponentApps/InputT';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import apis from '../../../apis';
import { IsLoading } from '../../../../components';
import { appConfig } from '../../../../app/Config';
import RNOtpVerify from 'react-native-otp-verify';

const stLogin = StyleSheet.create({
    contentInput: {
        paddingVertical: 2, backgroundColor: colors.white,
        marginHorizontal: 40, borderRadius: 30, paddingHorizontal: 10, marginTop: 20
    },
    textInput: {
        flex: 1, color: colors.black_80, fontSize: sizes.sText14,
        lineHeight: 18, fontWeight: 'bold',
    },
    textTitle: {
        textAlign: 'center', fontSize: sizes.sText22, color: colors.white, fontWeight: 'bold', marginVertical: 10
    }

});

const phut = 1
const giay = 30
export default class XacNhanOTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: Utils.ngetParam(this, 'item', {}),
            isLoading: false,
            icCheck: 1,
            isError: false,
            value: '',
            minutes: phut,
            seconds: giay
        }
        this.refOTP = React.createRef(null)
    }

    componentDidMount = async () => {
        console.log('[LOG] item', Utils.ngetParam(this, 'item', {}))
        StatusBar.setHidden(true);
        let m = Math.floor(Utils.getGlobal(nGlobalKeys.timeRequestOTP, 90) / 60)
        let s = Utils.getGlobal(nGlobalKeys.timeRequestOTP, 90) % 60
        await this.setState({ minutes: m, seconds: s }, () => {
            clearInterval(this.myInterval);
            this.otptimer();
        })
        if (Platform.OS === 'android') {
            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(this.otpHandler))
                .catch(p => console.log('catch get otp from message', p));
        }
        this.refOTP.current.focus()
    }
    otpHandler = (message) => {
        try {
            console.log('message', message)
            let otp = otp = /(\d{4})/g.exec(message)[1];
            console.log('otp', otp)
            this.setState({ value: otp });
            Keyboard.dismiss();
        } catch (error) {
            console.log('error', error)
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android')
            RNOtpVerify.removeListener();
    }
    _onchangeText = (val) => {
        this.setState({ isError: false, value: val })
    }
    _CapnhatOTP = async () => {
        nthisIsLoading.show();
        var { item, value } = this.state
        Utils.nlog("state", item, value)
        const resLay = await apis.ApiUser.XacThucDangNhap({ ...item, otp: value })
        Utils.nlog("gia tri xac thuc dang nhap res", resLay)
        if (resLay.status == 1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Xác thực tành công", "Xác nhận", () => Utils.goscreen(this, "st_Login"));
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", resLay.error ? resLay.error.message : "Xác thực thất bại", "Xác nhận");
        }
    }

    _LayMaCap = async () => {
        nthisIsLoading.show();
        const { type, email, } = this.state.item
        const hashOTP = await Utils.getHashOTP()
        const resLay = await apis.ApiUser.LayMaCapLaiMK(email, type, hashOTP)
        Utils.nlog("gia tri lay ma cap res", resLay)
        if (resLay.status == 1) {
            this.setState({ item: { ...this.state.item, ...resLay.data } })
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", type == 0 ? "Một mã OTP đã gửi đến email của bạn" : "Một mã OTP đã gửi đến số điện thoại của bạn.", "Xác nhận")
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", resLay.error ? resLay.error.message : "Lấy mã OTP thất bại", "Xác nhận")
        }
    }

    otptimer() {
        clearInterval(this.myInterval);
        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state;

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1,
                }));
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.myInterval);
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59,
                    }));
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    handleClick() {
        this.setState({ minutes: phut, seconds: giay });
        this._LayMaCap();
        this.otptimer();
    }

    render() {
        const { nrow, nmiddle } = nstyles
        const { isLoading, icCheck, isError, value } = this.state
        return (
            <View style={[nstyles.ncontainer,
            { justifyContent: 'center' }]}>
                <View style={{ height: Height(25), justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: sizes.sText22, color: colors.colorTextBlue, fontWeight: 'bold' }}>{`HỆ THỐNG THÔNG TIN\n` + appConfig.TieuDeApp}</Text>
                </View>
                <ImageBackground source={Images.icBgr} style={[nstyles.ncontainer, { paddingTop: 45, }]}>
                    <KeyboardAwareScrollView style={{ flex: 1 }}>
                        <Text style={stLogin.textTitle}>{`quên mật khẩu`.toUpperCase()}</Text>
                        <InputT
                            refInput={this.refOTP}
                            placeholder={`Mã OTP`}
                            style={{
                                color: colors.black_80,
                                fontSize: sizes.sText14,
                                fontWeight: '300',
                            }}
                            value={value}
                            editable={true}
                            showUnline={false}
                            fcCheck={icCheck == 1 ? this._checkEmail : this._checkSoDienThoai}
                            colorError1={colors.yellowishOrange}
                            colorError2={colors.yellowishOrange}
                            errorText={icCheck == 1 ? "Email không hợp lệ" : 'Số diện thoại không hợp lệ'}
                            colorUnline={colors.black_20}
                            style={[stLogin.contentInput, { paddingVertical: 10 }]}
                            styErorr={{ paddingHorizontal: 50, marginTop: 60, fontStyle: 'italic' }}
                            showError={isError}
                            onChangeText={this._onchangeText}
                            textContentType={'oneTimeCode'}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                            <ButtonCus
                                stContainerR={{ backgroundColor: colors.colorLightGrayBlue, marginHorizontal: 5, }}
                                onPressB={() => Utils.goback(this)}
                                textTitle={`Quay lại`}
                            >
                            </ButtonCus>
                            <ButtonCus
                                stContainerR={{ marginHorizontal: 5 }}
                                onPressB={this._CapnhatOTP}
                                textTitle={`Xác nhận`}
                            >
                            </ButtonCus>
                        </View>
                        {this.state.minutes === 0 && this.state.seconds === 0 ?
                            <TouchableOpacity onPress={() => this.handleClick()} activeOpacity={0.5} style={{ padding: 5, marginTop: 23, flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={{ fontSize: sizes.sText14, color: colors.white, textDecorationLine: 'underline' }}>Gửi lại OTP</Text>
                            </TouchableOpacity> :
                            <Text style={{ fontSize: sizes.sText14, color: colors.white, alignSelf: 'center', padding: 5, marginTop: 23, }}>Gửi lại OTP sau {this.state.minutes < 10
                                ? `0${this.state.minutes}`
                                : this.state.minutes}
                                {` phút `}
                                {this.state.seconds < 10
                                    ? `0${this.state.seconds}`
                                    : this.state.seconds} giây
                            </Text>
                        }
                    </KeyboardAwareScrollView>
                </ImageBackground>
                {/* {
                    isLoading == true ? <ModalLoading enLoading={this._enLoading} /> : <View />
                } */}
                <IsLoading />

            </View >

        );
    }
}
