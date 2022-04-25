import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import Utils from '../../../app/Utils';
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
import HtmlViewCom from '../../../components/HtmlView';
import { nkey } from '../../../app/keys/keyStore';
import { ConfigScreenDH } from '../../routers/screen';
import AppCodeConfig from '../../../app/AppCodeConfig';

//1 phan anh 2 gop y
const menuHinhThuc = [{
    TenHinhThuc: 'Phản ánh',
    iD: '1'
}, {
    TenHinhThuc: 'Góp ý',
    iD: '2'
}]
class ModalXoaSuaPhanAnh extends Component {
    constructor(props) {
        super(props);
        this.dataHinhThuc = menuHinhThuc;
        this.dataSetting = Utils.getGlobal(nGlobalKeys.dataSetting, {}, AppCodeConfig.APP_ADMIN);
        this.data = Utils.ngetParam(this, "data", {});
        this.arrFile = this.data.ListFileDinhKem.concat(this.data.ListFileDinhKemCD)
        this.action = Utils.ngetParam(this, "action", {})
        this.callback = Utils.ngetParam(this, "callback", () => { });
        var cm = this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == this.data.IdChuyenMuc);
        var lv = this.props.dataLinhVuc.find(item => item.IdLinhVuc == this.data.LinhVuc);
        var md = this.props.dataMucDo.find(item => item.IdMucDo == this.data.MucDo);
        var ht = menuHinhThuc.find(item => item.iD == this.data.HinhThuc);
        var nguon = this.props.dataNguon.find(item => item.IdNguon == this.data.NguonPA)
        this.isHuy = Utils.ngetParam(this, 'isHuy', false)
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
            Lat: this.data ? this.data.ToaDoX : '',
            Log: this.data ? this.data.ToaDoY : '',
            ChiTietNguon: this.data ? this.data.ChiTietNguon : '',
            CongKhai: this.data ? this.data.CongKhai : false,
            isLoad: false,
            icCheck: 0,
            arrVideo: [],
            arrApplication: [],
            arrImage: [],
            arrAplicaton: [],
            arrFileDelete: [],
            listChuyenMucAI: [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }]

        };
    }

    _setUpDuLieu = () => {
        var cm = this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == this.data.IdChuyenMuc);
        var lv = this.props.dataLinhVuc.find(item => item.IdLinhVuc == this.data.LinhVuc);
        var md = this.props.dataMucDo.find(item => item.IdMucDo == this.data.MucDo);
        var ht = menuHinhThuc.find(item => item.iD == this.data.HinhThuc);
        var nguon = this.props.dataNguon.find(item => item.IdNguon == this.data.NguonPA);
        var data = this.state.NoiDung
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
    }
    goback = () => {
        Utils.goback(this)
    }

    // callbackDataMaps
    _callbackDataMaps = (rejon, DiaChiSuKien) => {
        //Utils.nlog("vao calback")
        this.setState({
            Lat: rejon.latitude,
            Log: rejon.longitude,
            DiaChiSuKien: DiaChiSuKien
        })
    }
    _onPressBD = () => {
        Utils.goscreen(this, "sc_BanDo_Root", {
            latitude: this.state.Lat,
            longitude: this.state.Log,
            callbackDataMaps: this._callbackDataMaps
        })
    }
    _XoaPhanAnh = async () => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xóa phản ánh này ?', 'Đồng ý', 'Hủy', async () => {
            nthisIsLoading.show();
            Utils.nlog("gia tri action", this.action)
            this.data.ActionFormChon = this.action
            var body = {
                ...this.data,
                IsDel: true
            }
            Utils.nlog("gia tri action")
            const res = await apis.Auto.UpdatePhanAnhBackEnd(body);
            Utils.nlog("gia tri res xoá phan anh", res)
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                    if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                        ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                    }
                    Utils.goscreen(this, "scHomePAHT");
                })
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Xử lý thất bại", "Xác nhận")
            }
            nthisIsLoading.hide();
        })
    }

    _XuLiPhanAnh = async () => {
        //this.setState({ isLoad: true })
        nthisIsLoading.show();
        // //Utils.nlog("gia tri ,", this.state.TieuDe.length)
        if (this.state.TieuDe.length <= 0) {
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
        if (!this.state.objChuyenMuc) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn chuyên mục", "Xác nhận");
            nthisIsLoading.hide();
            return

        }
        if (!this.state.objLinhVuc) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn lĩnh vực", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        if (!this.state.objMucDo || this.state.objMucDo.IdMucDo == 100) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn mức độ", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        if (!this.state.objNguon || this.state.objNguon.IdNguon == 100) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn nguồn phản ánh", "Xác nhận");
            nthisIsLoading.hide();
            return
        }
        // //Utils.nlog("gia tri action", this.action)
        this.data.ActionFormChon = this.action
        let LstImg = [], arrVideo = [];
        var { arrImage, arrAplicaton, arrFileDelete } = this.state//list image
        // //Utils.nlog("gia tri image---------------", arrImage)
        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];

            if (item.IsNew == false) {
                continue;
            } else {

                let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
                //|| temp.includes("mov") || temp.includes("mp4")
                if (checkImage == true || item.isImage == true || item.timePlay == 0) {
                    // alert(1)
                    Utils.nlog("gia tri image---------------", item)
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    }
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                    LstImg.push({
                        "type": item.timePlay == 0 ? 1 : 2,
                        "strBase64": strBase64,
                        "filename": "hinh" + index + ".png",
                        "extension": ".png",
                        IsDel: false,
                        Isnew: true
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
                            IsDel: false,
                            Isnew: true
                        });
                    }
                }
            }

        }
        for (let index = 0; index < arrAplicaton.length; index++) {
            let item = arrAplicaton[index];
            if (item.IsNew == false) {
                continue;
            } else {
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
                        IsDel: false,
                        Isnew: true
                    });
                }
            }

        }
        // let arrDelete = [];
        for (let index = 0; index < arrFileDelete.length; index++) {
            // alert(arrFileDelete.length);
            let item = arrFileDelete[index];
            // arrDelete.push({
            //     ...item,
            //     IsDel: true,
            //     IsNew: false
            // })
            LstImg.push({
                ...item,
                IsDel: true,
                Isnew: false
            });
        }

        var body = {
            ...this.data,
            NoiDung: this.state.NoiDung,
            TieuDe: this.state.TieuDe,
            CongKhai: this.state.CongKhai,
            ChiTietNguon: this.state.ChiTietNguon,
            IdChuyenMuc: this.state.objChuyenMuc.IdChuyenMuc,
            LinhVuc: this.state.objLinhVuc.IdLinhVuc,
            ToaDoX: this.state.Lat,
            ToaDoY: this.state.Log,
            DiaDiem: this.state.DiaChiSuKien,
            HinhThuc: this.state.objHinhThuc.iD,
            NguonPA: this.state.objNguon.IdNguon,
            MucDo: this.state.objMucDo.IdMucDo,
            fileUpDate: { IdPA: this.data.IdPA, LstImg: LstImg },
            Notify: this.state.icCheck,
            // fileUpDate
        }
        // //Utils.nlog("gia tri body trước khi gửi-----------", body.fileUpDate)
        const res = await apis.Auto.UpdatePhanAnhBackEnd(body);
        //Utils.nlog("gia tri res xu li phan anh", res)
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
                            this.callback(this);
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
                // //Utils.nlog("gia tri video", arrVideo)
                Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                    if (this.isHuy == true && this.callback) {
                        ROOTGlobal[nGlobalKeys.loadDSPHuyDH]();
                        this.callback(this)
                    }
                    if (this.callback) {
                        ROOTGlobal[nGlobalKeys.loadDSPAMoRongDH]();
                        this.callback(this)
                    } else {
                        // alert(1);
                        if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                            ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                        }
                        // Utils.goscreen(this, "scHomePAHT");
                        try {
                            this.callback(this);
                        } catch (error) {
                            Utils.goback(this);
                        };
                    }

                    // try {
                    //     this.callback(this);
                    // } catch (error) {
                    //     Utils.goback(this);
                    // };
                })
            }
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Xử lý thất bại", "Xác nhận");
            nthisIsLoading.hide();
        }
        // this.setState({ isLoad: false })
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
        console.log("gia tri list chuyên mục", res, isSetUp);
        if (res.status == 1) {
            if (isSetUp == true) {
                this.setState({ listChuyenMucAI: res.data && res.data.length > 0 ? [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }].concat(res.data) : [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }] })
            } else {
                this.setState({ listChuyenMucAI: res.data && res.data.length > 0 ? [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }].concat(res.data) : [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }], objChuyenMuc: { IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' } })
            }

        }
    }

    render() {
        const { nrow, nmiddle } = nstyles
        let { CongKhai } = this.state;
        let titleForm = this.action ? this.action.ButtonText : 'Sửa/xoá phản ánh';
        let isShowXoaPA = titleForm.toLowerCase().includes('xoá') || titleForm.toLowerCase().includes('xóa');
        // let arrFileOld = [...].concat(this.data.ListFileDinhKemCD)
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: Height(5), borderTopLeftRadius: 30, borderTopRightRadius: 20
                }}>
                    <HeaderModal
                        _onPress={() => Utils.goback(this)}
                        multiline={true}
                        title={titleForm} />
                    <KeyboardAwareScrollView

                        showsVerticalScrollIndicator={false}
                        ref={ref => { this.Scroll = ref }}
                        style={{ paddingHorizontal: 15, }}>
                        <ItemNoiDung
                            numberOfLines={6}
                            multiline={true}
                            value={this.state.TieuDe}
                            onChangeText={(text) => this.setState({ TieuDe: text })}
                            textTieuDe={<Text>Tiêu đề <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            stContaierTT={{ paddingVertical: 8 }}
                        />
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
                        <View style={[{ paddingVertical: 10 }]}>
                            <Text style={[{ fontSize: sizes.sizes.sText12, lineHeight: sizes.reSize(15), }]}>{"Toạ độ"}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <ItemNoiDung
                                    isTitle={false}
                                    // multiline={true}
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
                                    // multiline={true}
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
                                        width: Width(30), borderRadius: 2, paddingVertical: 13,
                                        backgroundColor: colors.peacockBlue, marginTop: 14,
                                        alignSelf: 'flex-start', justifyContent: 'flex-start'
                                    }}
                                    textTitle={`Chọn toạ độ`}
                                >
                                </ButtonCus>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                            {/* <ModalDrop
                                value={this.state.objChuyenMuc}
                                keyItem={'IdChuyenMuc'}
                                texttitle={<Text>Chuyên mục <Text style={{ color: colors.redStar }}>*</Text></Text>}
                                styleContent={{ marginRight: 5 }}
                                dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                options={this.props.dataChuyenMuc}
                                onselectItem={(item) => this.setState({ objChuyenMuc: item })}
                                Name={"TenChuyenMuc"} />
                            <ModalDrop
                                value={this.state.objLinhVuc}
                                keyItem={'IdLinhVuc'}
                                texttitle={<Text>Lĩnh vực <Text style={{ color: colors.redStar }}>*</Text></Text>}
                                styleContent={{ marginRight: 5 }}
                                dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                options={this.props.dataLinhVuc}
                                onselectItem={(item) => this.setState({ objLinhVuc: item })}
                                Name={"LinhVuc"} /> */}
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
                                onselectItem={(item) => this.setState({ objChuyenMuc: item })}
                                Name={"TenChuyenMuc"} />
                        </View>

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
                        <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
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
                        <ItemNoiDung
                            multiline={true}
                            // numberOfLines={2}
                            value={this.state.ChiTietNguon}
                            onChangeText={(text) => this.setState({ ChiTietNguon: text })}
                            textTieuDe={`Chi tiết nguồn`}
                            placeholder={`Địa chỉ`}
                            stContaierTT={{ paddingVertical: 8 }}
                        />
                        <View style={{ paddingVertical: 20 }}>
                            <FileCom arrFile={this.arrFile} nthis={this} setFileUpdate={this._UpdateFile} />

                        </View>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 30 }}
                            onPress={() => this.setState({ CongKhai: !this.state.CongKhai })}
                        >
                            <Image source={CongKhai ? Images.icCheck : Images.icUnCheck}
                                style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.peacockBlue }]}
                                resizeMode='contain' />
                            <Text style={{ color: colors.black_80, paddingHorizontal: 5, fontSize: sizes.sText14 }}>
                                {`Công khai phản ánh này`}
                            </Text>
                        </TouchableOpacity>

                        <View style={[nrow, { justifyContent: 'center' }]}>
                            <ButtonCus
                                onPressB={this._XuLiPhanAnh}
                                stContainerR={{
                                    width: Width(30), paddingVertical: 12,
                                    marginTop: 0, marginBottom: 30,
                                    alignSelf: 'center', justifyContent: 'flex-start', marginHorizontal: 10
                                }}
                                textTitle={`Sửa`}
                            />
                            {
                                isShowXoaPA ? <ButtonCus
                                    onPressB={this._XoaPhanAnh}
                                    stContainerR={{
                                        width: Width(30), paddingVertical: 12,
                                        marginTop: 0, marginBottom: 30, backgroundColor: colors.grayLight,
                                        alignSelf: 'center', justifyContent: 'flex-start', marginHorizontal: 10
                                    }}
                                    textTitle={`Xoá`}
                                /> : null
                            }


                        </View>
                    </KeyboardAwareScrollView>
                    <IsLoading />
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
export default Utils.connectRedux(ModalXoaSuaPhanAnh, mapStateToProps, false);