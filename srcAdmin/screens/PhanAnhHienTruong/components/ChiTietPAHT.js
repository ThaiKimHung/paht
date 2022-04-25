import React, { Component, Fragment } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Linking,
    TextInput,
    Platform,
    ScrollView,
    Keyboard,
    BackHandler
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

import { nstyles, Width, paddingBotX, khoangcach, Height } from '../../../../styles/styles'
import { colors } from '../../../../styles'
import Utils from '../../../../app/Utils'
import { HeaderCom, ButtonCom, TextInputCom, ListEmpty, IsLoading } from '../../../../components'
import { Images } from '../../../images'
import { sizes } from '../../../../styles'
import ButtonCus from '../../../../components/ComponentApps/ButtonCus'
import ItemNhatKy from './ItemNhatKy';
import ItemGhiChu from './ItemGhiChu';
import Apis from '../../../apis'
import ModalLoading from '../../../../components/ComponentApps/ModalLoading'
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import ImageFileCus from './ImageFileCus';
import HtmlViewCom from '../../../../components/HtmlView';
import ComponentChiTiet from './ComponentChiTiet';
import apis from '../../../apis';
import { appConfig } from '../../../../app/Config';
import { ConfigScreenDH } from '../../../routers/screen';
import AppCodeConfig from '../../../../app/AppCodeConfig';
import { ListHinhAnhCom } from './ListHinhAnh';
import * as Animatable from 'react-native-animatable';
import ImagePickerNew from '../../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus';
import { ConfigOnline } from '../../../../app/ConfigOnline';
const list_tab = [{
    id: 0,
    text: 'Nhật ký'
}, {
    id: 1,
    text: 'Ghi chú'
}, {
    id: 2,
    text: 'Tương tác'
}]

//Định nghĩa file
const typeHinh = 1
const typeLink = 2// gồm excel,doc,...

// {Định nghĩa button: để chuyển Modal,Screen}
const batdau = 0
const xacminh = 1
const phanphoi = 2
const phanphoinoibo = 12
const xuly = 3
const xulynoibo = 13
const pheduyet = 4
const pheduyetnoibo = 14
const dangtai = 5
const dangtainoibo = 15
const huy = 6
const huynoibo = 16
const ketthuc = -1
const trinhlanhdao = 8
const lanhdaoduyet = 9
const pheduyettrinhphanphoi = 19
// {button này được hiển thị theo quyền user}
const traodoi = 102
const xoasuaPA = 105
const trinhphanphoi = 18
const xoaPA = 108
const thuhoiIOC = 110
const tamdong = 22
const xacminhhashtag = 23
const tiepnhanvaphanphoi = 24 // tiếp nhận và phân phối
const khongdudieukien = 26


const btn_traodoi = {
    ButtonText: 'Trao đổi',
    IdForm: 7,//
}
const btn_xoasua = {
    ButtonText: 'Sửa, xóa phản ánh',
    IdForm: 8
}

/**
 1 địa chỉ email
 2 tiêu đề
 3 chuyên mục lĩnh vực hình thức
 4 hạn xử ly
 5 công khai
 6 Nội dung xử lý của bước trước
 7 Đơn vị xử Lý chính và phụ
 8 nội dung đơn vị xử lý 

*/
var DesignDefault = [2, 3, 4, 5, 6, 7];
const DesignTiepNhan = [2, 3, 4, 6];
const DesignTiepNhanComeback = [2, 3, 4, 6]
const DesingTrinhPhanPhoi = [2, 3];
const DesingPhanPhoiDonViXL = [2, 3];
const DesigPhanPhoi = [2, 3, 4, 6, 7];
const DesignPheDuyetPhanPhoi = [2, 6, 7];
const DesignXuLy = [2, 3, 4, 6, 7];
const DesignPheDuyet = [2, 3, 4, 6, 7];
const DesignTrinhLanhDao = [2, 3, 4, 6, 7];
const DesignPheDuyetGDCA = [2, 4, 5, 6, 7, 8];
const DesignDangTai = [2, 3, 4, 5, 6, 7, 8];

if (appConfig.IdSource == 'UB') {
    DesignTiepNhan.push(5);
    DesigPhanPhoi.push(5);
    DesignXuLy.push(5);
    DesignPheDuyet.push(5);
    DesignDangTai.push(5);
}

const listDesign = {
    "0": DesignDefault,//dành cho dèault UB
    "1": DesignTiepNhan,
    "1B": DesignTiepNhanComeback,
    "27": DesingTrinhPhanPhoi,
    "28": DesignPheDuyetPhanPhoi,
    "2": DesigPhanPhoi,
    "17": DesingPhanPhoiDonViXL,
    "3": DesignXuLy,
    "4": DesignPheDuyet,
    "24": DesignTrinhLanhDao,
    "25": DesignPheDuyetGDCA,
    "5": DesignDangTai,
    "15": DesignDefault,
    "23": DesignTiepNhan,
}
//id =1, 

