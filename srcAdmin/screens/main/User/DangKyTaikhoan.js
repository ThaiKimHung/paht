import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, TextInput,
    TouchableOpacity, ScrollView, ImageBackground, StatusBar
} from 'react-native';
import { nstyles, Width, Height } from '../../../../styles/styles';
import Utils from '../../../../app/Utils';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { Images } from '../../../images';
import { reText, sizes } from '../../../../styles/size';
import InputCus from '../../../../components/ComponentApps/InputCus';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { colors } from '../../../../styles';
import InputLogin from '../../../../components/ComponentApps/InputLogin';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import InputT from '../../../../components/ComponentApps/InputT';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import apis from '../../../apis';
import { IsLoading } from '../../../../components';
import ModalDrop from '../../PhanAnhHienTruong/components/ModalDrop';
import { appConfig } from '../../../../app/Config';

const Paddingst = Platform.OS == 'ios' ? 10 : 5;
const stLogin = StyleSheet.create({
    contentInput: {

        paddingVertical: Platform.OS == 'ios' ? 5 : 1, backgroundColor: colors.white,
        borderRadius: 30, paddingHorizontal: 10, marginTop: 5,
    },
    textInput: {
        flex: 1, color: colors.black_80, fontSize: sizes.sText14,
        lineHeight: 18,
    },
    textTitle: {
        textAlign: 'center', fontSize: sizes.sText22, color: colors.white, fontWeight: 'bold', marginVertical: 10
    }

});

