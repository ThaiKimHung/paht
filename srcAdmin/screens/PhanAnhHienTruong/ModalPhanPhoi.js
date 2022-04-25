import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    checked,
    Alert,
    FlatList,
} from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//--
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import ItemDrop from './components/ItemDrop';
import InputCus from '../../../components/ComponentApps/InputCus';
import { Images } from '../../images';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { Width, Height } from '../../../styles/styles';
import DatePick from '../../../components/DatePick'
import { ItemDVXL } from './ItemDVXL';
import ModalLoading from '../../../components/ComponentApps/ModalLoading'
import ModalDrop from '../../screens/PhanAnhHienTruong/components/ModalDrop'
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { TextInputCom, IsLoading } from '../../../components';
import apis from '../../apis';
import moment from 'moment';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { appConfig } from '../../../app/Config';
import { GetConfigByCodeBy, getConfigNoiDung } from '../../apis/apiapp';
import HtmlViewCom from '../../../components/HtmlView';
import { ConfigScreenDH } from '../../routers/screen';
import AppCodeConfig from '../../../app/AppCodeConfig';



/**
 1 Tiêu Đề
 2 Lĩnh vực & Hình thức
 3 Mức Độ
 4 Nội Dung Phản Ánh
 5 Cấp Quản Lý
 6 Hạn Xử lý
 7 Nội Dung Thực hiện
 8 Tick Chọn
 9 Option lựa chọn 
 10 Button
 11 tiêu đề k edit được
 12 component biên tập
13 hạn xử lý k thao tác đuọc
14 xử lý khẩn k tích được
*/
const DesignPhanPhoiDefault = [1, 2, 3, 4, 5, 6, 7, 8, 10];

const DesignTrinhPhanPhoi = [11, 5, 6, 7, 8, 10];
const DesignPhanPhoi = [11, 5, 6, 7, 8, 10];
const DesignPhanPhoiDVXL = [11, 5, 7, 10, 13, 14];
const listDesign = {
    "0": DesignPhanPhoiDefault,//dành cho dèault
    "1": DesignPhanPhoiDefault,
    "27": DesignTrinhPhanPhoi,
    "2": DesignPhanPhoi,
    "17": DesignPhanPhoiDVXL,
}

const styles = StyleSheet.create({
    ContainerCheck: {
        flexDirection: 'row',
        marginRight: 22.5,
        alignItems: 'center',
        justifyContent: 'center'
    },

})

const menuHinhThuc = [{
    TenHinhThuc: 'Phản ánh',
    iD: 1
}, {
    TenHinhThuc: 'Góp ý',
    iD: 2
}]
const ListQL = [{ IdCapDonVi: 0, TenCapDonVi: "Tất cả" }];
const ListQLP = [{ IdCapDonVi: 0, TenCapDonVi: "Tất cả" }];

const pheduyettrinhphanphoi = 19
class ModalPhanPhoi extends Component {
    constructor(props) {
        super(props);
        this.data = this.props?.data ? this.props.data : Utils.ngetParam(this, 'data', {})
        // this.data = Utils.ngetParam(this, "data", {})
        this.PANB = Utils.ngetParam(this, "PANB");
        this.action = Utils.ngetParam(this, "action", {})
        this.callback = Utils.ngetParam(this, "callback", () => { });
        this.isVuotCap = Utils.ngetParam(this, "isVuotCap", false);
        this.isThaoTac = Utils.ngetParam(this, "isThaoTac", true);
        this.dataSetting = Utils.getGlobal(nGlobalKeys.dataSetting, {}, AppCodeConfig.APP_ADMIN);
        this.ChonGioPhanPhoi = Utils.getGlobal(nGlobalKeys.ChonGioPhanPhoi, '', AppCodeConfig.APP_ADMIN);
        this.DonViXL = [] //Lưu giá trị sao mỗi lần check
        this.DesignDefault = this.props?.DesignDefault ? this.props.DesignDefault : Utils.ngetParam(this, "DesignPhanPhoiDefault", "1");

        this.state = {
            isChuyenXL: this.data.ChuyenXuLy ? this.data.ChuyenXuLy : false,//false: chuyển xử lý; true: chuyển để biết theo dõi
            isCongKhai: this.data.CongKhai,
            isbientap: this.data.ChuyenXuLy ? this.data.ChuyenXuLy == 1 ? true : false : true,
            isXuLyKhanCap: this.data ? this.data.XuLyKhan : false,
            NoiDungTH: '',
            HanXuLy: this.data.HanXuLy ? moment(this.data.HanXuLy, "DD/MM/YYYY").format("YYYY-MM-DD") : '',
            TieuDe: this.data.TieuDe,
            NoiDungPA: this.data.NoiDung,
            LstDonViXL: [],
            LstDonViXLP: [],
            LstDonViXLDuyet: [],
            LstDonViXLDuyetP: [],
            LstDVXL: [],
            LstDVXLP: [],
            isLoading: true,
            selectLinhVuc: this.props.dataLinhVuc.find(item => item.IdLinhVuc == this.data.LinhVuc),
            selectMucDo: this.PANB ? this.props.dataMucDoNB.find(item => item.IdMucDo == this.data.MucDo) : this.props.dataMucDo.find(item => item.IdMucDo == this.data.MucDo),
            selectHinhThuc: menuHinhThuc.find(item => item.iD == this.data.HinhThuc),
            selectCapQL: ListQL[0],
            LstCapQuanLy: ListQL,
            selectCapQLP: ListQLP[0],
            LstCapQuanLyP: ListQLP,
            page: 0,
            allPage: 0,
            isScroll: true,
            design: listDesign[this.DesignDefault] ? listDesign[this.DesignDefault] : [],
            DemDVXLChon: 0,
            SelectDVXLChinh: '',
            isChooseMutil: true,
            selectCaNhanXuLy: [],
            GioXuLy: this.data.HanXuLy ? moment(this.data.HanXuLy, "DD/MM/YYYY HH:mm",).format("HH:mm") : "23:59",
        }
        ROOTGlobal[nGlobalKeys.DonViDH].checkDonVi = this._onClickDVXL
        ROOTGlobal[nGlobalKeys.DonViDH].checkDonViPhu = this._onClickDVXLP

        this.isUsePhanPhoi = Utils.getGlobal(nGlobalKeys.isUsePhanPhoi, false, AppCodeConfig.APP_ADMIN)
    }

