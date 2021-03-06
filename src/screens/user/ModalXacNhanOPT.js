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
            Utils.showToastMsg('Th??ng b??o', res?.error?.message || 'Y??u c???u OTP th??nh c??ng', icon_typeToast.success, 4000, icon_typeToast.success)
        } else {
            this.setState({ IdUser: '' })
            Utils.showToastMsg('Th??ng b??o', res?.error?.message || 'Y??u c???u OTP th???t b???i', icon_typeToast.warning, 4000, icon_typeToast.warning)
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
        Utils.nlog("gi?? tr??? c???a x??c th???c otp", res)
        if (res.status == 1) {
            await this.setState({ isLoading: false });
            Utils.goscreen(this, 'Modal_ThongBaoTK');
        } else {
            await this.setState({ isLoading: false })
            Utils.showMsgBoxOK(this, "Th??ng b??o", res.error ? res.error.message : "X??c nh???n OTP th???t b???i")
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
                            <Text style={[stLogin.textThongbao, { paddingHorizontal: 30, paddingVertical: 30 }]}>{`K??ch ho???t t??i kho???n`}</Text>
                            <Text style={stLogin.textValueItem}>{`Vui l??ng k??ch ho???t t??i kho???n b???ng m?? OTP b???n nh???n ???????c t??? tin nh???n ?????n S??? ??i???n tho???i${ROOTGlobal['haveEmail'] ? ' ho???c Email' : ''} c?? nh??n m?? b???n ???? s??? d???ng ????? ????ng k?? t??i kho???n.\nN???u b???n g???p v???n ????? c???n gi???i ????p, Vui l??ng li??n h??? ch??ng t??i ????? ???????c h??? tr???.`}</Text>
                            <View style={{ paddingHorizontal: 30 }}>
                                <InputLogin
                                    Fcref={this.refOTP}
                                    value={this.state.optText}
                                    showIcon={false}
                                    placeholder={"M?? OTP"}
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
                            <Text style={[stLogin.textTitleItem, { color: true == true ? colors.colorBlue : colors.colorVeryLightBlue, textAlign: 'right' }]}>{`k??ch ho???t`.toUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.getOTP} style={{ justifyContent: 'flex-end', paddingVertical: 10 }}>
                            <Text style={[stLogin.textTitleItem, { color: colors.colorBlue, textAlign: 'right' }]}>{`g???i l???i otp`.toUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.goback} style={{ justifyContent: 'flex-end', paddingVertical: 10 }}>
                            <Text style={[stLogin.textTitleItem, { color: colors.colorBlue, textAlign: 'right' }]}>{`????ng`.toUpperCase()}</Text>
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
