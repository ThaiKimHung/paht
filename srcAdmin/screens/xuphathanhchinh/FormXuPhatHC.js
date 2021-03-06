import React, { Component } from 'react'
import { Text, View, TouchableHighlight, Platform, TextInput, TouchableOpacity, Image } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Utils from '../../../app/Utils'
import { HeaderCom, IsLoading } from '../../../components'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { Height, nstyles, Width } from '../../../styles/styles'
import CompForm from './CompForm'
import { KeyForm } from './KeyForm'
import * as Animatable from 'react-native-animatable'
import apis from '../../apis'
import moment from 'moment'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import ImagePicker from '../../../components/ComponentApps/ImagePicker/ImagePicker'
import { reText } from '../../../styles/size'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import { ConfigScreenDH } from '../../routers/screen'
import AppCodeConfig from '../../../app/AppCodeConfig'


const FormXuPhat = [
    KeyForm.CanNhanToChuViPham,
    KeyForm.CapCoThamQuyenXuPhat,
    KeyForm.CaNhanQuyetDinhXuPhat,
    KeyForm.NgaySinh,
    KeyForm.QuocTich,
    KeyForm.NguyenQuan,
    KeyForm.HoKhauThuongTru,
    KeyForm.DiaChiHienTai,
    KeyForm.CMND,
    KeyForm.LinhVuc,
    KeyForm.HanhViViPham,
    KeyForm.CanCuPhapLyXuPhat,
    KeyForm.TongMucTienPhat,
    KeyForm.HinhThucXuPhatBoSung,
    KeyForm.BienPhanNganChanVaDamBao,
    KeyForm.NgayQDXuPhat,
    // KeyForm.CoQuanThiHanh,
    // KeyForm.CaNhanCoTrachNhiemToChucThiHanh,
    KeyForm.TrangThaiThiHanh,
    KeyForm.NgayThucThi,
    KeyForm.SoNgayQuaHan,
    KeyForm.NoiCap,
    KeyForm.NgayCap,
    KeyForm.SoDienThoai,
    KeyForm.TenCongTy,
    KeyForm.MaSoCongTy,
]

export class FormXuPhatHC extends Component {
    constructor(props) {
        super(props)
        this.ItemXuPhat = Utils.ngetParam(this, 'ItemXuPhat', null)
        this.refPick = React.createRef();
        this.isAdd = Utils.ngetParam(this, 'isAdd', false)
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.isRead = Utils.ngetParam(this, 'isRead', false)
        this.isSua = Utils.ngetParam(this, 'isSua', false)
        this.isDSThongKeDV = Utils.ngetParam(this, 'isDSThongKeDV', false)
        this.isTKTienXP = Utils.ngetParam(this, 'isTKTienXP', false);
        this.isTKXPHC = Utils.ngetParam(this, 'isTKXPHC', false);
        //Check quyen
        // - T???o / C???p nh???t bi??n b???n h??nh ch??nh ( Ch??a thi h??nh): 202
        // - Thi h??nh: 205
        // - H???n thi h??nh bi??n b???n (Khi ???? thi h??nh): 203
        // - Xo?? th??? t???c: 204
        // - T???o / c???p nh???t t??i kho???n c??ng d??n: 91
        // - Xo?? t??i kho???n c??ng d??n: 92
        const listRule = [202, 203, 204, 205, 91, 92]
        let haveRule = []
        var rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN);

        listRule.forEach(item => {
            const isRule = rules.includes(item)
            if (isRule) {
                haveRule.push(item)
            }
        })