    componentWillUpdate(nextProps, nextState) {
        try {
            if (this.props.listenStateChange) {
                this.props?.listenStateChange(nextState)
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    goback = () => {
        Utils.goback(this)
    }
    _ClickChuyenXL = () => {
        this.setState({ isChuyenXL: !this.state.isChuyenXL })
    }

    _ClickCongKhai = () => {
        this.setState({ isCongKhai: !this.state.isCongKhai })
    }

    _ClickXuLyKhanCap = () => {
        this.setState({ isXuLyKhanCap: !this.state.isXuLyKhanCap })
    }
    onChangeTieuDe = (text) => {
        this.setState({ TieuDe: text })
    }
    onChangeNoiDung = (text) => {
        this.setState({ NoiDungPA: text })
    }
    onChangeNDThucHien = (text) => {
        this.setState({ NoiDungTH: text })
    }
    _onClickDVXL = (item, index, isDelete = false) => {
        let { LstDonViXL, DemDVXLChon, isChooseMutil, selectCaNhanXuLy } = this.state

        if (isDelete) {
            selectCaNhanXuLy = selectCaNhanXuLy.filter((item2) => item2.MaPX != item.MaPX)
            //isChooseMutil
            DemDVXLChon = 0;
            for (let index = 0; index < LstDonViXL.length; index++) {
                if (LstDonViXL[index].MaPX == item.MaPX) {
                    LstDonViXL[index].isCheck = !LstDonViXL[index].isCheck;
                    this.setState({ LstDonViXL: LstDonViXL, DemDVXLChon: DemDVXLChon, SelectDVXLChinh: '', selectCaNhanXuLy })
                    return;
                }
            }

        } else {
            if (isChooseMutil == false) {
                if (DemDVXLChon == 0) {
                    DemDVXLChon = 1;
                    for (let index = 0; index < LstDonViXL.length; index++) {
                        if (LstDonViXL[index].MaPX == item.MaPX) {
                            LstDonViXL[index].isCheck = !LstDonViXL[index].isCheck;
                            //kiểm tra và bỏ check chọn ở đơn vị họp tác xử lý
                            this._onClickDelteDVXLP(item);

                            this.setState({ LstDonViXL: LstDonViXL, DemDVXLChon: DemDVXLChon, SelectDVXLChinh: LstDonViXL[index] })
                            return;
                        }
                    }
                } else {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn chỉ được chọn 1 đơn vị chủ trì xử lý", "Xác nhận");
                }
            } else {
                DemDVXLChon = 1;
                for (let index = 0; index < LstDonViXL.length; index++) {
                    if (LstDonViXL[index].MaPX == item.MaPX) {
                        LstDonViXL[index].isCheck = !LstDonViXL[index].isCheck;
                        //kiểm tra
                        this._onClickDelteDVXLP(item);
                        this.setState({ LstDonViXL: LstDonViXL, DemDVXLChon: DemDVXLChon, SelectDVXLChinh: LstDonViXL[index] })
                        return;
                    }
                }
            }

        }
    }
    _onClickDVXLP = (item, index) => {
        let { LstDonViXLP } = this.state
        for (let index = 0; index < LstDonViXLP.length; index++) {
            if (LstDonViXLP[index].MaPX == item.MaPX) {
                LstDonViXLP[index].isCheck = !LstDonViXLP[index].isCheck;
                this.setState({ LstDonViXLP: LstDonViXLP })
                return;
            }
        }
    }
    _onClickDelteDVXLP = (item) => {
        let { LstDonViXLP } = this.state
        for (let index = 0; index < LstDonViXLP.length; index++) {
            if (LstDonViXLP[index].MaPX == item.MaPX) {
                LstDonViXLP[index].isCheck = false;
                this.setState({ LstDonViXLP: LstDonViXLP })
                return;
            }
        }
    }
    _renderDonViXL = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._onClickDVXL(item, index, true)}
                key={item.MaPX}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ fontSize: sizes.sText14 }}>{item.TenPhuongXa}</Text>
                <Image
                    source={item.isCheck == true ? Images.icCheck : Images.icUnCheck}
                    style={[nstyles.nIcon14, { tintColor: colors.peacockBlue }]}
                />
            </TouchableOpacity >
        )
    }
    _renderDonViXLP = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._onClickDVXLP(item, index)}
                key={item.MaPX}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ fontSize: sizes.sText14 }}>{item.TenPhuongXa}</Text>
                <Image
                    source={item.isCheck == true ? Images.icCheck : Images.icUnCheck}
                    style={[nstyles.nIcon14, { tintColor: colors.peacockBlue }]}
                />
            </TouchableOpacity>
        )
    }
    capnhatDuLieu = async () => {
        var Linhvuc = await this.props.dataLinhVuc.find(item => item.IdLinhVuc == this.data.LinhVuc)
        // Utils.nlog("gia tri linh vuc", Linhvuc)
        var mucdo = await this.props.dataMucDo.find(item => item.IdMucDo == this.data.MucDo)
        // Utils.nlog("gia tri linh vuc", mucdo)
        var ten = menuHinhThuc.find(item => item.iD == this.data.HinhThuc)
        // Utils.nlog("gia tri linh vuc", ten)
        this.setState({
            selectHinhThuc: ten,
            selectLinhVuc: Linhvuc,
            selectMucDo: mucdo,
            CongKhai: this.data.CongKhai,

        })
    }
    getConfigChoosemutil = async () => {
        let res = await GetConfigByCodeBy("PHANPHOI_NHIEU_DONVI_XULY");
        // Utils.nlog("gia trij config mutil---------------", res)
        if (res && res.status == 1) {
            let check = res.data && res.data.Value == "0" ? false : true;

            this.setState({ isChooseMutil: check })
        }
    }
    getConfigND = async () => {
        let res = await getConfigNoiDung();
        if (res.status == 1 && res.data) {
            this.setState({ NoiDungTH: res.data.DEFAULT_TXT_PP })
        }
    }
    async componentDidMount() {
        await this.getConfigChoosemutil();
        if (this.isUsePhanPhoi) {
            this._GetCapDonVi_PhanPhoi();
        } else {
            await this._getLstCapQuanLy()
        }
        await this.capnhatDuLieu()
        await this._GetCapDonVi_PhanPhoi()
        await this.getConfigND()
    }

    _GetCapDonVi_PhanPhoi = async () => {
        let res = await apis.Autonoibo.GetCapDonVi_PhanPhoi(this.data.IdPA, this.action.IdRow);
        Utils.nlog("ress-------dataa -_GetCapDonVi_PhanPhoi", res)
        if (res.status == 1 && res.data) {
            this.setState({ selectCapQL: res.data[0], LstCapQuanLy: res.data, selectCapQLP: res.data[0], },
                this._GetAPI

            )
        }
    }

    _GetAPI = async () => {
        this._getLstDonViXuLy(),
            this._getLstDonViXuLyPhu()
    }

    _getLstDonViXuLy = async () => {
        Utils.nlog("gia tri _getLstDonViXuLy   1")
        let res = {}
        if (appConfig.IdSource == 'CA') {
            res = await apis.ApiDonVi.GetList_DonViPhanPhoi_CA(this.state.selectCapQL.IdCapDonVi, this.data.IdPA)
            Utils.nlog("giá trị cáp đơn vị xử lý", res);
        }
        else {
            res = await apis.ApiDonVi.GetList_DonVi_ID(this.data.IsComeBackProcess ? '' : this.data.DSDVXuLy.map(item => item.MaPX), this.state.selectCapQL.IdCapDonVi)
        }
        Utils.nlog("gia tri _getLstDonViXuLy", res, this.data.DSDVXuLy.map(item => item.MaPX))
        if (res.status == 1) {
            if (res.data && res.data.length > 0) {
                const { DVXuLy = [] } = this.data;
                if (DVXuLy && DVXuLy.length > 0) {
                    let dem = 0;
                    let arrDVXL = res.data.map((item) => {
                        var t = DVXuLy.find(item2 => item2.MaPX == item.MaPX) ? true : false;
                        if (t == true) {
                            dem = 1;
                        }
                        return (
                            {
                                ...item,
                                isCheck: t
                            }
                        )
                    });

                    this.setState({ LstDonViXL: arrDVXL, isLoading: false, LstDVXL: arrDVXL, DemDVXLChon: dem })
                } else if (this.data?.IdBoPhan) {
                    let dem = 0;
                    let arrDVXL = res.data.map((item) => {
                        dem = item?.MaPX == this.data?.IdBoPhan ? 1 : 0
                        return (
                            {
                                ...item,
                                isCheck: item?.MaPX == this.data?.IdBoPhan
                            }
                        )
                    });
                    this.setState({ LstDonViXL: arrDVXL, isLoading: false, LstDVXL: arrDVXL, DemDVXLChon: dem })
                } else {
                    this.setState({ LstDonViXL: res.data, isLoading: false, LstDVXL: res.data })
                }

            } else {

                this.setState({ LstDonViXL: [], isLoading: false, LstDVXL: [] })
            }

        } else {

            this.setState({ LstDonViXL: [], isLoading: false, LstDVXL: [] })
        }
    }

    _getLstDonViXuLyPhu = async () => {

        let res = {}
        if (appConfig.IdSource == 'CA') {
            // res = await apis.ApiDonVi.GetList_DonViPhanPhoi_CA(this.state.selectCapQLP.IdCapDonVi, this.data.IdPA)//

            let arrIdCap = this.state.LstCapQuanLy.map(item => item.IdCapDonVi);
            Utils.nlog("gia tri chi tiết phản ánh data--22", arrIdCap)
            res = await apis.ApiDonVi.GetList_DonViPhanPhoi_CA(arrIdCap.join(","), this.data.IdPA)
            Utils.nlog("res data --------------", res)

        } else {
            res = await apis.ApiDonVi.GetList_DonVi(this.state.selectCapQLP.IdCapDonVi);
        }
        // Utils.nlog("gia tri chi tiết phản ánh data--22", res.data, this.state.selectCapQL.IdCapDonVi)
        if (res.status == 1) {
            if (res.data && res.data.length > 0) {
                const { DVXuLyHT = [] } = this.data;
                if (DVXuLyHT && DVXuLyHT.length > 0) {
                    let arrDVXL = res.data.map((item) => {
                        var t = DVXuLyHT.find(item2 => item2.MaPX == item.MaPX) ? true : false;
                        return (
                            {
                                ...item,
                                isCheck: t
                            }
                        )
                    });
                    this.setState({ LstDonViXLP: arrDVXL, isLoading: false, LstDVXLP: arrDVXL })
                } else {
                    this.setState({ LstDonViXLP: res.data, isLoading: false, LstDVXLP: res.data })
                }

            } else {

                this.setState({ LstDonViXLP: [], isLoading: false, LstDVXLP: [] })
            }

        } else {

            this.setState({ LstDonViXLP: [], isLoading: false, LstDVXLP: [] })
        }
    }
    _getLstCapQuanLy = async () => {
        if (this.PANB) {
            let res = await apis.Autonoibo.GetCapDonViAll();
            // Utils.nlog('data cap quan ly ', res)
            if (res.status == 1 && res.data.length > 0) {
                this.setState({ LstCapQuanLy: [ListQLP[0], ...res.data], selectCapQL: ListQLP[0] }, this._getLstDonViXuLy);
            }
        } else {
            let res = await apis.Auto.GetCapDonViAll();
            // Utils.nlog('data cap quan ly --------------nhé em--------------', res)
            if (res.status == 1 && res.data.length > 0) {
                this.setState({ LstCapQuanLy: [ListQLP[0], ...res.data], selectCapQL: ListQLP[0] }, this._getLstDonViXuLy);
            }
        }

    }
    _getLstCapQuanLyPhu = async () => {
        if (this.PANB) {
            let res = await apis.Autonoibo.GetCapDonViAll();
            // Utils.nlog('data cap quan ly ', res)
            if (res && res.status == 1 && res.data.length > 0) {
                this.setState({ LstCapQuanLy: [ListQLP[0], ...res.data], selectCapQL: res.data && res.data.length > 0 ? res.data[0] : ListQLP[0] }, this._getLstDonViXuLy);
            }
        } else {
            let res = await apis.Auto.GetCapDonViAll();
            // Utils.nlog('data cap quan ly --------------nhé em--------------', res)
            if (res && res.status == 1 && res.data.length > 0) {
                this.setState({ LstCapQuanLy: [ListQLP[0], ...res.data], selectCapQL: res.data && res.data.length > 0 ? res.data[0] : ListQLP[0] }, this._getLstDonViXuLy);
            }
        }

    }
    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }
    _oncChangeText = (text) => {
        var { LstDonViXL } = this.state
        if (text == '') {
            this.setState({ LstDVXL: LstDonViXL })
        } else {
            const result = LstDonViXL.filter(item => item.TenPhuongXa.includes(text));
            this.setState({ LstDVXL: result })
        }
    }

    _XuLiPhanAnh = async () => {
        if (this.PANB) {
            nthisIsLoading.show();
            if (this.state.NoiDungTH.TieuDe && this.state.NoiDungTH.TieuDe.trim() == '') {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập tiêu đề ", "Xác nhận")
                nthisIsLoading.hide();
                return
            }
            if (this.state.HanXuLy == '') {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn hạn xử lý", "Xác nhận")
                nthisIsLoading.hide();
                return
            }
            let { LstDonViXL, LstDonViXLP, selectCaNhanXuLy } = this.state
            let list = LstDonViXL.filter(item => item.isCheck == true)
            list = list.map((item) => item.MaPX)

            let listP = LstDonViXLP.filter(item => item.isCheck == true)
            listP = listP.map((item) => item.MaPX)
            if (list.length <= 0) {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn đơn vị phân phối", "Xác nhận")
                nthisIsLoading.hide();
                return;
            }
            if (this.state.selectLinhVuc.IdLinhVuc == 100) {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn lĩnh vực", "Xác nhận");
                nthisIsLoading.hide();
                return
            }
            if (this.state.selectMucDo.IdMucDo == 100) {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn mức độ", "Xác nhận");
                nthisIsLoading.hide();
                return
            }
            if (this.state.NoiDungTH == '') {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung thực hiện", "Xác nhận");
                nthisIsLoading.hide();
                return
            }
            let arrCaNhan = selectCaNhanXuLy && selectCaNhanXuLy.map(item => {
                return {
                    UserID: item.UserID,
                    IdDV: item.MaPX
                }
            })
            this.data.ActionFormChon = this.action
            let body = {
                ...this.data,
                NoiDungXL: this.state.NoiDungTH,
                TieuDe: this.state.TieuDe,
                CongKhai: this.state.isCongKhai,
                HinhThuc: this.state.selectHinhThuc.iD,
                MucDo: this.state.selectMucDo.IdMucDo,
                LinhVuc: this.state.selectLinhVuc.IdLinhVuc,
                SoNgay: 1,
                DSDVXuLy: list,
                DSDVXuLyHT: listP,
                HanXuLy: moment(this.state.HanXuLy).format("DD/MM/YYYY HH:mm"),
                XuLyKhan: this.state.isXuLyKhanCap,
                ChuyenTheoDoi: !this.state.isChuyenXL,
                DsCaNhanXuLy: arrCaNhan
            }
            Utils.nlog("gia tri action-------------------------------------------", body)
            const res = await apis.Autonoibo.XuLyQuyTrinhPhanAnh(body);
            // Utils.nlog("gia tri res xu li phan anh", res)
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", "Phân phối thành công", "Xác nhận", () => {
                    if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                        ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                    }
                    // Utils.goscreen(this, "scHomePAHT");
                    try {
                        this.callback(this);
                    } catch (error) {
                        Utils.goback(this);
                    };
                });
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Thực hiện phân phối không thành công", "Xác nhận")
            }
            nthisIsLoading.hide();
        } else {
            nthisIsLoading.show();
            let { LstDonViXL, LstDonViXLP, selectCaNhanXuLy } = this.state
            let list = LstDonViXL.filter(item => item.isCheck == true)
            list = list.map((item) => item.MaPX)

            let listP = LstDonViXLP.filter(item => item.isCheck == true)
            listP = listP.map((item) => item.MaPX)
            let arrCaNhan = selectCaNhanXuLy && selectCaNhanXuLy.map(item => {
                return {
                    UserID: item.UserID,
                    IdDV: item.MaPX
                }
            })
            if (this.isThaoTac == true) {
                if (this.state.TieuDe && this.state.TieuDe.trim() == '') {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập tiêu đề ", "Xác nhận")
                    nthisIsLoading.hide();
                    return;
                }
                if (this.state.HanXuLy == '') {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn hạn xử lý", "Xác nhận")
                    nthisIsLoading.hide();
                    return;
                }
                //lấy danh sach đơn vị xử lý chính và phụ ra


                if (list.length <= 0) {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn đơn vị phân phối", "Xác nhận")
                    nthisIsLoading.hide();
                    return;
                }
                if (this.state.selectLinhVuc.IdLinhVuc == 100) {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn lĩnh vực", "Xác nhận");
                    nthisIsLoading.hide();
                    return
                }
                if (this.state.selectMucDo.IdMucDo == 100) {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn mức độ", "Xác nhận");
                    nthisIsLoading.hide();
                    return
                }
                if (this.state.NoiDungTH == '') {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung thực hiện", "Xác nhận");
                    nthisIsLoading.hide();
                    return
                }
            }
            this.data.ActionFormChon = this.action;

            Utils.nlog("giá trị list chính,list phụ", list, listP)
            let body = {
                ...this.data,
                NoiDungXL: this.state.NoiDungTH,
                TieuDe: this.state.TieuDe,
                CongKhai: this.state.isCongKhai,
                HinhThuc: this.state.selectHinhThuc.iD,
                MucDo: this.state.selectMucDo.IdMucDo,
                LinhVuc: this.state.selectLinhVuc.IdLinhVuc,
                SoNgay: 1,
                DSDVXuLy: list,
                DSDVXuLyHT: listP,
                HanXuLy: moment(this.state.HanXuLy).format("DD/MM/YYYY HH:mm"),
                XuLyKhan: this.state.isXuLyKhanCap,
                ChuyenTheoDoi: !this.state.isChuyenXL,
                ChuyenXuLy: this.state.isbientap ? 1 : 2,
                DsCaNhanXuLy: arrCaNhan
            }
            Utils.nlog("gia tri action", body)
            const res = await apis.Auto.XuLyQuyTrinhPhanAnh(body);
            Utils.nlog("gia tri res xu li phan anh", res)
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", `${this.action.IdForm == 18 ? 'Trình phân phối thành công' : (this.action.IdForm == pheduyettrinhphanphoi ? 'Thực hiện thành công' : 'Phân phối thành công')}`, "Xác nhận", () => {
                    if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                        ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                    }
                    // Utils.goscreen(this, "scHomePAHT");
                    try {
                        this.callback(this);
                    } catch (error) {
                        Utils.goback(this);
                    };
                });
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : `${this.action.IdForm == 18 ? 'Thực hiện trình phân phối không thành công' : "Thực hiện phân phối không thành công"}`, "Xác nhận")
            }
            nthisIsLoading.hide();
        }

    }
    _ListFooterComponent = () => {

    }
    loadMore = async () => {
        const { page, size, val } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.Auto.DanhSachPANoChecker(pageNumber, size, val);
            Utils.nlog('data list canh bao 2', res)
            if (res.status == 1 && res.data) {
                if (res.page) {
                    this.pageAll = res.page.AllPage;
                }
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber, });
            };
        };
    };

    onEnableScroll = (value: boolean) => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };

    _GetDanhSachCaNhanXuLy = async (DSDonVi) => {
        let res = await apis.Auto.DanhSachCaNhanXuLyTheoDonViStep(DSDonVi, this.data.IdPA, this.data.IdStep, this.action)
        let dataDSNV = [];
        if (res.status == 1 && res) {
            dataDSNV = res.data;
        }

        if (this.isThaoTac) {
            Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps_Multi, {
                callback: (val) => this.setState({ selectCaNhanXuLy: val }),
                item: this.state.selectCaNhanXuLy, key: 'FullName',
                title: 'Danh sách cá nhân', AllThaoTac: dataDSNV,
                ViewItem: (item) => this._viewItemImage(item, 'FullName'), Search: true, KeyID: 'UserID'
            })
        }
    }
    _viewItemImage = (item, keyView) => {
        return (
            <View key={item.Id} style={{
                flex: 1,
                padding: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.black_50,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_80 }} >{`${item[keyView]}`}</Text>
                <Image source={item.isCheck ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon16, { tintColor: colors.colorBlueLight, marginRight: 10 }]}></Image>
            </View>
        )
    }
    _deleteItem = (index) => {
        let { selectCaNhanXuLy } = this.state
        selectCaNhanXuLy.splice(index, 1);
        console.log("XXX:", index, selectCaNhanXuLy);
        this.setState({ selectCaNhanXuLy: selectCaNhanXuLy })
    }
    ComponentTieuDe = (edit = true) => {
        return (
            <ItemNoiDung
                editable={this.isThaoTac && edit}
                value={this.state.TieuDe}
                multiline={true}
                textTieuDe={<Text>Tiêu đề <Text style={{ color: colors.redStar }}></Text></Text>}
                placeholder={'Nội dung'}
                onChangeText={(text) => this.onChangeTieuDe(text)}
                stContaierTT={{ paddingVertical: 8 }}
            />
        )
    }

    ComponentLinhVucHinhThuc = () => {
        const { selectLinhVuc, selectHinhThuc } = this.state
        return (
            <View pointerEvents={this.isThaoTac == false ? 'none' : 'auto'} style={[nstyles.nstyles.nrow, { marginTop: 11 }]}>
                <ModalDrop
                    value={selectLinhVuc}
                    keyItem={'IdLinhVuc'}
                    texttitle={<Text>Lĩnh vực <Text style={{ color: colors.redStar }}>*</Text></Text>}
                    styleContent={{ marginRight: 5 }}
                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                    options={this.props.dataLinhVuc}
                    onselectItem={(item) => this.setState({ selectLinhVuc: item })}
                    Name={"LinhVuc"} />
                <ModalDrop
                    value={selectHinhThuc}
                    keyItem={'iD'}
                    texttitle={'Hình thức'}
                    dropdownTextStyle={{
                        paddingHorizontal: 20, width: '100%',
                        fontSize: 16
                    }}
                    options={menuHinhThuc}
                    onselectItem={(item) => this.setState({ selectHinhThuc: item })}
                    Name={"TenHinhThuc"} />
            </View>
        )
    }

    ComponentMucDo = () => {
        const { selectMucDo } = this.state
        return (
            < View pointerEvents={this.isThaoTac == false ? 'none' : 'auto'} style={[nstyles.nstyles.nrow, { marginTop: 11 }]} >
                <ModalDrop
                    value={selectMucDo}
                    keyItem={'IdMucDo'}
                    texttitle={<Text>Mức độ <Text style={{ color: colors.redStar }}>*</Text></Text>}
                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                    options={this.props.dataMucDo}
                    onselectItem={(item) => this.setState({ selectMucDo: item })}
                    Name={"TenMucDo"} />
            </View >)
    }

    ComponentNoiDungPhanAnh = () => {
        return (
            <ItemNoiDung
                editable={false}
                value={this.state.NoiDungPA}
                multiline={true}
                textTieuDe="Nội dung phản ánh"
                placeholder={'Nội dung'}
                // textNoiDung={this.state.NoiDungPA}
                onChangeText={(text) => this.onChangeNoiDung(text)}
            />
        )
    }
    GoScreenSelectDVXLPhu = () => {
        // let DonVXLChinh
        const { LstDonViXLP, LstDVXLP, SelectDVXLChinh, LstDonViXL } = this.state
        Utils.goscreen(this, ConfigScreenDH.Modal_DonVi, {
            dataP: LstDonViXLP,
            dataViewP: LstDVXLP,
            dataDVXL: LstDonViXL
        })
    }

    ComponentCapQUanLy = () => {
        const { selectCapQL, selectCapQLP, LstDonViXL, LstDonViXLP, LstDVXL, LstDVXLP, LstCapQuanLy, LstDonViXLDuyet, LstDonViXLDuyetP, DemDVXLChon, LstCapQuanLyP, selectCaNhanXuLy } = this.state
        let list = LstDonViXL.filter(item => item.isCheck == true);
        let listPhu = LstDonViXLP.filter(item => item.isCheck == true);
        Utils.nlog("gia tri seletc cap ql", list.map(item => item.MaPX))
        let getDSNhanVien = () => { };
        if (list.length > 0 && this.action.IdRow == 17) {
            getDSNhanVien = () => this._GetDanhSachCaNhanXuLy(list.map(item => item.MaPX));

        }
        return (
            <>
                {
                    this.isThaoTac == true ? <View style={[nstyles.nstyles.nrow, {}]}>
                        <ModalDrop
                            value={selectCapQL}
                            keyItem={"IdCapDonVi"}
                            texttitle={'Cấp quản lý'}
                            // textDefault={selectCapQL.TenCapDonVi}
                            // styleContent={{ marginRight: 5 }}
                            dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                            options={LstCapQuanLy}
                            onselectItem={(item) => this.setState({ selectCapQL: item }, () => {
                                this.setState({ DemDVXLChon: 0 }, this._getLstDonViXuLy)

                                // this._getLstDonViXuLyPhu();
                            })}
                            Name={"TenCapDonVi"} />

                    </View> : null
                }
                {/* this._GetDanhSachCaNhanXuLy(list.map(item => item.MaPX)) */}
                <TouchableOpacity
                    onPress={this.isThaoTac == false ? () => { } : async () => {
                        Utils.goscreen(this, ConfigScreenDH.Modal_DonVi, {
                            data: LstDonViXL,
                            dataView: LstDVXL,
                            DVXL: true
                        });
                    }}
                    style={{
                        marginTop: 10, backgroundColor: colors.colorGrayTwo, flexDirection: 'row',
                        borderWidth: 0.5, borderRadius: 2, padding: 10, borderColor: colors.brownGreyTwo,
                    }}
                >
                    <Text style={{ fontSize: sizes.sizes.sText14, flex: 1 }}>{<Text>{'Đơn vị ' + (appConfig.IdSource == 'CA' ? 'chủ trì ' : '') + 'xử lý '}<Text style={{ color: colors.redStar }}>*</Text></Text>}</Text>
                    <Image source={Images.icDropDown} style={[nstyles.nstyles.nIcon15,
                    { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
                </TouchableOpacity>

                {
                    list.length > 0 || LstDonViXLDuyet.length > 0 ? <View pointerEvents={this.isThaoTac == false ? 'none' : 'auto'}  >
                        <View
                            style={{
                                paddingHorizontal: 10, backgroundColor: colors.colorGrayTwo,
                                borderWidth: 1, borderColor: colors.brownGreyTwo,
                                marginTop: 5, paddingVertical: 5,
                                borderRadius: 2,
                            }}>
                            <FlatList
                                data={list}
                                renderItem={this._renderDonViXL}
                                keyExtractor={(item, index) => index.toString()}
                                // onEndReached={this.loadMore}
                                onEndReachedThreshold={0.3}
                            // ListFooterComponent={this._ListFooterComponent}
                            />
                        </View>
                    </View> : null
                }
                {/* Phụ. */}
                {/* {
                    this.isThaoTac == true ? <View style={[nstyles.nstyles.nrow, {}]}>
                        <ModalDrop
                            value={selectCapQLP}
                            keyItem={"IdCapDonVi"}
                            // texttitle={'Cấp quản lý'}
                            texttitle={'Cấp quản lý của đơn vị xử lý phụ'}
                            // textDefault={selectCapQL.TenCapDonVi}
                            // styleContent={{ marginRight: 5 }}
                            dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                            options={LstCapQuanLy}
                            onselectItem={(item) => this.setState({ selectCapQLP: item }, () => {
                                // this._getLstDonViXuLy();
                                this._getLstDonViXuLyPhu();
                            })}
                            Name={"TenCapDonVi"} />

                    </View> : null
                } */}

                {
                    appConfig.IdSource == "CA" ?
                        <TouchableOpacity
                            onPress={this.isThaoTac == false ? () => { } : this.GoScreenSelectDVXLPhu}
                            style={{
                                marginTop: 10, backgroundColor: colors.colorGrayTwo, flexDirection: 'row',
                                borderWidth: 0.5, borderRadius: 2, padding: 10, borderColor: colors.brownGreyTwo,
                            }}
                        >
                            <Text style={{ fontSize: sizes.sizes.sText14, flex: 1 }}>{<Text>{'Đơn vị phối hợp xử lý '}<Text style={{ color: colors.redStar }}></Text></Text>}</Text>
                            <Image source={Images.icDropDown} style={[nstyles.nstyles.nIcon15,
                            { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
                        </TouchableOpacity>
                        : null
                }
                {
                    listPhu.length > 0 || LstDonViXLDuyetP.length > 0 ? <View pointerEvents={this.isThaoTac == false ? 'none' : 'auto'}  >
                        <View
                            style={{
                                paddingHorizontal: 10, backgroundColor: colors.colorGrayTwo,
                                borderWidth: 1, borderColor: colors.brownGreyTwo,
                                marginTop: 5, paddingVertical: 5,
                                borderRadius: 2,
                            }}>
                            <FlatList
                                data={listPhu}
                                renderItem={this._renderDonViXLP}
                                keyExtractor={(item, index) => index.toString()}
                                // onEndReached={this.loadMore}
                                onEndReachedThreshold={0.3}
                            // ListFooterComponent={this._ListFooterComponent}
                            />
                        </View>
                    </View> : null
                }

                {
                    list.length > 0 && this.action.IdRow == 17 ?
                        <>
                            <TouchableOpacity
                                onPress={getDSNhanVien}
                                style={{
                                    marginTop: 10, backgroundColor: colors.colorGrayTwo, flexDirection: 'row',
                                    borderWidth: 0.5, borderRadius: 2, padding: 10, borderColor: colors.brownGreyTwo,
                                }}
                            >
                                <Text style={{ fontSize: sizes.sizes.sText14, flex: 1 }}>{<Text>{`Danh sách cá nhân `}<Text style={{ color: colors.redStar }}>*</Text></Text>}</Text>
                                <Image source={Images.icDropDown} style={[nstyles.nstyles.nIcon15,
                                { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
                            </TouchableOpacity>
                            {selectCaNhanXuLy ?
                                <View style={{ flexDirection: 'row', marginVertical: 5, flexWrap: 'wrap' }}>
                                    {selectCaNhanXuLy.map((item, index) => {
                                        return (
                                            <View key={index} style={{ backgroundColor: colors.colorGrayBgr, borderRadius: 5, marginRight: 5, marginBottom: 3 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                    <Text style={{ fontStyle: 'italic', paddingLeft: 10 }}>{item.FullName}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => this._deleteItem(index)}
                                                        style={{ padding: 10 }}
                                                    >
                                                        <Image source={Images.icClose} style={[nstyles.nstyles.nIcon16, { tintColor: colors.redStar, }]}></Image>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View> : null}
                        </> : null
                }
            </>
        )
    }


    ComponentHanXuLy = (isTick = true) => {
        const { HanXuLy, GioXuLy } = this.state

        return (
            <>
                <Text style={{ fontSize: sizes.sizes.sText12, marginTop: 10 }}>Hạn xử lý  <Text style={{ color: colors.redStar }}>*</Text></Text>
                <View
                    pointerEvents={this.isThaoTac == false || isTick == false ? 'none' : 'auto'}
                    style={[nstyles.nstyles.nrow,
                    {
                        justifyContent: 'space-between',
                        borderWidth: 0.5,
                        marginTop: 5,
                        backgroundColor: colors.BackgroundHome
                    }]}>
                    <DatePick
                        style={{
                            width: "100%",
                            paddingVertical: 10
                        }}
                        value={HanXuLy}
                        onValueChange={HanXuLy => this.setState({ HanXuLy })}
                    />
                </View>
                {
                    HanXuLy && this.ChonGioPhanPhoi ? <View
                        pointerEvents={this.isThaoTac == false || isTick == false ? 'none' : 'auto'}
                        style={[nstyles.nstyles.nrow,
                        {
                            justifyContent: 'space-between',
                            borderWidth: 0.5,
                            marginTop: 5,
                            backgroundColor: colors.BackgroundHome
                        }]}>
                        <DatePick
                            style={{
                                width: "100%",
                                paddingVertical: 10
                            }}
                            ChonGio
                            Img={Images.icClock}
                            value={GioXuLy}
                            onValueChange={GioXuLy => this.setState({ GioXuLy }, async () => {
                                var HanXL = HanXuLy + ' ' + GioXuLy
                                await this.setState({ HanXuLy: HanXL })
                                Utils.nlog('Gia tri Han XuLy', this.state.HanXuLy)
                            })}
                        />

                    </View> : null
                }
            </>
        )
    }

    ComponentNoiDungThucHien = () => {
        const { } = this.state
        return (
            // <ItemNoiDung
            //     textTieuDe={<Text>Nội dung thực hiện <Text style={{ color: colors.redStar }}>{this.isThaoTac == true ? '*' : null}</Text></Text>}
            //     multiline={true}
            //     placeholder={'Nội dung'}
            //     stContaierTT={{
            //         backgroundColor: colors.veryLightPink,
            //         height: Height(8)

            //     }}
            //     stNoiDung={{ textAlignVertical: "top" }}
            //     value={this.state.NoiDungTH}
            //     onChangeText={(text) => this.onChangeNDThucHien(text)}
            // />
            <View style={{ marginVertical: 10, }}>
                <Text>Nội dung thực hiện <Text style={{ color: colors.redStar }}>{this.isThaoTac == true ? '*' : null}</Text></Text>
                <TouchableOpacity
                    onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                        content: this.state.NoiDungTH,
                        callback: (val) => this.setState({ NoiDungTH: val })
                    })}
                    pointerEvents={
                        'auto'
                    }
                    style={[{
                        paddingTop: 5,
                        paddingLeft: 5,
                        marginTop: 5,
                        // alignItems: "center",
                        paddingVertical: 5,
                        borderWidth: 1,
                        // borderStyle: 'dashed',
                        minHeight: 60,
                        borderColor: colors.grayLight,
                        borderRadius: 5,
                        backgroundColor: colors.veryLightPink,
                    }]}>
                    <HtmlViewCom html={this.state.NoiDungTH ? this.state.NoiDungTH : '<div></div>'} style={{ height: '100%' }} />
                </TouchableOpacity>
            </View>

        )
    }

    ComponentTick = (isTick = true) => {
        const { isCongKhai,
            isXuLyKhanCap, } = this.state
        return (
            <View pointerEvents={this.isThaoTac == false || isTick == false ? 'none' : 'auto'} style={{ marginTop: 10, flexDirection: 'row' }}>
                {/* {
                    this.PANB ? null : <TouchableOpacity style={styles.ContainerCheck} onPress={() => this._ClickCongKhai()}>
                        <Image source={isCongKhai ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon14, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                        <Text style={{ marginRight: 15 }}>Công khai phản ánh này</Text>
                    </TouchableOpacity>
                } */}
                <TouchableOpacity style={styles.ContainerCheck} onPress={() => this._ClickXuLyKhanCap()}>
                    <Image source={isXuLyKhanCap ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon14, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                    <Text>Xử lý khẩn cấp</Text>
                </TouchableOpacity>
            </View>
        )

    }

    ComponentOption = () => {
        const { isChuyenXL,
            isbientap, } = this.state
        return (
            <>
                {
                    this.PANB ? null : <><View pointerEvents={this.isThaoTac == false ? 'none' : 'auto'} style={{ marginTop: 21, flexDirection: 'row' }}>
                        {/* <TouchableOpacity style={styles.ContainerCheck} onPress={() => this._ClickChuyenXL()}>
                            <Image source={isChuyenXL == true ? Images.icRadioCheck : Images.icRadioUncheck} style={[nstyles.nIcon14, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                            <Text style={{ marginRight: 15 }}>Chuyển xử lý</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.ContainerCheck} onPress={() => this._ClickChuyenXL()}>
                            <Image source={isChuyenXL == false ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon14, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                            <Text>Chuyển để biết theo dõi</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                }
            </>
        )
    }
    ComponentOptionBienTap = () => {
        const { isChuyenXL,
            isbientap, } = this.state
        return (
            <>
                {
                    isChuyenXL ? <View pointerEvents={this.isThaoTac == false ? 'none' : 'auto'} style={{ marginTop: 21, flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.ContainerCheck} onPress={() => this.setState({ isbientap: true })}>
                            <Image source={isbientap == true ? Images.icRadioCheck : Images.icRadioUncheck} style={[nstyles.nIcon14, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                            <Text style={{ marginRight: 15 }}>{'Có biên tập'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ContainerCheck} onPress={() => this.setState({ isbientap: false })}>
                            <Image source={isbientap == false ? Images.icRadioCheck : Images.icRadioUncheck} style={[nstyles.nIcon14, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                            <Text>{'Không cần biên tập'}</Text>
                        </TouchableOpacity>
                    </View> : null

                }
            </>

        )
    }

    ComponentButtonXacNhan = () => {
        const { } = this.state
        return (
            <ButtonCus
                onPressB={this._XuLiPhanAnh}
                stContainerR={{
                    width: Width(30), paddingVertical: 12, marginBottom: 30,
                    maralignSelf: 'center', justifyContent: 'flex-start'
                }}
                textTitle={this.action.IdForm == pheduyettrinhphanphoi ? "Duyệt" : "Thực hiện"}
            />)
    }

    ComponentDanhSachNhanViec = () => {
        return (
            <TouchableOpacity>

            </TouchableOpacity>
        )
    }


    renderItemDesign = (id) => {
        const { design = [] } = this.state;
        let index = design.findIndex(d => d === id);
        if (index >= 0) {
            switch (id) {
                case 1:
                    return this.ComponentTieuDe()
                case 2:
                    return this.ComponentLinhVucHinhThuc()
                case 3:
                    return this.ComponentMucDo()
                case 4:
                    return this.ComponentNoiDungPhanAnh()
                case 5:
                    return this.ComponentCapQUanLy()
                case 6:
                    return this.ComponentHanXuLy()
                case 7:
                    return this.ComponentNoiDungThucHien()
                case 8:
                    return this.ComponentTick()
                case 9:
                    return this.ComponentOption()
                case 10:
                    return this.ComponentButtonXacNhan()
                case 11:
                    return this.ComponentTieuDe(false)
                case 12:
                    return this.ComponentOptionBienTap();
                case 13:
                    return this.ComponentHanXuLy(false)
                case 14:
                    return this.ComponentTick(false)
                default:
                    return null;
                    break;
            }
        } else {
            return null;
        }

    }

    render() {
        // if (this.isThaoTac == false) {
        //     list = LstDonViXLDuyet.map(item => {
        //         return { ...item, isCheck: true }
        //     })
        // }
        const { isLoading } = this.state
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: !this.props?.IsComponentPhanPhoi ? colors.backgroundModal : colors.nocolor,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: !this.props?.IsComponentPhanPhoi ? nstyles.Height(5) : 0, borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>
                    {
                        !this.props?.IsComponentPhanPhoi && <HeaderModal
                            _onPress={() => this.goback()}
                            title={this.action.ButtonText}
                        />
                    }
                    <KeyboardAwareScrollView
                        scrollEnabled={this.state.enableScrollViewScroll}
                        ref={myScroll => (this._myScroll = myScroll)}
                        showsVerticalScrollIndicator={false}
                        style={{ paddingHorizontal: !this.props?.IsComponentPhanPhoi ? 15 : 0, }}>

                        {this.renderItemDesign(1)}
                        {!this.props?.IsComponentPhanPhoi && this.renderItemDesign(11)}
                        {this.renderItemDesign(2)}
                        {this.renderItemDesign(3)}
                        {this.renderItemDesign(4)}
                        {this.renderItemDesign(5)}
                        {/*  cho chọn han xu ly tích*/}
                        {this.renderItemDesign(6)}
                        {/* k cho chọn han xu ly tích*/}
                        {this.renderItemDesign(13)}
                        {this.renderItemDesign(7)}
                        {/* Xử lý khẩn có tích*/}
                        {this.renderItemDesign(8)}
                        {/* Xử lý khẩn k tích*/}
                        {this.renderItemDesign(14)}

                        {this.renderItemDesign(9)}
                        {this.renderItemDesign(12)}

                        {!this.props?.IsComponentPhanPhoi && this.renderItemDesign(10)}

                        <IsLoading />
                    </KeyboardAwareScrollView>

                </View>
                {
                    isLoading == true ? <ModalLoading /> : <View />
                }
            </View >
        );
    }
}
const mapStateToProps = state => ({
    dataNguon: state.GetList_NguonPhanAnh,
    dataChuyenMuc: state.GetList_ChuyenMuc,
    dataMucDo: state.GetList_MucDoAll,
    dataLinhVuc: state.GetList_LinhVuc,
    dataMucDoNB: state.GetList_MucDoAll_NB,
    //   GetList_DonVi_NB
});

export default Utils.connectRedux(ModalPhanPhoi, mapStateToProps, false);