class ChiTietPAHT extends Component {
    constructor(props) {
        super(props)
        let tempData = Utils.ngetParam(this, "IdPA", "");
        tempData = tempData.toString().split("|");
        this.IdPA = tempData[0];
        this.openTraDoi = tempData.length == 2 ? tempData[1] : 'false';
        Utils.nlog('XXX-tempData:', tempData);

        this.PANB = Utils.ngetParam(this, "PANB");
        this.DesignDefault = Utils.ngetParam(this, "DesignDefault", "0");
        // alert("this.DesignDefault", Utils.ngetParam(this, "DesignDefault", "0"))
        this.isMenuMore = Utils.ngetParam(this, 'isMenuMore', 0)
        this.idStep = Utils.ngetParam(this, 'idStep', 0)
        this.IsComeBackProcess = Utils.ngetParam(this, 'IsComeBackProcess', false)
        this.callback = this.PANB || this.isMenuMore < 0 || this.idStep > 0 ? () => Utils.goback(this) : Utils.ngetParam(this, "callback", () => {
            if (ROOTGlobal[nGlobalKeys.HomeDH].getThongBao)
                ROOTGlobal[nGlobalKeys.HomeDH].getThongBao()
            Linking.openURL(appConfig.deeplinkhome)
        });
        this.isTuongTac = Utils.ngetParam(this, 'isTuongTac', false)
        this.editGhiChu = false;
        this.prevIndex = null;
        this.noidung = '';
        this.checkLogin = false;
        this.index = null;
        this.checkReply = false;
        this.showGhiChu = Utils.getGlobal(nGlobalKeys.showGhiChu, '', AppCodeConfig.APP_ADMIN);
        this.showTuongTacConfig = Utils.getGlobal(nGlobalKeys.showTuongTac, false, AppCodeConfig.APP_ADMIN);
        this.state = {
            design: listDesign[this.DesignDefault] ? listDesign[this.IsComeBackProcess == true && this.DesignDefault == 1 ? `${this.DesignDefault}B` : this.DesignDefault] : DesignDefault,
            isCheck: false,
            tabActive: this.isTuongTac ? 2 : 0,
            isLoading: true,
            dataCTPA: [],
            lstFile: [],//lấy dữ liệu từ API gồm cả link(excel,doc,...) và image
            lstAction: [],
            latitube: '',
            longtitube: '',
            height: 40,
            dataNhatKy: [],
            dataGhiChu: [],
            dataTraoDoi: [],
            editGhiChu: false,
            ghichu: '',
            dataComent: [],
            IdRow: '',
            noidungPH: '',
            ruleUser: Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN),//quyen User đợi lấy từ getinfo,
            tuongtac: false,
            arrImg: [],
            arrFile: [],
            ActionDataXLKhac: [],
            options: false,
            optionsPhanHoi: false,
            pickImage: false,
            ListFileDinhKem: [],
            ListFileDinhKemNew: [],
            ListFileDinhKemDelete: [],
            showDetailPA: true
        }
        ROOTGlobal.dataGlobal._ReloadCTPADH = (IdPA) => {
            this.componentDidMount(IdPA);
        }
    }
    renderItemDesign = (id) => {
        const { design = [], dataCTPA } = this.state;
        let index = design.findIndex(d => d === id);
        if (index >= 0) {
            switch (id) {
                case 1:
                    return <ComponentChiTiet.ComponentEmailDiaChi dataCTPA={dataCTPA} />
                case 2:
                    return <ComponentChiTiet.ComponentTieuDe dataCTPA={dataCTPA} />
                case 3:
                    return <ComponentChiTiet.ComponentCMLVHTN dataCTPA={dataCTPA} />
                case 4:
                    return <ComponentChiTiet.ComponentHanXuLy dataCTPA={dataCTPA} />
                case 5:
                    return <ComponentChiTiet.ComponentHanCongKhai dataCTPA={dataCTPA} />

                case 6:
                    return <ComponentChiTiet.ComponentNoiDungXL dataCTPA={dataCTPA} IsComeBackProcess={this.IsComeBackProcess} />
                case 7:
                    return <ComponentChiTiet.ComponentDVXuLyChinhVaPhu dataCTPA={dataCTPA} />
                case 8:
                    return <ComponentChiTiet.ComponentNoiDungDVXuLy dataCTPA={dataCTPA} />
                //ComponentNoiDungDVXuLy
                default:
                    return null;
                    break;
            }
        } else {
            return null;
        }

    }

    async componentDidMount(IdPA = null) {
        if (IdPA != this.IdPA && Utils.getGlobal(nGlobalKeys.isScreenCTPA, false, AppCodeConfig.APP_ADMIN)) {
            Utils.setGlobal(nGlobalKeys.isScreenCTPA, false, AppCodeConfig.APP_ADMIN)
            Utils.push('sc_ChiTietPhanAnh', { IdPA })
        } else {
            this.setState({ isLoading: true })
            Utils.setGlobal(nGlobalKeys.isScreenCTPA, true, AppCodeConfig.APP_ADMIN)
            await this.props.SetStatus_Notify(-1)
            this._checkLogin();
            await this._getChiTietPAHT();
            Utils.nlog('Gai tri idStep => Chi Tiet', this.idStep)
            ROOTGlobal[nGlobalKeys.Reload_ChiTietPa] = this.onRefesh;
            ROOTGlobal[nGlobalKeys.Reload_NhatKyThaoTacPhanAnh] = this._GetList_NhatKyThaoTacPhanAnh;
            this.setState({ isLoading: false })
        }
        // ROOTGlobal[nGlobalKeys.Reload_ChiTietGhiChu] = this._ChiTietGhiChu;
        if (this.isTuongTac) {
            await this._getListComent()
        }
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }
    backAction = () => {
        console.log('vao go back')
        try {
            if (this.idStep > 0) Utils.goback(this)
            // this.props.SetStatus_Notify(1)
            this.callback(this);
        } catch (error) {
            // this.props.SetStatus_Notify(1)
            Utils.goback(this);
        };
        return true
    }
    componentWillUnmount() {
        ROOTGlobal.dataGlobal._ReloadCTPADH = null;
        this.props.SetStatus_Notify(1)
        Utils.setGlobal(nGlobalKeys.isScreenCTPA, false, AppCodeConfig.APP_ADMIN)
    }

    _congKhai = () => {
        if (this.state.isCheck)
            this.setState({ isCheck: false })
        else
            this.setState({ isCheck: true })
    }

    _getChiTietPAHT = async () => {
        var { ruleUser } = this.state
        let res = null;
        if (this.PANB) res = await Apis.Autonoibo.ChiTietPhanAnh(this.IdPA);
        else res = await Apis.Auto.ChiTietPhanAnh(this.IdPA);
        Utils.nlog('data chi tiet PA:', res)
        if (Number.isInteger(res) && res < 0) {
            this.setState({ isLoading: false });
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 0) {
            this.setState({ isLoading: false });
        }
        if (res.status == 1 && res.data) {
            let lstButton = [...res.data.ActionData, ...res.data.ActionDataXLKhac];
            //++Xử lý Nhiều Đơn VỊ CÙNG Xử lý và Phê Duyệt
            if (ConfigOnline.XULYPA_THEONHIEU_DV == 1) {
                const { IdDonVi = 0 } = this.props.auth?.userDH;
                if (res.data.DSDVDaXuLy?.find(item => item.MaPX == IdDonVi)) {
                    lstButton = lstButton.filter(item => !([3, 2, 22].includes(item.IdForm) && !item.IsComeBack || item.IsComeBack && item.IdForm == 23))
                }
                if (res.data.DSDVDaPheDuyet?.find(item => item.MaPX == IdDonVi)) {
                    lstButton = lstButton.filter(item => !(item.IdForm == 4 && !item.IsComeBack || item.IsComeBack && item.IdForm == 2))
                }
            }
            // Utils.nlog("gia tri list button", lstButton)
            let { ActionDataXLKhac } = res.data
            Utils.nlog('Gia tri daaaaa======================', res.data)

            const tuongtac = (res.data.TypeReference == 103 || res.data.Status == 6 || res.data.Status == 100 || (Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN))) ? true : false;
            const file = this._handleFile(res.data.ListFileDinhKemCD);
            // let IdStep_Design = res.data.IdStep; //- đợi cập nhật sau

            this.setState(
                {
                    // design: listDesign[IdStep_Design] ? listDesign[this.IsComeBackProcess == true && IdStep_Design == 1 ? `${IdStep_Design}B` : IdStep_Design] : DesignDefault,
                    dataCTPA: res.data,
                    isCheck: res.data.CongKhai,
                    // lstFile: res.data.ListFileDinhKemCD,
                    lstAction: lstButton,
                    latitube: res.data.ToaDoX,
                    longtitube: res.data.ToaDoY,
                    isLoading: false,
                    arrImg: file.arrImg,
                    arrFile: file.arrFile,
                    tuongtac,
                    ActionDataXLKhac
                }, this._GetList_NhatKyThaoTacPhanAnh);

            // Utils.nlog('file', this.state.lstFile)
        }
    }

    _handleFile = (lstFile) => {
        var arrImg = [], arrFile = [];
        if (lstFile.length > 0) {
            lstFile.forEach(item => {
                if (Utils.checkIsImage(item.Link) || Utils.checkIsVideo(item.Link)) {
                    arrImg.push({ url: item.Link })
                } else {
                    arrFile.push({ FileName: item.TenFile, Link: item.Link })
                }
            });
        }
        return {
            arrFile, arrImg
        };
    }

    _clickTab = (item) => () => {
        if (item.id == 0)
            this._GetList_NhatKyThaoTacPhanAnh();
        if (item.id == 1)
            this._ChiTietGhiChu();
        if (item.id == 2)
            this._getListComent()
        this.setState({ tabActive: item.id });
    }

    _GetList_NhatKyThaoTacPhanAnh = async () => {
        //--XU LY NOTIFI VAO FORM TRAO DOI--
        if (this.openTraDoi == "true") {
            nthisIsLoading.hide();
            let itemTraoDoi = this.state.lstAction.find(itemTD => itemTD.IdForm == traodoi);
            if (itemTraoDoi)
                this._onPressButton(itemTraoDoi);
        }
        //----------------------------------
        let res = null;
        if (this.PANB) res = await Apis.Autonoibo.GetList_NhatKyThaoTacPhanAnh(this.IdPA);
        else res = await Apis.Auto.GetList_NhatKyThaoTacPhanAnh(this.IdPA);
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        Utils.nlog('nhat ky', res)
        if (res.status == 1 && res.data.length > 0) {
            this.setState({ dataNhatKy: res.data })
        };
    }

    _ChiTietGhiChu = async (editGhiChu = false) => {
        let res = null;
        if (this.PANB) res = await Apis.Autonoibo.ChiTietGhiChu(this.IdPA);
        else res = await Apis.Auto.ChiTietGhiChu(this.IdPA);
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        Utils.nlog('ghi chu', res)
        if (res.status == 1) {
            let data = [];
            if (res.data.length > 0)
                data = res.data.map(item => {
                    return { ...item, key: `${item.IdRow}` };
                });
            this.setState({ dataGhiChu: data, editGhiChu, ghichu: '' });
        };
    }

    _onChangeText = (ghichu) => {
        this.setState({ ghichu });
    }

    addDelEditGhiChu = async (isDel = false, IdRowDel = 0, key = 0) => {
        let res = null;
        const { editGhiChu, ghichu } = this.state;
        if (ghichu.trim() == '' && isDel != true) {
            Utils.showMsgBoxOK(this, "Thông báo", "Chưa nhập nội dung ghi chú", 'Xác nhận');
            return;
        }
        this.isLoadding.show();
        let NoiDungGC = ghichu.trim();
        let IdRow = '';
        let isDelNew = false;
        if (editGhiChu) {
            //Thuc hien edit
            const item = this.state.dataGhiChu[this.prevIndex];
            IdRow = item.IdRow;
        }
        if (isDel == true) {
            isDelNew = true;
            IdRow = IdRowDel;
            NoiDungGC = ''
        }

        if (this.PANB) res = await Apis.Autonoibo.GhiChu(this.IdPA, NoiDungGC, IdRow, isDelNew);
        else res = await Apis.Auto.GhiChu(this.IdPA, NoiDungGC, IdRow, isDelNew);
        if (res && res.status == 1 && res.data) {
            this._ChiTietGhiChu();
            if (isDel == true)
                this.closeRow(key, IdRowDel);
            this.isLoadding.hide();
            return;
        }
        this.isLoadding.hide();
        Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại", "Xác nhận")
    }
    delGhiChu = async (key, rowKey) => {
        Utils.showMsgBoxYesNo(this, "Xóa ghi chú", "Bạn có chắc chắn muốn xóa ghi chú này?", "Xoá", "Hủy", async () => {
            this.addDelEditGhiChu(true, rowKey, key);
        })
    }
    _renderTab = (item) => {
        var { tabActive, tuongtac } = this.state
        if (item.id == 1 && this.showGhiChu != '1')
            return null;
        Utils.nlog('LOG [RootThaiNguyen]', Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN) != '' ? 1 : 0)
        if (item.id == 2 && !tuongtac) {
            return null;
        }
        return (<TouchableOpacity
            activeOpacity={0.8}
            key={item.id}
            style={[styles.tab_touch, { backgroundColor: tabActive == item.id ? colors.colorHeaderApp : 'transparent' }]}
            onPress={this._clickTab(item)}
        >
            <Text style={{ color: tabActive == item.id ? colors.white : '#B0B2B2' }}>{item.text}</Text>
        </TouchableOpacity>)
    }
    _XoaPhanAnh = async () => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xóa phản ánh này ?', 'Đồng ý', 'Hủy', async () => {
            nthisIsLoading.show();
            var body = {
                ...this.state.dataCTPA,
                IsDel: true
            }
            const res = await apis.Auto.UpdatePhanAnhBackEnd(body);
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                    if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                        ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                    }
                    // this.callback()
                    if (this.isTuongTac == true) {
                        Utils.goscreen(this, 'stackTuongTac')
                    }
                    Utils.goback(this)
                    // Utils.goscreen(this, "scHomePAHT");
                })
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Xử lý thất bại", "Xác nhận")
            }
            nthisIsLoading.hide();
        })
    }
    _onPressButton = (item) => {
        const { dataCTPA } = this.state

        if (item.IsComeBack == true) {
            Utils.goscreen(this, 'Modal_ModalTraBuocTruocDH', { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
            return;
        }
        switch (item.IdForm) {
            case batdau:
                break;
            case xacminh:
                Utils.goscreen(this, ConfigScreenDH.Modal_XacMinhPA, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            case pheduyettrinhphanphoi:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), isThaoTac: false, });//truyền Id hoặc Item chờ xử lý
                break;
            case phanphoi:
                Utils.goscreen(this, ConfigScreenDH.Modal_PhanPhoi, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), DesignPhanPhoiDefault: item.IdRow });//truyền Id hoặc Item chờ xử lý
                break;
            case phanphoinoibo:
                Utils.goscreen(this, ConfigScreenDH.Modal_PhanPhoi, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB, DesignPhanPhoiDefault: item.IdRow });//truyền Id hoặc Item chờ xử lý
                break;
            case xuly:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            case xulynoibo:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB });
                break;
            case pheduyet:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            case pheduyetnoibo:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB });
                break;
            //
            case dangtai:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), isNoiDung: false, });
                break;
            case dangtainoibo:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB });
                break;
            case trinhlanhdao:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB });
                break;
            case huy:
                Utils.goscreen(this, ConfigScreenDH.Modal_HuyPAHT, { CTPA: this.state.dataCTPA, ActionData: item, callback: this.callback ? this.callback : Utils.goback(this) })
                break;
            case huynoibo:
                Utils.goscreen(this, ConfigScreenDH.Modal_HuyPAHT, { CTPA: this.state.dataCTPA, ActionData: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB })
            case lanhdaoduyet:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB, isNoiDung: false });
                break;
            case ketthuc:
                Utils.goscreen(this, ConfigScreenDH.Modal_HuyPAHT, { CTPA: this.state.dataCTPA, ActionData: item, callback: this.callback ? this.callback : Utils.goback(this) })
                break;
            case traodoi:
                Utils.goscreen(this, ConfigScreenDH.Modal_TraoDoi, { IdPA: dataCTPA.IdPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB });
                break;
            //Trình phân phối
            case trinhphanphoi:
                Utils.goscreen(this, ConfigScreenDH.Modal_PhanPhoi, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this), PANB: this.PANB, DesignPhanPhoiDefault: item.IdRow });//truyền Id hoặc Item chờ xử lý
                break;
            case xoaPA:
                this._XoaPhanAnh();
                break;
            case xoasuaPA:
                //chuyển màn hình đến modal xóa/sửa phản ánh
                Utils.goscreen(this, ConfigScreenDH.Modal_XoaSuaPhanAnh, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) })
                break;
            case thuhoiIOC:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            case tamdong:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            case xacminhhashtag:
                Utils.goscreen(this, ConfigScreenDH.Modal_XacMinhPA, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            case tiepnhanvaphanphoi:
                Utils.goscreen(this, ConfigScreenDH.Modal_XacMinhPA, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            case khongdudieukien:
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLy, { data: dataCTPA, action: item, callback: this.callback ? this.callback : Utils.goback(this) });
                break;
            default:
                break;
        }

    }

    _renderButton = ({ item, index }) => {
        return (
            <ButtonCus
                textTitle={item.ButtonText}
                onPressB={() => this._onPressButton(item)}
                stContainerR={[index % 2 == 0 ? styles.btnLeft : styles.btnRight, { backgroundColor: colors.listColorBtnLe[index % 10] }]}
            />
        )
    }

    _renderButtonChan = ({ item, index }) => {
        return (
            <ButtonCus
                textTitle={item.ButtonText}
                onPressB={() => this._onPressButton(item)}
                stContainerR={[index % 2 == 0 ? styles.btnLeft : styles.btnRight, { backgroundColor: colors.listColorBtnChan[index % 10] }]}
            />
        )
    }

    _renderButtonLe = (dataButton = []) => {
        var lstBtn = []
        for (let index = 1; index < dataButton.length; index++) {
            lstBtn.push(dataButton[index])
        }
        return (
            <Fragment>
                <ButtonCus
                    textTitle={dataButton[0].ButtonText}
                    onPressB={() => this._onPressButton(dataButton[0])}
                    stContainerR={[{ width: '100%', borderRadius: 2, backgroundColor: '#01638D', marginTop: 15 }]}
                />
                <FlatList
                    style={{ width: '100%' }}
                    numColumns={2}
                    data={lstBtn}
                    renderItem={this._renderButton}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Fragment>
        )
    }

    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }

    _renderLink = (item, index) => {
        var { FileName, Link } = item
        return (
            <TouchableOpacity style={{ paddingTop: 7 }} key={index} onPress={() => Linking.openURL(Link)}>
                <Text
                    style={{
                        // marginLeft: Width(2),
                        textDecorationLine: 'underline',
                        textDecorationColor: colors.colorUnderlineLink,
                        color: colors.colorUnderlineLink
                    }}
                    numberOfLines={1}>{FileName}</Text>
            </TouchableOpacity>
        )
    }

    _renderViewTab = () => {
        const { dataNhatKy, tabActive, dataGhiChu, dataCTPA, options, ListFileDinhKem, ListFileDinhKemNew, ListFileDinhKemDelete, showTuongTacAll } = this.state;
        switch (tabActive) {
            case 0:
                const { Rules = [] } = this.props.auth?.userDH
                const isEdit = Rules.includes(10078) ? true : false // cho phéo chỉnh sửa thao tác
                if (dataNhatKy.length > 0)
                    return (
                        <>
                            <View style={{ height: 15 }} />
                            {
                                dataNhatKy.map((item, index) => <ItemNhatKy key={index} index={index} item={{ ...item, AlowEdit: item?.AlowEdit || isEdit ? true : false }} nthis={this} HanXuLy={dataCTPA.HanXuLy ? dataCTPA.HanXuLy : ''} />)
                            }
                        </>
                    )
                else return <ListEmpty textempty={'Không có dữ liệu'} />;
            case 1:
                return <Fragment>
                    <View style={{ paddingHorizontal: khoangcach }}>
                        <Text style={{ fontSize: sizes.reText(12), fontWeight: '700', marginVertical: 10 }}>Nội dung thêm</Text>
                        <TextInputCom
                            value={this.state.ghichu}
                            refInput={ref => this.GHICHU = ref}
                            cusStyleTextInput={{ textAlignVertical: 'top', height: 80, maxHeight: 110 }}
                            cusViewContainer={{ maxHeight: 110 }}
                            onChangeText={this._onChangeText}
                            multiline />
                    </View>
                    <ButtonCom
                        Linear={true}
                        onPress={this.addDelEditGhiChu}
                        text={this.state.editGhiChu ? 'Cập nhật' : 'Thêm'}
                        style={{ paddingHorizontal: 42, marginVertical: 15, borderRadius: 4 }}
                        styleTouchable={{ alignSelf: 'center', marginTop: 10 }}
                        colorChange={[colors.colorGolden, colors.colorGolden]}
                    />
                    <View style={{ height: 0.5, backgroundColor: 'gray' }} />
                    {dataGhiChu.length > 0 ? <SwipeListView
                        disableRightSwipe
                        data={dataGhiChu}
                        renderItem={data => (
                            <ItemGhiChu key={data.item.IdRow} item={data.item} />
                        )}
                        renderHiddenItem={(data, rowMap) => <View style={styles.rowBack}>
                            <TouchableOpacity
                                style={styles.backRightBtnLeft}
                                onPress={() => this._editGhiChu(rowMap, data.item.IdRow)}
                            >
                                <Image source={Images.icPen} style={[nstyles.nIcon20, { tintColor: 'white' }]} />
                                <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14 }}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.backRightBtnRight}
                                onPress={() => this.delGhiChu(rowMap, data.item.IdRow)}
                            >
                                <Image source={Images.icDelete} style={[nstyles.nIcon20, { tintColor: 'white' }]} />
                                <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14 }}>Xóa</Text>
                            </TouchableOpacity>
                        </View>}
                        leftOpenValue={75}
                        rightOpenValue={-150}
                        previewRowKey={`${dataGhiChu[0].key}`}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                        onRowDidOpen={this.onRowDidOpen}
                    /> : <ListEmpty textempty={'Không có dữ liệu'} />}
                    <IsLoading ref={refs => this.isLoadding = refs} />
                </Fragment>
            case 2:
                return <Fragment>
                    {
                        !this.showTuongTacConfig ? null :
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, marginTop: 15, alignSelf: 'flex-start' }}
                                onPress={() => this.setState({ showTuongTacAll: !showTuongTacAll })}
                            >
                                <Image source={showTuongTacAll ? Images.icCheck : Images.icUnCheck}
                                    style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.peacockBlue }]}
                                    resizeMode='contain' />
                                <Text style={{ color: colors.black_80, paddingHorizontal: 5, fontSize: sizes.sText14, fontStyle: 'italic' }}>
                                    {`Hiển thị nội dung với riêng người dùng`}
                                </Text>
                            </TouchableOpacity>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ options: !options }, Keyboard.dismiss())
                        }} style={{ paddingRight: 10 }}>
                            <Image source={Images.icOptionMenu} style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>
                        <TextInput
                            value={this.state.noidungPH}
                            // ref={ref => {this[idInput.toString()] = ref; this[idInput.toString()].focus()}}
                            multiline={true}
                            style={[nstyles.ntextinput, { textAlignVertical: 'top', borderBottomColor: colors.black_50, borderBottomWidth: 0.5, flex: 1, maxHeight: Height(12), minHeight: Height(8), backgroundColor: colors.BackgroundHome }]}
                            underlineColorAndroid='transparent'
                            placeholder='Nhập nội dung...'
                            onChangeText={text => { this.setState({ noidungPH: text }) }}
                        />

                    </View>

                    <ButtonCom
                        Linear={true}
                        onPress={this._taoComment}
                        text={'Phản hồi chung'}
                        style={{ paddingHorizontal: 42, marginVertical: 15, borderRadius: 4 }}
                        styleTouchable={{ alignSelf: 'center', marginTop: 10 }}
                        colorChange={[colors.colorGolden, colors.colorGolden]}
                    />
                    {options ?
                        <Animatable.View animation={"fadeInUp"} style={{ borderRadius: 20 }}>
                            <ImagePickerNew
                                data={this.isEdit == 1 ? ListFileDinhKem : []}
                                dataNew={this.isEdit == -1 ? LisListFileDinhKemtHinhAnh : []}
                                NumberMax={8}
                                isEdit={!this.isRead}
                                keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                                onDeleteFileOld={(data) => {
                                    let dataNew = [].concat(ListFileDinhKemDelete).concat(data)
                                    this.setState({ ListFileDinhKemDelete: dataNew })
                                }}
                                onAddFileNew={(data) => {
                                    Utils.nlog("Data list image mớ", data)
                                    this.setState({ ListFileDinhKemNew: data })
                                }}
                                onUpdateDataOld={(data) => {
                                    this.setState({ ListFileDinhKem: data })
                                }}
                                isPickOne={true}
                            >
                            </ImagePickerNew>
                        </Animatable.View> : null}

                    <View style={{ height: 0.5, backgroundColor: colors.black_50, marginTop: 10 }} />
                    <FlatList
                        keyboardShouldPersistTaps='always'
                        scrollEnabled={false}
                        data={this.state.dataComent}
                        renderItem={this._renderComent}
                        keyExtractor={this._keyExtracComent}
                        ListEmptyComponent={<ListEmpty
                            style={[styles.text12, { color: colors.black_50, textAlign: 'center', marginTop: 20 }]}
                            textempty='Phản ánh này chưa có tương tác nào' />}
                        extraData={this.state.IdRow}
                    />
                </Fragment>
        };
    }

    _getListComent = async () => {
        const res = await Apis.TuongTac.DanhSachTuongTac(this.IdPA);
        if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        else
            if (res.status == 1 && res.data) {
                for (let i = 0; i < res.data.length; i++) {
                    const item = res.data[i];
                    item.PhanHoi = [];
                    for (let j = 0; j < res.data.length; j++) {
                        const item1 = res.data[j];
                        if (item1.IdParent != 0) {
                            if (item1.IdParent == item.IdRow) {
                                item.PhanHoi.push(item1);
                            };
                        };
                    };
                };
                const dataComent = res.data.filter(item => item.IdParent == 0);
                Utils.nlog('_getListComent:', dataComent);
                this.setState({ dataComent });
            };
    }

    _likeComent = (IdRow) => async () => {
        const res = await Apis.TuongTac.LikeTuongTacCB(IdRow);
        this._getListComent();
    }

    _handleListFileNew = async () => {
        const { ListFileDinhKemNew } = this.state;
        let arrFileNew = [], arrFileDelete = []
        if (ListFileDinhKemNew.length > 0) {
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                const element = ListFileDinhKemNew[index];
                Utils.nlog('Gia tri element =>>>>>>', element)
                let str64 = '', extent = ''
                if (element.type == 3) {
                    str64 = await Utils.parseBase64_File(element.uri)
                } else {
                    str64 = await Utils.parseBase64(element.uri, element.height ? element.height : 2000, element.width ? element.width : 2000, 0.5, element.type == 2 ? true : false)
                }

                if (element.type == 1) {
                    extent = '.png'
                } else if (element.type == 2) {
                    extent = '.mp4'
                } else {
                    extent = '.' + element.name.split('.')[element.name.split('.').length - 1]
                }
                arrFileNew.push({
                    filename: element.type == 3 ? element.name : `filename${index}${extent}`,
                    Type: element.type,
                    extension: extent,
                    strBase64: str64,
                })
            }
        }
        return arrFileNew;
    }

    _submitComent = (indexPH, child) => async () => {
        if (this.noidung) {
            nthisIsLoading.show();
            const listFileAdd = await this._handleListFileNew()
            if (this.state.IdRow && !this.checkReply) {// trường hợp cập nhật edit cmt
                const res = await Apis.TuongTac.Reply_TuongTac_Update(this.IdPA, this.state.IdRow, this.noidung, this.state.showTuongTac == true);
                Utils.nlog('edit comment', res)
                nthisIsLoading.hide();
                if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
                else {
                    if (res) {
                        await this._getListComent();
                        this.setState({ IdRow: '' });
                    } else {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật phản hồi thất bại, vui lòng thử lại', 'Xác nhận');
                    };
                };
            } else { // trường hợp trả lời phản hồi của người dân
                const res = await Apis.TuongTac.Reply_TuongTac_Insert(this.IdPA, this.state.IdRow, this.noidung, listFileAdd, this.state.showTuongTac == true);
                Utils.nlog('reply comment', res)
                nthisIsLoading.hide();
                if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
                else
                    if (res) {
                        this.checkReply = false;
                        this.noidung = '';
                        await this._getListComent();
                        this.setState({
                            IdRow: '', ListFileDinhKem: [], optionsPhanHoi: false,
                            pickImage: false,
                            ListFileDinhKem: [],
                            ListFileDinhKemNew: [],
                            ListFileDinhKemDelete: [],
                        });
                    } else {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra, vui lòng thử lại', 'Xác nhận');
                    };
            };
        } else {
            this.setState({ IdRow: '' });
        };
    }

    _taoComment = async () => {
        if (this.state.noidungPH.trim()) {
            const listFileAdd = await this._handleListFileNew()
            const res = await Apis.TuongTac.Reply_TuongTac_Insert(this.IdPA, 0, this.state.noidungPH, listFileAdd, this.state.showTuongTacAll == true);
            if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
            else {
                if (res) {
                    await this._getListComent();
                    this.setState({
                        ListFileDinhKem: [], options: false,
                        pickImage: false,
                        ListFileDinhKem: [],
                        ListFileDinhKemNew: [],
                        ListFileDinhKemDelete: [],
                        noidungPH: ''
                    });
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Tạo phản hồi chung thất bại, vui lòng thử lại', 'Xác nhận');
                };
                Utils.nlog('tao noi dung comment', res);
            };
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Mời bạn nhập vào nội dung', 'Xác nhận');
        };
    }

    _deleteComment = (IdRow) => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có muốn xoá phản hồi này không?', 'Đồng ý', 'Huỷ', () => this._delete(IdRow))
    }

    _delete = async (IdRow) => {
        nthisIsLoading.show();
        const res = await Apis.TuongTac.Delete_TuongTac(IdRow);
        nthisIsLoading.hide();
        if (res) {
            this._getListComent()
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Xoá phản hồi thất bại, vui lòng thử lại', 'Xác nhận');
        }
    }

    _replyComent = (IdRow, index) => {
        if (this.state.IdRow) {
            this.checkReply = false;
            this.setState({ IdRow: '' });
        } else {
            if (this.checkLogin) {
                this.index = index;
                this.noidung = '';
                this.checkReply = true;
                this.setState({ IdRow, showTuongTac: false });
            } else Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
        };
    }

    _editComment = (item, index) => async () => {
        if (this.state.IdRow) {
            this.setState({ IdRow: '' });
        } else {
            if (this.checkLogin) {
                this.index = index;
                this.noidung = item.NoiDung;
                this.setState({ IdRow: item.IdRow, showTuongTac: item.IsHienThiNDVoiND });
            } else Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
        };
    }

    _duyetTuongTac = (item, index, indexPH = false) => async () => {
        const res = await Apis.TuongTac.EnOrDis_TuongTac(item.IdRow);
        Utils.nlog('duyet tuong tacs', res)
        if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        else {
            if (res) {
                if (Number.isInteger(indexPH)) {
                    const dataComent = this.state.dataComent;
                    dataComent[index].PhanHoi[indexPH].HienThi = !dataComent[index].PhanHoi[indexPH].HienThi;
                    this.setState({ dataComent });
                } else {
                    const dataComent = this.state.dataComent;
                    dataComent[index].HienThi = !item.HienThi;
                    this.setState({ dataComent });
                };
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Xử lý thất bại, vui lòng thử lại', 'Xác nhận');
            };
        };
    }

    renderInputRep = (val, index, child) => {
        const { optionsPhanHoi, showTuongTac } = this.state;
        if (val)
            return (
                <View style={{ flex: 1, width: '100%', alignItems: 'center', }} >
                    {
                        !this.showTuongTacConfig ? null :
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, marginTop: 5, alignSelf: 'flex-start' }}
                                onPress={() => this.setState({ showTuongTac: !showTuongTac })}
                            >
                                <Image source={showTuongTac ? Images.icCheck : Images.icUnCheck}
                                    style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.peacockBlue }]}
                                    resizeMode='contain' />
                                <Text style={{ color: colors.black_80, paddingHorizontal: 5, fontSize: sizes.sText14, fontStyle: 'italic' }}>
                                    {`Hiển thị nội dung với riêng người dùng`}
                                </Text>
                            </TouchableOpacity>
                    }
                    <View style={[nstyles.nrow, { alignItems: 'center', borderBottomColor: this.state.IdRow ? colors.peacockBlue : colors.black_50, borderBottomWidth: 0.5 }]}>
                        {
                            !this.checkReply ? null : <TouchableOpacity onPress={() => {
                                this.setState({ optionsPhanHoi: !optionsPhanHoi }, Keyboard.dismiss())
                            }} style={{ paddingRight: 10 }}>
                                <Image source={Images.icOptionMenu} style={{ width: 25, height: 25 }} />
                            </TouchableOpacity>
                        }

                        <TextInput
                            style={[nstyles.ntextinput, { flex: 1, marginBottom: 10, marginLeft: 5, textAlignVertical: 'top', maxHeight: Height(12), minHeight: Height(8), backgroundColor: colors.BackgroundHome }]}
                            multiline={true}
                            underlineColorAndroid='transparent'
                            placeholder='Nhập nội dung...'
                            onChangeText={text => this.noidung = text}
                            autoFocus
                            returnKeyType='done'
                        >{this.noidung}</TextInput>
                        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={this._submitComent(index, child)}>
                            <Image source={Images.icSentMes} style={[nstyles.nIcon25, { tintColor: colors.softBlue }]} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                    {
                        optionsPhanHoi ?
                            <Animatable.View animation={"fadeInUp"} style={{ borderRadius: 20, flex: 1, width: '100%' }}>
                                <ImagePickerNew
                                    data={this.isEdit == 1 ? ListFileDinhKem : []}
                                    dataNew={this.isEdit == -1 ? LisListFileDinhKemtHinhAnh : []}
                                    NumberMax={8}
                                    isEdit={!this.isRead}
                                    keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                                    onDeleteFileOld={(data) => {
                                        let dataNew = [].concat(ListFileDinhKemDelete).concat(data)
                                        this.setState({ ListFileDinhKemDelete: dataNew })
                                    }}
                                    onAddFileNew={(data) => {
                                        Utils.nlog("Data list image mớ", data)
                                        this.setState({ ListFileDinhKemNew: data })
                                    }}
                                    onUpdateDataOld={(data) => {
                                        this.setState({ ListFileDinhKem: data })
                                    }}
                                    isPickOne={true}
                                >
                                </ImagePickerNew>
                            </Animatable.View> : null
                    }

                </View>
            )


        return null;
    }

    _renderReplyComment = (item1, index1, item, index) => {
        let isCommentShow = item1.HienThi && item.HienThi;
        return (
            <View key={item1.IdRow}>
                <View style={[styles.containerComment, { borderColor: isCommentShow ? colors.colorBlueLight : colors.redStar, borderWidth: item1.IsCongDan ? 2 : isCommentShow ? 0 : 1 }]}>
                    <Text style={[styles.text14, { color: colors.black_50, marginRight: 25 }]}>{item1.TenCBorCD}{item1.IsCongDan == false ? " ✪" : ""}</Text>
                    <Text style={[styles.text13]}>{item1.NoiDung}</Text>
                    {
                        isCommentShow ? null :
                            <Image source={Images.icHideItem}
                                style={[nstyles.nIcon16, { position: 'absolute', top: 0, right: 0, tintColor: colors.redpink }]} />
                    }
                </View>
                <View style={{ paddingHorizontal: 18 }}>
                    {item1 && item1.DSFileDinhKem.length > 0 ?
                        <ListHinhAnhCom
                            buttonDelete={false}
                            buttonCamera={false}
                            link={true}
                            nthis={this}
                            onPressDelete={(item, index) => {
                            }}
                            ListHinhAnh={item1.DSFileDinhKem}
                        />
                        : null}
                </View>

                <View style={[nstyles.nrow, { alignItems: 'center', marginTop: 5, marginLeft: 20 }]}>
                    <Text style={[styles.text13, { color: colors.black_50 }]}>{moment(item1.NgayGui, 'DD/MM/YYYY hh:mm').format('DD/MM, HH:mm')}</Text>
                    {
                        item1.IsCongDan ?
                            <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                                <TouchableOpacity
                                    onPress={() => this._deleteComment(item1.IdRow)}
                                    style={{ paddingHorizontal: 13 }}>
                                    <Text style={styles.text13}>Xoá</Text>
                                </TouchableOpacity>
                                {
                                    this.isMenuMore != 0 ? null :
                                        <TouchableOpacity
                                            onPress={this._duyetTuongTac(item1, index, index1)}
                                            style={{ paddingHorizontal: 13 }}>
                                            <Text style={[styles.text13, { color: item1.HienThi == null ? 'red' : (item1.HienThi ? 'red' : colors.peacockBlue) }]}>{item1.HienThi == null ? 'Duyệt' : (item1.HienThi ? 'Ẩn' : 'Hiện')}</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                            :
                            <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                                <TouchableOpacity
                                    onPress={this._editComment(item1, index)}
                                    style={{ paddingHorizontal: 23, paddingRight: 10 }}>
                                    <Text style={styles.text13}>{item1.IdRow == this.state.IdRow ? 'Huỷ' : 'Sửa'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this._deleteComment(item1.IdRow)}
                                    style={{ paddingHorizontal: 13 }}>
                                    <Text style={styles.text13}>Xoá</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
                {
                    this.renderInputRep(item1.IdRow == this.state.IdRow, index1, true)
                }
            </View>
        )
    }
    _renderHanXuLy = (title, dataCTPA) => {
        // let data = dataCTPA.HanDangTai ? 'HanDangTai' : dataCTPA.HanPhanPhoi ? 'HanPhanPhoi' : dataCTPA.HanPheDuyet ? 'HanPheDuyet' : dataCTPA.HanTiepNhan ? 'HanTiepNhan' : ''
        // console.log('===>>> hien thi han data: ', data)
        let value = ''
        switch (title.toString()) {
            case 'HanDangTai':
                title = 'Hạn đăng tải'
                value = dataCTPA.HanDangTai
                break;
            case 'HanPhanPhoi':
                title = 'Hạn phân phối'
                value = dataCTPA.HanPhanPhoi
                break;
            case 'HanPheDuyet':
                title = 'Hạn phê duỵệt'
                value = dataCTPA.HanPheDuyet
                break;
            case 'HanTiepNhan':
                title = 'Hạn tiếp nhận'
                value = dataCTPA.HanTiepNhan
                break;
            default:
                return
                break;
        }
        return (
            <View style={[styles.noidung]}>
                <Text style={{ flex: 1 }}>
                    <Text style={[styles.title]}>{title}: </Text>
                    {value} {dataCTPA?.TreHen > 0 ? <Text style={{ color: colors.redStar }}>(Quá hạn)</Text> : ''}
                </Text>
            </View>)
    }
    _renderComent = ({ item, index }) => {
        if (item.IdParent == 0)
            return <View key={item.IdRow} style={{ marginTop: 10 }}>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, alignSelf: 'flex-start', padding: 5, marginTop: 5,
                    borderColor: (item.HienThi ? colors.colorBlueLight : colors.redStar), borderWidth: item.IsCongDan ? 2 : item.HienThi ? 0 : 1
                }}>
                    <Text style={[styles.text14, { color: colors.black_50, marginRight: 25 }]}>{item.TenCBorCD}{item.IsCongDan == false ? " ✪" : ""}</Text>
                    <Text style={[styles.text13]}><Text style={{ color: colors.greenishTeal }}>{item.IsHienThiNDVoiND == true ? '● ' : ''}</Text>{item.NoiDung}</Text>
                    {
                        item.HienThi ? null :
                            <Image source={Images.icHideItem}
                                style={[nstyles.nIcon16, { position: 'absolute', top: 0, right: 0, tintColor: colors.redpink }]} />
                    }
                </View>
                <View>
                    {item && item.DSFileDinhKem.length > 0 ?
                        <ListHinhAnhCom
                            buttonDelete={false}
                            buttonCamera={false}
                            link={true}
                            nthis={this}
                            onPressDelete={(item, index) => {
                            }}
                            ListHinhAnh={item.DSFileDinhKem}
                        />
                        : null}
                </View>

                <View style={[nstyles.nrow, { alignItems: 'center', marginTop: 5 }]}>
                    <Text style={[styles.text14, { color: colors.black_50 }]}>{moment(item.NgayGui, 'DD/MM/YYYY hh:mm').format('DD/MM, HH:mm')}</Text>
                    {
                        item.IsCongDan ? <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                            <TouchableOpacity
                                onPress={() => this._replyComent(item.IdRow, index)}
                                style={{ paddingHorizontal: 13 }}>
                                <Text style={styles.text13}>{item.IdRow == this.state.IdRow ? 'Huỷ' : 'Phản hồi'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this._deleteComment(item.IdRow)}
                                style={{ paddingHorizontal: 13 }}>
                                <Text style={styles.text13}>Xoá</Text>
                            </TouchableOpacity>
                            {
                                this.isMenuMore != 0 ? null :
                                    <TouchableOpacity
                                        onPress={this._duyetTuongTac(item, index)}
                                        style={{ paddingHorizontal: 13 }}>
                                        <Text style={[styles.text13, { color: item.HienThi == null ? 'red' : (item.HienThi ? 'red' : colors.peacockBlue) }]}>{item.HienThi == null ? 'Duyệt' : (item.HienThi ? 'Ẩn' : 'Hiện')}</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                            :
                            <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                                {
                                    !this.checkReply && item.IdRow == this.state.IdRow ? null :
                                        <TouchableOpacity
                                            onPress={() => this._replyComent(item.IdRow, index)}
                                            style={{ paddingHorizontal: 13 }}>
                                            <Text style={styles.text13}>{item.IdRow == this.state.IdRow ? 'Huỷ' : 'Phản hồi'}</Text>
                                        </TouchableOpacity>
                                }
                                {
                                    this.checkReply ? null :
                                        <TouchableOpacity
                                            onPress={this._editComment(item, index)}
                                            style={{ paddingHorizontal: 13, paddingRight: 10 }}>
                                            <Text style={styles.text13}>{item.IdRow == this.state.IdRow ? 'Huỷ' : 'Sửa'}</Text>
                                        </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    onPress={() => this._deleteComment(item.IdRow)}
                                    style={{ paddingHorizontal: 13 }}>
                                    <Text style={styles.text13}>Xoá</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
                {
                    this.renderInputRep(item.IdRow == this.state.IdRow, index, false)
                }
                { // phản hồi cmt
                    item.PhanHoi.map((item1, index1) => this._renderReplyComment(item1, index1, item, index))
                }
            </View>
        else return null;
    }
    _keyExtracComent = (item) => `${item.IdRow}`;

    _checkLogin = () => {
        let token = Utils.getGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN)
        if (token) this.checkLogin = true;
    };

    onRefesh = () => {
        this._getChiTietPAHT();
        this._GetList_NhatKyThaoTacPhanAnh();
    }

    render() {
        var { isCheck, dataCTPA, lstAction, lstFile, isLoading, tabActive, arrImg, arrFile, showDetailPA } = this.state
        // console.log('data comment', this.state.dataComent);
        // Utils.nlog("design--------------------------:", arrImg)
        let title = 'Chi tiết phản ánh'
        if (dataCTPA?.IdChuyenMuc && dataCTPA.IdChuyenMuc == 41) {
            title = 'Chi tiết tư vấn F0'
        } else if (dataCTPA?.IdChuyenMuc && dataCTPA.IdChuyenMuc == 42) {
            title = 'Chi tiết an sinh xã hội'
        }
        return (
            <View style={nstyles.ncontainer}>
                {/* {header} */}
                <HeaderCom
                    styleContent={{ backgroundColor: colors.colorHeaderApp }}
                    titleText={title}
                    onPressLeft={() => {
                        try {
                            if (this.idStep > 0) Utils.goback(this)
                            // this.props.SetStatus_Notify(1)
                            this.callback(this);
                        } catch (error) {
                            // this.props.SetStatus_Notify(1)
                            Utils.goback(this);
                        };
                    }}
                    onPressRight={() => Utils.goscreen(this, ConfigScreenDH.Modal_MapChiTietPA, {
                        dataItem: this.state.dataCTPA
                    })}
                    iconRight={this.state.dataCTPA.ToaDoX == 0 && this.state.dataCTPA.ToaDoY == 0 ? null : Images.icLocation}
                    nthis={this} />
                {/* {body} */}
                <View style={[nstyles.nbody, {}]}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps='always'
                        style={{ flex: 1 }}
                        extraHeight={100}
                        contentContainerStyle={{ paddingBottom: paddingBotX + 10 }}
                        showsVerticalScrollIndicator={false} style={{ backgroundColor: '#FFFFFF' }}>
                        <View style={{ paddingHorizontal: 10 }}>
                            {/* {Thông tin email,sdt,... } */}
                            <View style={{ borderBottomWidth: 0.5, paddingBottom: 10, paddingTop: 15 }}>
                                <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                                    <Text style={[styles.title, { fontWeight: 'bold' }]} numberOfLines={1}>Mã phản ánh: {dataCTPA.MaPhanAnh}</Text>
                                    {
                                        dataCTPA.Is3C == true ? <Text style={[styles.txt12, {
                                            fontWeight: 'bold', color: colors.white, borderRadius: 5, borderColor: colors.white,
                                            backgroundColor: colors.orange, paddingHorizontal: 5, borderWidth: 1,
                                        }]}>3C</Text> : null
                                    }
                                    {
                                        dataCTPA.IsZalo == true ? <View>
                                            <Text style={[styles.txt12, {
                                                fontWeight: 'bold', color: colors.white, borderRadius: 5, borderColor: colors.white,
                                                backgroundColor: colors.blueZalo, paddingHorizontal: 5, borderWidth: 1,
                                            }]}>{`zalo`}</Text>
                                        </View> : null
                                    }
                                </View>
                                <View style={[styles.noidung]}>
                                    <Text style={{ flex: 1 }}>
                                        <Text style={[styles.title]}>Công dân tổ chức: </Text>
                                        {dataCTPA.TenNguoiGopY}
                                    </Text>
                                </View>

                                <View style={[styles.noidung]}>
                                    <Text style={{ flex: 1 }}>
                                        {<Text style={[styles.title]}>Số điện thoại: </Text>}
                                        {dataCTPA.SDTCD}
                                    </Text>
                                </View>
                                {
                                    this.renderItemDesign(1)
                                }
                            </View>

                            <View style={{ paddingTop: 5 }}>
                                {
                                    this.renderItemDesign(2)
                                }
                                {
                                    !showDetailPA && dataCTPA && dataCTPA.TieuDe ? null :
                                        <View style={{
                                            paddingBottom: 5, borderRadius: 5, marginTop: 5,
                                            borderWidth: 1, borderColor: colors.black_20
                                        }}>
                                            <View style={{
                                                paddingTop: 5,
                                                paddingHorizontal: 5,
                                                // alignItems: "center",
                                                paddingVertical: 5,
                                                borderWidth: 1,
                                                borderStyle: 'dashed',
                                                minHeight: 50,
                                                borderColor: 'rgba(235,200,0,1)',
                                                borderRadius: 5,
                                                backgroundColor: 'rgba(235,200,0,0.1)'
                                            }}>
                                                {<Text style={[styles.title, { fontWeight: 'bold' }]}>Nội dung phản ánh: </Text>}
                                                {/* <HtmlViewCom
                                        html={dataCTPA && dataCTPA.NoiDung ? dataCTPA.NoiDung : "<div></div>"}
                                        style={{ height: '100%' }}
                                    /> */}
                                                <AutoHeightWebViewCus style={{ width: '100%', opacity: 0.99, minHeight: 1 }} scrollEnabled={false}
                                                    source={{ html: dataCTPA && dataCTPA.NoiDung ? dataCTPA.NoiDung : "<div></div>" }} textLoading={'Đang tải nội dung...'} />
                                            </View>
                                            <View style={{ marginHorizontal: 3 }}>
                                                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                                                    {/* {arrImg.map((item, index) => */}
                                                    <ImageFileCus dataMedia={arrImg} dataFile={arrFile} nthis={this} />
                                                    {/* } */}
                                                </ScrollView>
                                                <View style={[styles.noidung]}>
                                                    <Text style={{ flex: 1 }}>
                                                        {<Text style={[styles.title]}>Ngày phản ánh: </Text>}
                                                        {dataCTPA.CreatedDate}
                                                    </Text>
                                                </View>
                                                <View style={[styles.noidung]}>
                                                    <Text style={{ flex: 1 }}>
                                                        {<Text style={[styles.title]}>Địa chỉ sự kiện: </Text>}
                                                        {dataCTPA.DiaDiem}
                                                    </Text>
                                                </View>
                                                {
                                                    this.renderItemDesign(3)
                                                }
                                            </View>
                                        </View>
                                }
                                {/* //--4 Trường hợp Hạn này là đang dùng cho Quảng Trị, viết chung ko ảnh hưởng gì. */}
                                {
                                    dataCTPA.HanDangTai ? this._renderHanXuLy('HanDangTai', dataCTPA) : null
                                }
                                {
                                    dataCTPA.HanPhanPhoi ? this._renderHanXuLy('HanPhanPhoi', dataCTPA) : null
                                }
                                {
                                    dataCTPA.HanPheDuyet ? this._renderHanXuLy('HanPheDuyet', dataCTPA) : null
                                }
                                {
                                    dataCTPA.HanTiepNhan ? this._renderHanXuLy('HanTiepNhan', dataCTPA) : null
                                }
                                {
                                    dataCTPA.HanDangTai || dataCTPA.HanPhanPhoi || dataCTPA.HanPheDuyet || dataCTPA.HanTiepNhan ? null : this.renderItemDesign(4)
                                }
                                {
                                    this.renderItemDesign(5)
                                }
                                {
                                    this.renderItemDesign(8)
                                }
                                {
                                    this.renderItemDesign(6)
                                }
                                {
                                    this.renderItemDesign(7)
                                }
                                {/* --Nut Xem chi tiết/Thu gọn - Làm cho pleiku Tình nào cần thì mở ra.-- */}
                                {/* <TouchableOpacity
                                    style={[{ alignItems: 'center', padding: 8, backgroundColor: colors.black_5, marginTop: 5, borderRadius: 5 }]}
                                    onPress={() => this.setState({ showDetailPA: !showDetailPA })}>
                                    <Text style={{ color: colors.blueFaceBook, fontWeight: 'bold' }}>{showDetailPA ? 'Thu gọn' : 'Xem chi tiết xử lý'}</Text>
                                </TouchableOpacity> */}
                                {/* {Button chức năng} */}
                                {
                                    !showDetailPA ? null :
                                        (this.isMenuMore == 1 ? null : lstAction.length % 2 == 0 ?
                                            <View>
                                                <FlatList
                                                    contentContainerStyle={{ paddingVertical: 5 }}
                                                    numColumns={2}
                                                    data={lstAction}
                                                    renderItem={this._renderButtonChan}
                                                    keyExtractor={(item, index) => index.toString()}
                                                />
                                            </View>
                                            : <View>
                                                {this._renderButtonLe(lstAction)}
                                            </View>)
                                }
                            </View>
                        </View>
                        {
                            !showDetailPA ? null :
                                <>
                                    {/* {Tab (Touch)} */}
                                    <View
                                        style={styles.tab}>
                                        {list_tab.map(this._renderTab)}
                                        {/* {Hiển thị dữ liệu từng tab tại đây} */}
                                    </View>
                                    <View style={{ paddingHorizontal: tabActive == 1 ? 0 : khoangcach, paddingTop: 5 }}>
                                        {this._renderViewTab()}
                                    </View>
                                </>
                        }
                    </KeyboardAwareScrollView>
                    {
                        isLoading == true ? <ModalLoading /> : null
                    }
                </View>
                <IsLoading />
            </View>
        )
    }
    closeRow(key, rowKey) {
        if (key[rowKey]) {
            key[rowKey].closeRow();
        };
    }

    _editGhiChu = (key, rowKey) => {
        if (this.state.editGhiChu) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Ghi chú đang được chỉnh sửa, vui lòng cập nhật', 'Đồng ý');
            this.closeRow(key, rowKey);
        } else {
            this.prevIndex = this.state.dataGhiChu.findIndex(
                item => item.IdRow == rowKey
            );
            const ghichu = this.state.dataGhiChu[this.prevIndex].NoiDung;
            this.setState({ editGhiChu: true, ghichu });
            this.closeRow(key, rowKey);
            this.GHICHU.focus();
        };
    }

    onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };


}

