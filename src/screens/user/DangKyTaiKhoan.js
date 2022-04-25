import React, { Component, Fragment, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Dimensions, Platform, Image, BackHandler } from 'react-native';
import HeaderCom from '../../../components/HeaderCom';
import { colors, nstyles, sizes } from '../../../styles';
import { Images } from '../../images';
import ButtonCom from '../../../components/Button/ButtonCom';
import { ScrollView } from 'react-native-gesture-handler';
import InputCheckCus from '../../../components/ComponentApps/InputCheckCus';
import Utils from '../../../app/Utils';
import Api from '../../apis';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import ModalLoading from './ModalLoading';
import { nkey } from '../../../app/keys/keyStore';
import apis from '../../apis';
import { appConfig } from '../../../app/Config';
import LottieView from 'lottie-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HtmlViewCom from '../../../components/HtmlView';
import moment from 'moment';

import { Width, Height, nwidth, nheight, versionIOS_12 } from '../../../styles/styles';
import { reSize, reText } from '../../../styles/size';
import ComponentIndex from './ComponentForm';
import { AvatarUser, HeaderCus, IsLoading } from '../../../components';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { Alert } from 'react-native';
import { TYPES } from './dangky/Component';
import ThongTinDiaChi from './dangky/ThongTinDiaChi';
import CryptoJS from 'crypto-js'
import QRCode from 'react-native-qrcode-svg';
import InfoTiemChung from './InfoTiemChung';
import BtnThongBaoChuyenBienNang from './BtnThongBaoChuyenBienNang';
import NetInfo from "@react-native-community/netinfo";

const listComDiaChi = [
    {
        id: 1,
        name: 'Tỉnh',
        type: TYPES.DropDown,
        check: false,
        key: 'tinh',
        placehoder: '- Chọn tỉnh -',
        errorText: '',
        helpText: '',
        isRow: true,
        isEnd: false,
        keyView: 'TenTinhThanh'
    },
    {
        id: 2,
        name: 'Huyện',
        type: TYPES.DropDown,
        check: false,
        key: 'huyen',
        placehoder: '- Chọn quận/huyện -',
        errorText: '',
        helpText: '',
        isRow: true,
        isEnd: true,
        keyView: 'TenQuanHuyen'
    },
    {
        id: 3,
        name: 'Xã',
        type: TYPES.DropDown,
        check: true,
        key: 'IdDonVi',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenXaPhuong'
    }

    // },
    // {
    //     id: 4,
    //     name: 'Địa chỉ',
    //     type: TYPES.TextInput,
    //     check: true,
    //     key: 'DiaChi11',
    //     placehoder: 'Nhập số nhà ngõ đường phố',
    //     errorText: '',
    //     helpText: ''
    // }
]

const TextLine = (props) => {
    let { title = '', value = '' } = props
    return (
        <>
            <View {...props} style={{
                flexDirection: 'row', backgroundColor: colors.white,
                alignItems: 'center', padding: 3,
                paddingHorizontal: 10, borderRadius: 15
            }}>
                <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{title}: </Text>
                <Text style={{ flex: 1, textAlign: 'right', paddingVertical: 8 }}>{value}</Text>
            </View>
            <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
        </>

    )
}

const stLogin = StyleSheet.create({
    contentInput: {
        fontWeight: '600',
        backgroundColor: 'transparent',
        color: colors.black_80,
    },
    textThongbao: {
        color: colors.black_20,
        fontSize: sizes.sText18,
        fontWeight: '600'
    }
});
const dataTypeDD = [
    {
        Id: 1,
        Name: 'Chứng minh nhân dân 9 số'
    },
    {
        Id: 2,
        Name: 'Căn cước công dân 12 số'
    }
]

/* 
chú thích component
 -1 logo
 0 chọn avatar
 1 họ và tên
 2 ngày sinh
 3 giới tính
 4 loại số căn cước 9 hoặc 12
 5 số căn cước
 6 ngày cấp cmnd
 7 nơi cấp cmnd
 8 nhập mk
 9 nhập lại mk
 10 số điện thoại
 11 email
 12 quốc tịch
 13 dân tộc
 14 tôn giáo
 15 dịa chỉ thường trú
 16 username
*/

