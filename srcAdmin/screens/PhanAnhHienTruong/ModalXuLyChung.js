import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform, Linking, BackHandler } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes, styles } from '../../../styles';
import { HeaderCom, TextInputCom, IsLoading } from '../../../components';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { Width, Height } from '../../../styles/styles';
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Images } from '../../images';
import apis from '../../apis';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import FileCom from './components/FileCom';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import HtmlViewCom from '../../../components/HtmlView';
import { reSize, reText } from '../../../styles/size';
import { ConfigScreenDH } from '../../routers/screen';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { store } from '../../../srcRedux/store';
import VideoCus from '../../../components/Video/VideoCus';
import DatePicker from 'react-native-datepicker';
import { appConfig } from '../../../app/Config';
import { ConfigOnline } from '../../../app/ConfigOnline';


const styles2 = StyleSheet.create({
    ContainerCheck: {
        flexDirection: 'row',
        marginRight: 22.5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start', marginHorizontal: 15
    },

})
// 1 Tiêu đề    
// 2 form nhập nội dung
// 3 file đính kèm
// 4 check công khai
// 5 nút xử lý

const DesignXuLyChungDefault = [1, 2, 3, 4, 5];
const DesignPheDuyetTrinhPhanPhoi = [1, 2, 5];
const DesignXuLy = [1, 3, 5, 6]; //cũ có 2, mới là 6
const DesignPheDuyet = [1, 2, 5];
const DesignTrinhLanhDao = [1, 2, 4, 5];
const DesignPheDuyetGDCA = [1, 2, 5];
const DesignDangTai = [1, 2, 4, 8, 5];
const DesignThuHoi = [1, 2, 5];
const DesignTamDong = [1, 2, 3, 5, 7];
const DesignKhongDuDieuKien = [1, 2, 5];


const listDesign = {
    "0": DesignXuLyChungDefault,//dành cho dèault
    "28": DesignPheDuyetTrinhPhanPhoi,
    "3": DesignXuLy,
    "24": DesignTrinhLanhDao,
    "25": DesignPheDuyetGDCA,
    "5": DesignDangTai,
    "4": DesignPheDuyet,
    "110": DesignThuHoi,
    "22": DesignTamDong,
    "26": DesignKhongDuDieuKien,
}


class ModalXuLyChung extends Component {
    constructor(props) {
        super(props);
        this.isNoidung = Utils.ngetParam(this, 'isNoiDung', true)
        // this.isCongKhai = Utils.ngetParam(this, 'isCongKhai', false)
        this.data = Utils.ngetParam(this, 'data', {})//body
        this.arrFile = this.data.ListFileDinhKem.concat(this.data.ListFileDinhKemCD)
        this.action = Utils.ngetParam(this, 'action', {})//dataButton
        this.callback = Utils.ngetParam(this, "callback", () => { });
        this.PANB = Utils.ngetParam(this, "PANB");
        this.EnablePublicFile = Utils.getGlobal(nGlobalKeys.EnablePublicFile, false, AppCodeConfig.APP_ADMIN) // bật tắt render giao dien tick bỏ công khai các file bước đăng tải
        this.state = {
            noidung: this.action.IdForm == 28 ? 'Đồng ý đề xuất' : (this.action.IdForm == 25 ? 'Đồng ý kết quả' : this.data.NoiDungXL),
            arrVideo: [],
            CongKhai: this.data ? this.data.CongKhai : false,
            arrApplication: [],
            //upload
            arrImage: [],
            arrAplicaton: [],
            arrFileDelete: [],
            XuLyNoiBo: false,
            NoiBo: Utils.getGlobal(nGlobalKeys.NoiBo, "false", AppCodeConfig.APP_ADMIN),
            design: listDesign[this.action.IdForm] ? listDesign[this.action.IdForm] : [],
            disabledButton: false,
            ListIdFilePublic: [],
            HanXuLy: ''
        };
    };
    componentDidMount() {
        const { userDH } = store.getState().auth;//FullName
        if (this.action.IdForm && (this.action.IdForm == 3 || this.action.IdForm == 0)) {
            let noidung = Utils.getGlobal(nGlobalKeys.dataNDXuLyMau, '', AppCodeConfig.APP_ADMIN);
            let StringDVXL = '';
            if (this.data.DVXuLy && this.data.DVXuLy.length > 0) {
                if (ConfigOnline.XULYPA_THEONHIEU_DV == 1)
                    StringDVXL = this.data.DVXuLy.find(item => item.MaPX == userDH?.IdDonVi)?.TenPhuongXa;
                else
                    StringDVXL = this.data.DVXuLy.map(item => item.TenPhuongXa).join('; ');

            }
            if (typeof (noidung) == 'string' && StringDVXL && noidung.length > 0) {
                //lấy thông tin user dh

                Utils.nlog("user noidung", userDH, noidung)
                noidung = noidung.replace(new RegExp("\\[DSDonVi]", "gm"), " " + StringDVXL);
                noidung = noidung.replace(new RegExp("\\[TenNXL]", "gm"), userDH?.FullName || '');
                this.setState({ noidung: noidung.replace(":...", ": ...") });
            }
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        Utils.nlog('LOG [this.data] :::', this.data)
    }
    componentWillUnmount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        return true;
    }
    goback = () => {
        Utils.goback(this)
    };

