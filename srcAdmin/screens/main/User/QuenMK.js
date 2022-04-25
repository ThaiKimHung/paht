import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    TouchableOpacity, ScrollView, ImageBackground, StatusBar
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

export default class QuenMK extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            icCheck: 1,
            isError: false,
            value: ''
        }
    }
    componentDidMount = async () => {
        StatusBar.setHidden(true);
    }
    _onchangeText = async (val) => {
        var { icCheck } = this.state

        if (val.length > 0) {
            var ck = true
            if (icCheck == 1) {
                ck = await Utils.validateEmail(val)
            } else {
                ck = await Utils.validatePhone(val)
            }
            if (ck == false) {
                this.setState({ isError: true, value: val })
            } else {
                this.setState({ isError: false, value: val })
            }
        } else {
            this.setState({ isError: false, value: val })
        }

    }
    _LayMaCap = async () => {
        nthisIsLoading.show();
        const { icCheck, value } = this.state
        const hashOTP = await Utils.getHashOTP()
        const resLay = await apis.ApiUser.LayMaCapLaiMK(value, icCheck - 1, hashOTP)
        Utils.nlog("gia tri lay ma cap res", resLay)
        if (resLay.status == 1) {
            var item = resLay.data;
            item.type = icCheck - 1;
            nthisIsLoading.hide();
            if (item.type == 0) {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng kiểm tra email của bạn để xác thực đổi mật khẩu.', 'Xác nhận')
            } else {
                Utils.goscreen(this, 'st_XacNhanOTP', { item: { ...item, email: value }, });
            }
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", resLay.error ? resLay.error.message : "Lấy mã OTP thất bại", "Xác nhận")
        }
        return

    }

    render() {
        const { nrow, nmiddle } = nstyles
        const { isLoading, icCheck, isError } = this.state
        return (

            <View style={[nstyles.ncontainer,
            { justifyContent: 'center' }]}>
                <View style={{ height: Height(25), justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: sizes.sText22, color: colors.colorTextBlue, fontWeight: 'bold' }}>{`HỆ THỐNG THÔNG TIN\n` + appConfig.TieuDeApp}</Text>
                </View>
                <ImageBackground source={Images.icBgr} style={[nstyles.ncontainer, { paddingTop: 45, }]}>
                    <KeyboardAwareScrollView style={{ flex: 1 }}>
                        <Text style={stLogin.textTitle}>{`quên mật khẩu`.toUpperCase()}</Text>
                        <View >
                            <View style={[nrow, { paddingHorizontal: 50, marginTop: 30 }]}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}
                                    onPress={() => this.setState({ icCheck: 1, value: '' })}>
                                    <Image source={icCheck == 1 ? Images.icRadioCheck : Images.icRadioUncheck}
                                        style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.white }]}
                                        resizeMode='contain' />
                                    <Text style={{ color: colors.white, paddingHorizontal: 5, fontSize: sizes.sText14 }}>
                                        {`Email`}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}
                                    onPress={() => this.setState({ icCheck: 2, value: '' })}>
                                    <Image source={icCheck == 2 ? Images.icRadioCheck : Images.icRadioUncheck}
                                        style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.white }]}
                                        resizeMode='contain' />
                                    <Text style={{ color: colors.white, paddingHorizontal: 5, fontSize: sizes.sText14 }}>
                                        {`Số điện thoại`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <InputT
                            placeholder={icCheck == 1 ? "Nhập email" : 'Nhập số diện thoại'}
                            style={{
                                color: colors.black_80,
                                fontSize: sizes.sText14,
                                fontWeight: '300',
                            }}
                            value={this.state.value}
                            editable={true}
                            showUnline={false}
                            fcCheck={icCheck == 1 ? this._checkEmail : this._checkSoDienThoai}
                            colorError1={colors.yellowishOrange}
                            colorError2={colors.yellowishOrange}
                            errorText={icCheck == 1 ? "Email không hợp lệ" : 'Số diện thoại không hợp lệ'}
                            colorUnline={colors.black_20}
                            style={[stLogin.contentInput, { paddingVertical: 10 }]}
                            styErorr={{ paddingHorizontal: 50, marginTop: 14, fontStyle: 'italic' }}
                            // customStyle={{ marginHorizontal: 40 }}
                            showError={isError}
                            onChangeText={this._onchangeText}
                            keyboardType={icCheck == 1 ? `email-address` : `phone-pad`}

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
                                onPressB={this._LayMaCap}
                                textTitle={`Lấy lại mật khẩu`}
                            >
                            </ButtonCus>
                        </View>
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