class DangKyTaiKhoan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            icCheck: 1,
            isError: false,
            value: '',
            objDonVi: this.props.dataDonVi[0],
            txtChucVu: 'Không có',
            txtTenDangNhap: '',
            txtTenNguoiDung: '',
            txtEmail: '',
            txtMatKhau: '',
            txtNhapLMK: '',
            txtSoDienThoai: '',
            ShowMKhau: true,
            ShowMKhau2: true
        }
    }
    componentDidMount = async () => {
        StatusBar.setHidden(true);
        Utils.nlog("gia tri data don vi", this.props.dataDonVi)
    }
    _TaoTaikhoan = async () => {
        nthisIsLoading.show();
        const { isLoading, icCheck, isError, objDonVi,
            txtChucVu,
            txtTenDangNhap,
            txtEmail,
            txtMatKhau,
            txtNhapLMK, txtTenNguoiDung,
            txtSoDienThoai } = this.state
        // if (objDonVi.MaPX == -1) {
        //     nthisIsLoading.hide();
        //     Utils.showMsgBoxOK(this, "Thông báo", "Bạn chọn cấp đơn vị", "Xác nhận");
        //     return;
        // }
        // if (txtChucVu == '') {
        //     nthisIsLoading.hide();
        //     Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập chức vụ", "Xác nhận");
        //     return;
        // }
        if (txtTenNguoiDung == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập họ và tên", "Xác nhận");
            return;
        }
        if (txtTenDangNhap == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập tên đăng nhập", "Xác nhận");
            return;
        }
        if (txtMatKhau == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập mật khẩu", "Xác nhận");
            return;
        }
        if (txtMatKhau.length < 6) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Mật khẩu phải tối thiểu 6 ký tự", "Xác nhận");
            return;
        }
        if (txtNhapLMK == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập xác nhận mật khẩu", "Xác nhận");
            return;
        }
        if (txtNhapLMK != txtMatKhau) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Xác nhận mật khẩu và mật khẩu phải giống nhau", "Xác nhận");
            return;
        }
        var body = {
            _isEditMode: false,
            _isNew: false,
            _isUpdated: false,
            _isDeleted: false,
            _prevState: null,
            _defaultFieldName: "",
            _userId: 0,
            UserName: txtTenDangNhap,
            FullName: txtTenNguoiDung,
            Password: txtMatKhau,
            RePassword: txtNhapLMK,
            PhoneNumber: txtSoDienThoai ? txtSoDienThoai : '',
            TenChucVu: txtChucVu,
            Email: txtEmail ? txtEmail : "",
            // IdCoQuan: objDonVi.MaPX,
            IdGroup: [],
            Change: true,
        }
        const res = await apis.ApiUser.TaoNguoiDung(body);
        Utils.nlog("gia tri tạo tai khoan", res)
        if (res && res.status == 1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Đăng ký tài khoản thành công \n Vui lòng chờ xác nhận để đăng nhập vào hệ thống", "Xác nhận", () => {
                Utils.goback(this);
            })
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Đăng ký tài khoản thất bại", "Xác nhận");
        }
    }
    _setShowPass = () => {
        this.setState({ ShowMKhau: !this.state.ShowMKhau })
    }
    _setShowPass2 = () => {
        this.setState({ ShowMKhau2: !this.state.ShowMKhau2 })
    }
    render() {
        const { nrow, nmiddle } = nstyles
        const { isLoading, icCheck, isError, objDonVi,
            txtChucVu,
            txtTenDangNhap,
            txtEmail, ShowMKhau, ShowMKhau2,
            txtMatKhau,
            txtNhapLMK, txtTenNguoiDung,
            txtSoDienThoai } = this.state
        return (
            <View style={[nstyles.ncontainer,
            { justifyContent: 'center' }]}>
                <View style={{ height: Height(25), justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: sizes.sText22, color: colors.colorTextBlue, fontWeight: 'bold' }}>{`HỆ THỐNG THÔNG TIN\n` + appConfig.TieuDeApp}</Text>
                </View>
                <ImageBackground source={Images.icBgr} style={[nstyles.ncontainer, {}]}>
                    <Text style={stLogin.textTitle}>{`Tạo tài khoản`.toUpperCase()}</Text>
                    <KeyboardAwareScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                        <View style={{ flex: 1, width: '100%' }}>
                            {/* <ModalDrop
                                isDrop={true}
                                value={this.state.objDonVi}
                                keyItem={'MaPX'}
                                texttitle={<Text>Đơn vị <Text style={{ color: colors.redStar }}>*</Text></Text>}
                                dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.sText13 }}
                                options={this.props.dataDonVi}
                                onselectItem={(item) => this.setState({ objDonVi: item })}
                                Name={"TenPhuongXa"} />
                            <View style={{ marginTop: 20 }}>
                                <Text>Chức vụ <Text style={{ color: colors.redStar }}>*</Text></Text>
                                <TextInput
                                    style={{
                                        paddingVertical: Paddingst, marginVertical: 5, paddingHorizontal: 10,
                                        backgroundColor: colors.white, borderRadius: 20
                                    }}

                                    placeholder='Chức vụ'
                                    value={txtChucVu}
                                    onChangeText={(text) => this.setState({ txtChucVu: text })}
                                ></TextInput>
                            </View> */}
                            <View style={{ marginTop: 5 }}>
                                <Text>Họ tên <Text style={{ color: colors.redStar }}>*</Text></Text>
                                <TextInput
                                    style={{
                                        paddingVertical: Paddingst, marginVertical: 5, paddingHorizontal: 10,
                                        backgroundColor: colors.white, borderRadius: 20
                                    }}
                                    placeholder='Họ tên'
                                    value={txtTenNguoiDung}
                                    onChangeText={(text) => this.setState({ txtTenNguoiDung: text })}
                                ></TextInput>
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <Text>Tên đăng nhập <Text style={{ color: colors.redStar }}>*</Text></Text>
                                <TextInput
                                    style={{
                                        paddingVertical: Paddingst, marginVertical: 5, paddingHorizontal: 10,
                                        backgroundColor: colors.white, borderRadius: 20
                                    }}
                                    placeholder='Tên đăng nhập'
                                    value={txtTenDangNhap}
                                    onChangeText={(text) => this.setState({ txtTenDangNhap: text })}
                                ></TextInput>
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <Text>Số điện thoại</Text>
                                <TextInput
                                    style={{
                                        paddingVertical: Paddingst, marginVertical: 5, paddingHorizontal: 10,
                                        backgroundColor: colors.white, borderRadius: 20
                                    }}
                                    placeholder='Số điện thoại'
                                    keyboardType='numeric'
                                    value={txtSoDienThoai}
                                    onChangeText={(text) => this.setState({ txtSoDienThoai: text })}
                                ></TextInput>
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <Text>Email</Text>
                                <TextInput
                                    style={{
                                        paddingVertical: Paddingst, marginVertical: 5, paddingHorizontal: 10,
                                        backgroundColor: colors.white, borderRadius: 20,
                                    }}
                                    keyboardType='email-address'
                                    value={txtEmail}
                                    onChangeText={(text) => this.setState({ txtEmail: text })}
                                    placeholder='Email'
                                ></TextInput>
                            </View>

                            <View style={nstyles.nrow}>
                                <View style={{ marginTop: 5, flex: 1 }}>
                                    <Text>Mật khẩu <Text style={{ color: colors.redStar }}>*</Text></Text>
                                    <InputLogin
                                        value={txtMatKhau}
                                        iconStyle={nstyles.nIcon16}
                                        icon={Images.icPass}
                                        icShowPass={true}
                                        isShowPassOn={ShowMKhau}
                                        iconShowPass={ShowMKhau == true ? Images.icShowPass : Images.icHidePass}
                                        showIcon={true}
                                        secureTextEntry={ShowMKhau}
                                        placeholder={"Nhập mật khẩu"}
                                        setShowPass={this._setShowPass}
                                        onChangeText={text => this.setState({ txtMatKhau: text })}
                                        iconStylePass={{ marginRight: 10, }}
                                        placeholderTextColor={colors.lightGreyBlue}
                                        styleContainer={{ backgroundColor: 'white', borderWidth: 0, borderRadius: 20, paddingVertical: 0 }}
                                        styleInput={{ fontSize: reText(14), fontWeight: 'normal', color: colors.black }}
                                    />
                                </View>
                                <View style={{ marginTop: 5, flex: 1, marginLeft: 3 }}>
                                    <Text>Nhập lại mật khẩu <Text style={{ color: colors.redStar }}>*</Text></Text>
                                    <InputLogin
                                        value={txtNhapLMK}
                                        iconStyle={nstyles.nIcon16}
                                        icon={Images.icPass}
                                        icShowPass={true}
                                        isShowPassOn={ShowMKhau2}
                                        iconShowPass={ShowMKhau2 == true ? Images.icShowPass : Images.icHidePass}
                                        showIcon={true}
                                        secureTextEntry={ShowMKhau2}
                                        placeholder={"Nhập mật khẩu"}
                                        setShowPass={this._setShowPass2}
                                        onChangeText={text => this.setState({ txtNhapLMK: text })}
                                        iconStylePass={{ marginRight: 10, }}
                                        placeholderTextColor={colors.lightGreyBlue}
                                        styleContainer={{ backgroundColor: 'white', borderWidth: 0, borderRadius: 20, paddingVertical: 0 }}
                                        styleInput={{ fontSize: reText(14), fontWeight: 'normal', color: colors.black }}
                                    />
                                </View>
                            </View>

                        </View>
                    </KeyboardAwareScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
                        <ButtonCus
                            stContainerR={{ backgroundColor: colors.colorLightGrayBlue, marginHorizontal: 5, }}
                            onPressB={() => Utils.goback(this)}
                            textTitle={`Quay lại`}
                        >
                        </ButtonCus>
                        <ButtonCus
                            stContainerR={{ marginHorizontal: 5 }}
                            onPressB={this._TaoTaikhoan}
                            textTitle={`Đăng ký`}
                        >
                        </ButtonCus>
                    </View>
                </ImageBackground>
                {/* {
                    isLoading == true ? <ModalLoading enLoading={this._enLoading} /> : <View />
                } */}
                <IsLoading />

            </View >

        );
    }
}
const mapStateToProps = state => ({
    dataNguon: state.GetList_NguonPhanAnh,
    dataChuyenMuc: state.GetList_ChuyenMuc,
    dataMucDo: state.GetList_MucDoAll,
    dataLinhVuc: state.GetList_LinhVuc,
    dataDonVi: state.GetList_DonVi,

});
export default Utils.connectRedux(DangKyTaiKhoan, mapStateToProps, false);