    _XuLiPhanAnh = async () => {
        nthisIsLoading.show();
        let res = {};
        Utils.nlog('gai tri is Noid ung ====', this.isNoidung)
        // Tạm đóng xử lý
        if (this.action?.IdForm == 22 && !this.state.HanXuLy) {
            nthisIsLoading.hide();
            this.setState({ disabledButton: false })
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng chọn thời gian dự kiến xử lý.", "Xác nhận");
            return;
        }
        if (this.isNoidung && this.state.noidung == "") {
            nthisIsLoading.hide();
            this.setState({ disabledButton: false })
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập nội dung xử lý.", "Xác nhận");
            return;
        }
        if (this.data.Status == 1 && this.action?.IdForm != 26) {
            nthisIsLoading.hide();
            this.setState({ disabledButton: false })
            Utils.showMsgBoxOK(this, "Thông báo", "Phản ánh chưa được tiếp nhận nên không thể thu hồi", "Xác nhận");
            return;
        }
        // Utils.nlog("gia tri action", this.action)

        //Xử lý ẩn hình ảnh /file xử lý của cán bộ lúc đăng tải
        if (this.EnablePublicFile && this.action.IdForm == '5' && this.state.ListIdFilePublic.length > 0) {
            let resPuclicFile = await apis.Auto.KhongCongKhaiFileDinhKem(this.state.ListIdFilePublic)
            Utils.nlog("[LOG] KhongCongKhaiFileDinhKem ", resPuclicFile)
        }

        this.data.ActionFormChon = this.action
        let LstImg = [], arrVideo = [];
        var { arrImage, arrAplicaton, arrFileDelete } = this.state//list image
        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];

