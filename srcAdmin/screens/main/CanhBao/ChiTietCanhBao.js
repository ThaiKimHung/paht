import React, { Component, Fragment } from 'react'
import { Text, View, StyleSheet, Platform, TouchableOpacity, Image, TouchableHighlight } from 'react-native'
import { colors, nstyles } from '../../../../styles'
import { HeaderCom, DatePick, IsLoading } from '../../../../components'
import Utils from '../../../../app/Utils'
import { Images } from '../../../images'
import apis from '../../../apis'
import { sizes, reSize } from '../../../../styles/size'
import ModalDrop from '../../PhanAnhHienTruong/components/ModalDrop'
import ItemNoiDung from '../../PhanAnhHienTruong/components/ItemNoiDung';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment'
import { Width } from '../../../../styles/styles'
import ButtonCus from '../../../../components/ComponentApps/ButtonCus'
import FileCom from '../../PhanAnhHienTruong/components/FileCom';

import path from 'path';
import HtmlViewCom from '../../../../components/HtmlView'
import { ConfigScreenDH } from '../../../routers/screen'

// 0:Thông tin 1: cảnh báo 2:Khẩn cấp
const CapDo = [
    {
        name: 'Thông tin',
        id: 0
    },
    {
        name: 'Cảnh báo',
        id: 1
    },
    {
        name: 'Khẩn cấp',
        id: 2
    },
]
export class ChiTietCanhBao extends Component {
    constructor(props) {
        super(props)
        this.isNew = Utils.ngetParam(this, "isNew", false);
        this.isEdit = Utils.ngetParam(this, "isEdit", false);
        this.callback = Utils.ngetParam(this, "callback", () => { });

        this.state = {
            data: Utils.ngetParam(this, "data", {}),
            objCapDo: CapDo[0],
            objChuyenMuc: this.props.dataChuyenMuc[0],
            objLocTheo: this.props.dataChuyenMuc[0],
            objDonVi: this.props.dataDonVi[0],
            arrImage: [],
            dataInfo: {},
            TieuDe: '',
            ViTri: '',
            NoiDung: '',
            Log: '',
            Lat: '',
            FromDate: '',
            F_hh: '00',
            T_hh: '00',
            F_mm: '00',
            T_mm: '00',
            ToDate: '',
            FromTime: '',
            ToaDoX: '',
            ToaDoY: '',
            arrImg: '',
            arrLinkFile: '',
            isCheck: false,
            ArrImageDelete: [],

            arrImage: [],
            arrAplicaton: [],
            arrFileDelete: [],
            ListIMG: []
        }
    }

