

import React, { Component } from 'react';
import {
    View, TextInput,
    Text, Image, TouchableOpacity,
    StyleSheet, PermissionsAndroid,
    Linking, Animated,
    ActivityIndicator, Platform, ScrollView, Alert, Keyboard, BackHandler
} from 'react-native';
import { Images } from '../../../images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';
import ImageSize from 'react-native-image-size'
import moment from 'moment';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import ImagePicker from '../../../../components/ComponentApps/ImagePicker/ImagePicker';
import RNCompress from '../../../../src/RNcompress';
import { reText, reSize, sizes } from '../../../../styles/size';
import { nstyles, Height, paddingTopMul, khoangcach, Width } from '../../../../styles/styles';
import { appConfig } from '../../../../app/Config';
import { IsLoading, HeaderCom } from '../../../../components';
import { colors } from '../../../../styles';
import Utils from '../../../../app/Utils';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import AppCodeConfig from '../../../../app/AppCodeConfig';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import apis from '../../../apis';
import InputLogin from '../../../../components/ComponentApps/InputLogin';


class AddUserCongDan extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.state = {
            newPass: '',
            confirmPass: '',
            isNewPass: true,
            isConfirmPass: true,
            ShowNewMKhau: true,
            ShowConfirmMKhau: true,
            username: '',
            hoten: '',
            status: false,
        }
    }
    goback = () => {
        Utils.goback(this)
    }
    onChangeNewPass = (text) => {
        this.setState({ newPass: text, isNewPass: text ? true : false })
    }
    onChangeConfirmPass = (text) => {
        this.setState({ confirmPass: text, isConfirmPass: text ? true : false })
    }
    _setShowNewPass = () => {
        this.setState({ ShowNewMKhau: !this.state.ShowNewMKhau })
    }
    _setShowConfirmPass = () => {
        this.setState({ ShowConfirmMKhau: !this.state.ShowConfirmMKhau })
    }

    onSubmid = async () => {
        var { newPass, confirmPass, username,
            hoten, status } = this.state;
        var noti = ''
        var mess = 'M???t kh???u ph???i ??t nh???t 8 k?? t??? bao g???m ch??? s???, ch??? hoa, ch??? th?????ng v?? k?? t??? ?????c bi???t'
        if (!username) {
            noti += 'Vui l??ng nh???p S??T ????ng nh???p\n'
        }
        // if (!newPass) {
        //     noti += 'Vui l??ng nh???p m???t kh???u\n'
        // }
        // if (!confirmPass) {
        //     noti += 'Vui l??ng nh???p x??c nh???n m???t kh???u\n'
        // }
        hoten = Utils.chuanhoaHovaTen(hoten)
        if (!hoten) {
            noti += 'Vui l??ng nh???p h??? v?? t??n\n'
        }
        else
            if (this.Check_HoTen(hoten) <= 2)
                noti += 'H??? v?? t??n kh??ng h???p l???, vui l??ng nh???p l???i!\n'

        if (noti) {
            Utils.showMsgBoxOK(this, 'Th??ng b??o', noti, 'X??c nh???n')
        }

        else {
            //th???c hi???n postapi ?????i m???t kh???u ?????ng th???i ????ng xu???t
            const bodyChangePass = {
                "Ap": "",
                "ChuHo": false,
                "DiaChi": "",
                "Email": "",
                "FullName": hoten,
                "GioiTinh": "",
                "HoTenLot": "",
                "IdHuyen": 0,
                "IdPX": 0,
                "IsDel": false,
                "IsLogin": false,
                "Mang": "",
                "NgaySinh": "",
                "Password": username,
                "PhoneNumber": "",
                "RePassword": username,
                "SDT": "",
                "STT": 0,
                "Status": status == 0 ? 0 : 1,
                "Ten": "",
                "TenHuyen": "",
                "To": "",
                "UserID": 0,
                "UserName": username,
                "Username": username,
                "Xa": ""
            }
            let res = await apis.ApiUser.TaoTKCongDan(bodyChangePass);
            // Utils.nlog('T???oTKCongDan---------------------------------', res, confirmPass)
            if (res && res?.status == 1) {
                Utils.showMsgBoxOK(this, 'Th??ng b??o', res?.error?.message ? res.error.message : "Th???c hi???n th??nh c??ng", 'X??c nh???n',
                    () => {
                        this.callback(username);
                        Utils.goback(this);
                    })
            }
            else {
                Utils.showMsgBoxOK(this, 'Th??ng b??o', res?.error?.message ? res.error.message : "Th???c hi???n th???t b???i", 'X??c nh???n')
            }
        }
    }
    onChangeUsername = (text) => {
        Utils.nlog(text)
        this.setState({ username: text })
    }
    onChangeHoten = (text) => {
        this.setState({ hoten: text })
    }

    Check_HoTen = (ChuoiString = '') => {
        let temp = ChuoiString.trim()
        return temp.length
    }

    render() {
        const { isOldPass, isNewPass, isConfirmPass, ShowOldPassword, ShowNewMKhau, ShowConfirmMKhau, status, username } = this.state
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            // style={[{ backgroundColor: colors.backgroundModal, flex: 1, justifyContent: 'center' }]} 
            >
                <View style={{
                    left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.black_60,
                    // alignItems: 'center',
                }} />
                <View style={{ backgroundColor: colors.black_60 }}>
                    <View style={{
                        alignSelf: 'center',
                        justifyContent: 'flex-end',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        width: '100%'
                    }}>
                        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
                            <Text style={{
                                color: colors.colorHeaderApp,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: sizes.sText18
                            }}
                            >Th??m t??i kho???n c??ng d??n</Text>
                            <View>
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>S??T ????ng nh???p</Text>
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={false}
                                    placeholder={"S??T ????ng nh???p"}
                                    onChangeText={text => this.onChangeUsername(text)}
                                    placeholderTextColor={colors.colorTextGray}
                                    icon={Images.icPass}
                                    icShowPass={true}
                                    showIcon={true}
                                    stContainerR={{ width: '100%', }}
                                    secureTextEntry={ShowOldPassword}
                                    styleInput={{ color: colors.black }}
                                    keyboardType='numeric'
                                    icTextInput={false}
                                    setShowPass={this._setShowOldPass}
                                    iconStylePass={[nstyles.nIcon21, { tintColor: colors.colorTextGray, marginHorizontal: 5 }]}

                                />
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }} >S??T ????ng nh???p l?? <Text style={{ fontWeight: 'bold' }}>b???t bu???c</Text></Text>
                            </View>
                            {/* <View style={{ marginTop: 10 }} pointerEvents={'none'}>
                                {isNewPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nh???p m???t kh???u</Text> : null}
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={true}
                                    placeholder={"Nh???p m???t kh???u"}
                                    // onChangeText={text => this.onChangeNewPass(text)}
                                    placeholderTextColor={colors.colorTextGray}
                                    icon={Images.icPass}
                                    icShowPass={true}
                                    value={username}
                                    isShowPassOn={ShowNewMKhau}
                                    iconShowPass={ShowNewMKhau == true ? Images.icShowPass : Images.icHidePass}
                                    showIcon={true}
                                    stContainerR={{ width: '100%', }}
                                    secureTextEntry={ShowNewMKhau}
                                    icTextInput={false}
                                    setShowPass={this._setShowNewPass}
                                    iconStylePass={[nstyles.nIcon21, { tintColor: colors.colorTextGray, marginHorizontal: 5 }]}

                                />
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui l??ng nh???p <Text style={{ fontWeight: 'bold' }}>m???t kh???u</Text></Text>
                            </View>
                            <View style={{ marginTop: 10 }} pointerEvents={'none'}>
                                {isConfirmPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>X??c nh???n m???t kh???u</Text> : null}
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={true}
                                    placeholder={"X??c nh???n m???t kh???u"}
                                    // onChangeText={text => this.onChangeConfirmPass(text)}
                                    placeholderTextColor={colors.colorTextGray}
                                    icon={Images.icPass}
                                    icShowPass={true}
                                    isShowPassOn={ShowConfirmMKhau}
                                    iconShowPass={ShowConfirmMKhau == true ? Images.icShowPass : Images.icHidePass}
                                    showIcon={true}
                                    stContainerR={{ width: '100%', }}
                                    secureTextEntry={ShowConfirmMKhau}
                                    icTextInput={false}
                                    value={username}
                                    setShowPass={this._setShowConfirmPass}
                                    iconStylePass={[nstyles.nIcon21, { tintColor: colors.colorTextGray, marginHorizontal: 5 }]}

                                />
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui l??ng nh???p <Text style={{ fontWeight: 'bold' }}>l???i m???t kh???u</Text></Text>
                            </View> */}
                            <View>
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>H??? v?? t??n</Text>
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={false}
                                    placeholder={"H??? v?? t??n"}
                                    onChangeText={text => this.onChangeHoten(text)}
                                    placeholderTextColor={colors.colorTextGray}
                                    icon={Images.icPass}
                                    icShowPass={true}
                                    showIcon={true}
                                    stContainerR={{ width: '100%', }}
                                    secureTextEntry={ShowOldPassword}
                                    styleInput={{ color: colors.black }}
                                    icTextInput={false}
                                    setShowPass={this._setShowOldPass}
                                    iconStylePass={[nstyles.nIcon21, { tintColor: colors.colorTextGray, marginHorizontal: 5 }]}
                                />
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }} >H??? v?? t??n l?? <Text style={{ fontWeight: 'bold' }}>b???t bu???c</Text></Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ status: !this.state.status })} style={{ flexDirection: 'row', alignItems: 'flex-end', paddingTop: 10 }}>
                                <Image
                                    source={status == false ? Images.icUnCheck : Images.icCheck}
                                    resizeMode={'contain'}
                                    style={{
                                        width: reSize(20), height: reSize(20),
                                        tintColor: 'black'
                                    }} />
                                <Text style={{ fontSize: sizes.sText12, paddingHorizontal: 10 }}>???? k??ch ho???t</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[nstyles.nrow, { justifyContent: 'space-around', paddingBottom: khoangcach + 10 }]}>
                            <ButtonCus
                                textTitle='Quay l???i'
                                onPressB={() => Utils.goback(this)}
                                stContainerR={{ backgroundColor: 'gray', marginRight: 5, borderRadius: 5, width: Width(40) }}
                            />
                            <ButtonCus
                                stContainerR={{ marginLeft: 5 }}
                                textTitle='Th??m t??i kho???n'
                                onPressB={this.onSubmid}
                                stContainerR={{ backgroundColor: colors.colorHeaderApp, borderRadius: 5, width: Width(40) }}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}





export default AddUserCongDan