            if (item.IsNew == false) {
                continue;
            } else {
                let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
                //|| temp.includes("mov") || temp.includes("mp4")
                if (checkImage == true || item?.isImage == true || (item?.timePlay && item?.timePlay == 0)) {
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    };
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, false);
                    LstImg.push({
                        "type": item.timePlay == 0 ? 1 : 2,
                        "strBase64": strBase64,
                        "filename": "hinh" + index + ".png",
                        "extension": ".png",
                        "isnew": true,
                        isdelete: false,
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
                            "isnew": true,
                            isdelete: false,
                        });
                    };
                };
            }
        };

        for (let index = 0; index < arrAplicaton.length; index++) {
            let item = arrAplicaton[index];
            if (item.IsNew == false) {
                continue;
            } {
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
                        "isnew": true,
                        isdelete: false,
                    });
                };
            }

        };

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
                isdelete: true,
                Isnew: false
            });
        }

        let body = {}
        if (this.PANB) {
            body = {
                ...this.data,
                // ...this.CTPA,
                CongKhai: this.state.CongKhai,
                NoiDungXL: this.state.noidung,
                UploadPA: LstImg

            }
        } else {
            body = {
                ...this.data,
                // ...this.CTPA,
                CongKhai: this.state.CongKhai,
                NoiDungXL: this.state.noidung,
                UploadPA: LstImg,
                XuLyNoiBo: this.state.XuLyNoiBo,
                HanXuLy: this.state.HanXuLy ? this.state.HanXuLy : this.data.HanXuLy
            }
        }
        console.log("gia tri body", body);
        if (this.action.IdForm == 110) res = await apis.Auto.ThuHoiVeIOC(this.data.IdPA, this.state.noidung, this.data.Status)
        else if (this.PANB) res = await apis.Autonoibo.XuLyQuyTrinhPhanAnh(body);
        else res = await apis.Auto.XuLyQuyTrinhPhanAnh(body);
        Utils.nlog("gia tri res xu li phan anh", res)
        if (res && res.status == 1) {
            if (Platform.OS == 'android' && arrVideo && arrVideo.length > 0) {
                const { IdLS = 0, Status = 0 } = res.data;
                const { IdPA = 0 } = body;
                const resVideo = await apis.ApiUpLoadVideo.Uploadvideo(arrVideo, IdPA, IdLS, Status);
                if (resVideo && resVideo.status == 1) {
                    nthisIsLoading.hide();
                    this.setState({ disabledButton: false })
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
                    });
                } else {
                    nthisIsLoading.hide();
                    this.setState({ disabledButton: false })
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
                    });
                };
            } else {
                nthisIsLoading.hide();
                this.setState({ disabledButton: false })
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
                });
            };
        } else {
            nthisIsLoading.hide();
            this.setState({ disabledButton: false })
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Xử lý thất bại", "Xác nhận")
        };
    }

    onChangeNoiDung = (text) => {
        this.setState({ noidung: text })
    }
    _UpdateFile = (arrImage = [], arrAplicaton = [], arrFileDelete = []) => {
        //Utils.nlog("vao set File Upload", arrImage, arrAplicaton)
        this.setState({ arrImage, arrAplicaton, arrFileDelete });
    }
    ComponentTieuDe = () => {
        return (
            <HeaderModal
                title={this.action.IdForm == 28 ? 'Phê duyệt của lãnh đạo' : this.action.ButtonText}
                _onPress={this.goback}
            />
        )
    }
    ComponentFormNoiDung = () => {
        return (
            // <ItemNoiDung
            //     textTieuDe={<Text>{this.action.IdForm == 28 || this.action.IdForm == 25 ? 'Ý kiến chỉ đạo' : 'Nội dung'} <Text style={{ color: colors.redStar }}>{this.isNoidung ? '*' : ''}</Text></Text>}
            //     placeholder={`Nội dung`}
            //     multiline={true}
            //     value={this.state.noidung}
            //     stNoiDung={{ textAlignVertical: 'top' }}
            //     numberOfLines={2}
            //     stTitle={{ marginLeft: 15 }}
            //     stConaier={{ paddingVertical: 0 }}
            //     onChangeText={this.onChangeNoiDung}
            //     stContaierTT={{ backgroundColor: colors.veryLightPink, width: Width(90), height: Height(10), marginLeft: 15 }}
            // />
            <View
                pointerEvents={
                    'auto'
                }
                style={[{
                    // alignItems: "center",
                    minHeight: 60,
                    borderColor: colors.colorHeaderApp,
                    marginHorizontal: 15
                }]}
            >
                <Text style={{
                    color: colors.black,
                    fontSize: sizes.sText14,
                }}>{this.action.IdForm == 28 || this.action.IdForm == 25 ? 'Ý kiến chỉ đạo' : 'Nội dung'} <Text style={{ color: colors.redStar }}>{this.isNoidung ? '*' : ''}</Text></Text>
                <TouchableOpacity onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                    content: this.state.noidung,
                    callback: (val) => this.setState({ noidung: val })
                })} style={{ backgroundColor: colors.veryLightPink, minHeight: Height(10), padding: 5, marginVertical: 5, borderWidth: 0.5, borderColor: colors.brownGreyTwo, borderRadius: 5 }}>
                    {
                        this.state.noidung != '' ?
                            <HtmlViewCom html={this.state.noidung} style={{ height: '100%' }} /> :
                            <Text style={{ fontSize: reText(14), color: colors.brownGreyTwo }}>Nội dung</Text>
                    }
                </TouchableOpacity>
            </View>
        )
    }
    ComponentFile = () => {
        return (
            this.action.IdForm != 8 ?
                <View style={{ paddingVertical: 20, marginLeft: 15 }}>
                    <FileCom arrFile={this.arrFile} nthis={this} setFileUpdate={this._UpdateFile} />
                </View> : null
        )
    }
    ComponentCheckCongKhai = () => {
        const { XuLyNoiBo, CongKhai, NoiBo } = this.state;
        return (
            <View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, paddingVertical: 10 }}
                    onPress={() => this.setState({ CongKhai: !this.state.CongKhai })}
                >

                    <Image source={CongKhai ? Images.icCheck : Images.icUnCheck}
                        style={[nstyles.nIcon12, { paddingHorizontal: 0, tintColor: colors.peacockBlue }]}
                        resizeMode='contain' />
                    <Text style={{ color: colors.black_80, paddingHorizontal: 5, fontSize: sizes.sText14 }}>
                        {`Công khai phản ánh này`}
                    </Text>
                </TouchableOpacity>

                {!this.PANB && this.action.IdForm == 3 && NoiBo == "true" ? <TouchableOpacity style={styles2.ContainerCheck} onPress={() => this.setState({ XuLyNoiBo: !XuLyNoiBo })}>
                    <Image source={XuLyNoiBo ? Images.icCheck : Images.icUnCheck} style={[nstyles.nstyles.nIcon14, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                    <Text style={{ marginRight: 15 }}>Xử lý nội bộ</Text>
                </TouchableOpacity> : null}
            </View>
        )
    }

    onFuncXuLyChung = () => { //--Dung báo có 1 vài TH bị lỗi Loadding hoài, fix Tối ưu lại xem sao.
        if (!this.state.disabledButton)
            this.setState({ disabledButton: true }, () => {
                this._XuLiPhanAnh();
            });
    }

    ComponentButtonSend = () => {
        return (
            <ButtonCus
                textTitle={this.action.ButtonText}
                onPressB={this.onFuncXuLyChung}
                stContainerR={{ marginTop: 20.5, marginLeft: 15, marginBottom: 30, flex: 1 }}
                disabled={this.state.disabledButton}
            />
        )
    }

    ComponentNoiDungXL = () => {
        return (
            <View
                pointerEvents={
                    'auto'
                }
                style={[{
                    // alignItems: "center",
                    minHeight: 60,
                    borderColor: colors.colorHeaderApp,
                    marginHorizontal: 15
                }]}
            >
                <Text style={{
                    color: colors.black,
                    fontSize: sizes.sText14,
                }}>Nội dung phản ánh: <Text style={{ color: colors.redStar }}>*</Text></Text>
                <TouchableOpacity onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                    content: this.state.noidung,
                    callback: (val) => this.setState({ noidung: val })
                })} style={{ backgroundColor: colors.veryLightPink, minHeight: Height(10), padding: 5, marginVertical: 5, borderWidth: 0.5, borderColor: colors.brownGreyTwo, borderRadius: 5 }}>
                    {
                        this.state.noidung != '' ?
                            <HtmlViewCom html={this.state.noidung} style={{ height: '100%' }} /> :
                            <Text style={{ fontSize: reText(14), color: colors.brownGreyTwo }}>Nội dung</Text>
                    }
                </TouchableOpacity>
            </View>
        )
    }

    ComponentThoiGian = () => {
        return (
            <View style={[{ borderColor: colors.colorHeaderApp, marginHorizontal: 15 }]}>
                <Text style={{
                    color: colors.black,
                    fontSize: sizes.sText14,
                }}>Thời gian dự kiến xử lý: <Text style={{ color: colors.redStar }}>*</Text></Text>
                <DatePicker
                    style={{ flex: 1, width: '100%', marginVertical: 5 }}
                    date={this.state.HanXuLy}
                    mode="datetime"
                    placeholder="Chọn thời gian"
                    format="DD/MM/YYYY HH:mm"
                    confirmBtnText="Xác nhận"
                    cancelBtnText="Huỷ"
                    androidMode='spinner'
                    locale='vi'
                    customStyles={{
                        datePicker: {
                            backgroundColor: '#d1d3d8',
                            justifyContent: 'center',
                        }
                    }}
                    onDateChange={date => this.setState({ HanXuLy: date })}
                />
            </View>
        )
    }

    onPreview = () => {
        if (ConfigOnline.DOMAIN_CD && this.data.IdPA) {
            const urlPreview = ConfigOnline.DOMAIN_CD + `/vi/preview-pa?id=${this.data.IdPA}`
            Utils.openWeb(this, urlPreview, { isShowMenuWeb: false, title: 'Chế độ xem trước', })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", 'Có lỗi xảy ra trong quá trình mở bản xem trước. Vui lòng xem lại sau!', 'Xác nhận')
        }
    }

    ComponentPreview = () => {
        return (
            <View style={[{ borderColor: colors.colorHeaderApp, marginHorizontal: 13, alignItems: 'flex-start' }]}>
                <TouchableOpacity onPress={this.onPreview} activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={Images.icShowPass} resizeMode='contain' style={[nstyles.nstyles.nIcon16, { tintColor: colors.orange }]} />
                    <Text style={{ color: colors.orange, paddingLeft: 3 }}>{'Chế độ xem trước'}</Text>
                </TouchableOpacity>
            </View>
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
                    return this.ComponentFormNoiDung()
                case 3:
                    return this.ComponentFile()
                case 4:
                    return this.ComponentCheckCongKhai()
                case 5:
                    return this.ComponentButtonSend()
                case 6:
                    return this.ComponentNoiDungXL()
                case 7:
                    return this.ComponentThoiGian()
                case 8:
                    return this.ComponentPreview()
                default:
                    return null;
                    break;
            }
        } else {
            return null;
        }
    }

    CheckFilePublic = (item) => {
        Utils.nlog('[LOG] item', item)
        const { ListIdFilePublic } = this.state
        let temp = ListIdFilePublic
        let findIndex = temp.findIndex(e => e == item.IdRow)
        if (findIndex != -1) {
            temp.splice(findIndex, 1)
            this.setState({ ListIdFilePublic: temp })
        } else {
            temp.push(item.IdRow)
            this.setState({ ListIdFilePublic: temp })
        }
    }

    ComponentCongKhaiHinhAnh = () => {
        const { ListIdFilePublic } = this.state
        const { ListFileDinhKemXuLy } = this.data
        if (ListFileDinhKemXuLy && ListFileDinhKemXuLy.length > 0) {
            var arrImage = [], arrApplication = [];
            for (let index = 0; index < ListFileDinhKemXuLy.length; index++) {
                const item = ListFileDinhKemXuLy[index];
                Utils.nlog('Gia tri dau vao ArrrFile Tiem', item)
                let checkImage = Utils.checkIsImage(item.Path);
                let checkVideo = Utils.checkIsVideo(item.Path);
                if (checkImage == true || checkVideo == true) {
                    arrImage.push(
                        {
                            ...item,
                            width: 500,
                            height: 578,
                            uri: item.Link ? item.Link : appConfig.domain + 'Upload/' + item.Path,
                            IsNew: false,
                            IsDel: false
                        })
                } else {
                    arrApplication.push({
                        ...item,
                        uri: item.Link ? item.Link : appConfig.domain + 'Upload/' + item.Path,
                        IsNew: false,
                        IsDel: false,
                        IsVideo: true
                    })
                }
            }
            return (
                <>
                    {ListFileDinhKemXuLy && ListFileDinhKemXuLy.length > 0 ? <Text style={{ paddingHorizontal: 13, textAlign: 'justify' }}>{'File công khai (Bỏ đánh dấu file nếu không muốn công khai):'}</Text> : null}
                    <ScrollView horizontal style={{ padding: 13 }}>
                        {
                            arrImage.map((item, index) => {
                                if (item.timePlay && item.timePlay > 0) {
                                    Utils.nlog("index -----------------: 2    ", index, item)
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, { source: item.uri });

                                            }}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: colors.colorGrayIcon,
                                                borderRadius: 5,
                                                width: Width(25),
                                                height: Width(25),
                                                marginRight: 10,
                                            }}>

                                            <Image style={{
                                                width: Width(25),
                                                height: Width(25), borderRadius: 5,
                                            }}
                                                source={{ uri: item.uri }}
                                                resizeMode='cover' />
                                            {/* <Text>hihi</Text> */}
                                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image source={Images.icVideoBlack} style={[nstyles.nstyles.nIcon24, { backgroundColor: colors.black_50, padding: 5, borderRadius: 8 }]} resizeMode={'contain'} />
                                            </View>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                style={{ position: 'absolute', top: 0, right: 0 }}
                                                onPress={() => { this.CheckFilePublic(item) }}>
                                                <Image
                                                    style={{ width: reSize(24), height: reSize(24), tintColor: colors.redpink }}
                                                    source={ListIdFilePublic.includes(item.IdRow) ? Images.icUnCheck : Images.icCheck} />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    )
                                } else {
                                    let type = 0;
                                    let checkImage = Utils.checkIsImage(item.uri);
                                    let checkVideo = Utils.checkIsVideo(item.uri);
                                    Utils.nlog("giá trị image hay video là ---------------- : ", checkImage + " -video- " + checkVideo, item.uri)
                                    if (checkVideo == true) {

                                        type = 1;
                                    }
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                if (type == 0) {
                                                    Utils.goscreen(this, ConfigScreenDH.Modal_ShowListImage, {
                                                        ListImages: arrImage.map(item => {
                                                            return { ...item, url: item.uri }
                                                        }), index: index
                                                    });
                                                    // setIndexHinh(index);
                                                    // enableFullImage(true);
                                                } else {
                                                    Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, { source: item.uri });
                                                }
                                            }}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: colors.colorGrayIcon,
                                                borderRadius: 5,
                                                width: Width(25),
                                                height: Width(25),
                                                marginRight: 10,
                                            }}>
                                            {type == 1 ?
                                                <VideoCus
                                                    source={{ uri: item.uri }}
                                                    style={{
                                                        width: Width(25),
                                                        height: Width(25), borderRadius: 5,
                                                    }}
                                                    resizeMode='cover'
                                                    paused={true}
                                                />
                                                // null
                                                : <Image style={{
                                                    width: Width(25),
                                                    height: Width(25), borderRadius: 5,
                                                }}
                                                    source={{ uri: item.uri }}
                                                    resizeMode='cover' />
                                            }
                                            {/* <Image style={{
                                    width: Width(25),
                                    height: Width(25), borderRadius: 5,
                                }}
                                    source={{ uri: item.uri }}
                                    resizeMode='cover' /> */}
                                            {
                                                type == 0 ? null :
                                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image source={Images.icVideoBlack} style={[nstyles.nIcon24, { backgroundColor: colors.black_50, padding: 5, borderRadius: 8 }]} resizeMode={'contain'} />
                                                    </View>
                                            }
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                style={{ position: 'absolute', bottom: 5, right: 5 }}
                                                onPress={() => { this.CheckFilePublic(item) }}>
                                                <Image
                                                    style={{ width: reSize(24), height: reSize(24), tintColor: colors.redpink }}
                                                    source={ListIdFilePublic.includes(item.IdRow) ? Images.icUnCheck : Images.icCheck} />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    )
                                }

                            }
                            )}
                    </ScrollView>
                    {
                        arrApplication.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={{ marginHorizontal: 13, marginTop: 8 }}
                                // onPress={() => { this._ShowVideo(item) }}
                                >
                                    <TouchableOpacity onPress={
                                        () => {
                                            Utils.nlog("giatri item file ", item.uri)
                                            if (item.IsNew == false) {
                                                try {
                                                    Linking.openURL(item.uri)
                                                } catch (error) {

                                                }

                                            }
                                        }
                                    }
                                        style={{
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            width: '100%', paddingHorizontal: 5,
                                            backgroundColor: colors.colorGrayBgr,
                                            paddingVertical: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                        <Image
                                            style={{ width: reSize(24), height: reSize(24), }}
                                            source={Images.icAttached}
                                            resizeMode='contain' />
                                        <Text style={{ flex: 1, marginRight: 20 }}>
                                            {item.TenFile ? item.TenFile : item.FileName}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={{ position: 'absolute', top: 5, right: 5 }}
                                        onPress={() => { this.CheckFilePublic(item) }}
                                    >
                                        <Image
                                            style={{ width: reSize(24), height: reSize(24), tintColor: colors.redpink }}
                                            resizeMode='contain'
                                            source={ListIdFilePublic.includes(item.IdRow) ? Images.icUnCheck : Images.icCheck} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )
                        })
                    }
                </>
            )
        } else {
            return <>
                <Text style={{ paddingHorizontal: 13, textAlign: 'justify' }}>{'File công khai (Bỏ đánh dấu file nếu không muốn công khai):'}</Text>
                <Text style={{ textAlign: 'justify', marginHorizontal: 13, marginTop: 10, color: colors.grayLight }}>{'Không có dữ liệu file đính kèm trong quy trình xử lý'}</Text>
            </>

        }

    }
    render() {
        Utils.nlog("Giá trị ===================()():", this.action.IdForm)
        Utils.nlog("gia tri action", this.action)
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',

                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: nstyles.Height(10),
                    borderTopLeftRadius: 30, borderTopRightRadius: 30,

                }}>
                    {this.renderItemDesign(1)}
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        {this.renderItemDesign(7)}
                        {this.renderItemDesign(6)}
                        {this.renderItemDesign(2)}
                        {this.renderItemDesign(3)}
                        {this.renderItemDesign(4)}
                        {this.renderItemDesign(8)}

                        {this.EnablePublicFile && this.action.IdForm == '5' ? this.ComponentCongKhaiHinhAnh() : null}
                        {this.renderItemDesign(5)}
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading />
            </View >
        );
    }
}
export default ModalXuLyChung