const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(ChiTietPAHT, mapStateToProps, true);

const styles = StyleSheet.create({
    title: {
        color: colors.colorHeaderApp,
        fontSize: sizes.sizes.sText14,
        // fontWeight: 'bold'
        // paddingTop: 17
    },
    text12: {
        fontSize: sizes.reText(12)
    },
    text13: {
        fontSize: sizes.reText(13)
    },
    text14: {
        fontSize: sizes.reText(14)
    },
    containerComment: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 10,
        marginLeft: 20
    },
    noidung: {
        paddingTop: 8,
        flexDirection: 'row'
    },
    container_button: {
        flexDirection: 'row',
        width: Width(90),
        paddingTop: 20
    },
    btnLeft: {
        borderRadius: 2,
        backgroundColor: colors.colorHeaderApp,
        flex: 1,
        marginRight: 5,
        marginTop: 10
    },
    btnRight: {
        borderRadius: 2,
        flex: 1,
        marginLeft: 5,
        marginTop: 10,
    },
    tab_touch: {
        backgroundColor: colors.colorHeaderApp,
        flex: 1,
        paddingVertical: 12,
        ...nstyles.nmiddle
    },
    tab: {
        marginTop: 20,
        paddingHorizontal: khoangcach,
        ...nstyles.nrow,
        borderBottomWidth: 1,
        borderBottomColor: colors.colorHeaderApp,
        backgroundColor: '#EFEFEF',
        ...nstyles.nmiddle
    },


    rowBack: {
        flex: 1,
        ...nstyles.nrow,
        justifyContent: 'flex-end'
    },
    backRightBtn: {
        bottom: 0,
        ...nstyles.nmiddle,
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        ...nstyles.nmiddle,
        backgroundColor: colors.colorBlueLight,
        width: 75,
    },
    backRightBtnRight: {
        ...nstyles.nmiddle,
        backgroundColor: colors.grayLight,
        width: 75,
    },



})