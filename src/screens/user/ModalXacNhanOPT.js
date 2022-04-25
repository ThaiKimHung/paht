import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Platform } from 'react-native';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import { ScrollView } from 'react-native-gesture-handler';
import { AppgetGlobal, ROOTGlobal } from '../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { nkey } from '../../../app/keys/keyStore';
import Api from '../../apis';
import InputLogin from '../../../components/ComponentApps/InputLogin';
import apis from '../../apis';
import ModalLoading from './ModalLoading';
import RNOtpVerify from 'react-native-otp-verify';

const stLogin = StyleSheet.create({
    contentInput: {
        // marginHorizontal: '10%',
        fontWeight: '600',
        backgroundColor: 'transparent'
    },
    textThongbao: {
        color: colors.black_80,
        fontSize: sizes.sizes.sText18,
        fontWeight: '600',

    },
    viewcontainer: {
        paddingVertical: 20,
        flex: 1,
        flexDirection: 'column'
    },
    textTitleItem: {
        paddingHorizontal: 30,
        color: colors.black_20,
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
class ModalXacNhanOPT extends Component {
    constructor(props) {
        super(props);
        this.Username = Utils.ngetParam(this, 'Username', '');
        this.Sdt = Utils.ngetParam(this, 'Sdt', '');
        this.lenghtOTP = Utils.getGlobal(nGlobalKeys.lenghtOTP, 6)
        this.state = {
            isOPT: false,
            optText: '',
            IdUser: Utils.ngetParam(this, 'IdUser', ''),
            isLoading: false
        };
        this.refOTP = React.createRef(null)
    }
    async componentDidMount() {
        this.refOTP.current.focus()
        if (Platform.OS === 'android') {
            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(this.otpHandler))
                .catch(p => console.log('catch get otp from message', p));
        }
    }

    getOTP = async (resHash = '') => {
        this.setState({ isLoading: true })
        const res = await apis.ApiUser.RequestOTPApp(this.Username, this.Sdt, resHash)
        this.setState({ isLoading: false })
        Utils.nlog("gia tri cua request OPT", res)
        if (res.status == 1) {
            this.setState({ IdUser: res?.data?.idacc })
            Utils.showToastMsg('Thông báo', res?.error?.message || 'Yêu cầu OTP thành công', icon_typeToast.success, 4000, icon_typeToast.success)
        } else {
            this.setState({ IdUser: '' })
            Utils.showToastMsg('Thông báo', res?.error?.message || 'Yêu cầu OTP thất bại', icon_typeToast.warning, 4000, icon_typeToast.warning)
        }
    }

    otpHandler = (message) => {
        try {
            console.log('message', message)
            let otp = /(\d{6})/g.exec(message)[1];
            console.log('otp', otp)
            this.setState({ optText: otp });
            Keyboard.dismiss();
        } catch (error) {
            console.log('error', error)
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android')
            RNOtpVerify.removeListener();
    }

    _onChangeOPT = (val) => {
        if (val.length > 0) {
            this.setState({ isOPT: true, optText: val })
        } else {
            this.setState({ isOPT: false, optText: val })
        }
    }

    kichHoatOPT = async () => {
        var { IdUser, optText } = this.state
        await this.setState({ isLoading: true })
        let res = await apis.ApiUser.XacThucDangKyTK(IdUser, optText)
        Utils.nlog("giá trị của xác thực otp", res)
        if (res.status == 1) {
            await this.setState({ isLoading: false });
            Utils.goscreen(this, 'Modal_ThongBaoTK');
        } else {
            await this.setState({ isLoading: false })
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Xác nhận OTP thất bại")
        }
    }

    goback = () => {
        Utils.goback(this)
    }
    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }
    render() {
        var { isLoading } = this.state
        return (
            <View style={[{ backgroundColor: colors.backgroundModal, flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }}
                //  onTouchEnd={this.goback}
                />
                <View style={{
                    backgroundColor: colors.white, marginTop: 10,
                    padding: 10, width: '90%', alignSelf: 'center', borderRadius: 8
                }}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <View style={stLogin.viewcontainer}>
                            <Text style={[stLogin.textThongbao, { paddingHorizontal: 30, paddingVertical: 30 }]}>{`Kích hoạt tài khoản`}</Text>
                            <Text style={stLogin.textValueItem}>{`Vui lòng kích hoạt tài khoản bằng mã OTP bạn nhận được từ tin nhắn đến Số điện thoại${ROOTGlobal['haveEmail'] ? ' hoặc Email' : ''} cá nhân mà bạn đã sử dụng để đăng ký tài khoản.\nNếu bạn gặp vấn đề cần giải đáp, Vui lòng liên hệ chúng tôi để được hỗ trợ.`}</Text>
                            <View style={{ paddingHorizontal: 30 }}>
                                <InputLogin
                                    Fcref={this.refOTP}
                                    value={this.state.optText}
                                    showIcon={false}
                                    placeholder={"Mã OTP"}
                                    onChangeText={this._onChangeOPT}
                                    customStyle={[stLogin.contentInput, { color: colors.black_80, paddingVertical: 10 }]}
                                    placeholderTextColor={colors.black_20}
                                    colorUnline={colors.black_80}
                                    icShowPass={false}
                                    textContentType={'oneTimeCode'}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity onPress={this.kichHoatOPT} style={{ justifyContent: 'flex-end', paddingVertical: 10 }}>
                            <Text style={[stLogin.textTitleItem, { color: true == true ? colors.colorBlue : colors.colorVeryLightBlue, textAlign: 'right' }]}>{`kích hoạt`.toUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.getOTP} style={{ justifyContent: 'flex-end', paddingVertical: 10 }}>
                            <Text style={[stLogin.textTitleItem, { color: colors.colorBlue, textAlign: 'right' }]}>{`gửi lại otp`.toUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.goback} style={{ justifyContent: 'flex-end', paddingVertical: 10 }}>
                            <Text style={[stLogin.textTitleItem, { color: colors.colorBlue, textAlign: 'right' }]}>{`Đóng`.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {
                    isLoading == true ? <ModalLoading enLoading={this._enLoading} /> : <View />
                }
            </View >

        );
    }
}

export default ModalXacNhanOPT;
