import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Height, nstyles, Width } from '../../../styles/styles'
import { colors } from '../../../styles'
import Utils from '../../../app/Utils'
import { reText, reSize } from '../../../styles/size'
import { Images } from '../../images'
import { KeyForm } from './KeyForm'
import CompForm from './CompForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isIphoneX } from 'react-native-iphone-x-helper'
import apis from '../../apis'
import moment from 'moment'
import { ConfigScreenDH } from '../../routers/screen'
const FormDangKy = [
    KeyForm.TenDangNhap,
    KeyForm.HoTen,
    KeyForm.GioiTinh,
    KeyForm.NgaySinh,
    KeyForm.SoDienThoai,
    KeyForm.Email,
    KeyForm.QuocTich,
    KeyForm.NguyenQuan,
    KeyForm.DiaChiThuongTru,
    KeyForm.DiaChiHienTai,
    KeyForm.CMND,
    KeyForm.NgayCap,
    KeyForm.NoiCap,
]
export class FormTaoTaiKhoan extends Component {
    constructor(props) {
        super(props)
        this.User = Utils.ngetParam(this, "User");
        this.callback = Utils.ngetParam(this, "callback", () => { })
        this.state = {
            design: FormDangKy, // Nội dung form,
            TenDangNhap: '',
            HoTen: '',
            GioiTinh: 0,
            NgaySinh: '',
            SoDienThoai: '',
            Email: '',
            NguyenQuan: '',
            DiaChiThuongTru: '',
            DiaChiHienTai: '',
            CMND: '',
            NgayCap: '',
            NoiCap: '',
            dataQuocTich: [],
            selectedQuocTich: { Code: "VN", TenQuocTich: "VIET NAM" },
        }
    }

    componentDidMount = () => {
        this.getListQuocTich()
        this.getInfoAccount()
        Utils.nlog("this.User", this.User)
    }