// UserName: PhoneNumber,
// FullName: UserName,
// Password,
// RePassword: Password,
var defaultUB = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 10, 15, 11] //[-2, -1, 16, 1, 8, 9]
var defaultVTNOUB = [-2, 0, 1, 2, 3, 4, 5, 6, 7, 10, 15, 11] //[-2, 16, 1]
var defaultReq = [0, 1, 2, 3, 4, 5, 6, 7, 10, 15, 11] //[16, 1, 8, 9]
var defaultVT = [-2, 0, 1, 2, 3, 5, 8, 9, 10, 11, 12, 13, 14, 15]
var defaultVTNODK = [-2, 0, 1, 2, 3, 5, 11, 12, 13, 14, 15]
class DangKyTaiKhoan extends Component {
    constructor(props) {
        super(props);
        //--Config động các trường ĐK
        let configDKTemp = Utils.getGlobal(nGlobalKeys.optionRegister);
        // let configDKTemp = '[-2, -1, 16, 1, 8, 9]|[-2, 16, 1, 5, 15]|[16, 1, 8, 9,5,15]'
        if (configDKTemp && configDKTemp != '') {
            configDKTemp = configDKTemp.split('|');
            defaultUB = JSON.parse(configDKTemp[0] ? configDKTemp[0] : []);
            defaultVTNOUB = JSON.parse(configDKTemp[1] ? configDKTemp[1] : []);
            defaultReq = JSON.parse(configDKTemp[2] ? configDKTemp[2] : []);
        }
        //-----------
        this.checkPass = false;
        this.checkMK = false;
        this.checkSDT = false;

        this.formRegister = Utils.getGlobal(nGlobalKeys.formRegister); //Để phẩn biệt form đơn giản và phức tạp
        this.isDichBenh = Utils.getGlobal(nGlobalKeys.isDichBenh);
        // nthis={this} 
        if (props.nthis != null) {
            this.nthis = props.nthis
        } else {
            this.nthis = this
        }
        this.isDangky = true
        if (props.isDangKy != undefined || props.isDangKy != null) {
            this.isDangky = props.isDangKy
        }
        this.isOTP = Utils.getGlobal(nGlobalKeys.isOTP, true);
        let tempDesign = this.isDangky ? defaultUB : defaultVTNOUB;
        ROOTGlobal['haveEmail'] = tempDesign.includes(11);
        this.refTTDiaChi = React.createRef(null);
        const { userCD } = this.props.auth;
        this.state = {
            design: tempDesign,
            bs: false,
            selected: true,
            ShowPassword: true,
            ShowRePass: true,
            Id: '',
            Mk: '',
            Email: '',
            Sdt: '',
            NgaySinh: '',
            HvaT: '',
            Gt: 0,
            checkId: true,
            checkMK: true,
            checkResPass: true,
            checkHoTen: true,
            checkEmail: true,
            checkNgaySinh: true,
            dateTemp: "",//moment(),
            isLoading: false,
            RePassword: '',
            isDangKy: true,
            sdtXacThuc: '',
            policyData: "",
            isPolicy: false,
            isAccept: false,
            isAvatar: true,

            isGioiTinh: 0,
            //state mới
            avatarSource: '',
            //---State Defaul Save Cache Offline
            hoten: userCD?.FullName,
            ngaysinh: userCD?.NgaySinh,
            gioitinh: userCD?.GioiTinh,
            socmnd: userCD?.CMND,
            ngaycap: userCD?.NgayCap,
            noicap: userCD?.NoiCap,
            dienthoai: userCD?.PhoneNumber,
            email: userCD?.Email,
            diachithuongtru: userCD?.DiaChi,
            //---
            validhoten: true,
            typedinhdanh: dataTypeDD[1],
            matkhau: '',
            nhaplaimatkhau: '',
            quoctich: '',
            dantoc: '',
            tongiao: '',
            latlongDiaChi: {},
            showPass: false,
            showRepas: false,
            username: '',
            listQuocTich: [],
            listDanToc: [],
            listTonGiao: [],
            dataThongTin: {},
            isChangeImage: false,
            HeighIMG: 2000, WidthIMG: 2000,
            isFB: 0,// phân biệt login bằng fb nếu ==6 là FB
            tinhtp: '',
            quanhuyen: '',
            phuongxa: '',
            listTinh: [],
            listQuanHuyen: [],
            listPhuongXa: [],
            QRCode: '',
            tinh: '',
            quan: '',
            phuong: '',
            AnhCMNDT: '',
            AnhCMNDS: ''
        };
        this.refLoading = React.createRef(null);
        this.showQR_InfoCD = Utils.getGlobal(nGlobalKeys.showQR_InfoCD, false)
    }
    _getPolicy = async () => {
        const res = await apis.ApiApp.GetDeailTrangTinh();
        if (res.status == 1 && res.data) {
            this.setState({ policyData: res.data.NoiDung, })
        } else {
            this.setState({ isAccept: true });
        }
    }
    getQuocTich = async () => {
        let res = await apis.ApiApp.GetListQuocTich(true);
        // Utils.nlog("giá trị res quốc tịch----------", res)
        if (res.status == 1) {
            let dataQG = res.data.find(item => item.Id == 241)
            this.setState({ listQuocTich: res.data, quoctich: dataQG }, this.GetListDanToc)
        }
    }
    GetListDanToc = async () => {
        let res = await apis.ApiApp.GetListDanToc(true);
        Utils.nlog("giá trị res dân tộc----------", res)
        if (res.status == 1) {
            this.setState({ listDanToc: res.data, dantoc: res.data[0] }, this.GetListTonGiao)
        }
    }
    GetListTonGiao = async () => {
        let res = await apis.ApiApp.GetListTonGiao(true);
        Utils.nlog("giá trị res tôn giáo----------", res)
        if (res.status == 1) {
            this.setState({ listTonGiao: res.data, tongiao: res.data[0] }, () => {
                if (this.isDangky == false) {
                    this.getThongTin();
                }
            })
        }
    }
    getData = async () => {
        await this.getQuocTich();
        await this.GetTinhThanhPho();
    }
    getThongTin = async () => {
        // nthisIsLoading.show();
        this.refLoading.current.show();
        let IdUser = await Utils.getGlobal(nGlobalKeys.Id_user, '');
        let res = await Api.ApiUser.GetInFoUser(IdUser)
        this.refLoading.current.hide();
        const { listQuocTich = [],
            listDanToc = [],
            listTonGiao = [] } = this.state
        Utils.nlog("gia trị get info user-----------", res)
        if (res.status == 1) {
            let { data } = res;
            this.props.SetUserApp(AppCodeConfig.APP_CONGDAN, data)
            this.setState({
                isFB: data.FromReference,
                avatarSource: data.FromReference == 6 ? data.Avata : appConfig.domain + data.Avata,
                hoten: data.FullName,
                ngaysinh: data.NgaySinh,
                gioitinh: data.GioiTinh,
                // typedinhdanh: '',
                socmnd: data?.CMND ? data.CMND : data?.CachLy ? data.CachLy.CMND : '',
                ngaycap: data.NgayCap,
                noicap: data.NoiCap,
                dienthoai: data.PhoneNumber,
                email: data.Email,
                quoctich: listQuocTich.find(item => item.Id == data.QuocTich) ? listQuocTich.find(item => item.Id == data.QuocTich) : {},
                dantoc: listDanToc.find(item => item.Id == data.DanToc) ? listDanToc.find(item => item.Id == data.DanToc) : {},
                tongiao: listTonGiao.find(item => item.Id == data.TonGiao) ? listTonGiao.find(item => item.Id == data.TonGiao) : {},
                diachithuongtru: data?.DiaChi ? data.DiaChi : data?.CachLy ? data.CachLy.DiaChi : '',
                showPass: false,
                showRepas: false,
                username: data.Username,
                //--SET STATE DEFAULT--
                isChangeImage: false,
                dataThongTin: data,
                refreshing: false,
                AnhCMNDT: data?.AnhCMNDT || '',
                AnhCMNDS: data?.AnhCMNDS || ''
            })
            const { CachLy } = data
            this.setState({
                tinhtp: { IDTinhThanh: CachLy?.IDTinhThanh, TenTinhThanh: CachLy?.TenTinhThanh },
                quanhuyen: { IDQuanHuyen: CachLy?.IDQuanHuyen, TenQuanHuyen: CachLy?.TenQuanHuyen },
                phuongxa: { IdXaPhuong: CachLy?.IDXaPhuong, TenXaPhuong: CachLy?.TenXaPhuong },
                latlongDiaChi: { lat: CachLy?.ToaDoX, lng: CachLy?.ToaDoY }
            }, () => {
                this.GetTinhThanhPho()
                // this.GetQuanHuyen()
                // this.GetPhuongXa()
            })
        } else {
            // Utils.showMsgBoxOK(this, "Thông báo", "Lấy thông tin tài khoản thất bại")
            // this.props.LogoutApp(AppCodeConfig.APP_CONGDAN)
            // this.props.LogoutApp(AppCodeConfig.APP_ADMIN)
            // this.props.LogoutApp(AppCodeConfig.APP_DVC)
            // this.props.Set_Menu_CanBo([], '')
            // this.props.Set_Menu_CongDong([])

            // Utils.setGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN)
            // Utils.setGlobal(nGlobalKeys.Id_user, '', AppCodeConfig.APP_ADMIN)
            // await Utils.nsetStore(nkey.loginToken, '', AppCodeConfig.APP_ADMIN);
            // await Utils.nsetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);

            // this.setState({ isLoading: false })
            // Utils.setGlobal(nGlobalKeys.loginToken, '');
            // Utils.setGlobal(nGlobalKeys.Id_user, '');
            // Utils.setGlobal(nGlobalKeys.Email, '');
            // Utils.setGlobal(nGlobalKeys.NumberPhone, '');

            // await Utils.nsetStore(nkey.loginToken, '');
            // Utils.nsetStore(nkey.token, '');
            // Utils.nsetStore(nkey.Id_user, '');
            // // Utils.nsetStore(nkey.Email, '');
            // Utils.nsetStore(nkey.NumberPhone, '');
            // await Utils.nsetStore(nkey.TimeTuNgay, '');
            // // this._CapNhatAvatar(false)
            // //Logout Tay Ninh
            // await Utils.nsetStore(nkey.TokenSSO, '')
            // await Utils.nsetStore(nkey.UseCookieSSO, true)
            // await Utils.nsetStore(nkey.InfoUserSSO, '')
            // Utils.setGlobal(nGlobalKeys.TokenSSO, '');
            // Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
            // Utils.setGlobal(nGlobalKeys.UseCookieSSO, true);
            // //
            // Utils.goscreen(this, "tab_Person");
            this.props.logoutAppCheckInterNet(true)
            NetInfo.fetch().then(async (state) => {
                if (state.isConnected) {
                    Utils.goback(this);
                }
            })
        }
    }

    GetTinhThanhPho = async () => {
        let res = await apis.ApiDVC.GetTinhThanhPho()
        Utils.nlog('[LOG] res tinh thanh', res)
        if (res && res.length > 0) {
            this.setState({ listTinh: res })
        } else {
            this.setState({ listTinh: [] })
        }
    }

    GetQuanHuyen = async () => {
        let res = await apis.ApiDVC.GetQuanHuyen(this.state.tinhtp ? this.state.tinhtp.IDTinhThanh : -1)
        Utils.nlog('[LOG] res quan huyen', this.state.tinhtp.IDTinhThanh, res)
        if (res && res.length > 0) {
            this.setState({ listQuanHuyen: res, quanhuyen: res[0] }, this.GetPhuongXa)
        } else {
            this.setState({ listQuanHuyen: [], quanhuyen: '' }, this.GetPhuongXa)
        }
    }

    GetPhuongXa = async () => {
        let res = await apis.ApiDVC.GetPhuongXa(this.state.quanhuyen ? this.state.quanhuyen.IDQuanHuyen : -1)
        Utils.nlog('[LOG] res phuong xa', this.state.quanhuyen.IDQuanHuyen, res)
        if (res && res.length > 0) {
            this.setState({ listPhuongXa: res, phuongxa: res[0] })
        } else {
            this.setState({ listPhuongXa: [], phuongxa: '' })
        }
    }