        this.state = {
            design: FormXuPhat, // N???i dung form
            OnEdit: this.isRead ? false : this.isAdd || haveRule.includes(202) && this.ItemXuPhat.Status == 1 ? true : false, //rule 202 co the tao va cap nhat bien ban
            Rule: haveRule,
            MaDon: '',
            dataViPham: [],
            selectViPham: '',
            dataThamQuyenXP: [],
            selectThamQuyenXP: '',
            dataCaNhanXP: [],
            selectCaNhanXP: '',
            FullName: '',
            NgaySinh: '',
            dataQuocTich: [],
            selectQuocTich: { "Code": "VN", "TenQuocTich": "VIET NAM" },
            NguyenQuan: '',
            NoiDKHKTT: '',
            DiaChiHT: '',
            CMND: '',
            dataLinhVuc: [],
            selectLinhVuc: '',
            HanhViVPDTH: '',
            CanCuPhapLy: '',
            TongMucTienPhat: '',
            HinhThucPhatBoSung: '',
            BienPhapNganChan: '',
            NgayQDXP: moment(new Date()).add(1, 'days'),
            // dataCoQuanTH: [],
            selectCoQuanTH: '',
            dataCaNhanTNTH: [],
            selectCaNhanTNTH: '',
            dataTrangThai: [],
            selectTrangThai: {
                "Id": 1,
                "TenTrangThai": "Ch??a thi h??nh"
            },
            NgayThucThi: new Date(),
            SLNgayQuaHan: 0,

            //===C??c state c???a file ????nh k??m b??? sung d?????i ????y
            ListFileDinhKem: [],
            ListFileDinhKemNew: [],
            ListFileDinhKemDelete: [],
            //=== NoiDung CMND
            SearchCMND: '',

            isAddNew: false,
            NgayCap: '',
            NoiCap: '',
            PhoneNumber: '',

            isCheckInfo: false,// ki???m tra CMND c?? t???n t???i kh??ng,

            isCheckCaNhan: true,
            TenCongTy: '',
            MaSoCongTy: '',
            dataUser: [],
            SoNgayThucThi: '',
            TenCaNhanThiHanh: ''
        }
    }

    //GET DU LIEU
    componentDidMount() {
        this._LoadFirst()
    }

    //H??m get c??c d??? li???u c???n thi???t
    _LoadFirst = async () => {
        nthisIsLoading.show()
        await this._GetInfoUser();
        await this.GetCode_XuPhatHanhChinh();
        await this.GetCaNhanViPham();
        await this.GetCapCoThamQuyenXuPhat();
        await this.GetLinhVuc();
        await this.GetTrangThaiThiThanh();
        await this.GetQuocTich();
        if (this.ItemXuPhat != null) {
            await this.GetDetail_HanhChinh()
        }
        nthisIsLoading.hide()
        Utils.nlog('Gia tri dataviiiiiippp==', this.ItemXuPhat)

    }

    //===========================CAC HAM GET DU LIEU TRONG DAY=================================

    _GetInfoUser = async () => {
        let res = await apis.ApiUser.GetInfoUser();
        Utils.nlog("<><>_GetInfoUser", res)
        if (res.status == 1) {
            this.setState({ dataUser: res.data, })
        }
    }

    GetCode_XuPhatHanhChinh = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetCode_XuPhatHanhChinh()
        // Utils.nlog('code', res)
        if (res.status == 1 && res.data) {
            this.setState({ MaDon: res.data.code })
        }
    }

    GetDetail_HanhChinh = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetDetail_HanhChinh(this.ItemXuPhat.ID)
        Utils.nlog('GetDetail_HanhChinh<><><>', res)
        if (res.data && res.status == 1) {
            let { ToChucViPham, CMND, TenCaNhanQDXP, TenDonVi,
                NgaySinh, TenQuocTich, NguyenQuan, DKHKThuongTru, DiaChiHienTai, QuocTich,
                LinhVuc, TenLinhVuc, HanhVi, CanCuPhapLy, TongMucPhat, BoSung, BienPhap,
                CapQDXP, CoQuanThiHanh, NgayHieuLuc, TenCoQuanThiHanh, CaNhanQDXP, TenCaNhanThiHanh,
                TenTrangThai, NgayThucThi, SLNgayQuaHan, CongDan, ListFileDinhKem, Status, NgayCap, NoiCap, PhoneNumber, CaNhan, TenCongTy, MaSoThue, SoNgayThucThi, MucPhat } = res.data
            this.setState({
                FullName: ToChucViPham,
                CMND: CMND,
                selectThamQuyenXP: { IdThamQuyen: CapQDXP, TenCap: TenDonVi },
                selectCaNhanXP: { UserID: CaNhanQDXP, FullName: TenCaNhanQDXP },
                NgaySinh,
                selectQuocTich: { Code: QuocTich, TenQuocTich: TenQuocTich },
                NguyenQuan,
                NgayCap,
                NoiCap,
                PhoneNumber,
                NoiDKHKTT: DKHKThuongTru,
                DiaChiHT: DiaChiHienTai,
                selectLinhVuc: { IdLinhVuc: LinhVuc, LinhVuc: TenLinhVuc, MucPhat: MucPhat },
                HanhViVPDTH: HanhVi,
                CanCuPhapLy,
                TongMucTienPhat: TongMucPhat,
                HinhThucPhatBoSung: BoSung,
                BienPhapNganChan: BienPhap,
                NgayQDXP: NgayHieuLuc,
                TenCaNhanThiHanh: TenCaNhanThiHanh,
                // selectCoQuanTH: { MaPX: CoQuanThiHanh, TenPhuongXa: TenCoQuanThiHanh },
                // selectCaNhanTNTH: { FullName: TenCaNhanThiHanh },
                selectTrangThai: { Id: Status, TenTrangThai: TenTrangThai }, // 1 l?? ch??a thi h??nh, 2 l?? ???? thi h??nh, Status 0 l?? chua thi hanh 1 l?? thi hanh
                NgayThucThi,
                SLNgayQuaHan,
                ListFileDinhKem,
                SearchCMND: CMND,
                isCheckCaNhan: CaNhan,
                TenCongTy: TenCongTy,
                MaSoCongTy: MaSoThue,
                SoNgayThucThi: SoNgayThucThi

            }, () => {
                // this.GetCaNhanCoTrachNhiemThiHanh() // C?? t??c d???ng get d??? li???u dataDropDown c???a ca nhan c?? trach nhi???m thi h??nh
                this.GetCaNhanQuyetDinhXuPhat() // C?? t??c d???ng get d??? li???u dataDropDown c???a ca nhan c?? quyet dinh xu phat
            })
        }
    }

    GetCaNhanViPham = async () => {
        let res = await apis.ApiXuLyHanhChinh.DanhSachCongDan();
        Utils.nlog('Danh s??ch c?? nh??n t??? ch???c vi ph???m', res);
        if (res.status == 1 && res.data) {
            this.setState({ dataViPham: res.data })
        }
    }

    GetCapCoThamQuyenXuPhat = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_CapThamQuyen()
        Utils.nlog('C???p c?? th???m quy???n quy???t ?????nh x??? ph???t,C?? quan thi h??nh', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataThamQuyenXP: res.data })
        }
    }

    GetCaNhanQuyetDinhXuPhat = async () => {
        Utils.nlog('C???p c?? th???m quy???n quy???t ?????nh x??? ph???th', this.state.selectThamQuyenXP.IdThamQuyen)
        let res = await apis.ApiXuLyHanhChinh.DanhSachCanBo(this.state.selectThamQuyenXP.IdThamQuyen)
        Utils.nlog("<><>aaaaaaaaa", res)
        if (res.status == 1 && res.data) {
            // this.setState({ dataCaNhanXP: res.data })
            this.setState({ dataCaNhanXP: res.data, selectCaNhanXP: res.data[0] })
        }
        else {
            this.setState({ dataCaNhanXP: [], selectCaNhanXP: '' })
        }
    }

    GetQuocTich = async () => {
        let res = await apis.ApiApp.GetList_QuocTich()
        Utils.nlog('Quoc tich', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataQuocTich: res.data })
        }
    }

    GetLinhVuc = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_LinhVuc_New()
        Utils.nlog('Linh vuc<><><>', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataLinhVuc: res.data })
        }
    }

    // GetCaNhanCoTrachNhiemThiHanh = async () => {
    //     let res = await apis.ApiXuLyHanhChinh.DanhSachCanBo(this.state.selectCoQuanTH.MaPX)
    //     // Utils.nlog('Ca nhan co trach nhiem thi hanh', res)
    //     if (res.status == 1 && res.data) {
    //         this.setState({ dataCaNhanTNTH: res.data, selectCaNhanTNTH: res.data[0] })
    //     }
    // }

    //Get trang th??i thi h??nh
    GetTrangThaiThiThanh = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_TrangThai();
        Utils.nlog('Tr???ng th??i thi h??nh', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataTrangThai: res.data })
        }
    }

    //Get thong tin tai khhoan ng?????i d??ng t???i ????y
    // getInfoAccount = async () => {
    //     nthisIsLoading.show()
    //     let res = await apis.ApiXuLyHanhChinh.InfoAccount(this.state.selectViPham.UserID)
    //     Utils.nlog("data user", res)
    //     if (res.status == 1) {
    //         nthisIsLoading.hide()
    //         this.setState({
    //             NgaySinh: res.data.NgaySinh ? res.data.NgaySinh : '',
    //             selectQuocTich: { Code: res.data.QuocTich, TenQuocTich: res.data.TenQuocTich },
    //             NguyenQuan: res.data.NguyenQuan,
    //             NoiDKHKTT: res.data.DKHKThuongTru,
    //             DiaChiHT: res.data.DiaChi,
    //             CMND: res.data.CMND,
    //         })
    //     } else {
    //         nthisIsLoading.hide()
    //     }
    // }
    //GetTHong tin 
    getInfoAccount = async () => {
        nthisIsLoading.show()
        let res = await apis.ApiXuLyHanhChinh.GetDetail_ThongTinCaNhanXPHC(this.state.SearchCMND, this.state.isCheckCaNhan)
        Utils.nlog("data user", res)
        if (res.status == 1) {
            nthisIsLoading.hide()
            this.setState({
                TenCongTy: res.data.TenCongTy ? res.data.TenCongTy : '',
                FullName: res.data.FullName ? res.data.FullName : '',
                NgaySinh: res.data.NgaySinh ? res.data.NgaySinh : '',
                selectQuocTich: { Code: res.data.QuocTich ? res.data.QuocTich : 'VN', TenQuocTich: res.data.TenQuocTich ? res.data.TenQuocTich : 'VIET NAM' },
                NguyenQuan: res.data.NguyenQuan,
                NoiDKHKTT: res.data.DKHKThuongTru,
                DiaChiHT: res.data.DiaChiHienTai,
                NgayCap: res.data.NgayCap,
                NoiCap: res.data.NoiCap,
                CMND: res.data.CMND,
                isAddNew: true,
                PhoneNumber: res.data.PhoneNumber,
                isCheckInfo: res.data.CMND || res.data.MaSoThue ? false : true,
                MaSoCongTy: res.data.MaSoThue
            })
        } else {
            nthisIsLoading.hide()
        }
        Utils.nlog('Gia tri isAddneww======', this.state.FullName)
    }
    //=========================================================================================
    //===========================GOI DROPDOWN TAI DAY==========================================
    //?????nh d???nh item dropdown
    _viewItem = (item, keyView, moreInfo_Key = '') => {
        return (
            <View key={item.Id} style={{
                flex: 1,
                paddingVertical: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.black_50,
            }}>
                {moreInfo_Key === 'User' ?
                    <View style={{}}>
                        <Text style={{ marginHorizontal: 10 }}>{item.FullName + ' - ' + item.CMND}</Text>
                    </View>
                    :
                    <Text style={{ textAlign: 'center', color: colors.brownGreyTwo }} >{`${item[keyView]}`}</Text>
                }
            </View>
        )
    }
    //H??m x??? l?? dropdown c??c comp
    _dropDown = (indexForm) => {
        switch (indexForm) {
            case KeyForm.CanNhanToChuViPham:
                Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                    callback: (val) => this.onChangeTextIndex(val, KeyForm.CanNhanToChuViPham), item: this.state.selectViPham, key: 'FullName',
                    title: 'C?? nh??n/T??? ch???c vi ph???m', AllThaoTac: this.state.dataViPham, ViewItem: (item) => this._viewItem(item, 'FullName', 'User'), Search: true
                })
                break
            case KeyForm.CapCoThamQuyenXuPhat:
                Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                    callback: (val) => this.onChangeTextIndex(val, KeyForm.CapCoThamQuyenXuPhat), item: this.state.selectThamQuyenXP, key: 'TenCap',
                    title: 'C???p c?? th???m quy???n quy???t ?????nh x??? ph???t', AllThaoTac: this.state.dataThamQuyenXP, ViewItem: (item) => this._viewItem(item, 'TenCap'), Search: true
                })
                break;

            case KeyForm.CaNhanQuyetDinhXuPhat: {
                if (this.state.selectThamQuyenXP && this.state.selectThamQuyenXP.IdThamQuyen) {
                    Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => this.onChangeTextIndex(val, KeyForm.CaNhanQuyetDinhXuPhat), item: this.state.selectCaNhanXP, key: 'FullName',
                        title: 'C?? nh??n quy???t ?????nh x??? ph???t', AllThaoTac: this.state.dataCaNhanXP, ViewItem: (item) => this._viewItem(item, 'FullName'), Search: true
                    })
                } else {
                    Utils.showMsgBoxOK(this, 'Th??ng b??o', 'B???n ch??a ch???n C???p c?? th???m quy???n quy???t ?????nh x??? ph???t.', 'X??c nh???n')
                }
                break;
            }
            case KeyForm.QuocTich:
                Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                    callback: (val) => this.onChangeTextIndex(val, KeyForm.QuocTich), item: this.state.selectQuocTich, key: 'TenQuocTich',
                    title: 'Qu???c t???ch', AllThaoTac: this.state.dataQuocTich, ViewItem: (item) => this._viewItem(item, 'TenQuocTich'), Search: true
                })
                break;
            case KeyForm.LinhVuc:
                Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                    callback: (val) => this.onChangeTextIndex(val, KeyForm.LinhVuc), item: this.state.selectLinhVuc, key: 'LinhVuc',
                    title: 'L??nh v???c', AllThaoTac: this.state.dataLinhVuc, ViewItem: (item) => this._viewItem(item, 'LinhVuc'), Search: true
                })
                break;
            case KeyForm.NgayQDXuPhat:
                break;
            // case KeyForm.CoQuanThiHanh:
            //     Utils.goscreen(this, 'Modal_ComponentSelectPropsDH', {
            //         callback: (val) => this.onChangeTextIndex(val, KeyForm.CoQuanThiHanh), item: this.state.selectCoQuanTH, key: 'TenPhuongXa',
            //         title: 'C?? quan thi h??nh', AllThaoTac: this.state.dataThamQuyenXP, ViewItem: (item) => this._viewItem(item, 'TenPhuongXa'), Search: true
            //     })
            //     break;
            // case KeyForm.CaNhanCoTrachNhiemToChucThiHanh:
            //     if (this.state.selectCoQuanTH && this.state.selectCoQuanTH.MaPX) {
            //         Utils.goscreen(this, 'Modal_ComponentSelectPropsDH', {
            //             callback: (val) => this.onChangeTextIndex(val, KeyForm.CaNhanCoTrachNhiemToChucThiHanh), item: this.state.selectCaNhanTNTH, key: 'FullName',
            //             title: 'C?? nh??n c?? tr??ch nhi???m t??? ch???c thi h??nh', AllThaoTac: this.state.dataCaNhanTNTH, ViewItem: (item) => this._viewItem(item, 'FullName'), Search: true
            //         })
            //     } else {
            //         Utils.showMsgBoxOK(this, 'Th??ng b??o', 'B???n ch??a ch???n C?? quan thi h??nh.')
            //     }

            //     break;
            case KeyForm.TrangThaiThiHanh:
                Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                    callback: (val) => this.onChangeTextIndex(val, KeyForm.TrangThaiThiHanh), item: this.state.selectTrangThai, key: 'TenTrangThai',
                    title: 'Tr???ng th??i thi h??nh', AllThaoTac: this.state.dataTrangThai, ViewItem: (item) => this._viewItem(item, 'TenTrangThai'), Search: true
                })
                break;
            default:
                break;
        }
    }
    //===========================SET STATE TAI DAY==========================================
    _CheckTien = () => {
        // Utils.nlog("<><>1.-----", this.state.TongMucTienPhat.split(',').join(""))
        // Utils.nlog("<><>2.-----", this.state.selectLinhVuc.MucPhat)
        // if (this.state.TongMucTienPhat.split(',').join("") > this.state.selectLinhVuc.MucPhat) {
        //     Utils.showMsgBoxOK(this, "Th??ng b??o", "T???ng ti???n ph???t ???? l???n h??n m???c ph???t")
        //     return;
        // }
    }
    onChangeTextIndex = (val, index) => {
        switch (index) {
            case KeyForm.CanNhanToChuViPham:
                this.setState({ FullName: val })
                break;
            case KeyForm.CapCoThamQuyenXuPhat:
                this.setState({ selectThamQuyenXP: val }, this.GetCaNhanQuyetDinhXuPhat)
                break;
            case KeyForm.CaNhanQuyetDinhXuPhat:
                this.setState({ selectCaNhanXP: val })
                break;
            case KeyForm.NgaySinh:
                this.setState({ NgaySinh: val })
                break;
            case KeyForm.QuocTich:
                Utils.nlog('callback quoc tich', val)
                this.setState({ selectQuocTich: val })
                break;
            case KeyForm.NguyenQuan:
                this.setState({ NguyenQuan: val })
                break;
            case KeyForm.HoKhauThuongTru:
                this.setState({ NoiDKHKTT: val })
                break;
            case KeyForm.DiaChiHienTai:
                this.setState({ DiaChiHT: val })
                break;
            case KeyForm.CMND:
                this.setState({ CMND: val })
                break;
            case KeyForm.LinhVuc:
                this.setState({ selectLinhVuc: val })
                this.setState({ TongMucTienPhat: val.MucPhat })
                break;
            case KeyForm.HanhViViPham:
                this.setState({ HanhViVPDTH: val })
                break;
            case KeyForm.CanCuPhapLyXuPhat:
                this.setState({ CanCuPhapLy: val })
                break;
            case KeyForm.TongMucTienPhat:
                // Utils.nlog("<>11------", Number(val.split(',').join("")))
                // Utils.nlog("<>22------", Number(this.state.selectLinhVuc.MucPhat))
                if (Number(val.split(',').join("")) > Number(this.state.selectLinhVuc.MucPhat)) {
                    Utils.showMsgBoxOK(this, "Th??ng b??o", "T???ng ti???n ph???t ???? l???n h??n m???c ph???t", 'X??c nh???n')
                    return;
                }
                this.setState({ TongMucTienPhat: val })
                break;
            case KeyForm.HinhThucXuPhatBoSung:
                this.setState({ HinhThucPhatBoSung: val })
                break;
            case KeyForm.BienPhanNganChanVaDamBao:
                this.setState({ BienPhapNganChan: val })
                break;
            case KeyForm.NgayQDXuPhat:
                this.setState({ NgayQDXP: val })
                break;
            // case KeyForm.CoQuanThiHanh:
            //     this.setState({ selectCoQuanTH: val }, this.GetCaNhanCoTrachNhiemThiHanh)
            //     break;
            case KeyForm.CaNhanCoTrachNhiemToChucThiHanh:
                this.setState({ selectCaNhanTNTH: val })
                break;
            case KeyForm.TrangThaiThiHanh:
                this.setState({ selectTrangThai: val })
                break;
            case KeyForm.NgayThucThi:
                this.setState({ NgayThucThi: val })
                break;
            case KeyForm.SoNgayQuaHan:
                this.setState({ SLNgayQuaHan: val })
                break;
            case KeyForm.NgayCap:
                this.setState({ NgayCap: val })
                break;
            case KeyForm.NoiCap:
                this.setState({ NoiCap: val })
                break;
            case KeyForm.SoDienThoai:
                this.setState({ PhoneNumber: val })
                break;
            case KeyForm.TenCongTy:
                this.setState({ TenCongTy: val })
                break;
            case KeyForm.MaSoCongTy:
                this.setState({ MaSoCongTy: val })
                break;
            default:
                break;
        }
    }
    //H??m render c??c component
    _renderDesignForm = (idRender) => {
        let { design,
            selectViPham, selectThamQuyenXP, selectCaNhanXP, NgaySinh, selectQuocTich,
            NguyenQuan, NoiDKHKTT, DiaChiHT, CMND, selectLinhVuc, HanhViVPDTH, CanCuPhapLy,
            TongMucTienPhat, HinhThucPhatBoSung, BienPhapNganChan, NgayQDXP, selectCoQuanTH,
            selectCaNhanTNTH, selectTrangThai, OnEdit, NgayThucThi, SLNgayQuaHan, FullName, isAddNew, NgayCap, NoiCap, PhoneNumber, TenCongTy, isCheckCaNhan, MaSoCongTy } = this.state

        let keyRender = design.findIndex(Key => Key === idRender);

        if (keyRender >= 0) {
            switch (design[keyRender]) {
                case KeyForm.CanNhanToChuViPham:
                    return <CompForm.CompCaNhanToChucViPham value={FullName} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.CanNhanToChuViPham)} isCheckCaNhan={isCheckCaNhan} isEdit={!this.isRead} /> // isEdit={isAddNew ? isAddNew : false} 
                case KeyForm.CapCoThamQuyenXuPhat:
                    return <CompForm.CompCapCoThamQuyenQDXP value={selectThamQuyenXP.TenCap} onPress={() => this._dropDown(KeyForm.CapCoThamQuyenXuPhat)} isEdit={!this.isRead} />
                case KeyForm.CaNhanQuyetDinhXuPhat:
                    return <CompForm.CompCaNhanQDXP value={selectCaNhanXP.FullName} onPress={() => this._dropDown(KeyForm.CaNhanQuyetDinhXuPhat)} isEdit={!this.isRead} />
                //THong tin ng?????i d??ng chi hien thi=============================   
                case KeyForm.NgaySinh:
                    return <CompForm.CompNgaySinh value={NgaySinh ? moment(NgaySinh, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY') : ''} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NgaySinh)} isEdit={!this.isRead} />
                case KeyForm.QuocTich:
                    return <CompForm.CompQuocTich value={selectQuocTich.TenQuocTich} onPress={() => this._dropDown(KeyForm.QuocTich)} isEdit={!this.isRead} />
                case KeyForm.NguyenQuan:
                    return <CompForm.CompNguyenQuan value={NguyenQuan} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NguyenQuan)} isEdit={!this.isRead} />
                case KeyForm.HoKhauThuongTru:
                    return <CompForm.CompNoiDKHKTT value={NoiDKHKTT} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.HoKhauThuongTru)} isEdit={!this.isRead} />
                case KeyForm.DiaChiHienTai:
                    return <CompForm.CompDiaChiHienTai value={DiaChiHT} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.DiaChiHienTai)} isEdit={!this.isRead} isCheckCaNhan={isCheckCaNhan} />
                case KeyForm.SoDienThoai:
                    return <CompForm.CompSoDienThoai maxlength={10} value={PhoneNumber} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.SoDienThoai)} isEdit={!this.isRead} />
                case KeyForm.CMND:
                    return <CompForm.CompCMND maxlength={12} value={CMND} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.CMND)} isEdit={!this.isRead} />
                case KeyForm.NgayCap:
                    return <CompForm.CompNgayCap value={NgayCap ? moment(NgayCap, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY') : ''} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NgayCap)} isEdit={!this.isRead} />
                case KeyForm.NoiCap:
                    return <CompForm.ComNoiCap value={NoiCap} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NoiCap)} isEdit={!this.isRead} />
                //================================================================
                case KeyForm.LinhVuc:
                    return <CompForm.CompLinhVuc value={selectLinhVuc.LinhVuc} onPress={() => this._dropDown(KeyForm.LinhVuc)} isEdit={!this.isRead} />
                case KeyForm.HanhViViPham:
                    return <CompForm.CompHanhViViPham value={HanhViVPDTH} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.HanhViViPham)} isEdit={!this.isRead} />
                case KeyForm.CanCuPhapLyXuPhat:
                    return <CompForm.CompCanCuPhapLyXuPhat value={CanCuPhapLy} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.CanCuPhapLyXuPhat)} isEdit={!this.isRead} />
                case KeyForm.TongMucTienPhat:
                    return <CompForm.CompTongTienPhat value={Utils.inputMoney(TongMucTienPhat)} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.TongMucTienPhat)} isEdit={!this.isRead} />
                case KeyForm.HinhThucXuPhatBoSung:
                    return <CompForm.CompHinhThucPhatBoSung value={HinhThucPhatBoSung} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.HinhThucXuPhatBoSung)} isEdit={!this.isRead} />
                case KeyForm.BienPhanNganChanVaDamBao:
                    return <CompForm.CompBienPhapNganChan value={BienPhapNganChan} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.BienPhanNganChanVaDamBao)} isEdit={!this.isRead} />
                case KeyForm.NgayQDXuPhat:
                    return <CompForm.CompNgayQDXP value={NgayQDXP ? moment(NgayQDXP, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY') : ''} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NgayQDXuPhat)} isEdit={!this.isRead} />
                // case KeyForm.CoQuanThiHanh:
                //     return <CompForm.CompCoQuanThiHanh value={selectCoQuanTH.TenPhuongXa} onPress={() => this._dropDown(KeyForm.CoQuanThiHanh)} isEdit={!this.isRead} />
                // case KeyForm.CaNhanCoTrachNhiemToChucThiHanh:
                //     return <CompForm.CompCaNhanCoTrachNhiemTCTH value={selectCaNhanTNTH.FullName} onPress={() => this._dropDown(KeyForm.CaNhanCoTrachNhiemToChucThiHanh)} isEdit={!this.isRead} />
                case KeyForm.TrangThaiThiHanh:
                    return <CompForm.CompTrangThai value={selectTrangThai.TenTrangThai} onPress={() => this._dropDown(KeyForm.TrangThaiThiHanh)} isEdit={this.isAdd} />
                case KeyForm.NgayThucThi:
                    return OnEdit == false ? <CompForm.CompNgayThucThi value={NgayThucThi ? moment(NgayThucThi, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY') : ''} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.NgayThucThi)}
                        isEdit={false}
                    /> : null
                case KeyForm.SoNgayQuaHan:
                    return OnEdit == false ? <CompForm.CompSoNgayQuaHan value={SLNgayQuaHan.toString()} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.SoNgayQuaHan)} isEdit={false} /> : null
                case KeyForm.TenCongTy:
                    return <CompForm.CompTenCongTy value={TenCongTy} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.TenCongTy)} isEdit={!this.isRead} /> //isEdit={isAddNew ? isAddNew : false} 
                case KeyForm.MaSoCongTy:
                    return <CompForm.CompMaSoCongTy value={MaSoCongTy} onChangTextIndex={(val) => this.onChangeTextIndex(val, KeyForm.MaSoCongTy)} isEdit={!this.isRead} /> //isEdit={isAddNew ? isAddNew : false} 
                default:
                    break;
            }
        }
    }
    //X??? l?? c??c file th??m m???i
    _handleListFileNew = async () => {
        const { ListFileDinhKemNew } = this.state;
        let arrFileNew = [], arrFileDelete = []
        if (ListFileDinhKemNew.length > 0) {
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                const element = ListFileDinhKemNew[index];
                let str64 = '', extent = ''
                if (element.type == 3) {
                    str64 = await Utils.parseBase64(element.uri)
                } else {
                    str64 = await Utils.parseBase64(element.uri, element.height ? element.height : 2000, element.width ? element.width : 2000)
                }

                if (element.type == 1) {
                    extent = '.png'
                } else if (element.type == 2) {
                    extent = '.mp4'
                } else {
                    extent = '.' + element.name.split('.')[element.name.split('.').length - 1]
                }
                arrFileNew.push({
                    IsDel: false,
                    Isnew: true,
                    extension: extent,
                    filename: element.type == 3 ? element.name : `filename${index}${extent}`,
                    strBase64: str64,
                    type: element.type
                })
            }
        }

        return arrFileNew;
    }
    //X??? l?? file delete l?? c??c file api ???? tr??? v???
    _handleListFileUpdate = () => {
        let arrFileDelete = []
        const { ListFileDinhKemDelete } = this.state;
        if (ListFileDinhKemDelete.length > 0) {
            for (let index = 0; index < ListFileDinhKemDelete.length; index++) {
                const element = ListFileDinhKemDelete[index];
                arrFileDelete.push({
                    IdRow: element.IdRow,
                    IsDel: true,
                    Isnew: false,
                    filename: element.TenFile
                })
            }
        }

        return arrFileDelete;
    }
    _OnSaveBienBan = async () => {
        nthisIsLoading.show()
        let {
            selectViPham, selectThamQuyenXP, selectCaNhanXP, NgaySinh,
            selectQuocTich, NguyenQuan, NoiDKHKTT, DiaChiHT,
            CMND, selectLinhVuc, HanhViVPDTH, CanCuPhapLy,
            TongMucTienPhat, HinhThucPhatBoSung, BienPhapNganChan,
            NgayQDXP, selectCoQuanTH, selectCaNhanTNTH,
            selectTrangThai, NgayThucThi, SLNgayQuaHan, MaDon, SearchCMND, FullName, NgayCap, NoiCap, PhoneNumber, dataUser, isCheckCaNhan, TenCongTy, SoNgayThucThi, MaSoCongTy } = this.state

        let warning = ''


        if (!isCheckCaNhan && !TenCongTy) {
            warning += 'T??n c??ng ty.\n'
        }
        if (!isCheckCaNhan && !MaSoCongTy) {
            warning += 'M?? doanh nghi???p.\n'
        }
        if (!FullName) {
            warning += isCheckCaNhan ? 'C?? nh??n vi ph???m.\n' : 'Ng?????i ?????i di???n.\n'
        }
        if (!NgaySinh) {
            warning += 'Ng??y sinh.\n'
        }
        if (!selectQuocTich) {
            warning += 'Qu???c t???ch.\n'
        }
        if (!NguyenQuan) {
            warning += 'Nguy??n qu??n.\n'
        }
        if (!NoiDKHKTT) {
            warning += 'N??i ????ng k?? HKTT.\n'
        }
        if (!DiaChiHT) {
            warning += isCheckCaNhan ? '?????a ch??? hi???n t???i.\n' : '?????a ch???.\n'
        }
        if (!PhoneNumber) {
            warning += 'S??? ??i???n tho???i.\n'
        }
        if (!CMND) {
            warning += 'Ch???ng minh nh??n d??n.\n'
        }
        if (!NgayCap) {
            warning += 'Ng??y c???p.\n'
        }
        if (!NoiCap) {
            warning += 'N??i c???p.\n'
        }
        if (!selectThamQuyenXP) {
            warning += 'C???p c?? th???m quy???n quy???t ?????nh x??? ph???t.\n'
        }
        if (!selectCaNhanXP) {
            warning += 'C?? nh??n quy???t ?????nh x??? ph???t.\n'
        }
        if (selectLinhVuc == '') {
            warning += 'L??nh v???c.\n'
        }
        if (!HanhViVPDTH) {
            warning += 'H??nh vi vi ph???m h??nh ch??nh ???? th???c hi???n.\n'
        }
        if (!CanCuPhapLy) {
            warning += 'C??n c??? ph??p l?? x??? ph???t.\n'
        }
        if (TongMucTienPhat == 0) {
            warning += 'T???ng m???c ti???n ph???t.\n'
        }
        if (!NgayQDXP) {
            warning += 'Ng??y quy???t ?????nh x??? ph???t c?? hi???u l???c.\n'
        }
        if (!SoNgayThucThi) {
            warning += 'S??? ng??y th???c thi.\n'
        }
        if (!selectTrangThai) {
            warning += 'Tr???ng th??i thi h??nh.\n'
        }
        if (warning != '') {
            nthisIsLoading.hide()
            Utils.showMsgBoxOK(this, 'B???n ch??a ch???n/nh???p c??c tr?????ng:', warning, 'X??c nh???n')
            return;
        }

        //Body dung chung
        let body = {
            BienPhap: BienPhapNganChan ? BienPhapNganChan : '',
            BoSung: HinhThucPhatBoSung ? HinhThucPhatBoSung : '',
            CaNhanQDXP: selectCaNhanXP.UserID,
            // CaNhanThiHanh: selectCaNhanXP.UserID,
            CaNhanThiHanh: dataUser.UserID, // L???y IDUser
            CanCuPhapLy: CanCuPhapLy ? CanCuPhapLy : '',
            CapQDXP: selectThamQuyenXP.IdThamQuyen,
            // CoQuanThiHanh: selectCoQuanTH.MaPX ? selectCoQuanTH.MaPX : '',
            ToChucViPham: FullName ? FullName : '',
            CMND: CMND ? CMND : '',
            DiaChiHienTai: DiaChiHT ? DiaChiHT : '',
            HKTT: NoiDKHKTT ? NoiDKHKTT : '',
            NguyenQuan: NguyenQuan ? NguyenQuan : '',
            QuocTich: selectQuocTich.Code ? selectQuocTich.Code : '',
            NgaySinh: moment(NgaySinh, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            NgayCap: moment(NgayCap, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            NoiCap: NoiCap ? NoiCap : '',
            PhoneNumber: PhoneNumber ? PhoneNumber : '',
            FileViPham: [],
            HanhVi: HanhViVPDTH ? HanhViVPDTH : '',
            Id: 0,
            LinhVuc: selectLinhVuc.IdLinhVuc,
            MaDon: MaDon,
            NgayHieuLuc: moment(NgayQDXP, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            Status: selectTrangThai.Id,
            TongMucPhat: TongMucTienPhat,
            TenCongTy: TenCongTy ? TenCongTy : '',
            CaNhan: isCheckCaNhan ? true : false,
            SoNgayThucThi: SoNgayThucThi,
            MaSoThue: MaSoCongTy,
        }



        //  isAdd: true l?? th??m m???i bi??n b???n, isAdd: false c???p nh???t ch???nh s???a bi??n b???n
        // Utils.nlog('User ID', this.ItemXuPhat)
        if (this.isAdd || this.ItemXuPhat.CMND != SearchCMND) {
            const listFileAdd = await this._handleListFileNew()
            // Utils.nlog('ListFile', listFileAdd)
            body = {
                ...body,
                FileViPham: listFileAdd,
            }
            Utils.nlog('=====BODY ADD=====', body)
            let res = await apis.ApiXuLyHanhChinh.Save_HanhChinh(body);
            Utils.nlog('res add new XPHC ?????????????', res)
            if (res.status == 1) {
                nthisIsLoading.hide()
                Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Th??m bi??n b???n x??? ph???t h??nh ch??nh th??nh c??ng.', 'X??c nh???n', () => {
                    this.callback();
                    Utils.goback(this);
                })
            } else {
                Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Th??m bi??n b???n x??? ph???t h??nh ch??nh th???t b???i.', 'X??c nh???n')
                nthisIsLoading.hide()
            }

        } else {
            //Cap nhat lai form xuphat hanh chinh
            const listFileAdd = await this._handleListFileNew()
            const listFileUpdate = await this._handleListFileUpdate()
            // Utils.nlog('ListFile', listFileUpdate)
            body = {
                ...body,
                Id: this.ItemXuPhat.ID,
                FileViPham: listFileAdd,
                fileUpDate: {
                    IdPA: this.ItemXuPhat.ID,
                    LstImg: [...listFileAdd, ...listFileUpdate,],
                }
            }
            Utils.nlog('=====BODY UPDATE=====', body)
            let res = await apis.ApiXuLyHanhChinh.Save_HanhChinh(body);
            Utils.nlog('res update XPHC ?????????????', res)
            if (res.status == 1) {
                nthisIsLoading.hide()
                Utils.showMsgBoxOK(this, 'Th??ng b??o', 'C???p nh???t bi??n b???n x??? ph???t h??nh ch??nh th??nh c??ng.', 'X??c nh???n', () => {
                    this.callback();
                    Utils.goback(this);
                })
            } else {
                Utils.showMsgBoxOK(this, 'Th??ng b??o', res.error.message, 'X??c nh???n')
                nthisIsLoading.hide()
            }
        }
    }
    // Callback get lai thong tin ca nhan to chuc vi pham khi t???o c???p nh???t t??i kho???n
    callbackCapNhatTK = async (item = {}) => {
        // Utils.nlog('user update', item)
        this.onChangeTextIndex(item, KeyForm.CanNhanToChuViPham)
        // this.getInfoAccount(item.UserID)
    }
    _CheckCaNhan = (val) => {
        // Utils.nlog("<>this.refPick<>", this.refPick)
        this.refPick?.current?.refreshData([])
        this.setState({
            isCheckCaNhan: val,
            TenCongTy: '',
            MaSoCongTy: '',
            TenCaNhanThiHanh: '',
            FullName: '',
            NgaySinh: '',
            NguyenQuan: '',
            NoiDKHKTT: '',
            DiaChiHT: '',
            CMND: '',
            SearchCMND: '',
            NgayCap: '',
            NoiCap: '',
            PhoneNumber: '',
            selectThamQuyenXP: '',
            selectCaNhanXP: '',
            selectLinhVuc: '',
            HanhViVPDTH: '',
            CanCuPhapLy: '',
            TongMucTienPhat: '',
            HinhThucPhatBoSung: '',
            BienPhapNganChan: '',
            SoNgayThucThi: '',
            ListFileDinhKem: [],
            ListFileDinhKemNew: [],
            ListFileDinhKemDelete: [],
            selectQuocTich: { "Code": "VN", "TenQuocTich": "VIET NAM" },

        })
    }
    render() {
        let { selectViPham, OnEdit, Rule, ListFileDinhKem, ListFileDinhKemNew, ListFileDinhKemDelete, SearchCMND, FullName, isCheckInfo, CMND,
            isCheckCaNhan, selectLinhVuc, dataUser, TenCaNhanThiHanh, SoNgayThucThi, MaSoCongTy } = this.state
        return (
            <View style={nstyles.ncontainer} >
                <HeaderCom
                    nthis={this}
                    titleText={'X??? l?? h??nh ch??nh'}
                    // styleContent={{ backgroundColor: colors.colorStarYellow }}
                    iconLeft={Images.icBack}
                    iconRight={this.isRead ? null : Images.icSave}
                    customStyleIconRight={{ tintColor: 'white' }}
                    onPressLeft={() => {
                        this.callback();
                        this.isDSThongKeDV ? Utils.goscreen(this, 'sc_ChiTietThongKeDonVi') : this.isTKTienXP ? Utils.goscreen(this, 'sc_ThongKeTienXPHC_ChiTiet') : this.isTKXPHC ? Utils.goscreen(this, 'DanhSachCTChung') : Utils.goback(this)
                    }}
                    onPressRight={this.isRead ? () => { } : this._OnSaveBienBan}
                    hiddenIconRight={this.isDSThongKeDV || this.isTKTienXP ? true : false}
                />

                <KeyboardAwareScrollView extraHeight={120} style={{ backgroundColor: 'white' }} contentContainerStyle={{ paddingBottom: isIphoneX() ? 30 : 5, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
                    <Animatable.View animation={'zoomInDown'} delay={100}>
                        {this.ItemXuPhat != null ? null :
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, marginTop: 5 }}>
                                <TouchableOpacity style={{
                                    flexDirection: 'row', borderWidth: 0.5, paddingHorizontal: 15, paddingVertical: 8,
                                    borderColor: colors.black_16, borderRadius: 5
                                }} onPress={() => this._CheckCaNhan(true)}>
                                    <Image source={isCheckCaNhan ? Images.icRadioChk : Images.icRadioUnChk} style={{ width: 20, height: 20, }} />
                                    <Text style={{ marginLeft: 5, alignSelf: 'center', fontSize: reText(16), color: colors.black_80, fontWeight: 'bold' }}>
                                        C?? nh??n</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    flexDirection: 'row', borderWidth: 0.5, paddingHorizontal: 15, paddingVertical: 8,
                                    borderColor: colors.black_16, borderRadius: 5
                                }} onPress={() => this._CheckCaNhan(false)}>
                                    <Image source={!isCheckCaNhan ? Images.icRadioChk : Images.icRadioUnChk} style={{ width: 20, height: 20 }} />
                                    <Text style={{ marginLeft: 5, alignSelf: 'center', fontSize: reText(16), color: colors.black_80, fontWeight: 'bold' }}>
                                        T??? ch???c</Text>
                                </TouchableOpacity>
                            </View>}

                        {!this.isRead && !this.isSua ?
                            <>
                                <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{isCheckCaNhan ? 'CMND/C??n c?????c c??ng d??n' : 'M?? s??? doanh nghi???p'}</Text>
                                <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TextInput
                                        editable={!this.isRead}
                                        placeholder={isCheckCaNhan ? `Nh???p CMND/C??n c?????c c??ng d??n` : `Nh???p m?? s??? doanh nghi???p`}
                                        style={{
                                            borderColor: colors.brownGreyTwo, borderRadius: 7,
                                            alignItems: 'center', borderWidth: 0.5, flex: 1,
                                            height: Height(5), paddingHorizontal: 10
                                        }}
                                        keyboardType={isCheckCaNhan ? 'numeric' : 'default'}
                                        // value={isCheckCaNhan ? SearchCMND : MaSoCongTy}
                                        value={SearchCMND}
                                        onChangeText={(text) => this.setState({ SearchCMND: text })}

                                    />
                                    {this.state.isCheckCaNhan ?
                                        <TouchableOpacity onPress={() => Utils.goscreen(this, 'ModalScanQR_Info', {
                                            callback: (val) => this.setState({ SearchCMND: val.split('|')[0] },
                                                this.getInfoAccount
                                            )
                                        })}>
                                            <Image source={Images.icQR} style={{ width: Width(8), height: Width(8), marginLeft: 5, tintColor: colors.greenyBlue }} />
                                        </TouchableOpacity> : null}
                                    <TouchableOpacity
                                        onPress={this.getInfoAccount}
                                        style={{ backgroundColor: colors.colorBlueLight, padding: 9, borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                        <Image source={Images.icSearchGrey} style={[nstyles.nIcon24], { tintColor: colors.white, marginRight: 5 }} />
                                        <Text style={{ color: colors.white, fontSize: reText(14), paddingVertical: 5 }}>{`T??m ki???m`}</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                            : null}

                        {
                            isCheckInfo ?
                                <Animatable.Text animation={"bounceIn"} style={{ fontStyle: 'italic', paddingHorizontal: 10, paddingVertical: 5, fontSize: reText(12), color: colors.redStar, fontWeight: 'bold' }}>
                                    {isCheckCaNhan ? 'CMND/CCCD ch??a t???n t???i. Vui l??ng nh???p th??ng tin C?? nh??n vi ph???m !' : 'M?? doanh nghi???p ch??a t???n t???i. Vui l??ng nh???p th??ng tin T??? ch???c vi ph???m !'}
                                </Animatable.Text>
                                : null
                        }
                        {
                            FullName ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                                    {/* <TouchableHighlight
                                        onPress={() => Utils.goscreen(this, 'FormTaoTaiKhoanDH', { ListRule: Rule, User: SearchCMND, callback: this.callbackCapNhatTK })}
                                        underlayColor={colors.colorSalmon}
                                        style={{ backgroundColor: '#EB4D7B', borderRadius: 5, flex: 1, }}
                                    >
                                        <Text style={{ padding: 10, color: colors.white, fontWeight: 'bold', textAlign: 'center', fontSize: reText(12) }} numberOfLines={1}>{'T???o/C???p nh???t t??i kho???n'}</Text>
                                    </TouchableHighlight> */}

                                    <TouchableHighlight
                                        onPress={() => Utils.goscreen(this, this.isTKXPHC || this.isDSThongKeDV || this.isTKTienXP ? 'Modal_DanhSachTKXPHC' : 'Modal_DanhSachCDViPham',
                                            { UserID: isCheckCaNhan ? CMND : MaSoCongTy, isTKXPHC: this.isTKXPHC, isDSThongKeDV: this.isDSThongKeDV, isTKTienXP: this.isTKTienXP })}
                                        underlayColor={colors.softBlue}
                                        style={{ backgroundColor: colors.colorBlueLight, borderRadius: 5, flex: 1, alignItems: 'center', marginLeft: 5 }}
                                    >
                                        <Text style={{ padding: 10, color: colors.white, fontWeight: 'bold', textAlign: 'center', fontSize: reText(12) }} numberOfLines={1}>{'Danh s??ch vi ph???m'}</Text>
                                    </TouchableHighlight>
                                </View>
                                : null
                        }
                        <View style={{ marginHorizontal: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} >
                            <View style={{ height: 1, backgroundColor: '#EB4D7B', flex: 1 }} />
                            <Text style={{ fontWeight: 'bold', color: '#EB4D7B' }}>
                                {isCheckCaNhan ? 'Th??ng tin c?? nh??n vi ph???m' : 'Th??ng tin t??? ch???c vi ph???m'}
                            </Text>
                            <View style={{ height: 1, backgroundColor: '#EB4D7B', flex: 1 }} />
                        </View>
                        {this.isRead ? null :
                            <>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'ModalScanQR_Info', {
                                    callback: (val) => {
                                        this.setState(
                                            {
                                                CMND: val.split('|')[0],
                                                FullName: val.split('|')[2],
                                                NgaySinh: moment(val.split('|')[3], 'DDMMYYYY').format('DD/MM/YYYY'),
                                                NoiDKHKTT: val.split('|')[5],
                                                NgayCap: moment(val.split('|')[6], 'DDMMYYYY').format('DD/MM/YYYY')
                                            })
                                    }
                                })}
                                    style={{ marginHorizontal: 10, flexDirection: 'row', marginBottom: 2 }}>
                                    <Text style={{ color: colors.greenyBlue, fontSize: reText(16), fontWeight: 'bold' }}>Qu??t QR Code</Text>
                                    <Image source={Images.icQR} style={{ tintColor: colors.greenyBlue, width: 20, height: 20, marginLeft: 5, alignSelf: 'center' }} />
                                </TouchableOpacity>
                                <Text style={{ marginHorizontal: 10, marginBottom: 5, fontSize: reText(12), fontStyle: 'italic' }}>(B???n c?? th??? qu??t m?? QR tr??n CCCD ????? ??i???n nhanh c??c th??ng tin c?? nh??n)</Text>
                            </>}
                        {isCheckCaNhan ? null : this._renderDesignForm(KeyForm.TenCongTy)}
                        {isCheckCaNhan ? null : this._renderDesignForm(KeyForm.MaSoCongTy)}
                        {isCheckCaNhan ? null : this._renderDesignForm(KeyForm.DiaChiHienTai)}
                        {this._renderDesignForm(KeyForm.CanNhanToChuViPham)}

                        {this._renderDesignForm(KeyForm.NgaySinh)}
                        {this._renderDesignForm(KeyForm.QuocTich)}
                        {this._renderDesignForm(KeyForm.NguyenQuan)}
                        {this._renderDesignForm(KeyForm.HoKhauThuongTru)}
                        {isCheckCaNhan ? this._renderDesignForm(KeyForm.DiaChiHienTai) : null}
                        {this._renderDesignForm(KeyForm.SoDienThoai)}
                        {this._renderDesignForm(KeyForm.CMND)}
                        {this._renderDesignForm(KeyForm.NgayCap)}
                        {this._renderDesignForm(KeyForm.NoiCap)}
                        <View style={{ marginHorizontal: 10, marginVertical: 20, flexDirection: 'row', alignItems: 'center' }} >
                            <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                            <Text style={{ fontWeight: 'bold', color: colors.colorBlueLight }}>
                                Th???m quy???n x??? ph???t
                            </Text>
                            <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                        </View>
                        {this._renderDesignForm(KeyForm.CapCoThamQuyenXuPhat)}
                        {this._renderDesignForm(KeyForm.CaNhanQuyetDinhXuPhat)}
                        <View style={{ marginHorizontal: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} >
                            <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                            <Text style={{ fontWeight: 'bold', color: colors.colorBlueLight }}>
                                N???i dung x??? ph???t
                            </Text>
                            <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                        </View>
                        {this._renderDesignForm(KeyForm.LinhVuc)}
                        {selectLinhVuc && !this.isRead ?
                            <View style={{ marginHorizontal: 10, flexDirection: 'row', marginTop: 10, marginBottom: 5 }}>
                                <Text style={{ fontSize: reText(15), fontStyle: 'italic', color: colors.black_60 }}>M???c ph???t: </Text>
                                <Text style={{ fontSize: reText(15), color: colors.redStar, fontWeight: 'bold' }}>{Utils.formatMoney(selectLinhVuc.MucPhat)}</Text>
                                <Text style={{ fontSize: reText(15), fontStyle: 'italic', color: colors.black_60 }}> VN??</Text>
                            </View> : null}
                        {this._renderDesignForm(KeyForm.HanhViViPham)}
                        {this._renderDesignForm(KeyForm.CanCuPhapLyXuPhat)}
                        {this._renderDesignForm(KeyForm.TongMucTienPhat)}
                        {this._renderDesignForm(KeyForm.HinhThucXuPhatBoSung)}
                        {this._renderDesignForm(KeyForm.BienPhanNganChanVaDamBao)}
                        {this._renderDesignForm(KeyForm.NgayQDXuPhat)}
                        <View style={{ marginHorizontal: 10, marginTop: 5 }}>
                            <Text style={{ marginBottom: 5 }}>S??? ng??y thi h??nh<Text style={{ color: colors.redStar, fontSize: 16 }}>*</Text></Text>
                            {!this.isRead ?
                                <TextInput style={{ borderWidth: 1, paddingVertical: 10, paddingHorizontal: 5, borderColor: colors.colorGrayIcon, borderRadius: 5 }}
                                    keyboardType='numeric' value={SoNgayThucThi + ''} onChangeText={(val) => this.setState({ SoNgayThucThi: val })} placeholder={'S??? ng??y thi h??nh'} />
                                : <View style={{ borderWidth: 1, paddingVertical: 10, paddingHorizontal: 5, borderColor: colors.colorGrayIcon, borderRadius: 5 }}>
                                    <Text>{SoNgayThucThi + ''}</Text>
                                </View>}

                        </View>
                        {/* {this._renderDesignForm(KeyForm.CoQuanThiHanh)}
                        {this._renderDesignForm(KeyForm.CaNhanCoTrachNhiemToChucThiHanh)} */}
                        <View style={{ marginHorizontal: 10, marginTop: 5 }}>
                            <Text style={{ marginBottom: 5 }}>C?? nh??n c?? tr??ch nhi???m t??? ch???c thi h??nh</Text>
                            <View style={{ borderWidth: 1, paddingVertical: 10, paddingHorizontal: 5, borderColor: colors.colorGrayIcon, borderRadius: 5 }}>
                                <Text>{this.ItemXuPhat != null ? TenCaNhanThiHanh : dataUser.FullName}</Text>
                            </View>
                        </View>

                        {this._renderDesignForm(KeyForm.TrangThaiThiHanh)}
                        {this._renderDesignForm(KeyForm.NgayThucThi)}
                        {this._renderDesignForm(KeyForm.SoNgayQuaHan)}
                        <View style={{ marginHorizontal: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center' }} >
                            <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                            <Text style={{ fontWeight: 'bold', color: colors.colorBlueLight }}>
                                File ????nh k??m
                            </Text>
                            <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                        </View>
                        <ImagePicker data={ListFileDinhKem}
                            ref={this.refPick}
                            NumberMax={4}
                            isEdit={!this.isRead}
                            keyname={"TenFile"} uniqueKey={'Link'} nthis={this}
                            onDeleteFileOld={(data) => {
                                let dataNew = [].concat(ListFileDinhKemDelete).concat(data)
                                this.setState({ ListFileDinhKemDelete: dataNew })
                            }}
                            onAddFileNew={(data) => {
                                this.setState({ ListFileDinhKemNew: data })
                            }}
                            onUpdateDataOld={(data) => {
                                this.setState({ ListFileDinhKem: data })
                            }}

                        >
                        </ImagePicker>
                    </Animatable.View>
                </KeyboardAwareScrollView>
                <IsLoading />
            </View >
        )
    }
}

export default FormXuPhatHC