    getInfoAccount = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetDetail_ThongTinCaNhanXPHC(this.User)
        Utils.nlog("data user", res)
        if (res.status == 1) {
            this.setState({
                TenDangNhap: res.data.CMND,
                HoTen: res.data.FullName,
                GioiTinh: res.data.GioiTinh,
                NgaySinh: res.data.NgaySinh ? res.data.NgaySinh : '',
                SoDienThoai: res.data.PhoneNumber,
                Email: res.data.Email,
                selectQuocTich: { Code: res.data.QuocTich, TenQuocTich: res.data.TenQuocTich },
                NguyenQuan: res.data.NguyenQuan,
                DiaChiThuongTru: res.data.DKHKThuongTru,
                DiaChiHienTai: res.data.DiaChiHienTai,
                CMND: res.data.CMND,
                NgayCap: res.data.NgayCap ? res.data.NgayCap : '',
                NoiCap: res.data.NoiCap,
            })
        }
    }
    getListQuocTich = async () => {
        let res = await apis.ApiApp.GetList_QuocTich()
        if (res.status == 1) {
            this.setState({ dataQuocTich: res.data })
        }
        else { this.setState({ dataQuocTich: [] }) }
    }

    _DangKyTaiKhoan = async () => {
        const { design = [], TenDangNhap, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, NguyenQuan, DiaChiThuongTru, DiaChiHienTai,
            CMND, NgayCap, NoiCap, selectedQuocTich } = this.state;

        if (design.includes(1)) {
            //check họn và tên
            if (!TenDangNhap) {
                Utils.showMsgBoxOK(this, 'Thông báo', "Bạn chưa nhập tên đăng nhập", "Xác nhận");
                return;
            }
        }
        if (design.includes(2)) {
            //check họn và tên
            if (!HoTen) {
                Utils.showMsgBoxOK(this, 'Thông báo', "Bạn chưa nhập Họ và tên", "Xác nhận");
                return;
            } else {
                const name = HoTen;
                const index = name.lastIndexOf(' ');
                if (index != -1) {
                    // this.name = name.slice(index).trim();
                    // this.surname = name.slice(0, index).trim();
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', "Vui lòng nhập đầy đủ họ và tên", 'Đồng ý');
                    return;
                };
            };
        }
        if (design.includes(6)) {
            if (Email && Utils.validateEmail(Email) == false) {
                Utils.showMsgBoxOK(this, 'Thông báo', "Email không hợp lệ", "Xác nhận");
                return;
            }
        }
        if (design.includes(8)) {
            if (!NguyenQuan) {
                Utils.showMsgBoxOK(this, 'Thông báo', "Bạn chưa nhập nguyên quán", "Xác nhận");
                return;
            }
        }
        if (design.includes(9)) {
            if (!DiaChiThuongTru) {
                Utils.showMsgBoxOK(this, 'Thông báo', "Bạn chưa nhập địa chỉ thường trú", "Xác nhận");
                return;
            }
        }
        if (design.includes(10)) {
            if (!DiaChiHienTai) {
                Utils.showMsgBoxOK(this, 'Thông báo', "Bạn chưa nhập địa chỉ hiện tại", "Xác nhận");
                return;
            }
        }

        let body = {
            "UserName": TenDangNhap,
            "FullName": HoTen ? HoTen : '',
            "GioiTinh": GioiTinh,
            "NgaySinh": NgaySinh,
            "PhoneNumber": SoDienThoai ? SoDienThoai : '',
            "Email": Email ? Email : '',
            "QuocTich": selectedQuocTich.Code,
            "NguyenQuan": NguyenQuan ? NguyenQuan : '',
            "HKTT": DiaChiThuongTru ? DiaChiThuongTru : '',
            "DiaChi": DiaChiHienTai ? DiaChiHienTai : '',
            "CMND": CMND,
            "NgayCap": NgayCap,
            "NoiCap": NoiCap ? NoiCap : '',
        }
        let bodycapNhap = {
            ...body,
            "CMND": this.User ? this.User : '',
        }
        Utils.nlog("Body đăng ký tài khoản:", JSON.stringify(bodycapNhap))

        if (this.User == '') {
            var res = await apis.ApiXuLyHanhChinh.TaoTaiKhoanCongDanXPHC(body);
        }
        else {
            var res = await apis.ApiXuLyHanhChinh.CapNhatTKCongDan(bodycapNhap);
        }
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, "Thông báo", this.User == '' ? "Đăng ký thành công" : "Cập nhật tài khoản thành công", "Xác nhận", () => {
                this.callback(res.data);
                this._goback()
            });
        }
        else {
            Utils.showMsgBoxOK(this, "Thông báo", res.error.message, 'Xác nhận');
        }
    }



    _goback = () => {
        Utils.goback(this);
    }
    onChangeGT = (vals = 0) => {
        this.setState({ GioiTinh: vals })
    }

    _TaoMoi = () => {
        this.User = ''
        this.setState({
            TenDangNhap: '',
            HoTen: '',
            GioiTinh: '',
            NgaySinh: '',
            SoDienThoai: '',
            Email: '',
            selectedQuocTich: { Code: "VN", TenQuocTich: "VIET NAM" },
            NguyenQuan: '',
            DiaChiThuongTru: '',
            DiaChiHienTai: '',
            CMND: '',
            NgayCap: '',
            NoiCap: '',
        })
    }

    _viewItem = (item, keyView) => {
        return (
            <View key={item.Id} style={{
                flex: 1,
                paddingVertical: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.brownGreyTwo }} >{`${item[keyView]}`}</Text>
            </View>
        )
    }

    _dropDown = (indexForm) => {
        switch (indexForm) {
            case KeyForm.QuocTich:
                Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                    callback: (val) => this.onChangeTextIndex(val, KeyForm.QuocTich), item: this.state.selectedQuocTich, key: 'TenQuocTich',
                    AllThaoTac: this.state.dataQuocTich, ViewItem: (item) => this._viewItem(item, 'TenQuocTich'), Search: true
                })
                break
            default:
                break;
        }
    }


    _renderDesignForm = (idRender) => {
        let { design, TenDangNhap, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, selectedQuocTich, NguyenQuan, DiaChiThuongTru, DiaChiHienTai, CMND, NgayCap, NoiCap } = this.state
        let keyRender = design.findIndex(Key => Key === idRender);
        if (keyRender >= 0) {
            switch (design[keyRender]) {
                case KeyForm.TenDangNhap:
                    return <CompForm.CompTenDangNhap maxlength={10} value={TenDangNhap} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.TenDangNhap)} />
                case KeyForm.HoTen:
                    return <CompForm.CompHoTen value={HoTen} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.HoTen)} />
                case KeyForm.GioiTinh:
                    return <CompForm.CompGioiTinh value={GioiTinh} onChangeGT={this.onChangeGT} isEdit={true} />
                case KeyForm.NgaySinh:
                    return <CompForm.CompNgaySinh value={NgaySinh} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NgaySinh)} isEdit={true} />
                case KeyForm.SoDienThoai:
                    return <CompForm.CompSoDienThoai maxlength={10} value={SoDienThoai} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.SoDienThoai)} />
                case KeyForm.Email:
                    return <CompForm.CompEmail value={Email} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.Email)} />
                case KeyForm.QuocTich:
                    return <CompForm.CompQuocTich value={selectedQuocTich.TenQuocTich} onPress={() => this._dropDown(KeyForm.QuocTich)} isEdit={true} />
                case KeyForm.NguyenQuan:
                    return <CompForm.CompNguyenQuan value={NguyenQuan} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NguyenQuan)} />
                case KeyForm.DiaChiThuongTru:
                    return <CompForm.CompDiaChiThuongTru value={DiaChiThuongTru} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.DiaChiThuongTru)} />
                case KeyForm.DiaChiHienTai:
                    return <CompForm.CompNhapDiaChiHienTai value={DiaChiHienTai} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.DiaChiHienTai)} />
                case KeyForm.CMND:
                    return <CompForm.CompCMND maxlength={12} value={CMND} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.CMND)} />
                case KeyForm.NgayCap:
                    return <CompForm.CompNgayCap value={NgayCap} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NgayCap)} isEdit={true} />
                case KeyForm.NoiCap:
                    return <CompForm.CompNoiCap value={NoiCap} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NoiCap)} />

                default:
                    break;
            }
        }
    }

    onChangeTextIndex = (val, index) => {
        switch (index) {
            case KeyForm.TenDangNhap:
                this.setState({ TenDangNhap: val })
                break;
            case KeyForm.HoTen:
                this.setState({ HoTen: val })
                break;
            case KeyForm.NgaySinh:
                this.setState({ NgaySinh: val })
                break;
            case KeyForm.SoDienThoai:
                this.setState({ SoDienThoai: val })
                break;
            case KeyForm.Email:
                this.setState({ Email: val })
                break;
            case KeyForm.QuocTich:
                this.setState({ selectedQuocTich: val })
                break;
            case KeyForm.NguyenQuan:
                this.setState({ NguyenQuan: val })
                break;
            case KeyForm.DiaChiThuongTru:
                this.setState({ DiaChiThuongTru: val })
                break;
            case KeyForm.DiaChiHienTai:
                this.setState({ DiaChiHienTai: val })
                break;
            case KeyForm.CMND:
                this.setState({ CMND: val })
                break;
            case KeyForm.NgayCap:
                this.setState({ NgayCap: val })
                break;
            case KeyForm.NoiCap:
                this.setState({ NoiCap: val })
                break;
            default:
                break;
        }
    }

    render() {
        Utils.nlog("------------>:", this.User)
        // Utils.nlog("Thông tin:", this.state.SoDienThoai)
        return (
            // onTouchEnd={this._goback}
            <View style={{ backgroundColor: `transparent`, justifyContent: 'flex-end', flex: 1 }}>
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1, height: Height(90) }}>
                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', paddingBottom: 20 }}>
                        <TouchableOpacity onPress={this._goback}>
                            <Image source={Images.icBack} style={{ tintColor: colors.colorTextBlue, marginLeft: 15 }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.colorTextBlue, marginLeft: -25 }}>TÀI KHOẢN CÔNG DÂN</Text>
                        <View></View>
                    </View>

                    <KeyboardAwareScrollView style={{ backgroundColor: 'white' }} contentContainerStyle={{ paddingBottom: isIphoneX() ? 30 : 5 }} showsVerticalScrollIndicator={false}>
                        {/* {design.map(val => {
                            return <View key={val}>
                                {this._renderDesignForm(val)}
                            </View>
                        })} */}
                        {this._renderDesignForm(KeyForm.TenDangNhap)}
                        {this._renderDesignForm(KeyForm.HoTen)}
                        {this._renderDesignForm(KeyForm.GioiTinh)}
                        {this._renderDesignForm(KeyForm.NgaySinh)}
                        {this._renderDesignForm(KeyForm.SoDienThoai)}
                        {this._renderDesignForm(KeyForm.Email)}
                        {this._renderDesignForm(KeyForm.QuocTich)}
                        {this._renderDesignForm(KeyForm.NguyenQuan)}
                        {this._renderDesignForm(KeyForm.DiaChiThuongTru)}
                        {this._renderDesignForm(KeyForm.DiaChiHienTai)}
                        {this._renderDesignForm(KeyForm.CMND)}
                        {this._renderDesignForm(KeyForm.NgayCap)}
                        {this._renderDesignForm(KeyForm.NoiCap)}

                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <TouchableOpacity style={{
                                justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10,
                                backgroundColor: colors.colorPink, borderRadius: 5, minWidth: Width(35), alignSelf: 'center', marginVertical: 25, marginRight: 10
                            }}
                                onPress={this._TaoMoi}>
                                <Text style={{ color: colors.white, fontSize: reText(15), fontWeight: '500' }}>Làm mới</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10,
                                backgroundColor: colors.colorTextBlue, borderRadius: 5, minWidth: Width(35), alignSelf: 'center', marginVertical: 25
                            }}
                                onPress={this._DangKyTaiKhoan}>
                                <Text style={{ color: colors.white, fontSize: reText(15), fontWeight: '500' }}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View >
        )
    }
}

export default FormTaoTaiKhoan