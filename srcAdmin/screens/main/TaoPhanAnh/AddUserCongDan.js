

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
        var mess = 'Mật khẩu phải ít nhất 8 ký tự bao gồm chữ số, chữ hoa, chữ thường và ký tự đặc biệt'
        if (!username) {
            noti += 'Vui lòng nhập SĐT đăng nhập\n'
        }
        // if (!newPass) {
        //     noti += 'Vui lòng nhập mật khẩu\n'
        // }
        // if (!confirmPass) {
        //     noti += 'Vui lòng nhập xác nhận mật khẩu\n'
        // }
        hoten = Utils.chuanhoaHovaTen(hoten)
        if (!hoten) {
            noti += 'Vui lòng nhập họ và tên\n'
        }
        else
            if (this.Check_HoTen(hoten) <= 2)
                noti += 'Họ và tên không hợp lệ, vui lòng nhập lại!\n'

        if (noti) {
            Utils.showMsgBoxOK(this, 'Thông báo', noti, 'Xác nhận')
        }

        else {
            //thực hiện postapi đổi mật khẩu đồng thời đăng xuất
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
            // Utils.nlog('TạoTKCongDan---------------------------------', res, confirmPass)
            if (res && res?.status == 1) {
                Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message ? res.error.message : "Thực hiện thành công", 'Xác nhận',
                    () => {
                        this.callback(username);
                        Utils.goback(this);
                    })
            }
            else {
                Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message ? res.error.message : "Thực hiện thất bại", 'Xác nhận')
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
                            >Thêm tài khoản công dân</Text>
                            <View>
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>SĐT đăng nhập</Text>
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={false}
                                    placeholder={"SĐT đăng nhập"}
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
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }} >SĐT đăng nhập là <Text style={{ fontWeight: 'bold' }}>bắt buộc</Text></Text>
                            </View>
                            {/* <View style={{ marginTop: 10 }} pointerEvents={'none'}>
                                {isNewPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Nhập mật khẩu</Text> : null}
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={true}
                                    placeholder={"Nhập mật khẩu"}
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
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui lòng nhập <Text style={{ fontWeight: 'bold' }}>mật khẩu</Text></Text>
                            </View>
                            <View style={{ marginTop: 10 }} pointerEvents={'none'}>
                                {isConfirmPass ? <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Xác nhận mật khẩu</Text> : null}
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={true}
                                    placeholder={"Xác nhận mật khẩu"}
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
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }}>Vui lòng nhập <Text style={{ fontWeight: 'bold' }}>lại mật khẩu</Text></Text>
                            </View> */}
                            <View>
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 10 }}>Họ và tên</Text>
                                <InputLogin
                                    stContainerC={{ borderBottomWidth: 0.5 }}
                                    customStyle={{ paddingVertical: 10 }}
                                    secureTextEntry={false}
                                    placeholder={"Họ và tên"}
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
                                <Text style={{ fontSize: sizes.sText12, paddingTop: 5, color: 'gray' }} >Họ và tên là <Text style={{ fontWeight: 'bold' }}>bắt buộc</Text></Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ status: !this.state.status })} style={{ flexDirection: 'row', alignItems: 'flex-end', paddingTop: 10 }}>
                                <Image
                                    source={status == false ? Images.icUnCheck : Images.icCheck}
                                    resizeMode={'contain'}
                                    style={{
                                        width: reSize(20), height: reSize(20),
                                        tintColor: 'black'
                                    }} />
                                <Text style={{ fontSize: sizes.sText12, paddingHorizontal: 10 }}>Đã kích hoạt</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[nstyles.nrow, { justifyContent: 'space-around', paddingBottom: khoangcach + 10 }]}>
                            <ButtonCus
                                textTitle='Quay lại'
                                onPressB={() => Utils.goback(this)}
                                stContainerR={{ backgroundColor: 'gray', marginRight: 5, borderRadius: 5, width: Width(40) }}
                            />
                            <ButtonCus
                                stContainerR={{ marginLeft: 5 }}
                                textTitle='Thêm tài khoản'
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