    async componentDidMount() {
        Utils.nlog("LOG configDKTemp:", Utils.getGlobal(nGlobalKeys.optionRegister))
        Utils.nlog("[refTTDiaChi]:", this.refTTDiaChi)
        await this.getData();
        if (this.isDangky)
            this._getPolicy();
        else
            await this.getThongTin();

        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this.nthis)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }



    _checkMail = (val) => {
        return Utils.validateEmail(val)
    }

    _checkHoTen = (val) => {
        const name = val.trim();
        const index = name.lastIndexOf(' ');
        if (index != -1) {
            return true;
            // this.name = name.slice(index).trim();
            // this.surname = name.slice(0, index).trim();
        } else {
            return false
            // Utils.showMsgBoxOK(this, 'Thông báo', '', RootLang.lang.ok);
        };
    }

    replaceDau_KhoangTrang = (val) => {
        if (val.trim()) {
            val = val.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            val = val.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            val = val.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            val = val.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            val = val.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            val = val.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            val = val.replace(/đ/g, "d");
            val = val.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            val = val.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            val = val.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            val = val.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            val = val.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            val = val.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            val = val.replace(/Đ/g, "D");
            // Some system encode vietnamese combining accent as individual utf-8 characters
            // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
            val = val.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
            val = val.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
            // Bỏ các khoảng trắng liền nhau
            val = val.replace(/ + /g, " ");
            val = val.trim();
        }
        return val;
    }

    _checkMK = (val) => {
        let check = null;
        if (val.trim()) {
            val = this.replaceDau_KhoangTrang(val);
            check = Utils.validateMK(val);
            this.checkMK = !check
            return check

        } else {
            this.checkMK = true;
            return check
        }

    }
    _checkRePassword = (val) => {
        const rePass = val.trim();
        if (rePass == this.state.matkhau.trim()) {
            this.checkPass = false;
            return true;
        } else {
            this.checkPass = true;
            return false;
        };
    }

    onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1: {
                this.setState({ hoten: val })
            } break;
            case 2: {
                this.setState({ ngaysinh: val })
            } break;
            case 3: {
                this.setState({ ngaycap: val })
            } break;
            case 4: {
                this.setState({ noicap: val })
            } break;
            case 5: {
                this._checkMK(val);
                this.setState({ matkhau: val })
            } break;
            case 6: {
                // this._checkRePassword(val)
                this.setState({ nhaplaimatkhau: val })
            } break;
            case 7: {
                const check = Utils.validatePhone(val)
                this.checkSDT = !check;
                this.setState({ dienthoai: val })
            } break;
            case 8: {
                this.setState({ email: val })
            } break;
            case 9: {
                this.setState({ diachithuongtru: val.val, latlongDiaChi: val.location })
            } break;
            case 10: {
                this.setState({ socmnd: val })
            } break;
            case 11: {
                Utils.nlog('val lue quoc tich', val)
                this.setState({ quoctich: val })
            } break;
            case 12: {
                this.setState({ dantoc: val })
            } break;
            case 13: {
                this.setState({ tongiao: val })
            } break;
            case 14: {
                this.setState({ typedinhdanh: val })
            } break;
            case 15: {

                this.setState({ username: val })
            } break;
            case 17: {
                this.setState({ tinhtp: val }, this.GetQuanHuyen)
            } break;
            case 18: {
                this.setState({ quanhuyen: val }, this.GetPhuongXa)
            } break;
            case 19: {
                this.setState({ phuongxa: val })
            } break;
            default:
                break;
        }
    }

    _callback = (val) => {
        this.setState({ quoctich: val });
    }
    _viewItem = (item) => {
        return (
            <View key={item.Id} style={{
                flex: 1,
                paddingVertical: 15,
                // borderBottomWidth: 0.5,
                // borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item.Name}</Text>
            </View>
        )
    }

    _viewItemCustom = (item, key, value,) => {
        return (
            <View key={item[`${key}`]} style={{
                flex: 1,
                paddingVertical: 15,
                // borderBottomWidth: 0.5,
                // borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[`${value}`]}</Text>
            </View>
        )
    }
    _dropDown = (id) => {
        switch (id) {
            case 1:
                Utils.goscreen(this.nthis, 'Modal_ComponentSelectProps', {
                    callback: (val) => this.onChangeTextIndex(val, 11), item: this.state.quoctich,
                    AllThaoTac: this.state.listQuocTich, ViewItem: this._viewItem, Search: true,
                    title: 'Danh sách quốc tịch',
                })
                break;
            case 2: {
                Utils.goscreen(this.nthis, 'Modal_ComponentSelectProps', {
                    callback: (val) => this.onChangeTextIndex(val, 12), item: this.state.dantoc,
                    AllThaoTac: this.state.listDanToc, ViewItem: this._viewItem, Search: true,
                    title: 'Danh sách dân tộc',
                })
            } break;
            case 3: {
                Utils.goscreen(this.nthis, 'Modal_ComponentSelectProps', {
                    callback: (val) => this.onChangeTextIndex(val, 13), item: this.state.tongiao,
                    AllThaoTac: this.state.listTonGiao, ViewItem: this._viewItem,
                    title: 'Danh sách tôn giáo',
                })
            } break;
            case 4: {
                Utils.goscreen(this.nthis, 'Modal_ComponentSelectProps', {
                    callback: (val) => this.onChangeTextIndex(val, 14), item: this.state.typedinhdanh,
                    AllThaoTac: dataTypeDD, ViewItem: this._viewItem,
                    title: 'Danh sách loại',
                })
            } break;
            case 17: {
                Utils.goscreen(this.nthis, 'Modal_ComponentSelectProps', {
                    callback: (val) => this.onChangeTextIndex(val, 17), item: this.state.tinhtp,
                    AllThaoTac: this.state.listTinh, ViewItem: this._viewItemCustom, Search: true,
                    title: 'Danh sách tỉnh/thành phố', key: 'TenTinhThanh', KeyID: 'IDTinhThanh', ValueID: 'TenTinhThanh'
                })
            }
                break;
            case 18: {
                if (this.state.tinhtp && this.state.tinhtp.IDTinhThanh) {
                    Utils.goscreen(this.nthis, 'Modal_ComponentSelectProps', {
                        callback: (val) => this.onChangeTextIndex(val, 18), item: this.state.quanhuyen,
                        AllThaoTac: this.state.listQuanHuyen, ViewItem: this._viewItemCustom, Search: true,
                        title: 'Danh sách quận/huyện', key: 'TenQuanHuyen', KeyID: 'IDQuanHuyen', ValueID: 'TenQuanHuyen'
                    })
                } else {
                    Alert.alert('Thông báo', 'Vui lòng chọn tỉnh/thành phố.')
                }
                break;
            }
            case 19: {
                if (this.state.quanhuyen && this.state.quanhuyen.IDQuanHuyen) {
                    Utils.goscreen(this.nthis, 'Modal_ComponentSelectProps', {
                        callback: (val) => this.onChangeTextIndex(val, 19), item: this.state.phuongxa,
                        AllThaoTac: this.state.listPhuongXa, ViewItem: this._viewItemCustom, Search: true,
                        title: 'Danh sách phường/xã', key: 'TenXaPhuong', KeyID: 'IdXaPhuong', ValueID: 'TenXaPhuong'
                    })
                } else {
                    Alert.alert('Thông báo', 'Vui lòng chọn quận/huyện.')
                }
                break;
            }
            default:
                break;
        }

    }
    renderItemDesign = (id) => {
        const {
            design = [],
            hoten, ngaysinh, gioitinh,
            typedinhdanh, ngaycap, noicap,
            matkhau, nhaplaimatkhau,
            dienthoai, email, quoctich,
            dantoc, tongiao, diachithuongtru, socmnd, showPass,
            showRepass, avatarSource, username, tinhtp, quanhuyen,
            phuongxa
        } = this.state;

        let index = design.findIndex(d => d === id);
        if (index >= 0) {
            switch (id) {
                case -2: {
                    if (this.props.hideHeader) {
                        return null
                    } else {
                        return <HeaderCus
                            title={this.isDangky ? 'Đăng ký tài khoản' : 'Thông tin tài khoản'}
                            styleTitle={{ color: colors.white }}
                            iconLeft={Images.icBack}
                            Sleft={{ tintColor: colors.white }}
                            onPressLeft={() => Utils.goback(this)}
                        />
                    }
                }
                case -1: {
                    return (<LottieView source={require('../../images/welcome.json')}
                        style={{ width: nwidth(), height: nheight() / 4, justifyContent: "center", alignSelf: 'center' }}
                        loop={true}
                        autoPlay={true} />)
                }
                case 0: {
                    {
                        return (<View pointerEvents={this.props.OnEdit || this.isDangky == true ? 'auto' : 'none'} style={{ alignItems: 'center', marginTop: 10 }}>
                            <AvatarUser
                                onEdit={this._chooseAvatar}
                                uriAvatar={avatarSource}
                                colorIcon={this.props.theme.colorLinear.color[0]}
                                style={{ marginBottom: 10 }}
                            />
                        </View>)
                    }
                }
                case 1:
                    return <ComponentIndex.ComponentHVT isReq={defaultReq.includes(id)} value={hoten} onChangTextIndex={(val) => this.onChangeTextIndex(val, 1)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 2:
                    return <ComponentIndex.ComponentNgaySinh isReq={defaultReq.includes(id)} value={ngaysinh} onChangTextIndex={(val) => this.onChangeTextIndex(val, 2)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 3:
                    return <ComponentIndex.ComponentGioiTinh isReq={defaultReq.includes(id)} value={gioitinh} onChangeGT={this.onChangeGT} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 4:
                    return <ComponentIndex.ComponentTypeDD isReq={defaultReq.includes(id)} value={typedinhdanh.Name} onPress={() => this._dropDown(4)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 5:
                    return <ComponentIndex.ComponentInputDD isReq={defaultReq.includes(id)} value={socmnd} onChangTextIndex={(val) => this.onChangeTextIndex(val, 10)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} /> // code cũ có maxlength={typedinhdanh.Id == 1 ? 9 : 12}
                case 6:
                    return <ComponentIndex.ComponentNgayCap isReq={defaultReq.includes(id)} value={ngaycap} onChangTextIndex={(val) => this.onChangeTextIndex(val, 3)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 7:
                    return <ComponentIndex.ComponentNoiCap isReq={defaultReq.includes(id)} value={noicap} onChangTextIndex={(val) => this.onChangeTextIndex(val, 4)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 8:
                    return <ComponentIndex.ComponentMK isReq={defaultReq.includes(id)} value={matkhau} onChangTextIndex={(val) => this.onChangeTextIndex(val, 5)} isShow={showPass} onPressChange={() => this.setState({ showPass: !showPass })} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 9:
                    return <ComponentIndex.ComponentNhapMK isReq={defaultReq.includes(id)} value={nhaplaimatkhau} onChangTextIndex={(val) => this.onChangeTextIndex(val, 6)} isShow={showRepass} onPressChange={() => this.setState({ showRepass: !showRepass })} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 10:
                    return <ComponentIndex.ComponentDienThoai isReq={defaultReq.includes(id)} maxlength={15} value={dienthoai} onChangTextIndex={(val) => this.onChangeTextIndex(val, 7)} isEdit={this.isDangky == true || (this.state.isFB == 6 && this.props.OnEdit) ? true : false} />
                case 11:
                    return <ComponentIndex.ComponentEmail isReq={defaultReq.includes(id)} value={email} onChangTextIndex={(val) => this.onChangeTextIndex(val, 8)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 12:
                    return <ComponentIndex.ComponentQuocTich isReq={defaultReq.includes(id)} value={quoctich.Name} onPress={() => this._dropDown(1)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 13:
                    return <ComponentIndex.ComponentDanToc isReq={defaultReq.includes(id)} value={dantoc.Name} onPress={() => this._dropDown(2)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 14:
                    return <ComponentIndex.ComponentTonGiao isReq={defaultReq.includes(id)} value={tongiao.Name} onPress={() => this._dropDown(3)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 15:
                    return <ComponentIndex.ComponentDiaChi isReq={defaultReq.includes(id)} value={diachithuongtru} onChangTextIndex={(val) => this.onChangeTextIndex(val, 9)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false}
                        onFocus={() => {
                            if (this.isDangky)
                                setTimeout(() => {
                                    this.scroller.scrollToEnd(true)
                                }, 700)
                        }} />
                case 16:
                    return <ComponentIndex.ComponentUserName isReq={defaultReq.includes(id)} value={username} onChangTextIndex={(val) => this.onChangeTextIndex(val, 15)} isEdit={this.isDangky == true ? true : false} />

                case 17:
                    return <ComponentIndex.ComponentTinh isReq={defaultReq.includes(id)} value={tinhtp.TenTinhThanh} onPress={() => this._dropDown(17)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 18:
                    return <ComponentIndex.ComponentQuanHuyen isReq={defaultReq.includes(id)} value={quanhuyen.TenQuanHuyen} onPress={() => this._dropDown(18)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 19:
                    return <ComponentIndex.ComponentPhuongXa isReq={defaultReq.includes(id)} value={phuongxa.TenXaPhuong} onPress={() => this._dropDown(19)} isEdit={this.props.OnEdit || this.isDangky == true ? true : false} />
                case 20:
                    return <ComponentIndex.UploadCMND
                        isReq={defaultReq.includes(id)}
                        callback={(data) => {
                            this.setState({
                                AnhCMNDT: data?.AnhCMNDT,
                                AnhCMNDS: data?.AnhCMNDS
                            })
                        }}
                        AnhCMNDT={this.state.AnhCMNDT}
                        AnhCMNDS={this.state.AnhCMNDS}
                        isEdit={this.props.OnEdit || this.isDangky == true ? true : false}
                    />
                //ComponentNoiDungDVXuLy
                default:
                    return null;
                    break;
            }
        } else {
            return null;
        }
    }

    onDangKy_Update = async () => {
        Keyboard.dismiss();
        // const { Id, Mk, Sdt, HvaT, RePassword, } = this.state
        const refDiaChi = !this.isDangky && this.isDichBenh == 'true' ? this.refTTDiaChi.current.getData() : null
        const {
            design = [], dataThongTin,
            hoten, ngaysinh, gioitinh,
            typedinhdanh, ngaycap, noicap,
            matkhau, nhaplaimatkhau,
            dienthoai, email, quoctich, latlongDiaChi,
            dantoc, tongiao, diachithuongtru, socmnd, showPass,
            showRepass, avatarSource, username, isChangeImage, HeighIMG, WidthIMG, isAccept,
            tinhtp, quanhuyen, phuongxa, AnhCMNDS, AnhCMNDT
        } = this.state;
        if (design.includes(1) && defaultReq.includes(1)) {
            //check họn và tên
            if (!hoten?.trim()) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Bạn chưa nhập Họ và tên", "Xác nhận");
                return;
            } else {
                const name = hoten.trim();
                const index = name.lastIndexOf(' ');
                if (index != -1) {
                    // this.name = name.slice(index).trim();
                    // this.surname = name.slice(0, index).trim();
                } else {
                    Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng nhập đầy đủ họ và tên", 'Đồng ý');
                    return;
                };
            };
        }
        //check ngày sinh
        if (design.includes(2) && defaultReq.includes(2)) {
            if (!ngaysinh?.trim()) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng chọn ngày sinh", "Xác nhận")
                return
            }
        }
        //check loại căn cước loại số căn cước 9 hoặc 12
        if (design.includes(4) && defaultReq.includes(4)) {
            if (typedinhdanh.Name && !typedinhdanh.Name?.trim()) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng loại mã dịnh danh", "Xác nhận")
                return
            }
        }
        if (design.includes(5) && defaultReq.includes(5)) {
            if (!socmnd?.trim()) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', `Vui lòng nhập số ${typedinhdanh.Id == 1 ? 'chứng minh nhân dân' : 'căn cước công dân'}`, "Xác nhận")
                return
            }
        }

        //Kiểm tra ảnh chứng minh nhân dân
        if (design.includes(20) && defaultReq.includes(20)) {
            if (!AnhCMNDT || !AnhCMNDS) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', `Vui lòng tải lên đủ 2 mặt CMND/CCCD/Hộ chiếu`, "Xác nhận")
                return
            }
        }

        //check ngày câp
        if (design.includes(6) && defaultReq.includes(6)) {
            if (!ngaycap || ngaycap.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', `Vui lòng nhập ngày cấp ${typedinhdanh.Id == 1 ? 'chứng minh nhân dân' : 'căn cước công dân'}`, "Xác nhận")
                return
            }
        }

        //check nơi cấp
        if (design.includes(7) && defaultReq.includes(7)) {
            if (!noicap || noicap.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', `Vui lòng nhập nơi cấp ${typedinhdanh.Id == 1 ? 'chứng minh nhân dân' : 'căn cước công dân'}`, "Xác nhận")
                return
            }
        }

        //check mk
        if (design.includes(8) && defaultReq.includes(8)) {
            if (matkhau.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng nhập mật khẩu để đăng nhập", "Xác nhận")
                return
            }
            if (this.checkMK) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Mật khẩu không hợp lệ", "Xác nhận")
                return
            }
            let Mk2 = this.replaceDau_KhoangTrang(matkhau);
            if (Mk2 != matkhau) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Mật khẩu không được có dấu và khoảng trắng", "Xác nhận")
                return
            }
        }
        //check mk
        if (design.includes(9) && defaultReq.includes(9)) {
            if (nhaplaimatkhau.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng nhập lại mật khẩu để xác thực", "Xác nhận")
                return
            }
            if (nhaplaimatkhau != matkhau) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Mật khẩu xác nhận không khớp", "Xác nhận")
                return
            }
        }

        //check sdt
        if (design.includes(10) && defaultReq.includes(10)) {
            if (dienthoai.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng nhập số điện thoại", "Xác nhận")
                return
            }
            if (this.checkSDT) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Số điện thoại của bạn chưa hợp lệ", "Xác nhận")
                return
            }
        }

        //check email
        if (design.includes(11) && defaultReq.includes(11)) {
            if (email.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', `Vui lòng nhập email để tiếp tục ${this.isDangky ? 'đăng ký' : 'cập nhật thông tin'}`, "Xác nhận")
                return
            }
        }

        //check username
        if (design.includes(16) && defaultReq.includes(16)) {
            if (username.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', `Vui lòng nhập số điện thoại để tiếp tục ${this.isDangky ? 'đăng ký' : 'cập nhật thông tin'}`, "Xác nhận")
                return
            }
            if (this.checkSDT) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Số điện thoại của bạn chưa hợp lệ", "Xác nhận")
                return
            }
        }

        if (this.isDichBenh == 'true' && !this.isDangky) {
            if (!refDiaChi.tinh) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng chọn tỉnh/ thành phố!", "Xác nhận")
                return
            }
            if (!refDiaChi.huyen) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng chọn quận/ huyện!", "Xác nhận")
                return
            }
            if (!refDiaChi.IdDonVi) {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', "Vui lòng chọn phường/ xã", "Xác nhận")
                return
            }
        }

        //check diachithuongtru
        if (design.includes(15) && defaultReq.includes(15)) {
            if (diachithuongtru.trim() == '') {
                Utils.showMsgBoxOK(this.nthis, 'Thông báo', `Vui lòng nhập địa chỉ thường trú để tiếp tục ${this.isDangky ? 'đăng ký' : 'cập nhật thông tin'}`, "Xác nhận")
                return
            }
        }

        if (!this.isDangky)
            this.refLoading.current.show()
        // this.setState({ isLoading: true });
        else
            if (isAccept == false) {
                this.setState({ isPolicy: true });
                setTimeout(() => {
                    this.scroller.scrollToPosition(0, 0, true)
                }, 200);
                return;
            }

        var base64 = '';
        if (isChangeImage == true && avatarSource != '') {
            base64 = await Utils.parseBase64(avatarSource, HeighIMG, WidthIMG);
        }

        let body = {};
        if (this.isDangky)
            body = {
                "UserName": username ? username : dienthoai,
                "Password": matkhau,
                "RePassword": nhaplaimatkhau,
                "FileUploadAvata": {
                    "strBase64": base64,
                    "filename": "Image_avatar" + moment(new Date()).format('DD_MM_YYYY_HH_mm') + ".png"
                }
            }
        else {
            this.isDichBenh == 'true' && this.formRegister == '' ?
                body = {
                    // ...dataThongTin,
                    Avata: "/default-user.png",
                    Deleted: false,
                    PhoneNumber: dienthoai,
                    Status: 1,
                    Username: username,
                    strBase64: base64 ? base64 : ''
                } :
                body = {
                    ...dataThongTin,
                    Avata: "/default-user.png",
                    Deleted: false,
                    PhoneNumber: dienthoai,
                    Status: 1,
                    Username: username,
                    strBase64: base64 ? base64 : ''
                }
        }

        {
            this.isDichBenh == 'true' && !this.isDangky ?
                body = {
                    ...body,
                    "Email": email,
                    "NgayCap": ngaycap,
                    "NoiCap": noicap,
                    "NgaySinh": ngaysinh,
                    "TonGiao": tongiao?.Id,
                    "DanToc": dantoc?.Id,
                    "QuocTich": quoctich?.Id || quoctich?.id,
                    "GioiTinh": gioitinh,
                    "FullName": hoten,
                } :
                body = {
                    ...body,
                    "Email": email,
                    "CMND": socmnd,
                    "NgayCap": ngaycap,
                    "NoiCap": noicap,
                    "NgaySinh": ngaysinh,
                    "TonGiao": tongiao?.Id,
                    "DanToc": dantoc?.Id,
                    "QuocTich": quoctich?.Id || quoctich?.id,
                    "GioiTinh": gioitinh,
                    "FullName": hoten,
                    "DiaChi": diachithuongtru,
                    "Lat": latlongDiaChi?.lat ? latlongDiaChi.lat : 0,
                    "Lng": latlongDiaChi?.lng ? latlongDiaChi.lng : 0
                }
        }
        {
            this.isDangky ? null :
                body = {
                    ...body,
                    "QRCode": '',
                    "CachLy": {
                        "IDTinhThanh": this.isDichBenh == 'true' ? refDiaChi?.tinh.IDTinhThanh : tinhtp?.IDTinhThanh,
                        "TenTinhThanh": this.isDichBenh == 'true' ? refDiaChi?.tinh.TenTinhThanh : tinhtp?.TenTinhThanh,
                        "IDQuanHuyen": this.isDichBenh == 'true' ? refDiaChi?.huyen.IDQuanHuyen : quanhuyen?.IDQuanHuyen,
                        "TenQuanHuyen": this.isDichBenh == 'true' ? refDiaChi?.huyen.TenQuanHuyen : quanhuyen?.TenQuanHuyen,
                        "IDXaPhuong": this.isDichBenh == 'true' ? refDiaChi?.IdDonVi.IdPhuongXa : phuongxa?.IdXaPhuong,
                        "TenXaPhuong": this.isDichBenh == 'true' ? refDiaChi?.IdDonVi.TenXaPhuong : phuongxa?.TenXaPhuong,
                        "DiaChi": diachithuongtru,
                        "CMND": socmnd,
                        "ToaDoX": latlongDiaChi?.lat ? latlongDiaChi.lat : 0,
                        "ToaDoY": latlongDiaChi?.lat ? latlongDiaChi.lat : 0,
                    }
                }
        }

        if (design.includes(20) && this.isDangky) {
            this.refLoading.current.show()
            let downSize = Platform.OS != 'ios' || versionIOS_12 ? 0.8 : 0.7;
            let strBase64_imgFront = await Utils.parseBase64(AnhCMNDT.uri, AnhCMNDT.height ? AnhCMNDT.height : 2000, AnhCMNDT.width ? AnhCMNDT.width : 2000, downSize, false, false);
            let strBase64_imgAfter = await Utils.parseBase64(AnhCMNDS.uri, AnhCMNDS.height ? AnhCMNDS.height : 2000, AnhCMNDS.width ? AnhCMNDS.width : 2000, downSize, false, false);
            let anhCMND = [
                {
                    strBase64: strBase64_imgFront,
                    filename: AnhCMNDT.filename
                },
                {
                    strBase64: strBase64_imgAfter,
                    filename: AnhCMNDS.filename
                }
            ]
            body = {
                ...body,
                "AnhCMND": anhCMND
            }
        }
        Utils.nlog("giá trị body DK_Edit:", body)

        let res = {};
        this.refLoading.current.show()
        if (this.isDangky) {
            const hashOTP = await Utils.getHashOTP()
            body = { ...body, "Hash": hashOTP }
            Utils.nlog("Body Tao Tai Khoan", body)
            res = await Api.ApiUser.TaoTaiKhoan(body)
        }
        else
            res = await Api.ApiUser.CapNhatTTCongDan(body)
        Utils.nlog("giá trị res DK_Edit:", res)
        this.refLoading.current.hide()
        if (res.status == 1 && res.data) {
            if (this.isDangky) {
                let idUser = res.data.user.data
                let Sdt = username ? username : dienthoai;
                //set lưu id User
                await Utils.nsetStore(nkey.Id_user, idUser)
                await Utils.nsetStore(nkey.Username, Sdt)
                await Utils.nsetStore(nkey.NumberPhone, Sdt)
                Utils.setGlobal(nGlobalKeys.Id_user, idUser);
                Utils.setGlobal(nGlobalKeys.Username, Sdt)
                Utils.setGlobal(nGlobalKeys.NumberPhone, Sdt)
                if (this.isOTP == true) {
                    this.setState({ isLoading: false });
                    Utils.goscreen(this.nthis, 'Modal_XacNhanOPT', {
                        opt: res.data.otp,
                        IdUser: idUser,
                        Username: Sdt,
                        Sdt
                    });
                } else {
                    Utils.showMsgBoxOK(this.nthis, "Thông báo", "Đăng ký tài khoản thành công", "Xác nhận", () => {
                        Utils.goscreen(this.nthis, 'login')
                    })
                }

            } else {
                if (ROOTGlobal.dataGlobal._onPressAvatar) {
                    ROOTGlobal.dataGlobal._onPressAvatar()
                }

                var data1 = res.data
                if (data1) {
                    Utils.nsetStore(nkey.Id_user, data1.UserID);
                    Utils.nsetStore(nkey.NumberPhone, data1.PhoneNumber);
                }
                this.setState({ isLoading: false })
                if (this.props.onEnEdit) {
                    this.props.onEnEdit();
                }
                // this._CapNhatAvatar(true)
                Utils.showMsgBoxOK(this.nthis,
                    "Thông báo",
                    "Cập nhật thông tin thành công",
                    "Xác nhận", this.getThongTin)
            }

        } else {
            this.setState({ isLoading: false });
            var { error = {} } = res
            Utils.showMsgBoxOK(this.nthis, "Thông báo", error.message ? error.message : (this.isDangky ? "Lỗi đăng ký" : "Lỗi cập nhật thông tin"), 'Xác nhận')
        }
    }

    setShowPass = (flag) => () => {
        if (flag) this.setState({ ShowPassword: !this.state.ShowPassword });
        else this.setState({ ShowRePass: !this.state.ShowRePass });
    }

    xacnhanMK = () => {
        this.setState({ bs: true })
    }
    _setValue = (val) => {
        this.setState({ selected: !this.state.selected, Gt: val })
    }
    _checkId = (val) => {
        if (val.length == 0) {
            return true
        }
        var gt = false
        if ((val.length == 9 || val.length == 12)) {
            gt = true
        }
        return gt
    }




    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }
    onPresstab = (val) => {
        this.setState({ isDangKy: val })
    }

    yeucauOPT = async () => {
        var { sdtXacThuc } = this.state
        if (!sdtXacThuc || sdtXacThuc.length <= 0) {
            Utils.showMsgBoxOK(this, "Thông báo", `Bạn chưa nhập số điện thoại ${ROOTGlobal['haveEmail'] ? 'hoặc Email' : ''}`, "Xác nhận");
            return
        }
        this.setState({ isLoading: true });
        const hashOTP = await Utils.getHashOTP()
        let res = await Api.ApiUser.RequestOTPApp(sdtXacThuc, sdtXacThuc, hashOTP, true)
        Utils.nlog("gia tri cua request OTP dk", res)
        if (res.status == 1) {
            this.setState({ isLoading: false });
            Utils.goscreen(this, 'Modal_XacNhanOPT', {
                opt: res.data.otp,
                IdUser: res.data.idacc,
                Username: sdtXacThuc,
                Sdt: sdtXacThuc,
                IsReset: false

            });
        } else {
            this.setState({ isLoading: false });
            Utils.showMsgBoxOK(this.nthis, 'Thông báo', res.error ? res.error.message : 'Lỗi gửi xác thực', 'Xác nhận');

        }
    }
    onChangTextIndex = (val, index) => {

    }
    _chooseAvatar = () => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: this.response, // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        Utils.goscreen(this.nthis, 'Modal_MediaPicker', options);

    }
    response = async (res) => {
        if (res.iscancel) {
            // Utils.nlog('--ko chon item or back');
            return;
        }
        else if (res.error) {
            // Utils.nlog('--lỗi khi chon media');
            return;
        }
        else {
            //--dữ liệu media trả về là 1 item or 1 mảng item
            //--Xử lý dữ liệu trong đây-----
            Utils.nlog('Hinh da chon', res);
            //element.height ? element.height : 2000, element.width ? element.width : 2000
            this.setState({ avatarSource: res[0].uri, isChangeImage: true, HeighIMG: res[0].height ? res[0].height : 2000, WidthIMG: res[0].width ? res[0].width : 2000 })
        }
    };
    onChangeGT = (vals = 0) => {
        this.setState({ gioitinh: vals })
    }

    createQR = async () => {
        const { dataThongTin } = this.state
        if (dataThongTin?.CachLy) {
            nthisIsLoading.show()
            const {
                IDTinhThanh, TenTinhThanh, IDQuanHuyen, TenQuanHuyen,
                IDXaPhuong, TenXaPhuong, DiaChi, CMND, ToaDoX, ToaDoY
            } = dataThongTin.CachLy
            if (IDTinhThanh && TenTinhThanh && IDQuanHuyen && TenQuanHuyen && IDXaPhuong && TenXaPhuong && DiaChi && CMND && ToaDoX && ToaDoY) {
                let stringQR = JSON.stringify({ CachLy: dataThongTin.CachLy })
                let body = {
                    ...dataThongTin,
                    "QRCode": stringQR
                }
                Utils.nlog("[LOG] body cap nhat QR", res)
                let res = await Api.ApiUser.CapNhatTTCongDan(body)
                Utils.nlog("[LOG] cap nhat QR", res)
                nthisIsLoading.hide()
                if (res.status == 1 && res.data) {
                    Utils.goscreen(this.props.nthis, 'Modal_CreateQR_TN', { CachLy: stringQR })
                } else {
                    Utils.showMsgBoxOK(this.props.nthis, 'Thông báo', 'Có lỗi trong quá trình tạo QR, vui lòng thử lại sau !', 'Xác nhận')
                }
            } else {
                Utils.showMsgBoxOK(this.props.nthis, 'Thông báo', 'Vui lòng cập nhật CMND/CCCD/Hộ Chiếu, Tỉnh, Quận/Huyện, Phường/Xã, Địa chỉ đầy đủ.', 'Xác nhận')
            }
        } else {
            Utils.showMsgBoxOK(this.props.nthis, 'Thông báo', 'Vui lòng cập nhật CMND/CCCD/Hộ Chiếu, Tỉnh, Quận/Huyện, Phường/Xã, Địa chỉ đầy đủ', 'Xác nhận')
        }

    }

    uploadCMND = () => {
        Utils.navigate('Modal_UploadCMND', { callback: this.getThongTin })
    }

    uploadGiayThongHanh = () => {
        Utils.navigate('Modal_GiayThongHanh', { callback: this.getThongTin })
    }

    uploadGiayToKhac = () => {
        Utils.navigate('Modal_GiayToKhac', { callback: this.getThongTin })
    }

    render() {
        var { ShowPassword, ShowRePass, isLoading, isDangKy, sdtXacThuc, isPolicy, isAccept, ImageBG, isAvatar, avatarSource, isGioiTinh, tinhtp, quanhuyen, phuongxa } = this.state
        const { nrow } = nstyles.nstyles;
        var link = appConfig.domain + ImageBG;
        const { userCD, tokenCD } = this.props.auth
        const linkAvatar = appConfig.domain + userCD?.Avata
        const qrcode = JSON.stringify({
            "HoTen": userCD?.FullName,
            "PhoneNumberCD": userCD?.PhoneNumber,
            "CMND": userCD?.CachLy?.CMND || ''
        })
        // Utils.nlog('BEFORE ENCODE QR', qrcode)
        const qrCodeEncrypt = CryptoJS.AES.encrypt(qrcode, appConfig.keySecret).toString();
        // Utils.nlog('ENCODE QR', qrCodeEncrypt)
        return (
            <View
                // style={this.isDangky ? { flex: 1 } : { maxHeight: Height(70) }} style cũ
                style={{ flex: 1, paddingBottom: this.props.OnEdit ? 50 : 0 }}
            >
                {this.renderItemDesign(-2)}
                <KeyboardAwareScrollView
                    ref={scroller => { this.scroller = scroller; }}
                    style={{
                        // backgroundColor: "#f3fdf5"
                    }}
                    contentContainerStyle={{}}
                    scrollToOverflowEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        this.isOTP == true && this.isDangky == true ?
                            <View style={[nstyles.nstyles.shadown, { flexDirection: 'row', marginTop: 20, marginHorizontal: 15, marginBottom: 15, borderRadius: 5 }]}>
                                <TouchableOpacity
                                    onPress={() => this.onPresstab(true)}
                                    style={[nrow, {
                                        justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
                                        flex: 1, backgroundColor: isDangKy ? '#FCE5E6' : colors.white, borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
                                    }]}>
                                    {/* <Image source={Images.icDaGui} style={[nstyles.nstyles.nIcon30, { tintColor: isDangKy ? colors.redStar : 'gray' }]} resizeMode='center' /> */}
                                    <Text style={[nstyles.text14, { marginLeft: 10, color: isDangKy ? colors.redStar : 'gray' }]}>{`Đăng ký tài khoản`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.onPresstab(false)}
                                    style={[nrow, {
                                        justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderTopRightRadius: 5, borderBottomRightRadius: 5,
                                        flex: 1, backgroundColor: isDangKy ? colors.white : '#FCE5E6'
                                    }]}>
                                    {/* <Image source={Images.icBanNhap} style={[nstyles.nstyles.nIcon30, { tintColor: isDangKy ? 'gray' : colors.redStar }]} resizeMode='center' /> */}
                                    <Text style={[nstyles.text14, { marginLeft: 10, color: isDangKy ? 'gray' : colors.redStar }]}>{`Xác thực tài khoản`}</Text>
                                </TouchableOpacity>
                            </View> : null
                    }

                    {
                        isDangKy ? <View style={{ flex: 1, paddingBottom: 30 }} >
                            {this.props.OnEdit || this.isDangky ?
                                <TouchableOpacity onPress={() => Utils.goscreen(this.isDangky ? this : this.nthis, 'ModalScanQR_Info', {
                                    callback: (val) => {
                                        this.formRegister == '' ?
                                            this.setState(
                                                {
                                                    hoten: val.split('|')[2],
                                                })
                                            :
                                            this.setState(
                                                {
                                                    hoten: val.split('|')[2],
                                                    socmnd: val.split('|')[0],
                                                    ngaysinh: moment(val.split('|')[3], 'DDMMYYYY').format('DD/MM/YYYY'),
                                                    // diachithuongtru: val.split('|')[5],
                                                    ngaycap: moment(val.split('|')[6], 'DDMMYYYY').format('DD/MM/YYYY')
                                                })
                                    }

                                })}
                                    style={{ flexDirection: 'row', marginHorizontal: 12, marginVertical: 10 }}>
                                    <Image source={Images.icQR} style={{ width: Width(8), height: Width(8), alignSelf: 'center', tintColor: colors.greenyBlue }} />
                                    <View style={{ marginLeft: 5 }}>
                                        <Text style={{ alignSelf: 'flex-start', color: colors.greenyBlue, fontWeight: 'bold', fontSize: reText(16), }}>Scan QR Code</Text>
                                        <Text style={{ fontSize: reText(10), fontStyle: 'italic' }}>(Quét mã QR trên CCCD giúp điền nhanh thông tin của bạn)</Text>
                                    </View>
                                </TouchableOpacity>
                                : null}
                            {
                                this.showQR_InfoCD && qrCodeEncrypt && tokenCD ?
                                    <View style={{ paddingVertical: 5, alignItems: 'center' }}>
                                        <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                                            <Text style={{ color: colors.redStar, textAlign: 'center', fontWeight: 'bold', paddingBottom: 5, fontSize: reText(18) }}>{'QR Cá nhân'}</Text>
                                            <>
                                                <QRCode
                                                    value={qrCodeEncrypt}
                                                    size={Width(50)}
                                                    backgroundColor={colors.white}
                                                />
                                                <Text style={{ paddingVertical: 10, fontStyle: 'italic', color: colors.redStar }}>{'Mã QR để xuất trình khi: đi chợ, ra vào chốt kiểm soát.'}</Text>
                                                <TouchableOpacity onPress={() => { Utils.goscreen(this.props.nthis, 'Modal_CreateQR') }} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: colors.white, }}>
                                                    <View style={{ padding: 10 }}>
                                                        <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold' }}>{'Xem QR lớn hơn'}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </>
                                        </View>
                                    </View> : null
                            }
                            <View style={{ backgroundColor: colors.white, marginHorizontal: 13, borderRadius: 15 }}>
                                {this.renderItemDesign(-1)}
                                <InfoTiemChung />
                                {this.renderItemDesign(0)}
                                {this.renderItemDesign(16)}
                                {this.renderItemDesign(1)}
                                {this.renderItemDesign(2)}
                                {this.renderItemDesign(3)}
                                {this.renderItemDesign(4)}
                                {this.renderItemDesign(5)}
                                {this.renderItemDesign(20)}
                                {this.renderItemDesign(6)}
                                {this.renderItemDesign(7)}
                                {
                                    tokenCD && userCD.hasOwnProperty('GiayThongHanh') ?
                                        <>
                                            <TouchableOpacity onPress={this.uploadGiayThongHanh} style={{ marginTop: 10, flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center', padding: 3, paddingHorizontal: 10 }}>
                                                <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{`Giấy thông hành`}: </Text>
                                                <Text style={{
                                                    flex: 1, textAlign: 'right', paddingVertical: 8,
                                                    color: userCD?.GiayThongHanh ? colors.greenFE : this.props.theme.colorLinear.color[0]
                                                }}>
                                                    {userCD?.GiayThongHanh ? 'Đã cập nhật (xem tại đây)' : 'Cập nhật'}</Text>
                                            </TouchableOpacity>
                                            <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
                                        </>
                                        : null
                                }

                                {/* {
                                    tokenCD && userCD.hasOwnProperty('AnhCMNDT') && userCD.hasOwnProperty('AnhCMNDS') ?
                                        <>
                                            <TouchableOpacity onPress={this.uploadCMND} style={{ marginBottom: 10, flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center', padding: 3, paddingHorizontal: 10 }}>
                                                <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{`Ảnh CMND/CCCD`}: </Text>
                                                <Text style={{
                                                    flex: 1, textAlign: 'right', paddingVertical: 8,
                                                    color: userCD?.AnhCMNDT && userCD?.AnhCMNDS ? colors.greenFE : this.props.theme.colorLinear.color[0]
                                                }}>
                                                    {userCD?.AnhCMNDT && userCD?.AnhCMNDS ? 'Đã cập nhật (xem tại đây)' : 'Cập nhật'}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
                                        </>
                                        : null
                                } */}
                                {
                                    tokenCD && userCD.hasOwnProperty('GiayToKhac') ?
                                        <>
                                            <TouchableOpacity onPress={this.uploadGiayToKhac} style={{ marginBottom: 10, flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center', padding: 3, paddingHorizontal: 10 }}>
                                                <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{`Giấy tờ khác`}: </Text>
                                                <Text style={{
                                                    flex: 1, textAlign: 'right', paddingVertical: 8,
                                                    color: userCD?.GiayToKhac?.length > 0 ? colors.greenFE : this.props.theme.colorLinear.color[0]
                                                }}>
                                                    {userCD?.GiayToKhac?.length > 0 ? 'Đã cập nhật (xem tại đây)' : 'Cập nhật'}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
                                        </>
                                        : null
                                }
                                <BtnThongBaoChuyenBienNang />
                                {this.renderItemDesign(8)}
                                {this.renderItemDesign(9)}
                                {this.renderItemDesign(10)}
                                {this.renderItemDesign(11)}
                                {this.renderItemDesign(12)}
                                {this.renderItemDesign(13)}
                                {this.renderItemDesign(14)}
                                {this.renderItemDesign(17)}
                                {this.renderItemDesign(18)}
                                {this.renderItemDesign(19)}
                                {this.isDichBenh == 'true' ?
                                    this.props.OnEdit ?
                                        <View style={{ backgroundColor: colors.white, paddingVertical: 10 }}>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: reText(14) }}>Chọn địa chỉ<Text style={{ color: colors.redStar, fontSize: reText(16) }}> *</Text></Text>
                                            <ThongTinDiaChi tinh={tinhtp?.IDTinhThanh || ''} huyen={quanhuyen?.IDQuanHuyen || ''} IdDonVi={phuongxa?.IdXaPhuong || ''} ref={this.refTTDiaChi} isEdit={true} listCom={listComDiaChi} />
                                        </View>
                                        : !this.isDangky ?
                                            <View style={{}}>
                                                <TextLine title={'Tỉnh/ Thành phố'} value={this.state.tinhtp.TenTinhThanh} />
                                                <TextLine title={'Quận/ Huyện'} value={this.state.quanhuyen.TenQuanHuyen} />
                                                <TextLine title={'Phường/ Xã'} value={this.state.phuongxa.TenXaPhuong} />
                                            </View>
                                            : null
                                    : null}

                                {this.renderItemDesign(15)}
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 100, marginHorizontal: 13 }}>
                                {
                                    this.props.OnEdit ?
                                        <Fragment>
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <TouchableOpacity onPress={() => this.props.onEnEdit()} style={{ flex: 1, alignSelf: 'center', padding: 13, marginTop: 10, backgroundColor: 'white', borderRadius: 15, marginRight: 10 }}>
                                                    <Text style={{ fontSize: reText(14), color: colors.redStar, fontWeight: 'bold', textAlign: 'center' }}>{'Huỷ'}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={this.onDangKy_Update} style={{ flex: 1, alignSelf: 'center', padding: 13, marginTop: 10, backgroundColor: 'white', borderRadius: 15 }}>
                                                    <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold', textAlign: 'center' }}>{'Cập nhật'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_DoiMatKhau')} style={{ alignSelf: 'center', padding: 13, marginTop: 5, backgroundColor: 'white', width: '100%', borderRadius: 15 }}>
                                                <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold', textAlign: 'center' }}>{'Đổi mật khẩu'}</Text>
                                            </TouchableOpacity>
                                        </Fragment>
                                        : !this.isDangky ? <Fragment>
                                            <TouchableOpacity onPress={() => this.props.onEnEdit(true)} style={{ alignSelf: 'center', padding: 13, marginTop: 10, backgroundColor: 'white', width: '100%', borderRadius: 15 }}>
                                                <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold', textAlign: 'center' }}>{'Chỉnh sửa thông tin'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_DoiMatKhau')} style={{ alignSelf: 'center', padding: 13, marginTop: 5, backgroundColor: 'white', width: '100%', borderRadius: 15 }}>
                                                <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold', textAlign: 'center' }}>{'Đổi mật khẩu'}</Text>
                                            </TouchableOpacity>
                                        </Fragment> :
                                            null
                                }
                                {
                                    appConfig.IsQR == 1 ?
                                        <TouchableOpacity onPress={() => this.createQR()} style={{ alignSelf: 'center', padding: 10, marginTop: 10, flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Image source={Images.icQR} style={[nstyles.nstyles.nIcon24, { tintColor: this.props.theme.colorLinear.color[0] }]} resizeMode='contain' />
                                            <View style={{ paddingLeft: 10 }}>
                                                <Text style={{ fontSize: reText(14), color: this.props.theme.colorLinear.color[0], fontWeight: 'bold' }}>{'Tạo QR Code'}</Text>
                                                <View style={{ height: 1, backgroundColor: this.props.theme.colorLinear.color[0], marginTop: 3 }} />
                                            </View>
                                        </TouchableOpacity> : null
                                }
                                {
                                    this.isDangky == true ? <ButtonCom
                                        onPress={this.onDangKy_Update}
                                        disabled={false}
                                        icon={Images.icFE}
                                        sizeIcon={30}
                                        style={
                                            {
                                                ...stLogin.contentInput,
                                                marginVertical: 30, borderRadius: 5, paddingHorizontal: 40,
                                                alignSelf: 'center',
                                                backgroundColor: colors.colorBlue
                                            }}
                                        text={`ĐĂNG KÝ`}
                                    /> : null

                                }
                            </View>
                        </View> :
                            <View style={{ flex: 1, paddingVertical: 50, paddingHorizontal: 30 }}>
                                <View style={{ borderRadius: 18, borderWidth: 0.5, padding: Platform.OS === 'android' ? 5 : 15 }}>
                                    <InputCheckCus
                                        maxLength={ROOTGlobal['haveEmail'] ? 50 : 11}
                                        icon={Images.icLogin}
                                        showIcon={false}
                                        value={this.state.sdtXacThuc}
                                        placeholderTextColor={colors.black_50}
                                        placeholder={`Nhập SĐT${ROOTGlobal['haveEmail'] ? '/Email' : ''} đã đăng ký`}
                                        onChangeText={text => this.setState({ sdtXacThuc: text.trim() })}
                                        customStyle={[stLogin.contentInput]}
                                        // keyboardType={'numeric'}
                                        colorUnline={null}
                                        icShowPass={false}
                                        // fcCheck={this._checkPhone}
                                        // useCheck={false}
                                        titleText={`Số điện thoại ${ROOTGlobal['haveEmail'] ? 'hoặc Email' : ''}`}
                                        errorText={`Nhập SĐT${ROOTGlobal['haveEmail'] ? '/Email' : ''} đã đăng ký.SĐT${ROOTGlobal['haveEmail'] ? '/Email' : ''} này sẽ được sử dụng để nhận mã OTP kích hoạt tài khoản.`}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>

                                    <ButtonCom
                                        onPress={this.yeucauOPT}
                                        icon={Images.icFE}
                                        sizeIcon={30}
                                        style={
                                            {
                                                ...stLogin.contentInput,
                                                marginTop: 30, borderRadius: 5, paddingHorizontal: 40,
                                                alignSelf: 'center',
                                                backgroundColor: colors.colorBlue
                                            }}
                                        text={`Yêu cầu OTP`.toUpperCase()}
                                    />
                                </View>
                            </View>

                    }


                    {
                        isLoading == true ? <ModalLoading enLoading={this._enLoading} /> : <View />
                    }
                    {
                        isPolicy == true && isAccept == false ? <View
                            onPress={() => this.setState({ isPolicy: false })}
                            style={[nstyles.nstyles.shadown, {
                                position: 'absolute',
                                backgroundColor: colors.backgroundModal,
                                top: 0, left: 0, right: 0, bottom: 0,
                                padding: 20, paddingTop: 50
                            }]}>
                            <View style={{
                                // flex: 1,
                                backgroundColor: colors.white,
                                borderRadius: 5, padding: 20, maxHeight: Height(75)
                            }}>
                                <Text style={{
                                    textAlign: 'center', fontSize: sizes.reText(18),
                                    paddingVertical: 10, marginBottom: 20, fontWeight: 'bold'
                                }}>{'Điều khoản'}</Text>
                                <ScrollView style={{ width: '100%' }}>
                                    {/* <Text>{`${this.state.policyData}`}</Text> */}
                                    <HtmlViewCom html={this.state.policyData} style={{ height: '100%' }} />
                                </ScrollView>
                                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <ButtonCom
                                            onPress={() => this.setState({ isPolicy: false })}
                                            icon={Images.icFE}
                                            sizeIcon={30}
                                            style={
                                                {
                                                    marginTop: 15, borderRadius: 5,
                                                    paddingHorizontal: 20,
                                                    alignSelf: 'center',
                                                }}
                                            Linear={true}
                                            colorChange={[colors.colorBrownishGreyTwo, colors.colorBrownishGreyTwo]}
                                            text={`Thoát`.toUpperCase()}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ButtonCom
                                            onPress={() => {
                                                this.setState({ isAccept: true, isLoading: true }, () => this.onDangKy_Update());
                                            }}
                                            icon={Images.icFE}
                                            sizeIcon={30}
                                            style={
                                                {
                                                    ...stLogin.contentInput,
                                                    marginTop: 15, borderRadius: 5, paddingHorizontal: 20,
                                                    alignSelf: 'center',
                                                    backgroundColor: colors.colorBlue,
                                                    colorChange: false
                                                }}
                                            text={`Tiếp tục`.toUpperCase()}
                                        />
                                    </View>
                                </View>
                            </View>

                        </View > : null
                    }
                </KeyboardAwareScrollView>
                <IsLoading ref={this.refLoading} />
            </View >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(DangKyTaiKhoan, mapStateToProps, true);


