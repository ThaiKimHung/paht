import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { colors, sizes } from '../../../styles';
import { Images } from '../../images';
import { nstyles, Height, Width } from '../../../styles/styles';
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDrop from './components/ModalDrop';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import apis from '../../apis';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { IsLoading } from '../../../components';
import FileCom from './components/FileCom';
import { GetList_ChuyenMucAITheoLinhVuc } from '../../apis/ChuyenMuc';
import { appConfig } from '../../../app/Config';
import HtmlViewCom from '../../../components/HtmlView';
import { ConfigScreenDH } from '../../routers/screen';
import AppCodeConfig from '../../../app/AppCodeConfig';
import Tags from '../../../components/Tags';
import Icon from 'react-native-vector-icons/AntDesign'
import { reText } from '../../../styles/size';
import ModalPhanPhoi from './ModalPhanPhoi';
import moment from 'moment';

//1 phan anh 2 gop y
const menuHinhThuc = [{
    TenHinhThuc: 'Phản ánh',
    iD: '1'
}, {
    TenHinhThuc: 'Góp ý',
    iD: '2'
}]
class ModalXacMinhPA extends Component {
    constructor(props) {
        super(props);
        this.dataHinhThuc = menuHinhThuc;
        this.dataSetting = Utils.getGlobal(nGlobalKeys.dataSetting, {}, AppCodeConfig.APP_ADMIN);
        this.isTiepNhanDonGian = Utils.getGlobal(nGlobalKeys.isTiepNhanDonGian, {}, AppCodeConfig.APP_ADMIN);
        this.data = Utils.ngetParam(this, "data", {})
        this.action = Utils.ngetParam(this, "action", {})
        this.callback = Utils.ngetParam(this, "callback", () => { });
        var cm = this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == this.data.IdChuyenMuc);
        var lv = this.props.dataLinhVuc.find(item => item.IdLinhVuc == this.data.LinhVuc);
        var md = this.props.dataMucDo.find(item => item.IdMucDo == this.data.MucDo);
        var ht = menuHinhThuc.find(item => item.iD == this.data.HinhThuc);
        var nguon = this.props.dataNguon.find(item => item.IdNguon == this.data.NguonPA);
        this.state = {
            dataPhanAnh: this.data,
            objChuyenMuc: cm ? cm : this.dataSetting.selectChuyenMuc,
            objLinhVuc: lv ? lv : this.dataSetting.selectLinhVuc,
            objMucDo: md ? md : this.dataSetting.selectMucDo,
            objHinhThuc: ht,
            objNguon: nguon ? nguon : this.dataSetting.selectNguon,
            refreshing: true,
            page: 1,
            dataPA: [],
            textempty: 'Đang tải...',
            arrVideo: [],
            arrImage: [],
            arrApplication: [],
            isTogleID: 0,
            onPressItem: () => { },
            data: [],
            isPlay: true,
            TenTaiKhoan: '',
            CaNhanToChuc: this.data ? this.data.TenNguoiGopY : '',
            DienThoai: this.data ? this.data.SDTCD : '',
            Email: this.data ? this.data.EmailCD : '',
            DiaChi: this.data ? this.data.DiaChiCD : '',
            TieuDe: this.data ? this.data.TieuDe : '',
            NoiDung: this.data ? this.data.NoiDung : '',
            DiaChiSuKien: this.data ? this.data.DiaDiem : '',
            // Log: this.data ? this.data.ToaDoX : '',
            // Lat: this.data ? this.data.ToaDoY : '',
            Lat: this.data ? this.data.ToaDoX : '',
            Log: this.data ? this.data.ToaDoY : '',
            ChiTietNguon: this.data ? this.data.ChiTietNguon : '',
            CongKhai: this.data ? this.data.CongKhai : false,
            isLoad: false,
            //upload
            arrImage: [],
            arrAplicaton: [],
            arrFileDelete: [],
            listChuyenMucAI: [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }],
            tags: {
                tag: '',
                tagsArray: []
            },
        };
        this.statePhanPhoi = {} // chứa tất cả state phân phối
    }
    _setUpDuLieu = () => {
        var cm = this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == this.data.IdChuyenMuc);
        var lv = this.props.dataLinhVuc.find(item => item.IdLinhVuc == this.data.LinhVuc);
        var md = this.props.dataMucDo.find(item => item.IdMucDo == this.data.MucDo);
        var ht = menuHinhThuc.find(item => item.iD == this.data.HinhThuc);
        var nguon = this.props.dataNguon.find(item => item.IdNguon == this.data.NguonPA);
        var data = this.state.NoiDung;
        if (cm) {
            this._GetList_ChuyenMucAITheoLinhVuc(cm, true);
        }
        // //Utils.nlog("gia tri lv,md,cm,ht,nguon", md, this.dataSetting.selectMucDo)
        this.setState({
            objChuyenMuc: cm ? cm : this.dataSetting.selectChuyenMuc,
            objLinhVuc: lv ? lv : this.dataSetting.selectLinhVuc,
            objMucDo: md ? md : this.dataSetting.selectMucDo,
            objHinhThuc: ht,
            objNguon: nguon ? nguon : this.dataSetting.selectNguon,
            NoiDung: data
        })
    }

    componentDidMount() {
        this._setUpDuLieu();
        Utils.nlog('LOG [THIS_DATA] Xac Minh', this.data)
        Utils.nlog('LOG [THIS_ISTIEPNHAN] Xac Minh', this.isTiepNhanDonGian)
    }

    goback = () => {
        Utils.goback(this)
    }

    _ShowVideo = (item) => {
        Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, {
            source: item.uri
        });
    }



    // callbackDataMaps
    _callbackDataMaps = (rejon, DiaChiSuKien) => {
        // //Utils.nlog("vao calback")
        this.setState({
            Log: rejon.longitude,
            Lat: rejon.latitude,
            DiaChiSuKien: DiaChiSuKien
        })
    }
    _onPressBD = () => {
        Utils.goscreen(this, "sc_BanDo_RootDH", {
            latitude: this.state.Lat,
            longitude: this.state.Log,
            callbackDataMaps: this._callbackDataMaps,
            diadiem: this.state.DiaChiSuKien
        })
    }
    _XuLiPhanAnh = async () => {
        //this.setState({ isLoad: true })
        nthisIsLoading.show();
        if (this.state.TieuDe.trim() == '' && !this.isTiepNhanDonGian) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập tiêu đề phản ánh", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        if (this.state.NoiDung == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung phản ánh", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        if (this.state.DiaChiSuKien == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập địa chỉ sự kiện phản ánh", "Xác nhận");
            nthisIsLoading.hide();
            return
        }

        if (this.state.objChuyenMuc.IdChuyenMuc == 100 && !this.isTiepNhanDonGian) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn chuyên mục", "Xác nhận");
            nthisIsLoading.hide();
            return

        }
        if (this.state.objLinhVuc.IdLinhVuc == 100 && !this.isTiepNhanDonGian) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn lĩnh vực", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        if (this.state.objMucDo.IdMucDo == 100) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn mức độ", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        if (this.state.objNguon.IdNguon == 100 && !this.isTiepNhanDonGian) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn nguồn phản ánh", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        //Utils.nlog("gia tri action", this.action)
        this.data.ActionFormChon = this.action

        let LstImg = [], arrVideo = [];
        var { arrImage, arrAplicaton } = this.state//list image
        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];

            let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
            if (checkImage == true || item?.isImage == true || (item?.timePlay && item?.timePlay == 0)) {
                let downSize = 1;
                if (item.height >= 2000 || item.width >= 2000) {
                    downSize = 0.3;
                }
                let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, false);
                LstImg.push({
                    "type": item.timePlay == 0 ? 1 : 2,
                    "strBase64": strBase64,
                    "filename": "hinh" + index + ".png",
                    "extension": ".png",
                    "isnew": true
                });
            } else {
                if (Platform.OS == 'android') {
                    arrVideo.push(item);
                } else {
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    }
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                    LstImg.push({
                        "type": 2,
                        "strBase64": strBase64,
                        "filename": `Video_${index}${Platform.OS == 'ios' ? ".mov" : ".mp4"}`,// ("Video_" + index + Platform.OS == 'ios' ? ".mov" : ".mp4"),
                        "extension": Platform.OS == 'ios' ? ".mov" : ".mp4",
                        "isnew": true
                    });
                }
            }
        }
        for (let index = 0; index < arrAplicaton.length; index++) {
            let item = arrAplicaton[index];
            let strBase64;
            // strBase64 = await Utils.parseBase64(item.uri);
            if (item.uri) {
                var duoiFile = item?.TenFile.split('.')
                var fi = "." + duoiFile[duoiFile.length - 1]
                //Utils.nlog("gia trị duôi file", fi)
                LstImg.push({
                    "type": 2,
                    "strBase64": item.base64,
                    "filename": item.name,
                    "extension": fi,
                    "isnew": true
                });
            }
        }

        var body = {
            ...this.data,
            NoiDung: this.state.NoiDung,
            TieuDe: this.isTiepNhanDonGian && this.data?.TieuDe != "" ? this.data.TieuDe : this.state.TieuDe ? this.state.TieuDe : "Tiêu đề phản ánh",
            CongKhai: this.state.CongKhai,
            ChiTietNguon: this.state.ChiTietNguon,
            IdChuyenMuc: this.isTiepNhanDonGian && this.data?.IdChuyenMuc ? this.data?.IdChuyenMuc : this.state.objChuyenMuc?.IdChuyenMuc != 100 ? this.state.objChuyenMuc?.IdChuyenMuc : 36,
            LinhVuc: this.isTiepNhanDonGian && this.data?.LinhVuc ? this.data?.LinhVuc : this.state.objLinhVuc?.IdLinhVuc != 100 ? this.state?.objLinhVuc.IdLinhVuc : 21,
            ToaDoX: this.state.Lat,
            ToaDoY: this.state.Log,
            DiaDiem: this.state.DiaChiSuKien,
            HinhThuc: this.state.objHinhThuc.iD,
            NguonPA: this.isTiepNhanDonGian && this.data?.NguonPA ? this.data?.NguonPA : this.state.objNguon?.IdNguon ? this.state.objNguon.IdNguon : 12,
            MucDo: this.state.objMucDo.IdMucDo,
            UploadPA: LstImg,
        }

        if (this.action.IdForm == 23) {
            body = {
                ...body,
                hashtags: this.state.tags.tagsArray.map(item => { return `#${item}` })
            }
        }

        if (this.action.IdForm == 24) {
            // Xử lý component ModalPhanPhoi tại đây =============
            let { LstDonViXL, LstDonViXLP, selectCaNhanXuLy } = this.statePhanPhoi
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
            //lấy danh sach đơn vị xử lý chính và phụ ra
            if (list.length <= 0) {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn đơn vị phân phối", "Xác nhận")
                nthisIsLoading.hide();
                return;
            }
            if (this.statePhanPhoi.HanXuLy == '') {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn hạn xử lý", "Xác nhận")
                nthisIsLoading.hide();
                return;
            }
            if (this.statePhanPhoi.NoiDungTH == '') {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung thực hiện", "Xác nhận");
                nthisIsLoading.hide();
                return
            }
            //====================================================
            body = {
                ...body,
                NoiDungXL: this.statePhanPhoi.NoiDungTH,
                SoNgay: 1,
                DSDVXuLy: list,
                DSDVXuLyHT: listP,
                HanXuLy: moment(this.statePhanPhoi.HanXuLy).format("DD/MM/YYYY HH:mm"),
                XuLyKhan: this.statePhanPhoi.isXuLyKhanCap,
                ChuyenTheoDoi: !this.statePhanPhoi.isChuyenXL,
                ChuyenXuLy: this.statePhanPhoi.isbientap ? 1 : 2,
                DsCaNhanXuLy: arrCaNhan
            }
        }

        var action = {
            BorderColor: null,
            ButtonText: "Phân phối",
            Description: null,
            IdForm: 2,
            IdQuyen: 0,
            IdRow: 2,
            IsComeBack: false,
            IsLoop: false,
            Prior: 0,
            RowIndex: 0,
            Title: null,
            Type: 0,
            XLKhac: false
        }
        var rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN);
        var isRule = rules.find(item => item == 22) ? 1 : 0
        Utils.nlog("list ------------Rulus", isRule)
        Utils.nlog("gia tri body XacMinh PA", body)
        const res = await apis.Auto.XuLyQuyTrinhPhanAnh(body);
        Utils.nlog("gia tri res xu li phan anh xac minh", res)
        if (res.status == 1) {
            if (Platform.OS == 'android' && arrVideo) {
                var { IdLS = 0, Status = 0 } = res.data;
                var { IdPA = 0 } = body;
                const resVideo = await apis.ApiUpLoadVideo.Uploadvideo(arrVideo, IdPA, IdLS, Status);
                if (resVideo.status == 1) {
                    //Utils.nlog("gia tri video", arrVideo)
                    Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                        if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                            ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                        }
                        // Utils.goscreen(this, "scHomePAHT");

                        try {
                            if (Utils.getGlobal(nGlobalKeys.ChuyenPhanPhoi, 0, AppCodeConfig.APP_ADMIN) == 1 && isRule == 1) {
                                Utils.goscreen(this, ConfigScreenDH.Modal_PhanPhoi,
                                    {
                                        data: body, action: action,
                                        callback: Utils.goscreen(this, "scHomePAHT"),
                                        DesignPhanPhoiDefault: action.IdRow,
                                    });
                            } else {
                                this.callback(this);
                            }
                        } catch (error) {
                            Utils.goback(this);
                        };
                    })
                } else {
                    //Utils.nlog("gia tri video", arrVideo)
                    Utils.showMsgBoxOK(this, "Thông báo", "Cập nhật video cho phản ánh thất bại", "Xác nhận", () => {
                        if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                            ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                        }
                        // Utils.goscreen(this, "scHomePAHT");
                        try {
                            this.callback(this);
                        } catch (error) {
                            Utils.goback(this);
                        };
                    })
                }
            } else {
                //Utils.nlog("gia tri video", arrVideo)
                Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                    if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                        ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                    }
                    try {
                        if (Utils.getGlobal(nGlobalKeys.ChuyenPhanPhoi, 0, AppCodeConfig.APP_ADMIN) == 1 && isRule == 1 && this.action.IdForm != 24) {
                            Utils.goscreen(this, ConfigScreenDH.Modal_PhanPhoi,
                                {
                                    data: body, action: action,
                                    callback: Utils.goscreen(this, "scHomePAHT"),
                                    DesignPhanPhoiDefault: action.IdRow,
                                });
                        } else {
                            this.callback(this);
                        }
                    } catch (error) {
                        Utils.goback(this);
                    };
                })
            }
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Xử lý thất bại", "Xác nhận")
        }
        this.setState({ isLoad: false })
        nthisIsLoading.hide();

    }
    _UpdateFile = (arrImage = [], arrAplicaton = [], arrFileDelete = []) => {
        //Utils.nlog("vao set File Upload", arrImage, arrAplicaton)
        this.setState({ arrImage, arrAplicaton, arrFileDelete });
    }
    _GetList_ChuyenMucAITheoLinhVuc = async (item, isSetUp = false) => {
        let body = {
            "idLinhVuc": item.IdLinhVuc,
            "content": this.state.NoiDung ? this.state.NoiDung : ""
        }
        let res = await GetList_ChuyenMucAITheoLinhVuc(body);
        Utils.nlog("gia tri list chuyên mục AI:", res);
        //set giá trị mặc định cho chuyên mục nếu lĩnh vực đó chỉ có 1 chuyên mục
        if (res.status == 1) {
            if (res.data && res.data && res.data.length == 1) {
                this.setState({ listChuyenMucAI: res.data && res.data.length > 0 ? [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }].concat(res.data) : [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }], objChuyenMuc: isSetUp == true ? item : res.data[0] })
            } else {
                this.setState({ listChuyenMucAI: res.data && res.data.length > 0 ? [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }].concat(res.data) : [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }], objChuyenMuc: isSetUp == true ? item : { IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' } })
            }


        }
    }

    updateTagState = (state) => {
        this.setState({
            tags: state
        })
    };

    render() {
        const { nrow, nmiddle } = nstyles
        var {
            CongKhai, arrImage, arrApplication, tags, dataCTPA } = this.state;
        // //Utils.nlog("gia tri mucdo", this.state.objMucDo);
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: Height(5), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>
                    <HeaderModal
                        _onPress={() => Utils.goback(this)}
                        multiline={true}
                        title={this.action ? this.action.ButtonText : `Xác minh phản ánh`} />
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        ref={ref => { this.Scroll = ref }}
                        style={{ paddingHorizontal: 15, }}>
                        {
                            this.isTiepNhanDonGian ? null : <ItemNoiDung
                                // numberOfLines={6}
                                multiline={true}
                                value={this.state.TieuDe}
                                onChangeText={(text) => this.setState({ TieuDe: text })}
                                textTieuDe={<Text>Tiêu đề <Text style={{ color: colors.redStar }}>{this.state.TieuDe.length < 3 ? '*' : ''}</Text></Text>}
                                stContaierTT={{ paddingVertical: 8 }}
                            />
                        }
                        {
                            this.action?.IdForm == 23 && <View style={{ backgroundColor: colors.BackgroundHome, borderRadius: 5 }}>
                                <Tags
                                    updateState={this.updateTagState}
                                    tags={tags}
                                    label={'HashTags'}
                                    labelStyle={{ marginBottom: 5 }}
                                    placeholder="Tags..."
                                    leftElement={<Icon name={'tags'} color={'#3ca897'} size={25} />}
                                    leftElementContainerStyle={{ marginLeft: 3 }}
                                    inputStyle={{ color: '#3ca897', fontSize: reText(14), backgroundColor: colors.white, borderRadius: 5, paddingLeft: 5 }}
                                    tagStyle={{ backgroundColor: '#3ca897', height: 'auto', borderWidth: 0 }}
                                    tagTextStyle={{ color: colors.white }}
                                    deleteIconStyles={{ tintColor: colors.white }}
                                />
                            </View>
                        }
                        <View
                            pointerEvents={
                                'auto'
                            }
                            style={[{
                                paddingTop: 5,
                                paddingLeft: 5,
                                marginVertical: 10,
                                // alignItems: "center",
                                paddingVertical: 5,
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                minHeight: 60,
                                borderColor: colors.colorHeaderApp,
                                borderRadius: 5,
                                backgroundColor: 'rgba(39,98,137,0.1)'
                            }]}
                        >
                            <Text style={{
                                color: colors.colorHeaderApp,
                                fontSize: sizes.sText14,
                            }}>Nội dung phản ánh: <Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TouchableOpacity onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                                content: this.state.NoiDung,
                                callback: (val) => this.setState({ NoiDung: val })
                            })}>
                                <HtmlViewCom html={this.state.NoiDung} style={{ height: '100%' }} />
                            </TouchableOpacity>
                        </View>
                        {/* <ItemNoiDung
                            multiline={true}
                            // numberOfLines={2}
                            value={this.state.NoiDung}
                            onChangeText={(text) => this.setState({ NoiDung: text })}
                            textTieuDe={<Text>Nội dung phản ánh <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            stContaierTT={{ paddingVertical: 8 }}
                        /> */}
                        <ItemNoiDung
                            // numberOfLines={2}
                            multiline={true}
                            value={this.state.DiaChiSuKien}
                            onChangeText={(text) => this.setState({ DiaChiSuKien: text })}
                            textTieuDe={<Text>Địa chỉ sự kiện <Text style={{ color: colors.redStar }}>{this.state.DiaChiSuKien.length < 2 ? '*' : ''}</Text></Text>}
                            stContaierTT={{ paddingVertical: 8 }}
                        />
                        {
                            this.isTiepNhanDonGian ? null : <View style={[{ paddingVertical: 10 }]}>
                                <Text style={[{ fontSize: sizes.sizes.sText12, lineHeight: sizes.reSize(13), marginBottom: -10 }]}>{"Toạ độ"}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <ItemNoiDung
                                        isTitle={false}
                                        value={`${this.state.Lat}`.toString()}
                                        onChangeText={(text) => this.setState({ Lat: text })}
                                        // stContaierTT={{ padding: 0, margin: 0, }}
                                        stConainer={{ padding: 0, flex: 1, margin: 0, }}
                                        placeholder={'Kinh độ'}
                                        // textNoiDung={`${dataPhanAnh.ToaDoX}`}
                                        numberOfLines={1}
                                        style={[{ padding: 0, paddingVertical: 8, margin: 0, fontSize: sizes.sizes.sText12 }]}
                                    />
                                    <ItemNoiDung
                                        isTitle={false}
                                        stConainer={{ padding: 0, flex: 1, margin: 0, marginHorizontal: 5 }}
                                        placeholder={'Vĩ độ'}
                                        value={`${this.state.Log}`.toString()}
                                        onChangeText={(text) => this.setState({ Log: text })}
                                        // textNoiDung={`${dataPhanAnh.ToaDoY}`}
                                        numberOfLines={1}
                                        style={[{ padding: 0, paddingVertical: 8, margin: 0, fontSize: sizes.sizes.sText12 }]}
                                    />
                                    <ButtonCus
                                        onPressB={this._onPressBD}
                                        stContainerR={{
                                            width: Width(30), borderRadius: 2, paddingVertical: Platform.OS == 'android' ? 10.5 : 13,
                                            backgroundColor: colors.peacockBlue, marginTop: 14,
                                            alignSelf: 'flex-start', justifyContent: 'flex-start'
                                        }}
                                        textTitle={`Chọn toạ độ`}
                                    >
                                    </ButtonCus>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.brownGreyTwo, }}></View>
                            </View>
                        }
                        {
                            this.isTiepNhanDonGian ? null : <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                                <ModalDrop
                                    isChuyenMuc={true}
                                    value={this.state.objLinhVuc}
                                    keyItem={'IdLinhVuc'}
                                    texttitle={<Text>Lĩnh vực <Text style={{ color: colors.redStar }}>{this.state.objLinhVuc.IdLinhVuc == 100 ? '*' : ''}</Text></Text>}
                                    styleContent={{ marginRight: 5 }}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                    options={this.props.dataLinhVuc}
                                    onselectItem={(item) => this.setState({ objLinhVuc: item }, () => this._GetList_ChuyenMucAITheoLinhVuc(item))}
                                    Name={"LinhVuc"} />
                                <ModalDrop
                                    value={this.state.objChuyenMuc}
                                    keyItem={'IdChuyenMuc'}
                                    texttitle={<Text>Chuyên mục <Text style={{ color: colors.redStar }}>{this.state.objChuyenMuc.IdChuyenMuc == 100 ? '*' : ''}</Text></Text>}
                                    styleContent={{ marginRight: 5 }}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                    options={this.state.listChuyenMucAI.length > 0 ? this.state.listChuyenMucAI : this.props.dataChuyenMuc}
                                    onselectItem={(item) => this.setState({ objChuyenMuc: item }, () => {
                                        Utils.nlog("gia tri item", item)
                                        // alert(1);
                                        Utils.showToastMsg("Chuyên mục :" + item.TenChuyenMuc, item.MoTa, icon_typeToast.info);
                                        // }, 1000);

                                    })}
                                    Name={"TenChuyenMuc"} />
                            </View>
                        }

                        <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                            <ModalDrop
                                value={this.state.objHinhThuc}
                                keyItem={'iD'}
                                texttitle={'Hình thức'}
                                styleContent={{ marginRight: 5 }}
                                dropdownTextStyle={{
                                    paddingHorizontal: 20, width: '100%',
                                    fontSize: 16
                                }}
                                options={menuHinhThuc}
                                onselectItem={(item) => this.setState({ objHinhThuc: item })}
                                Name={"TenHinhThuc"} />

                            <ModalDrop
                                value={this.state.objMucDo}
                                keyItem={'IdMucDo'}
                                texttitle={<Text>Mức độ <Text style={{ color: colors.redStar }}>{this.state.objMucDo.IdMucDo == 100 ? '*' : ''}</Text></Text>}
                                styleContent={{ marginRight: 5 }}
                                dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                options={this.props.dataMucDo}
                                onselectItem={(item) => this.setState({ objMucDo: item })}
                                Name={"TenMucDo"} />
                        </View>
                        {
                            this.isTiepNhanDonGian ? null : <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                                <ModalDrop
                                    value={this.state.objNguon}
                                    keyItem={'IdNguon'}
                                    texttitle={<Text>Nguồn phản ánh <Text style={{ color: colors.redStar }}>{this.state.objNguon.IdNguon == 100 ? '*' : ''}</Text></Text>}
                                    styleContent={{ marginRight: 5 }}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                    options={this.props.dataNguon}
                                    onselectItem={(item) => this.setState({ objNguon: item })}
                                    Name={"TenNguon"} />
                            </View>
                        }
                        <ItemNoiDung
                            multiline={true}
                            value={this.state.ChiTietNguon}
                            onChangeText={(text) => this.setState({ ChiTietNguon: text })}
                            textTieuDe={'Chi tiết nguồn'}
                            placeholder={`Địa chỉ`}
                            stContaierTT={{ paddingVertical: 8 }}
                        />
                        {
                            this.isTiepNhanDonGian ? null : <View style={{}}>
                                <FileCom arrFile={[]} nthis={this} setFileUpdate={this._UpdateFile} />

                            </View>
                        }
                        {
                            appConfig.IdSource == 'CA' ? null :
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
                                    onPress={() => this.setState({ CongKhai: !this.state.CongKhai })}
                                >

                                    <Image source={CongKhai ? Images.icCheck : Images.icUnCheck}
                                        style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.peacockBlue }]}
                                        resizeMode='contain' />
                                    <Text style={{ color: colors.black_80, paddingHorizontal: 5, fontSize: sizes.sText14 }}>
                                        {`Công khai phản ánh này`}
                                    </Text>
                                </TouchableOpacity>
                        }
                        {
                            this.action.IdForm == 24 &&
                            <>
                                <View style={{ marginVertical: 10, backgroundColor: colors.grayLight, height: 0.5 }} />
                                <ModalPhanPhoi
                                    {...this.props}
                                    listenStateChange={state => { this.statePhanPhoi = state }}
                                    DesignDefault={2}
                                    IsComponentPhanPhoi
                                />
                            </>
                        }
                        <View>
                            <ButtonCus
                                onPressB={this._XuLiPhanAnh}
                                stContainerR={{
                                    paddingVertical: 12, paddingHorizontal: 10,
                                    marginTop: 10, marginBottom: 30,
                                    alignSelf: 'center', justifyContent: 'flex-start'
                                }}
                                textTitle={this.action?.ButtonText || 'Tiếp nhận'}
                            />
                        </View>
                        <IsLoading />
                    </KeyboardAwareScrollView>
                </View>
            </View >
        )
    }
}
const mapStateToProps = state => ({
    dataNguon: state.GetList_NguonPhanAnh,
    dataChuyenMuc: state.GetList_ChuyenMuc,
    dataMucDo: state.GetList_MucDoAll,
    dataLinhVuc: state.GetList_LinhVuc,
});
export default Utils.connectRedux(ModalXacMinhPA, mapStateToProps, false);