    _SetLaiduLieu = async (res) => {
        var cm = await this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == res.data.IdChuyenMuc);
        var lt = await this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == res.data.LocTheo);
        let dv = await this.props.dataDonVi.find(item => item.MaPX == res.data.IdDV);
        let cd = await CapDo.find(item => item.id == res.data.CapDo);
        this.setState({
            objChuyenMuc: cm ? cm : this.props.dataChuyenMuc[0],
            objLocTheo: lt,
            objDonVi: dv,
            objCapDo: cd,
            isCheck: res.data.TuongTac
        })
    }
    _getInFoCanhBao = async () => {
        const typeHinh = 1;
        const typeFile = 2;

        const { data } = this.state;
        const res = await apis.ApiCanhBao.InfoCanhBao(data.Id);
        // Utils.nlog("gia tri res nfo cnah báo", res);
        if (res.status == 1 && res.data) {
            var fDate = moment(res.data.TuNgay).format('YYYY-MM-DD');
            var tDate = moment(res.data.DenNgay).format('YYYY-MM-DD');
            var cm = await this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == res.data.IdChuyenMuc);
            var lt = await this.props.dataChuyenMuc.find(item => item.IdChuyenMuc == res.data.LocTheo);
            let dv = await this.props.dataDonVi.find(item => item.MaPX == res.data.IdDV);
            let cd = CapDo.find(item => item.id == res.data.CapDo);
            // Utils.nlog("gia tri ti kiem", cm, lt, dv, cd)
            if (res.data && res.data.ListFile.length > 0) {
                let ListIMG = await res.data.ListFile.map((item) => {
                    return {
                        ...item,
                        IsDel: false,
                        IsNew: false,
                        // uri: item.Path.substring(7),
                        Path: item.Path.replace('/Upload/', '')
                    }

                })
                // Utils.nlog("gia tri list IMG", ListIMG)
                this.setState({ ListIMG })

            }

            this.setState({
                dataInfo: res.data,
                TieuDe: res.data.TieuDe,
                ViTri: res.data.ViTri,
                NoiDung: res.data.NoiDung,
                Log: res.data.ToaDoX,
                Lat: res.data.ToaDoY,
                FromDate: fDate,
                ToDate: tDate,
                F_hh: moment(res.data.TuNgay).format('HH'),
                T_hh: moment(res.data.DenNgay).format('HH'),
                F_mm: moment(res.data.TuNgay).format('mm'),
                T_mm: moment(res.data.DenNgay).format('mm'),
                objChuyenMuc: cm,
                objLocTheo: lt,
                objDonVi: dv,
                objCapDo: cd,
                // arrImg: arrImg,
                // arrLinkFile: arrLinkFile,
                isCheck: res.data.TuongTac

            }, () => this._SetLaiduLieu(res))
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", "Lấy thông tin cảnh báo thất bại", "Xác nhận");
        }
    }



    componentDidMount() {
        if (this.isNew == false || this.isEdit == true) {
            this._getInFoCanhBao();
        }
    }
    TuNgay = (date) => {
        Utils.nlog("vao tu ngay", date)
        let { ToDate } = this.state;
        // let FromDate = date;
        if ((moment(date, "YYYY-MM-DD")).isAfter(moment(ToDate, "YYYY-MM-DD"))) {
            Utils.nlog("gia tri date vao nho hơn")
            this.setState({
                FromDate: ToDate,
            })
        } else {
            this.setState({
                FromDate: moment(date, "YYYY-MM-DD").format('YYYY-MM-DD'),

            })
        }
    }
    DenNgay = (date) => {
        Utils.nlog("vao den ngay", date)
        let { FromDate } = this.state;
        // let ToDate = date;
        if ((moment(date, "YYYY-MM-DD")).isBefore(moment(FromDate, "YYYY-MM-DD"))) {
            Utils.nlog("gia tri date vao lon hơn")
            this.setState({
                FromDate: FromDate,
            })
        } else {
            this.setState({
                ToDate: moment(date, "YYYY-MM-DD").format('YYYY-MM-DD'),

            })
        }
    }

    onPressdelete = (image) => {
        Utils.nlog("gia tri image delete", image)
        if (image.isOld == true) {
            this.setState({ ArrImageDelete: [...this.state.ArrImageDelete, image] })
        }
    }
    _InsertCanhBao = async () => {
        nthisIsLoading.show();
        const { TieuDe, objCapDo, objChuyenMuc, objDonVi, objLocTheo, NoiDung,
            ViTri, Lat, Log, FromDate, ToDate, F_hh, F_mm, T_mm, T_hh, isCheck, arrImg } = this.state
        //check dữ liệu
        if (TieuDe == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập tiêu đề cho cảnh báo", "Xác nhận");
            return;
        }
        if (NoiDung == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung cho cảnh báo", "Xác nhận");
            return;
        }
        if (objDonVi.MaPX == -1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn đơn vị cho cảnh báo", "Xác nhận");
            return;
        }
        if (objChuyenMuc.IdChuyenMuc == 100) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn chuyên mục cho cảnh báo", "Xác nhận");
            return;
        }
        if (FromDate == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn ngày bắt đầu cho cảnh báo", "Xác nhận");
            return;
        }
        if (ToDate == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn ngày kết thúc cho cảnh báo", "Xác nhận");
            return;
        }
        var f_d = `${FromDate}-${F_hh ? F_hh : '00'}-${F_mm ? F_mm : '00'}-00`;
        var t_d = `${ToDate}-${T_hh ? T_hh : '00'}-${T_mm ? T_mm : '00'}-00`;
        var date_f = moment(f_d ? f_d : '2010-01-01', 'YYYY-MM-DD-HH-mm-ss').format('YYYY-MM-DDTHH:mm:ss');
        var date_t = moment(t_d ? t_d : '2010-01-01', 'YYYY-MM-DD-HH-mm-ss').format('YYYY-MM-DDTHH:mm:ss');

        let LstImg = [], arrVideo = [];
        var { arrImage, arrAplicaton, arrFileDelete } = this.state//list image

        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];

            if (item.IsNew == false) {
                continue;
            } else {
                let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
                //|| temp.includes("mov") || temp.includes("mp4")
                if (checkImage == true || item.isImage == true || item.timePlay == 0) {
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    }
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                    LstImg.push({
                        Type: 1,
                        "strBase64": strBase64,
                        "filename": "hinh" + index + ".png",
                        "extension": "png",
                        IsDel: false,
                        IsNew: true
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
                            Type: 2,
                            "strBase64": strBase64,
                            "filename": `Video_${index}${Platform.OS == 'ios' ? ".mov" : ".mp4"}`,//("Video_" + index + Platform.OS == 'ios' ? ".mov" : ".mp4"),
                            "extension": Platform.OS == 'ios' ? "mov" : "mp4",
                            IsDel: false,
                            IsNew: true
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
                    var fi = + duoiFile[duoiFile.length - 1]
                    Utils.nlog("gia trị duôi file", fi)
                    LstImg.push({
                        Type: 3,
                        "strBase64": item.base64,
                        "filename": item.name,
                        "extension": fi,
                        IsDel: false,
                        IsNew: true
                    });
                }
            }

        }
        // Utils.nlog("gia tri format 2 ", date_f, date_t)
        var body = {
            "TieuDe": TieuDe,
            "IdDonVi": objDonVi.MaPX,
            "NoiDung": NoiDung,
            "ViTri": ViTri,
            "ToaDoX": Lat,
            "ToaDoY": Log,
            "IdChuyenMuc": objChuyenMuc.IdChuyenMuc,
            "LocTheo": objLocTheo ? objLocTheo.IdChuyenMuc : 0,
            "TheoDoi": 10,
            "TuNgay": date_f,
            "DenNgay": date_t,
            "CapDo": objCapDo.id,
            "TuongTac": isCheck ? 1 : 0,
            FileCanhBao: {
                IdPA: 0,
                LstImg: LstImg
            },
            "LstImg": LstImg
        }
        // Utils.nlog("gia tri body ---------------------", body)
        const res = await apis.ApiCanhBao.InsertCanhBao(body);
        Utils.nlog("gia tri canh bao res insert", res)
        if (res.status == 1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Đã thêm thành công ", "Xác nhận", () => {
                this.callback();
                Utils.goback(this);
            });
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Thêm cảnh báo thất bại ", "Xác nhận");
        }
        nthisIsLoading.hide();

    }
    _UpdateCanhBao = async () => {
        nthisIsLoading.show();
        const { TieuDe, objCapDo, objChuyenMuc, objDonVi, objLocTheo, NoiDung,
            ViTri, Lat, Log, FromDate, ToDate, F_hh, F_mm, T_mm, T_hh, isCheck, arrImg, dataInfo, ArrImageDelete } = this.state
        //check dữ liệu
        if (TieuDe == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập tiêu đề cho cảnh báo", "Xác nhận");
            return;
        }
        if (NoiDung == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung cho cảnh báo", "Xác nhận");
            return;
        }
        if (objDonVi.MaPX == -1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn đơn vị cho cảnh báo", "Xác nhận");
            return;
        }
        if (objChuyenMuc.IdChuyenMuc == 100) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn chuyên mục cho cảnh báo", "Xác nhận");
            return;
        }
        if (FromDate == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn ngày bắt đầu cho cảnh báo", "Xác nhận");
            return;
        }
        if (ToDate == '') {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa chọn ngày kết thúc cho cảnh báo", "Xác nhận");
            return;
        }
        var f_d = `${FromDate}-${F_hh}-${F_mm}-00`;
        var t_d = `${ToDate}-${T_hh}-${T_mm}-00`;
        var date_f = moment(f_d ? f_d : '2010-01-01', 'YYYY-MM-DD-HH-mm-ss').format('YYYY-MM-DDTHH:mm:ss');
        var date_t = moment(t_d ? t_d : '2010-01-01', 'YYYY-MM-DD-HH-mm-ss').format('YYYY-MM-DDTHH:mm:ss');

        //xu li file cho body
        let LstImg = [], arrVideo = [];
        var { arrImage, arrAplicaton, arrFileDelete } = this.state//list image

        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];
            if (item.IsNew == false) {
                continue;
            } else {
                let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
                //|| temp.includes("mov") || temp.includes("mp4")
                if (checkImage == true || item.isImage == true || item.timePlay == 0) {
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    }
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                    LstImg.push({
                        Type: 1,
                        "strBase64": strBase64,
                        "filename": "hinh" + index + ".png",
                        "extension": "png",
                        IsDel: false,
                        IsNew: true
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
                            Type: 2,
                            "strBase64": strBase64,
                            "filename": `Video_${index}${Platform.OS == 'ios' ? ".mov" : ".mp4"}`,//("Video_" + index + Platform.OS == 'ios' ? ".mov" : ".mp4"),
                            "extension": Platform.OS == 'ios' ? "mov" : "mp4",
                            IsDel: false,
                            IsNew: true
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
                    var duoiFile = item.name.split('.')
                    var fi = duoiFile[duoiFile.length - 1]
                    Utils.nlog("gia trị duôi file", item, duoiFile, fi)
                    LstImg.push({
                        Type: 3,
                        "strBase64": item.base64,
                        "filename": item.name,
                        "extension": fi,
                        IsDel: false,
                        IsNew: true
                    });
                }
            }

        }
        let arrDelete = [];
        for (let index = 0; index < arrFileDelete.length; index++) {
            let item = arrFileDelete[index];
            arrDelete.push({
                ...item,
                IsDel: true,
                IsNew: false
            })
            LstImg.push({
                ...item,
                IsDel: true,
                Isnew: false
            });
        }
        // Utils.nlog("gia tri list image", LstImg);
        // Utils.nlog("gia tri format 2 ", date_f, date_t)
        var body = {
            "IdRow": dataInfo.Id,
            "TieuDe": TieuDe,
            "IdDonVi": objDonVi.MaPX,
            "NoiDung": NoiDung,
            "ViTri": ViTri,
            "ToaDoX": Lat,
            "ToaDoY": Log,
            "IdChuyenMuc": objChuyenMuc.IdChuyenMuc,
            "LocTheo": objLocTheo ? objLocTheo.IdChuyenMuc : 0,
            "TheoDoi": 10,
            "TuNgay": date_f,
            "DenNgay": date_t,
            "CapDo": objCapDo.id,
            "IsDuyet": dataInfo.IsDuyet,
            "TuongTac": isCheck ? 1 : 0,
            FileCanhBao: {
                IdPA: 0,
                LstImg: LstImg
            },
            "LstImg": LstImg
        }
        // Utils.nlog("gia tri body chi tiết cảnh báo", body)
        const res = await apis.ApiCanhBao.UpdateCanhBao(body);
        // Utils.nlog("gia tri canh bao res insert", res)
        if (res.status == 1) {
            // UploadFileCanhBao
            if (Platform.OS == 'android' && arrVideo) {
                const resVideo = await apis.ApiUpLoadVideo.UploadFileCanhBao(arrVideo, dataInfo.Id);
                if (resVideo.status == 1) {
                    Utils.nlog("gia tri video", arrVideo)
                    Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                        // ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                        // Utils.goscreen(this, "scHomePAHT");
                        // try {
                        //     this.callback(this);
                        // } catch (error) {
                        //     Utils.goback(this);
                        // };
                    })
                } else {
                    Utils.nlog("gia tri video", arrVideo)
                    Utils.showMsgBoxOK(this, "Thông báo", "Cập nhật video cho phản ánh thất bại", "Xác nhận", () => {
                        // ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                        // Utils.goscreen(this, "scHomePAHT");
                        // try {
                        //     this.callback(this);
                        // } catch (error) {
                        //     Utils.goback(this);
                        // };
                    })
                }
            }
            else {
                nthisIsLoading.hide();
                Utils.showMsgBoxOK(this, "Thông báo", "Cập nhật cảnh báo thành công ", "Xác nhận", () => {
                    this.callback();
                    Utils.goback(this);
                });
            }

        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Cập nhật cảnh báo thất bại ", "Xác nhận");
        }
        nthisIsLoading.hide();
    }
    _DuyetCanhBao = () => {
        //CheckCanhBao
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn duyệt cảnh báo này không", "Xác nhận", "Thoát", async () => {
            var { dataInfo } = this.state;
            var body = {
                "IdRow": dataInfo.Id,
                "TieuDe": dataInfo.TieuDe,
                "IdDonVi": dataInfo.IdDV,
                "NoiDung": dataInfo.NoiDung,
                "ViTri": dataInfo.ViTri,
                "ToaDoX": dataInfo.ToaDoX,
                "ToaDoY": dataInfo.ToaDoY,
                "IdChuyenMuc": dataInfo.IdChuyenMuc,
                "LocTheo": dataInfo.LocTheo,
                "TuNgay": dataInfo.TuNgay,
                "DenNgay": dataInfo.DenNgay,
                "CapDo": dataInfo.CapDo,
                "IsDuyet": true,
                "TuongTac": dataInfo.TuongTac,
                "LstImg": dataInfo.ListFile
            }

            const res = await apis.ApiCanhBao.CheckCanhBao(body);
            Utils.nlog("giá trị duyet cảnh báo res", res);
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", "Duyệt cảnh báo thành công", "Xác nhận", () => {
                    this.callback();
                    Utils.goback(this);
                });
                return;
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : 'Thực hiện duyệt bị lỗi', "Xác nhận");
                return;
            }
        }, () => {
            return;
        })

    }
    HuyCanhBao = async () => {
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn huỷ cảnh báo này không", "Xác nhận", "Thoát", async () => {

            var { dataInfo } = this.state;
            var body = {
                "IdRow": dataInfo.Id,
                "TieuDe": dataInfo.TieuDe,
                "IdDonVi": dataInfo.IdDV,
                "NoiDung": dataInfo.NoiDung,
                "ViTri": dataInfo.ViTri,
                "ToaDoX": dataInfo.ToaDoX,
                "ToaDoY": dataInfo.ToaDoY,
                "IdChuyenMuc": dataInfo.IdChuyenMuc,
                "LocTheo": dataInfo.LocTheo,
                "TuNgay": dataInfo.TuNgay,
                "DenNgay": dataInfo.DenNgay,
                "CapDo": dataInfo.CapDo,
                "IsDuyet": false,
                "TuongTac": dataInfo.TuongTac,
                "LstImg": dataInfo.ListFile
            }

            const res = await apis.ApiCanhBao.CheckCanhBao(body);
            Utils.nlog("giá trị huỷ cảnh báo res", res);
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", "Huỷ cảnh báo thành công", "Xác nhận", () => {
                    this.callback();
                    Utils.goback(this);
                });
                return;
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : 'Thực hiện huỷ bị lỗi', "Xác nhận");
                return;
            }
        }, () => {
            return;
        })


    }
    callbackAutocompleteMap = (data, details = null) => {
        // Utils.nlog("vao thay ddoior address", data, details)
        const { lat, lng } = details.geometry.location;
        this.setState({
            Lat: lat,
            Log: lng,
            ViTri: data.description
        })

    };
    onOpenFile = (uri = '') => () => {
        let temp = uri.toLowerCase();
        if (temp.includes(".avi") || temp.includes(".mp4") || temp.includes(".mov") || temp.includes(".wmv") || temp.includes(".flv"))
            Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, { source: uri });
        else
            Linking.openURL(uri);
    }
    _UpdateFile = (arrImage = [], arrAplicaton = [], arrFileDelete = []) => {
        Utils.nlog("vao set File Upload nha----------1----------3", arrImage, arrAplicaton, arrFileDelete)
        this.setState({ arrImage, arrAplicaton, arrFileDelete });
    }
    render() {
        // Utils.nlog("gia tri list don vi", this.props.dataDonVi)
        const { dataInfo, arrImage, arrLinkFile, arrImg, isCheck, ListIMG } = this.state
        const { nrow } = nstyles.nstyles;

        Utils.nlog("Render lại list Image ----------", ListIMG)
        // Utils.nlog("gia tri chuyen muc", this.state.objChuyenMuc)
        return (
            <View style={{ flex: 1, backgroundColor: colors.white, }}>
                <HeaderCom
                    titleText='Chi tiết cảnh báo'
                    iconLeft={Images.icBack}
                    nthis={this}
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                />

                <KeyboardAwareScrollView style={{ paddingHorizontal: 20, flex: 1 }}>
                    <ItemNoiDung
                        editable={this.isNew}
                        value={this.state.TieuDe}
                        multiline={true}
                        textTieuDe={<Text>Tiêu đề <Text style={{ color: colors.redStar }}>*</Text></Text>}
                        placeholder={'Tiêu đề'}
                        onChangeText={(text) => this.setState({ TieuDe: text })}
                    />

                    <ModalDrop
                        isDrop={this.isNew}
                        value={this.state.objDonVi}
                        keyItem={'MaPX'}
                        texttitle={<Text>Đơn vị <Text style={{ color: colors.redStar }}>*</Text></Text>}
                        dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.sText13 }}
                        options={this.props.dataDonVi}
                        onselectItem={(item) => this.setState({ objDonVi: item })}
                        Name={"TenPhuongXa"} />



                    <View
                        pointerEvents={
                            this.isNew ? 'auto' : 'none'
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
                        }}>Nội dung: <Text style={{ color: colors.redStar }}>*</Text></Text>
                        <TouchableOpacity onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                            content: this.state.NoiDung,
                            callback: (val) => this.setState({ NoiDung: val })
                        })}>
                            <HtmlViewCom html={this.state.NoiDung} style={{ height: '100%' }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.isNew ? Utils.goscreen(this, ConfigScreenDH.Modal_AutocompleteMap, {
                                callback: this.callbackAutocompleteMap,
                                noRoot: false
                            }) : null
                        }}
                    >
                        <ItemNoiDung
                            editable={false}
                            value={this.state.ViTri}
                            multiline={true}
                            textTieuDe={<Text>Vị trí phát hiện <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            placeholder={'Vị trí'}
                            onChangeText={(text) => this.setState({ ViTri: text })}

                        />
                    </TouchableOpacity>


                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <ItemNoiDung
                            editable={this.isNew}
                            isTitle={true}
                            textTieuDe={<Text>Kinh độ <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            value={`${this.state.Lat ? this.state.Lat : '0'}`.toString()}
                            onChangeText={(text) => this.setState({ Lat: text })}

                            stConainer={{ padding: 0, flex: 1, margin: 0, marginRight: 5 }}
                            placeholder={'Kinh độ'}

                            numberOfLines={1}
                            style={[{ padding: 0, paddingVertical: 8, margin: 0, fontSize: sizes.sText12 }]}
                        />
                        <ItemNoiDung
                            editable={this.isNew}
                            isTitle={true}
                            textTieuDe={<Text>Vĩ độ <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            stConainer={{ padding: 0, flex: 1, margin: 0 }}
                            placeholder={'Vĩ độ'}
                            value={`${this.state.Log ? this.state.Log : '0'}`.toString()}
                            onChangeText={(text) => this.setState({ Log: text })}
                            numberOfLines={1}
                            style={[{ padding: 0, paddingVertical: 8, margin: 0, fontSize: sizes.sText12, }]}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <ModalDrop
                            isDrop={this.isNew}
                            value={this.state.objChuyenMuc}
                            keyItem={'IdChuyenMuc'}
                            texttitle={<Text>Chuyên Mục <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            styleContent={{ marginRight: 5 }}
                            dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.sText13 }}
                            options={this.props.dataChuyenMuc}
                            onselectItem={(item) => this.setState({ objChuyenMuc: item })}
                            Name={"TenChuyenMuc"} />
                        <ModalDrop
                            isDrop={this.isNew}
                            value={this.state.objLocTheo}
                            keyItem={'IdChuyenMuc'}
                            texttitle={<Text>Lọc theo <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            // styleContent={{ marginRight: 5 }}
                            dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.sText13 }}
                            options={this.props.dataChuyenMuc}
                            onselectItem={(item) => this.setState({ objLocTheo: item })}
                            Name={"TenChuyenMuc"} />
                    </View>
                    <ModalDrop
                        isDrop={this.isNew}
                        value={this.state.objCapDo}
                        keyItem={'id'}
                        texttitle={<Text>Cấp độ <Text style={{ color: colors.redStar }}>*</Text></Text>}
                        // styleContent={{ marginRight: 5 }}
                        dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.sText13, }}
                        options={CapDo}
                        onselectItem={(item) => this.setState({ objCapDo: item })}
                        Name={"name"} />
                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'center', }]}>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Text style={{ paddingVertical: Platform.OS == 'android' ? 0 : 2, fontSize: sizes.sText13, }}>Từ ngày</Text>
                            <DatePick value={this.state.FromDate}
                                style={{
                                    paddingVertical: Platform.OS == 'android' ? 8 : 13, borderWidth: 0.5, borderRadius: 2,
                                    borderColor: colors.colorGrayIcon, backgroundColor: colors.colorGrayTwo,
                                }}
                                onValueChange={this.isNew ? this.TuNgay : () => { }} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ItemNoiDung
                                    editable={this.isNew}
                                    maxLength={2}
                                    stContaierTT={{ padding: 0, }}
                                    textTieuDe={<Text>Giờ <Text style={{ color: colors.redStar }}>*</Text></Text>}
                                    value={this.state.F_hh}
                                    onChangeText={(text) => this.setState({ F_hh: text })}
                                    stConainer={{ padding: 0, flex: 1, margin: 1, marginRight: 5 }}
                                    placeholder={'HH'}
                                    keyboardType={'numeric'}
                                    numberOfLines={1}
                                    stNoiDung={{ fontSize: sizes.sText12 }}
                                    style={[{ padding: 0, paddingVertical: 5, margin: 0, fontSize: sizes.sText12, }]}
                                />
                                <ItemNoiDung
                                    editable={this.isNew}
                                    maxLength={2}
                                    keyboardType={'numeric'}
                                    stContaierTT={{ padding: 0, }}
                                    textTieuDe={<Text>Phút <Text style={{ color: colors.redStar }}>*</Text></Text>}
                                    value={this.state.F_mm}
                                    onChangeText={(text) => this.setState({ F_mm: text })}
                                    stConainer={{ padding: 0, flex: 1, margin: 1, }}
                                    placeholder={'mm'}
                                    numberOfLines={1}
                                    style={[{ padding: 0, paddingVertical: 5, margin: 0, fontSize: sizes.sText12 }]}
                                />
                            </View>

                        </View>
                    </View>

                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'center', }]}>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Text style={{ paddingVertical: Platform.OS == 'android' ? 0 : 2, fontSize: sizes.sText13, }}>Đến ngày </Text>
                            <DatePick value={this.state.ToDate}
                                style={{
                                    paddingVertical: Platform.OS == 'android' ? 8 : 13, borderWidth: 0.5, borderRadius: 2,
                                    borderColor: colors.colorGrayIcon, backgroundColor: colors.colorGrayTwo,
                                }}
                                onValueChange={this.isNew ? this.DenNgay : () => { }} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ItemNoiDung
                                    editable={this.isNew}
                                    maxLength={2}
                                    stContaierTT={{ padding: 0, }}
                                    textTieuDe={<Text>Giờ <Text style={{ color: colors.redStar }}>*</Text></Text>}
                                    value={this.state.T_hh}
                                    onChangeText={(text) => this.setState({ T_hh: text })}
                                    stConainer={{ padding: 0, flex: 1, margin: 1, marginRight: 5 }}
                                    placeholder={'HH'}
                                    keyboardType={'numeric'}
                                    numberOfLines={1}
                                    stNoiDung={{ fontSize: sizes.sText12 }}
                                    style={[{ padding: 0, paddingVertical: 5, margin: 0, fontSize: sizes.sText12, }]}
                                />
                                <ItemNoiDung
                                    editable={this.isNew}
                                    maxLength={2}
                                    stContaierTT={{ padding: 0, }}
                                    textTieuDe={<Text>Phút <Text style={{ color: colors.redStar }}>*</Text></Text>}
                                    value={this.state.T_mm}
                                    onChangeText={(text) => this.setState({ T_mm: text })}
                                    stConainer={{ padding: 0, flex: 1, margin: 1, }}
                                    placeholder={'mm'}
                                    keyboardType={'numeric'}
                                    numberOfLines={1}
                                    style={[{ padding: 0, paddingVertical: 5, margin: 0, fontSize: sizes.sText12 }]}
                                />
                            </View>

                        </View>
                    </View>
                    <View style={{ paddingVertical: 20 }}>
                        <FileCom arrFile={this.state.ListIMG} nthis={this} setFileUpdate={this._UpdateFile} />
                    </View>
                    <View style={{ paddingVertical: 20 }}>

                        <TouchableOpacity
                            style={{ flexDirection: 'row', width: Width(50) }}
                            onPress={() => this.setState({ isCheck: !this.state.isCheck }, this._onReFresh)}>
                            <Image source={isCheck == true ? Images.icCheck : Images.icUnCheck} style={[nstyles.nstyles.nIcon20, { tintColor: colors.peacockBlue, marginRight: 5 }]} resizeMode='contain' />
                            <Text style={{ marginRight: 15, fontSize: sizes.sText14 }}>{'Tương tác'}</Text>
                        </TouchableOpacity>
                        {
                            this.isNew && !this.isEdit ? <View style={{ marginVertical: 20 }}>
                                <ButtonCus
                                    onPressB={this._InsertCanhBao}
                                    stContainerR={{
                                        paddingVertical: 12,
                                        marginTop: 0, marginBottom: 30,
                                        alignSelf: 'center', justifyContent: 'flex-start'
                                    }}
                                    textTitle={`Thêm Cảnh báo`}
                                />
                            </View> : null
                        }
                        {
                            this.isEdit && this.isNew ? <View style={{ marginVertical: 20 }}>
                                <ButtonCus
                                    onPressB={this._UpdateCanhBao}
                                    stContainerR={{
                                        paddingVertical: 12,
                                        marginTop: 0, marginBottom: 30,
                                        alignSelf: 'center', justifyContent: 'flex-start'
                                    }}
                                    textTitle={`Thực hiện`}
                                />
                            </View> : null
                        }
                        {
                            !this.isEdit && !this.isNew ?
                                this.state.data.IsDuyet == false ? <TouchableOpacity
                                    onPress={this._DuyetCanhBao}
                                    style={{
                                        backgroundColor: colors.white, marginTop: 5, borderRadius: 2,
                                        paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center', paddingVertical: 10,
                                        borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, borderColor: colors.peacockBlue, marginBottom: 30
                                    }}>
                                    <Text style={{ color: colors.peacockBlue, fontWeight: 'bold' }}>{'Duyệt'}</Text>
                                </TouchableOpacity> : <TouchableOpacity
                                    onPress={this.HuyCanhBao}
                                    style={{
                                        backgroundColor: colors.white, marginTop: 5, borderRadius: 2,
                                        paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center', paddingVertical: 10,
                                        borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, borderColor: colors.peacockBlue, marginBottom: 30
                                    }}>
                                    <Text style={{ color: colors.grayLight, fontWeight: 'bold' }}>{'Huỷ '}</Text>
                                </TouchableOpacity> : null
                        }


                    </View>
                    <IsLoading />
                </KeyboardAwareScrollView>
            </View >
        )
    }
}
const mapStateToProps = state => ({
    dataNguon: state.GetList_NguonPhanAnh,
    dataChuyenMuc: state.GetList_ChuyenMuc,
    dataMucDo: state.GetList_MucDoAll,
    dataLinhVuc: state.GetList_LinhVuc,
    dataDonVi: state.GetList_DonVi,
});
export default Utils.connectRedux(ChiTietCanhBao, mapStateToProps, false);
