import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Dimensions, Platform } from 'react-native';
import HeaderCom from '../../../components/HeaderCom';
import { colors, nstyles, sizes } from '../../../styles';
import InputLogin from '../../../components/ComponentApps/InputLogin';
import { Images } from '../../images';
import ButtonCom from '../../../components/Button/ButtonCom';
import Utils from '../../../app/Utils';
import Api from '../../apis';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputCheckCus from '../../../components/ComponentApps/InputCheckCus';
import { nkey } from '../../../app/keys/keyStore';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { HeaderCus } from '../../../components';
import { nheight, nwidth, Width } from '../../../styles/styles';

const stLogin = StyleSheet.create({
    contentInput: {
        fontWeight: '600',
        backgroundColor: 'transparent',
        color: colors.black_80, fontSize: sizes.reSize(14),
        paddingVertical: Platform.OS == 'ios' ? 10 : 0
    },
    textThongbao: {
        color: colors.black_20,
        fontSize: sizes.sText18,
        fontWeight: '600'
    }
});

class QuenMatKhau extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bs: false,
            Username: '',
            Sdt: '',
            data: '',
            Opt: '',
            Mk: '',
            XnMk: '',
            sdtCu: Utils.getGlobal(nGlobalKeys.SDTQuenMK, ''),
            tgCu: Utils.getGlobal(nGlobalKeys.tgQuenMK, ''),
            isShowGuiOTP: true,
            TextInputDisableStatus: true
        };
    }
    async componentDidMount() {
        Utils.nlog('vao get global')

    }

    yeucauOPT = async () => {
        var { Username, Sdt, isShowGuiOTP } = this.state
        if (isShowGuiOTP == false) {
            return;
        }
        // if (Username.length <= 0) {
        //     Utils.showMsgBoxOK(this, "Th??ng b??o", "B???n ch??a nh???p t??n ????ng nh???p");
        //     return
        // }
        if (Sdt.length <= 0) {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "B???n ch??a nh???p s??? ??i???n tho???i", "X??c nh???n");
            return
        }
        Utils.nlog("so dt,", Sdt)
        Utils.setGlobal(nGlobalKeys.SDTQuenMK, Sdt);
        var t = new Date();
        Utils.setGlobal(nGlobalKeys.tgQuenMK, t);
        this.setState({ sdtCu: Sdt, tgCu: t })

        let res = await Api.ApiUser.RequestOTPApp(Sdt, Sdt)
        Utils.nlog("gia tri cua request OTP", res)
        if (res.status == 1) {
            // Utils.showMsgBoxOK(this, 'Th??ng b??o', "qua b?????c 2")
            await this.setState({ bs: true, data: res.data, isShowGuiOTP: false })
            // this.scroller.scrollTo({ x: 0, y: nstyles.Height(50), animated: true })
            this.refOtp.focus();
        } else {
            Utils.showMsgBoxOK(this, 'Th??ng b??o', res.error ? res.error.message : 'L???i g???i OTP', 'X??c nh???n');
            // this.setState({ isShowGuiOTP: false })
        }
    }
    xacnhanMK = async () => {
        var { Mk, XnMk, data = {}, Opt } = this.state
        if (Opt.length <= 0) {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "B???n ch??a nh???p m?? OTP", 'X??c nh???n')
            return
        }
        if (Mk.length <= 0) {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "B???n ch??a nh???p m???t kh???u", 'X??c nh???n')
            return
        }
        if (XnMk.length <= 0) {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "B???n ch??a nh???p x??c nh???n m???t kh???u", 'X??c nh???n')
            return
        }
        if (Mk != XnMk) {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "M???t kh???u ph???i gi???ng nhau", 'X??c nh???n')
            return
        }

        let res = await Api.ApiUser.DoiMatKhauApp(Mk, XnMk, Opt, data.idrequest, data.idacc)
        Utils.nlog("gia tro doi mmk", res)
        if (res.status == 1) {
            Utils.setGlobal(nGlobalKeys.SDTQuenMK, '');
            Utils.setGlobal(nGlobalKeys.tgQuenMK, '');
            Utils.showMsgBoxOK(this, 'Th??ng b??o', '?????i m???t kh???u th??nh c??ng', "X??c nh???n", () => {
                Utils.goback(this);
            })
        } else {
            var { error = {} } = res;
            Utils.showMsgBoxOK(this, 'Th??ng b??o', res.error ? error.message : 'Kh??ng th??? ?????i m???t kh???u', 'X??c nh???n');
        }
    }
    _checkMK = (val) => {

        if (val.length == 0) {
            return true
        }
        return Utils.validateMK(val)
    }
    _checkXNMK = (val) => {
        var { Mk, XnMk } = this.state
        return val == Mk ? true : false
    }
    _changeSDT = async (text) => {
        // const { sdtCu, tgCu } = this.state
        let sdtCu = Utils.getGlobal(nGlobalKeys.SDTQuenMK, '');
        let tgCu = Utils.getGlobal(nGlobalKeys.tgQuenMK, '');
        Utils.nlog("gia tri sdt cu", sdtCu)

        if (sdtCu == text && tgCu) {
            let dateCu = Moment(tgCu);
            let dateMoi = Moment(new Date());
            Utils.nlog("gia tri date cu moi", dateCu, dateMoi)
            let number = dateMoi.diff(dateCu, 'minutes');
            Utils.nlog("vao gia number", number)
            if (number < 5) {
                Utils.nlog("vao gia tri d?????i 5 ph??t", number)
                this.setState({ Sdt: text.trim(), isShowGuiOTP: false })
            } else {
                this.setState({ Sdt: text.trim(), isShowGuiOTP: true })
            }
        } else {
            Utils.nlog("vao ch??a c??")
            this.setState({ Sdt: text.trim() })
        }

    }
    render() {

        var { bs, isShowGuiOTP } = this.state
        return (
            <View style={[nstyles.ncontainer, { flex: 1, }]}>
                <HeaderCus
                    title={'Qu??n m???t kh???u'}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                />
                <KeyboardAwareScrollView
                    ref={scroller => { this.scroller = scroller; }}
                    style={{ flex: 1, backgroundColor: colors.BackgroundHome }}
                    scrollToOverflowEnabled={true}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 30 }}>
                        <LottieView source={require('../../images/OTP.json')} style={{ width: nwidth(), height: nheight() / 7, justifyContent: "center", alignSelf: 'center' }} loop={true} autoPlay={true} />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: 30, height: 30,
                                borderRadius: 25, backgroundColor: bs === false ? colors.oceanBlue : colors.colorGrayText, alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontWeight: '600',
                                    textAlign: 'center', fontSize: sizes.sizes.sText20, color: colors.white
                                }}>{'1'}</Text>
                            </View>
                            <Text style={{
                                paddingLeft: 30, fontWeight: '600',
                                textAlign: 'left', fontSize: sizes.sizes.sText16, color: colors.blackTwo, justifyContent: 'center'
                            }}>{'L???y m?? OTP'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', flex: 1, marginTop: 10 }}>
                            <View style={{
                                width: 30, alignItems: 'center', justifyContent: 'center', height: "100%"
                            }}>
                                <View style={{ width: 1.5, backgroundColor: colors.grey, height: '100%' }}></View>
                            </View>
                            <View style={{ flexDirection: 'column', paddingLeft: 30, flex: 1 }}>
                                {bs === false ? <View>
                                    <Text style={{
                                        paddingBottom: 20,
                                        fontWeight: '300',
                                        textAlign: 'left', fontSize: sizes.sizes.sText14, color: colors.black_80, justifyContent: 'center'
                                    }}>
                                        {`????? ?????i m???t kh???u b???n c???n x??c th???c th??ng tin t??i kho???n qua m?? OTP g???i ?????n S??? ??i???n tho???i${ROOTGlobal['haveEmail'] ? ' ho???c Email' : ''} c???a b???n ???? ????ng k??.\nVui l??ng nh???p t??n ????ng nh???p v??? s??? ??i???n tho???i b???n ???? s??? d???ng ????ng k?? t??i kho???n:`}
                                    </Text>
                                </View> : null}
                                <View style={{ borderRadius: 5, borderWidth: 0.5, flexDirection: "row" }}>
                                    <View style={{ flex: 1 }}>
                                        <InputLogin
                                            icon={Images.icLogin}
                                            showIcon={false}
                                            placeholderTextColor={colors.black_20}
                                            colorUnline={null}
                                            placeholder={"S??? di ?????ng"}
                                            value={this.state.Sdt}
                                            onChangeText={this._changeSDT}
                                            // customStyle={stLogin.contentInput}
                                            icShowPass={false}
                                            keyboardType={'numeric'}
                                            customStyle={{ flex: 1, padding: 10, borderRadius: 5, }}
                                        />
                                    </View>
                                    {bs === true ? <LottieView source={require('../../images/success.json')} style={{ height: nheight() / 35, alignContent: "flex-end", alignSelf: 'center', paddingRight: 5 }} loop={false} autoPlay={true} /> : null}
                                </View>
                                {bs === false ? <View>
                                    {/* <Text style={{
                                        fontWeight: '300',
                                        textAlign: 'left', fontSize: sizes.sizes.sText20, color: colors.black_20, justifyContent: 'center'
                                    }}> {`S??? d???ng s??? di ?????ng ????n v??? ?????i v???i t??i kho???n t??? ch???c.`}
                                    </Text> */}
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                        {
                                            this.state.isShowGuiOTP == true ? <ButtonCom
                                                onPress={this.yeucauOPT}
                                                icon={Images.icFE}
                                                style={{ marginTop: 10, borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}
                                                text={`Y??u c???u OTP`}
                                            /> : null
                                        }
                                    </View>
                                </View> :
                                    <View style={{ flexDirection: "column", paddingTop: 10 }}>
                                        <Text style={{
                                            textAlign: 'center', fontSize: sizes.sizes.sText16, color: "#00FF00", justifyContent: 'center'
                                        }}> {`M?? OTP ???? ???????c g???i`}
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <View style={{
                                width: 30, height: 30,
                                borderRadius: 25, backgroundColor: bs == true ? colors.oceanBlue : colors.colorGrayText, alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontWeight: '600',
                                    textAlign: 'center', fontSize: sizes.sizes.sText20, color: colors.white
                                }}>{'2'}</Text>
                            </View>
                            <Text style={{
                                paddingLeft: 30, fontWeight: '600',
                                textAlign: 'left', fontSize: sizes.sizes.sText16, color: bs == true ? colors.blackTwo : colors.colorGrayText, justifyContent: 'center'
                            }}>{'?????t m???t kh???u m???i'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', flex: 1, marginTop: 10 }}>
                            <View style={{
                                width: 30, alignItems: 'center', justifyContent: 'center', height: "100%"
                            }}>
                                <View style={{ width: 1.5, backgroundColor: colors.grey, height: '100%' }}></View>
                            </View>
                            <View style={{ flexDirection: 'column', paddingLeft: 30, flex: 1 }}>
                                <View style={{ borderRadius: 5, borderWidth: 0.5, flexDirection: "row" }}>
                                    <View style={{ flex: 1 }}>
                                        <InputLogin
                                            Fcref={refopt => { this.refOtp = refopt; }}
                                            icon={Images.icLogin}
                                            showIcon={false}
                                            colorUnline={null}
                                            placeholderTextColor={colors.black_20}
                                            placeholder={"M?? OTP"}
                                            value={this.state.Opt}
                                            onChangeText={text => this.setState({ Opt: text.trim() })}
                                            icShowPass={false}
                                            customStyle={{ flex: 1, padding: 10, borderRadius: 5, }}
                                        />
                                    </View>
                                </View>

                                <View style={{ paddingTop: 20 }}>
                                    <InputCheckCus
                                        icon={Images.icLogin}
                                        showIcon={false}
                                        placeholderTextColor={colors.black_20}
                                        placeholder={"M???t kh???u"}
                                        secureTextEntry={true}
                                        value={this.state.Mk}
                                        onChangeText={text => this.setState({ Mk: text.trim() })}
                                        colorUnline={null}
                                        useCheck={true}
                                        icShowPass={false}
                                        fcCheck={this._checkMK}
                                        titleText={"M???t kh???u"}
                                        errorText={Utils.getGlobal(nGlobalKeys.txtErrPass)}
                                        customStyle={{ flex: 1, padding: 10, borderRadius: 5, borderWidth: 0.5, marginVertical: 5 }}
                                    />
                                </View>
                                <View style={{ paddingTop: 20 }}>
                                    <InputCheckCus
                                        icon={Images.icLogin}
                                        showIcon={false}
                                        placeholderTextColor={colors.black_20}
                                        placeholder={"X??c nh???n l???i m???t kh???u"}
                                        secureTextEntry={true}
                                        value={this.state.XnMk}
                                        onChangeText={text => this.setState({ XnMk: text.trim() })}
                                        colorUnline={null}
                                        useCheck={true}
                                        icShowPass={false}
                                        fcCheck={this._checkXNMK}
                                        titleText={"X??c nh???n l???i m???t kh???u"}
                                        errorText={"M???t kh???u ph???i gi???ng m???t kh???u ??? tr??n"}
                                        customStyle={{ flex: 1, padding: 10, borderRadius: 5, borderWidth: 0.5, marginVertical: 5 }}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <ButtonCom
                                        onPress={this.xacnhanMK}
                                        icon={Images.icFE}
                                        sizeIcon={30}
                                        style={
                                            {
                                                ...stLogin.contentInput,
                                                marginTop: 10, marginBottom: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 10,
                                                minWidth: Width(30)
                                            }}
                                        text={"?????t l???i m???t kh???u"}
                                    />
                                </View>
                            </View>
                        </View>

                    </View>
                    {/* </ScrollView>
                </KeyboardAvoidingView> */}
                </KeyboardAwareScrollView>

            </View >
        );
    }
}

export default QuenMatKhau;

{/* <View style={{ flex: 1, flexDirection: 'row', width: '100%', marginTop: 10 }}>
                        <View style={{
                            width: 30, alignItems: 'center', justifyContent: 'center', height: "100%"
                        }}>
                            <View style={{ width: 1.5, backgroundColor: colors.grey, height: '100%' }}></View>
                        </View>
                        <View style={{ flexDirection: 'column', paddingLeft: 30, }}>
                            <Text style={{
                                fontWeight: '300',
                                textAlign: 'left', fontSize: sizes.sizes.sText20, color: colors.black_80, justifyContent: 'center'
                            }}>{'????? ?????i m???t kh???u b???n c??n x??c th???c th??ng tin t??i kho???n qua m?? OPT g???i ?????n ??i???n tho???i.\nVui l??ng nh???p t??n ????ng nh???p v?? s??? ??i???n tho???i b???n ???? s??? d???ng ????ng k?? t??i kho???n'}
                            </Text>
                            <InputLogin
                                icon={Images.icLogin}
                                showIcon={false}
                                placeholderTextColor={colors.colorGrayText}
                                placeholder={"T??n ????ng nh???p"}
                                onChangeText={text => (this.Username = text)}
                                customStyle={stLogin.contentInput}
                                icShowPass={false}
                            />
                        </View>
                    </View> */}
