import React, { Component, Fragment } from 'react'
import { Text, View, TouchableOpacity, Image, FlatList, ScrollView, Linking, Alert, ActivityIndicator, BackHandler } from 'react-native'
import { nstyles, paddingTopMul } from '../../../styles/styles';
import { colors } from '../../../styles';
import { Images } from '../../images';
import { reText, sizes } from '../../../styles/size';
import Utils from '../../../app/Utils';
import apis from '../../apis';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { ButtonCom, HeaderCus, IsLoading, IsLoadingNew } from '../../../components';
import { appConfig } from '../../../app/Config';
import * as Animatable from 'react-native-animatable'
import { node } from 'prop-types';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { nkey } from '../../../app/keys/keyStore';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import AppCodeConfig from '../../../app/AppCodeConfig';

// Dữ liệu cứng loại giấy tờ IdGiayTo Dùng để truyền body khi lưu
const DataGiayTo = [
    {
        IdGiayTo: 1,
        TenGiayTo: 'Chứng minh nhân dân'
    },
    {
        IdGiayTo: 2,
        TenGiayTo: 'Hộ Chiếu'
    },
    {
        IdGiayTo: 3,
        TenGiayTo: 'Chứng minh quân đội'
    },
    {
        IdGiayTo: 4,
        TenGiayTo: 'Chứng minh sĩ quan'
    },
    {
        IdGiayTo: 5,
        TenGiayTo: 'Căn cước công dân'
    },
]


export class ChiTietThuTuc extends Component {
    constructor(props) {
        super(props);
        this.itemThuTuc = Utils.ngetParam(this, 'itemThuTuc')
        this.isBoSung = Utils.ngetParam(this, 'isBoSung', false)
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.state = {
            dataChiTiet: {},
            selectGiayTo: DataGiayTo[0],
            hoten: '',
            sogiayto: '',
            isDichVu: true,
            HoSoDinhKem: [],
            isGui: false,
            dataTP: [],
            dataPX: [],
            selectHuyenTP: '',
            selectPhuongXa: '',
            DiaChi: '',
            GhiChu: '',

            //Các file sau khi upload
            ListFileUploaded: [],
            loadingUpfile: false,
            statusLoading: '',
            HoSoID: '',// ,
            selectHuyenTP_Recive: '',
            selectPhuongXa_Recive: '',
            DiaChi_Recive: '',
            isPayment: true,
            isRecive: false,
            InfoUser: '',
            isNopHoSo: this.isBoSung ? this.isBoSung : false,
            DiaChiDangKy: '',
            SelectHuyenTPDK: '',
            SelectPhuongXaDK: ''
        }
    }

    async componentDidMount() {
        await this.getData()
        if (this.isBoSung) {
            this.checkLogin()
        }
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    checkLogin = async () => {
        let data = this.props.auth.userDVC
        Utils.nlog('auth - - - - - - -', data)
        if (data && data.KhachHangID) {
            this.setState({ InfoUser: data, hoten: data.HoVaTen, sogiayto: data.SoDinhDanh, isNopHoSo: true })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng đăng nhập để nộp hồ sơ', 'OK', () => {
                this._loginSSO()
            })
        }
    }
    _loginSSO = () => {
        Utils.goscreen(this, 'Modal_DangNhapSSO', { callback: this._callbackLoginSSO, isShowMessage: false })
    }

    _callbackLoginSSO = (isState, respond) => {
        if (isState) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng nhập thành công', 'Tiếp tục', async () => {
                Utils.nlog('res sso', respond)
                let { data } = respond
                await this.props.SetUserApp(AppCodeConfig.APP_DVC, data)
                await this.props.SetRuleAppCanBo(data.AppCanBo)
                await this.props.CheckLienKet({ ...data, "LoginDVC": true, })
                this.props.loadMenuApp({
                    listObjectMenuDVC: data.AppCanBo
                })
                this.setState({ InfoUser: data, hoten: data.HoVaTen, sogiayto: data.SoDinhDanh, isNopHoSo: true })
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng nhập thất bại', 'Xác nhận')
        }
    }

    getData = async () => {
        nthisIsLoading.show();
        await this.LoadCBoLinhVuc()
        await this.GetDanhSachHoSoKemTheoTraCuu()
        await this.GetDataDonVi_TraCuu()
        nthisIsLoading.hide();
    }

    GetDataDonVi_TraCuu = async () => {
        let res = await apis.ApiDVC.GetDataDonVi_TraCuu()
        // Utils.nlog('tinh tp', res)
        if (res.status == 1) {
            let { CH } = res.data
            this.setState({ dataTP: CH.V_DICHVUCONG_DONVI_LstStringResult })
        } else {
            this.setState({ dataTP: [] })
        }
    }

    LoadCBoLinhVuc = async () => {
        let dataBoDy = new FormData();
        let obj = JSON.stringify({
            "DonViID": this.itemThuTuc.DonViID,
            "LinhVucID": this.itemThuTuc.LinhVucID,
            "TenThuTuc": this.itemThuTuc.TenThuTuc,
            "MucDo": this.itemThuTuc.MucDo,
            "PageNum": "1",
            "PageSize": "10"
        })
        dataBoDy.append("data", obj)
        const res = await apis.ApiDVC.GetDanhSachTTHCDVC(dataBoDy);
        Utils.nlog("<><>LoadCBoLinhVuc", res)
        if (res.status == 1) {
            this.setState({
                dataChiTiet: res.data.data.DICHVUCONG_THUTUCHANHCHINH_PResult[0]
            })
        }
    }

    GetDanhSachHoSoKemTheoTraCuu = async () => {
        let res = await apis.ApiDVC.GetDanhSachHoSoKemTheoTraCuu(this.itemThuTuc.ThuTucHanhChinhID, this.itemThuTuc.DonViID)
        Utils.nlog("<><>GetDanhSachHoSoKemTheoTraCuu", res)
        if (res.status == 1) {
            let { dsHoSoKemTheo } = res.data
            let temp = dsHoSoKemTheo.GetDanhSachHoSoKemTheoResult.map(item => {
                return {
                    ...item,
                    ListFile: []
                }
            })
            this.setState({ HoSoDinhKem: temp })
        }
    }

    _viewItemToChuc = (item, key, value) => {
        return (
            <View
                key={item[key]}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item[value]}</Text>
            </View>
        )
    }

    _callbackSoGiayTo = (val) => {
        //setState
        this.setState({ selectGiayTo: val })
    }

    _dropDownGiayTo = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this._callbackSoGiayTo(val), item: this.state.selectGiayTo,
            title: 'Loại giấy tờ',
            AllThaoTac: DataGiayTo, ViewItem: (item) => this._viewItemToChuc(item, 'IdGiayTo', 'TenGiayTo'), Search: true, key: 'TenGiayTo'
        })
    }

    changeService = (val) => {
        this.setState({ isDichVu: val })
        if (val == false) {
            this.setState({ selectHuyenTP_Recive: '', DiaChi_Recive: '', selectPhuongXa_Recive: '' })
        }
    }

    choseFile_HoSo = (HoSoKemTheoID) => {

        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: (res) => this.responseChoseFile(res, HoSoKemTheoID), // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }

    responseChoseFile = (res, HoSoKemTheoID) => {
        let { HoSoDinhKem = [] } = this.state;
        let tempHoSo = HoSoDinhKem
        if (res.iscancel) {
            // Utils.nlog('--ko chon item or back');
        }
        else if (res.error) {
            // Utils.nlog('--lỗi khi chon media');
        }
        else {
            //--dữ liệu media trả về là 1 item or 1 mảng item
            //--Xử lý dữ liệu trong đây-----
            res = res.map(item => {
                return {
                    ...item,
                    url: item.uri,
                    HoSoKemTheoID: HoSoKemTheoID
                    // uri: item.uri,
                    // imagePart: { uri: item.uri }
                }
            })
            const indexHoSo = tempHoSo.findIndex(item => item.HoSoKemTheoID == HoSoKemTheoID)
            //Do đã map list từ đầu nên findindex chắc chắc có nên k cần if kiểm tra
            tempHoSo[indexHoSo].ListFile = [...tempHoSo[indexHoSo].ListFile, ...res]
            this.uploadFileDK_ThuTuc(HoSoKemTheoID, [...res])
            // Utils.nlog('temp file', tempHoSo)
            this.setState({ HoSoDinhKem: tempHoSo })
        }
    }

    uploadFileDK_ThuTuc = async (HoSoKemTheoID, ListFile = []) => {
        // Utils.nlog('List File Kem', ListFile)
        if (ListFile.length > 0) {
            this.setState({ loadingUpfile: true, statusLoading: 'Đang tải các file lên...' })
            let fileUploaded = []
            let dataBoDy = new FormData();

            dataBoDy.append("data", HoSoKemTheoID)
            for (let i = 0; i < ListFile.length; i++) {
                const item = ListFile[i];
                dataBoDy.append("fileUpload",
                    {
                        name: `FileUpload${i + 1}.png`,
                        type: "image/png",
                        uri: item.url
                    })
            }
            let res = await apis.ApiDVC.UploadFileDKTTHC(dataBoDy)
            // Utils.nlog('data upload ', res)
            if (res.status == 1) {
                fileUploaded.push(res.data)
            }
            // Lưu ý bước sau khi nhấn lưu thì set lại ListFileUploaded để không phải bị đẩy lại các file cũ
            this.setState({ ListFileUploaded: [...this.state.ListFileUploaded, ...fileUploaded], loadingUpfile: false })
            // Utils.nlog('List File sau khi upload ', this.state.ListFileUploaded)
        }
    }

    onDeleteFileHoSo = async (item) => {
        let { HoSoDinhKem = [], ListFileUploaded = [] } = this.state;
        Utils.nlog('Ho so dinh kem', HoSoDinhKem)
        Utils.nlog('List File', ListFileUploaded)
        Utils.nlog('Thu tuc can xoa', item)
        //Xoa file online
        const indexUploaded = ListFileUploaded.findIndex(temp => temp.HoSoKemTheoID == item.HoSoKemTheoID)
        if (indexUploaded != -1) {
            this.setState({ statusLoading: 'Đang xóa file...', loadingUpfile: true })
            let res = await apis.ApiDVC.DeleteHSKemTheo(item.HoSoKemTheoID, ListFileUploaded[indexUploaded].LienKet)
            Utils.nlog('res xoa file', res)
            let tempUploaded = ListFileUploaded
            if (res.status == 1) {
                //Xoa file hien thi
                tempUploaded.splice(indexUploaded, 1)
                Utils.nlog('List File sau khi delete ', tempUploaded)
                this.setState({ loadingUpfile: false, ListFileUploaded: tempUploaded })
                let tempHoSo = HoSoDinhKem
                const indexHoSo = tempHoSo.findIndex(temp => temp.HoSoKemTheoID == item.HoSoKemTheoID)
                if (indexHoSo != -1) {
                    tempHoSo[indexHoSo].ListFile = []
                    this.setState({ HoSoDinhKem: tempHoSo })
                }
            }
        }
    }

    showImg = (item, index) => {
        let { HoSoDinhKem = [] } = this.state;
        let tempHoSo = HoSoDinhKem
        const indexHoSo = tempHoSo.findIndex(temp => temp.HoSoKemTheoID == item.HoSoKemTheoID)
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: tempHoSo[indexHoSo].ListFile, index })
    }

    renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.showImg(item, index)} activeOpacity={0.5} style={{ marginLeft: index > 0 ? 10 : 0, padding: 10 }}>
                <View>
                    <Image source={{ uri: item.url }} style={{ width: sizes.nImgSize80, height: sizes.nImgSize80 }} resizeMode='cover' />
                </View>
            </TouchableOpacity>
        )
    }

    //kiểm tra hồ sơ trước khi gửi,
    checkHoSo = () => {
        let { hoten, sogiayto, HoSoDinhKem, isDichVu, selectHuyenTP, selectPhuongXa, DiaChi, selectHuyenTP_Recive, selectPhuongXa_Recive, DiaChi_Recive, isRecive, DiaChiDangKy, SelectHuyenTPDK, SelectPhuongXaDK } = this.state
        let warning = ''
        if (!hoten) {
            warning += 'Họ và tên\n'
        }
        if (!sogiayto) {
            warning += 'Số giấy tờ\n'
        }
        if (!SelectHuyenTPDK || !SelectPhuongXaDK || !DiaChiDangKy) {
            warning += 'Địa chỉ đăng ký: '
        }
        if (!DiaChiDangKy) {
            warning += 'Số nhà/tên đường, '
        }
        if (!SelectPhuongXaDK) {
            warning += 'Phường/Xã, '
        }
        if (!SelectHuyenTPDK) {
            warning += 'Huyện/Thành Phố'
        }
        if (!isDichVu) {
            if (!selectHuyenTP || !selectPhuongXa || !DiaChi) {
                warning += '\nĐịa chỉ lấy hồ sơ: '
            }
            if (!DiaChi) {
                warning += 'Số nhà/tên đường, '
            }
            if (!selectPhuongXa) {
                warning += 'Phường/Xã, '
            }
            if (!selectHuyenTP) {
                warning += 'Huyện/Thành Phố'
            }


            if (!selectHuyenTP_Recive || !selectPhuongXa_Recive || !DiaChi_Recive) {
                warning += '\nĐịa chỉ nhận hồ sơ: '
            }
            if (!DiaChi_Recive) {
                warning += 'Số nhà/tên đường, '
            }
            if (!selectPhuongXa_Recive) {
                warning += 'Phường/Xã, '
            }
            if (!selectHuyenTP_Recive) {
                warning += 'Huyện/Thành Phố'
            }
        } else {
            if (isRecive) {
                if (!selectHuyenTP_Recive || !selectPhuongXa_Recive || !DiaChi_Recive) {
                    warning += 'Địa chỉ nhận hồ sơ: '
                }
                if (!DiaChi_Recive) {
                    warning += 'Số nhà/tên đường, '
                }
                if (!selectPhuongXa_Recive) {
                    warning += 'Phường/Xã, '
                }
                if (!selectHuyenTP_Recive) {
                    warning += 'Huyện/Thành Phố'
                }
            }
        }
        if (warning != '') {
            Utils.showMsgBoxOK(this, 'Vui lòng nhập đầy đủ các trường', warning,'Xác nhận')
            return false;
        }
        return true;
    }

    //Save
    SaveThuTuc = async () => {
        if (this.isBoSung) {
            //HO SO DA GUI CAN BO SUNG
            this.BoSungHoSo()
        } else {
            //QUY TRINH LOGIC SAVE->GUI
            let { hoten, DiaChi, selectGiayTo, selectHuyenTP, selectPhuongXa, sogiayto, isDichVu, GhiChu, ListFileUploaded, HoSoID, isGui,
                isPayment, DiaChi_Recive, selectHuyenTP_Recive, selectPhuongXa_Recive, isRecive, InfoUser, DiaChiDangKy, SelectHuyenTPDK, SelectPhuongXaDK } = this.state
            //true: Cho gửi, false: không cho gửi, bổ sung thông tin
            let check = this.checkHoSo()
            if (check && HoSoID == '') { //
                let diachiFull = DiaChi + ' ' + selectPhuongXa.Ten + ' ' + selectHuyenTP?.TenDonVi
                let diaChiFull_Recive = DiaChi_Recive + ' ' + selectPhuongXa_Recive.Ten + ' ' + selectHuyenTP_Recive?.TenDonVi
                let diaChiDangKyFull = DiaChiDangKy + ' , ' + SelectPhuongXaDK?.Ten + ' , ' + SelectHuyenTPDK?.TenDonVi
                let dataBoDy = new FormData();
                let obj = JSON.stringify(
                    {
                        "HoSoID": "",
                        "LinhVucID": this.itemThuTuc.LinhVucID,
                        "LoaiHoSoID": this.itemThuTuc.ThuTucHanhChinhID,
                        "DonViID": this.itemThuTuc.DonViID,
                        "TinhTrang": "VTN",
                        "CreatedUserID": "0",
                        "LastUpdUserID": "0",
                        "HoTenNguoiNop": hoten,
                        "GioiTinh": null,
                        "QuocTichID": null,
                        "NgaySinh": InfoUser ? InfoUser.NgayThangNamSinh.substring(6, 8) : null,
                        "ThangSinh": InfoUser ? InfoUser.NgayThangNamSinh.substring(4, 6) : null,
                        "NamSinh": InfoUser ? InfoUser.NgayThangNamSinh.substring(0, 4) : null,
                        "LoaiGiayToID": selectGiayTo.IdGiayTo, // * 
                        "SoGiayToTuyThan": sogiayto, // *
                        "NgayCap": "",
                        "NoiCap": "",
                        "HoKhauThuongTru": "",
                        "DienThoaiNguoiNop": InfoUser ? InfoUser.SoDienThoai : '', // *
                        "EmailNguoiNop": "",
                        "SoNha": !isDichVu ? DiaChi : '',
                        "QuanID": selectHuyenTP.DonViID,
                        "PhuongID": selectPhuongXa.Ma,
                        "DiaChiDangKy": diaChiDangKyFull,
                        "KhachHangID": InfoUser ? InfoUser.KhachHangID : '',
                        "UserPortalID": InfoUser ? InfoUser.UserPortalID : '',
                        "dsHoSoKemTheo": ListFileUploaded,
                        "DKNop": !isDichVu ? 1 : 0,
                        "DKTra": !isDichVu ? 1 : isRecive ? 1 : 0,
                        "DKNhanThuPhi": isPayment ? 1 : 0,
                        "DiaChiNop": !isDichVu ? diachiFull : '',
                        "DiaChiTra": !isDichVu ? diaChiFull_Recive : isRecive ? diaChiFull_Recive : ''
                    }
                )
                Utils.nlog('body save', obj)
                dataBoDy.append("data", obj)
                this.setState({ statusLoading: 'Đang lưu...', loadingUpfile: true })
                let res = await apis.ApiDVC.SaveDKTTHC(dataBoDy)
                Utils.nlog('res save dvc', res)
                if (res.status == 1 && res.data) {
                    let { data } = res.data
                    this.setState({ HoSoID: data, isGui: true, loadingUpfile: false }, this.GuiThuTuc)
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thất bại!', 'Xác nhận', () => {
                        this.setState({ loadingUpfile: false })
                    })
                }
            }
        }
    }

    GuiThuTuc = async () => {
        let { HoSoID } = this.state
        if (HoSoID != '') {
            //Gọi API sửa , thông báo thành công gửi back ra ngoài
            let dataBodySend = new FormData();
            let obj = JSON.stringify(
                { "HoSoID": HoSoID, "TinhTrang": "THS" }
            )
            // Utils.nlog('body gui', obj)
            dataBodySend.append("data", obj)
            this.setState({ statusLoading: 'Đang gửi...', loadingUpfile: true })
            let res = await apis.ApiDVC.SendDKTTHC(dataBodySend)
            // Utils.nlog('res send ====================', res)
            if (res.status == 1 && res.data) {
                let { data } = res.data
                if (data) {
                    Utils.showMsgBoxYesNo(this, 'Thông báo', 'Gửi thành công!\nBạn có muốn thanh toán hồ sơ hay không ?', "Thanh toán", 'Thoát', () => {
                        this.setState({ loadingUpfile: false })
                        Utils.goback(this);
                        Utils.goscreen(this, "scThanhToan", {
                            IDHS: data
                        })
                    },
                        () => {
                            this.setState({ loadingUpfile: false })
                            Utils.goback(this)
                        })
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thất bại!', 'Xác nhận', () => {
                        this.setState({ loadingUpfile: false })
                    })
                }
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thất bại!', 'Xác nhận', () => {
                    this.setState({ loadingUpfile: false })
                })
            }
        }
    }

    BoSungHoSo = async () => {
        let { hoten, DiaChi, selectGiayTo, selectHuyenTP, selectPhuongXa, sogiayto, isDichVu, GhiChu, ListFileUploaded, HoSoID, isGui,
            isPayment, DiaChi_Recive, selectHuyenTP_Recive, selectPhuongXa_Recive, isRecive, InfoUser, DiaChiDangKy, SelectHuyenTPDK, SelectPhuongXaDK } = this.state
        Utils.nlog('list file upload', ListFileUploaded)
        if (this.itemThuTuc.HoSoID != '') {
            //Gọi API bổ sung hồ  sơ
            let diachiFull = DiaChi + ' ' + selectPhuongXa.Ten + ' ' + selectHuyenTP?.TenDonVi
            let diaChiFull_Recive = DiaChi_Recive + ' ' + selectPhuongXa_Recive.Ten + ' ' + selectHuyenTP_Recive?.TenDonVi
            let diaChiDangKyFull = DiaChiDangKy + ' , ' + SelectPhuongXaDK?.Ten + ' , ' + SelectHuyenTPDK?.TenDonVi
            let dataBoDyUpdate = new FormData();
            let obj = JSON.stringify(
                {
                    "HoSoID": this.itemThuTuc.HoSoID,
                    "LinhVucID": this.itemThuTuc.LinhVucID,
                    "LoaiHoSoID": this.itemThuTuc.ThuTucHanhChinhID,
                    "DonViID": this.itemThuTuc.DonViID,
                    "TinhTrang": "VTN",
                    "CreatedUserID": "0",
                    "LastUpdUserID": "0",
                    "HoTenNguoiNop": hoten,
                    "GioiTinh": null,
                    "QuocTichID": null,
                    "NgaySinh": InfoUser ? InfoUser.NgayThangNamSinh.substring(6, 8) : null,
                    "ThangSinh": InfoUser ? InfoUser.NgayThangNamSinh.substring(4, 6) : null,
                    "NamSinh": InfoUser ? InfoUser.NgayThangNamSinh.substring(0, 4) : null,
                    "LoaiGiayToID": selectGiayTo.IdGiayTo, // * 
                    "SoGiayToTuyThan": sogiayto, // *
                    "NgayCap": "",
                    "NoiCap": "",
                    "HoKhauThuongTru": "",
                    "DienThoaiNguoiNop": InfoUser ? InfoUser.SoDienThoai : '', // *
                    "EmailNguoiNop": "",
                    "SoNha": !isDichVu ? DiaChi : '',
                    "QuanID": selectHuyenTP.DonViID,
                    "PhuongID": selectPhuongXa.Ma,
                    "DiaChiDangKy": diaChiDangKyFull,
                    "KhachHangID": InfoUser ? InfoUser.KhachHangID : '',
                    "UserPortalID": InfoUser ? InfoUser.UserPortalID : '',
                    "dsHoSoKemTheo": ListFileUploaded.map(item => {
                        return {
                            ...item,
                            "HoSoID": this.itemThuTuc.HoSoID,
                            CreatedUserID: InfoUser ? InfoUser.KhachHangID : '',
                            LastUpdUserID: InfoUser ? InfoUser.KhachHangID : '',
                        }
                    }),
                    "DKNop": !isDichVu ? 1 : 0,
                    "DKTra": !isDichVu ? 1 : isRecive ? 1 : 0,
                    "DKNhanThuPhi": isPayment ? 1 : 0,
                    "DiaChiNop": !isDichVu ? diachiFull : '',
                    "DiaChiTra": !isDichVu ? diaChiFull_Recive : isRecive ? diaChiFull_Recive : ''
                }
            )
            Utils.nlog('body bo sung ho so', obj)
            dataBoDyUpdate.append("data", obj)
            this.setState({ statusLoading: 'Đang gửi ...', loadingUpfile: true })
            let res = await apis.ApiDVC.UpdateDKTTHC(dataBoDyUpdate)
            Utils.nlog('res update ====================', res)
            if (res.status == 1 && res.data) {
                let { data } = res.data
                if (data == true) {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Bổ sung hồ sơ thành công!', 'Xác nhận', () => {
                        this.setState({ isGui: true, loadingUpfile: false })
                        this.callback()
                        Utils.goback(this)
                    })
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Bổ sung hồ sơ thất bại!', 'Xác nhận', () => {
                        this.setState({ loadingUpfile: false })
                    })
                }
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Bổ sung hồ sơ thất bại!', 'Xác nhận', () => {
                    this.setState({ loadingUpfile: false })
                })
            }
        }
    }

    _handleDownloadForm = async (item) => {
        nthisIsLoading.show()
        let res = await apis.ApiDVC.DownLoadHSKemTheo(item.HoSoKemTheoID, item.FileName)
        Utils.nlog('res download', res)
        if (res.status == 1) {
            nthisIsLoading.hide()
            Linking.openURL(res.data.data)
        } else {
            nthisIsLoading.hide()
            Alert.alert('Thông báo', 'Có lỗi khi tải xuống !')
        }
    }

    //Load danh sách phuong xa
    LoadCBoByDieuKien = async (val, type = -1) => {
        nthisIsLoading.show()
        let res = await apis.ApiDVC.LoadCBoByDieuKien(val.DonViID)
        Utils.nlog('Phuong Xa', res)
        if (res.status == 1) {
            nthisIsLoading.hide()
            let { data } = res.data
            this.setState({ dataPX: data.GetDanhMucCboByDieuKienResult }, () => {
                if (type == 1) {
                    this.setState({ SelectPhuongXaDK: data?.GetDanhMucCboByDieuKienResult[0] })
                }
            })
        } else {
            nthisIsLoading.hide()
            this.setState({ dataPX: [] }, () => {
                if (type == 1) {
                    this.setState({ SelectPhuongXaDK: '' })
                }
            })
        }
    }


    _callbackHuyenTPDK = (val) => {
        //setState
        this.setState({ SelectHuyenTPDK: val }, () => this.LoadCBoByDieuKien(val, 1))
    }

    _dropDownHuyenTPDK = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this._callbackHuyenTPDK(val), item: this.state.SelectHuyenTPDK,
            title: 'Chọn Huyện / Thành Phố',
            AllThaoTac: this.state.dataTP, ViewItem: (item) => this._viewItemToChuc(item, 'DonViID', 'TenDonVi'), Search: true, key: 'TenDonVi'
        })
    }

    _callbackPhuongXaDK = (val) => {
        //setState
        this.setState({ SelectPhuongXaDK: val })
    }

    _dropDownPhuongXaDK = () => {
        if (this.state.SelectHuyenTPDK && this.state.SelectHuyenTPDK.DonViID) {
            Utils.goscreen(this, 'Modal_ComponentSelectProps', {
                callback: (val) => this._callbackPhuongXaDK(val), item: this.state.SelectPhuongXaDK,
                title: 'Chọn Phường / Xã',
                AllThaoTac: this.state.dataPX, ViewItem: (item) => this._viewItemToChuc(item, 'Ma', 'Ten'), Search: true, key: 'Ten'
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn chưa chọn Huyện/Thành phố!', 'Xem lại')
        }
    }


    _callbackHuyenTP = (val) => {
        //setState
        this.setState({ selectHuyenTP: val }, () => this.LoadCBoByDieuKien(val))
    }

    _dropDownHuyenTP = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this._callbackHuyenTP(val), item: this.state.selectHuyenTP,
            title: 'Chọn Huyện / Thành Phố',
            AllThaoTac: this.state.dataTP, ViewItem: (item) => this._viewItemToChuc(item, 'DonViID', 'TenDonVi'), Search: true, key: 'TenDonVi'
        })
    }

    _callbackHuyenTP_Recive = (val) => {
        //setState
        this.setState({ selectHuyenTP_Recive: val }, () => this.LoadCBoByDieuKien(val))
    }

    _dropDownHuyenTP_Recive = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this._callbackHuyenTP_Recive(val), item: this.state.selectHuyenTP_Recive,
            title: 'Chọn Huyện / Thành Phố',
            AllThaoTac: this.state.dataTP, ViewItem: (item) => this._viewItemToChuc(item, 'DonViID', 'TenDonVi'), Search: true, key: 'TenDonVi'
        })
    }

    _callbackPhuongXa = (val) => {
        //setState
        this.setState({ selectPhuongXa: val })
    }

    _dropDownPhuongXa = () => {
        if (this.state.selectHuyenTP && this.state.selectHuyenTP.DonViID) {
            Utils.goscreen(this, 'Modal_ComponentSelectProps', {
                callback: (val) => this._callbackPhuongXa(val), item: this.state.selectPhuongXa,
                title: 'Chọn Phường / Xã',
                AllThaoTac: this.state.dataPX, ViewItem: (item) => this._viewItemToChuc(item, 'Ma', 'Ten'), Search: true, key: 'Ten'
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn chưa chọn Huyện/Thành phố!', 'Xem lại')
        }
    }

    _callbackPhuongXa_Recive = (val) => {
        //setState
        this.setState({ selectPhuongXa_Recive: val })
    }

    _dropDownPhuongXa_Recive = () => {
        if (this.state.selectHuyenTP_Recive && this.state.selectHuyenTP_Recive.DonViID) {
            Utils.goscreen(this, 'Modal_ComponentSelectProps', {
                callback: (val) => this._callbackPhuongXa_Recive(val), item: this.state.selectPhuongXa_Recive,
                title: 'Chọn Phường / Xã',
                AllThaoTac: this.state.dataPX, ViewItem: (item) => this._viewItemToChuc(item, 'Ma', 'Ten'), Search: true, key: 'Ten'
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn chưa chọn Huyện/Thành phố!', 'Xem lại')
        }
    }

    handlePayment = () => {
        this.setState({ isPayment: !this.state.isPayment })
    }

    handleRecive = () => {
        this.setState({ isRecive: !this.state.isRecive })
    }

    handleNopHoSo = () => {
        this.checkLogin()
    }
    render() {
        const { dataChiTiet, selectGiayTo, hoten, sogiayto, isDichVu, HoSoDinhKem, isGui, selectHuyenTP, selectPhuongXa, DiaChi, GhiChu, loadingUpfile,
            selectHuyenTP_Recive, selectPhuongXa_Recive, DiaChi_Recive, isPayment, isRecive, isNopHoSo, DiaChiDangKy, SelectHuyenTPDK, SelectPhuongXaDK } = this.state;
        // Utils.nlog("dataChiTiet<>", dataChiTiet[0])
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={'Nộp hồ sơ trực tuyến'}
                    styleTitle={{ color: colors.white }}
                />
                <ScrollView style={{ flex: 1, padding: 10 }}>

                    {
                        isNopHoSo ?
                            <Fragment>
                                <View style={{ backgroundColor: colors.white, padding: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), paddingVertical: 5 }}>Đơn vị:
                                        <Text style={{ fontWeight: '400', fontSize: reText(14), }}> {dataChiTiet?.TenDonVi}</Text>
                                    </Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>Tên hồ sơ:
                                        <Text style={{ fontWeight: '400' }}> {dataChiTiet?.TenThuTuc}</Text>
                                    </Text>
                                </View>
                                <View pointerEvents={isGui ? 'none' : 'auto'} style={{ backgroundColor: colors.white, padding: 10, marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(18) }}>{'Thông tin đăng ký'}</Text>
                                    <InputRNCom
                                        styleContainer={{ paddingVertical: 5, marginBottom: 5 }}
                                        styleBodyInput={{
                                            borderColor: colors.blueGrey_20,
                                            minHeight: 40, alignSelf: 'center', paddingLeft: 15,
                                        }}
                                        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                                        editable={true}
                                        placeholder={"Nhập họ và tên"}
                                        styleInput={{ paddingLeft: 0 }}
                                        styleError={{ backgroundColor: 'white', }}
                                        styleHelp={{ backgroundColor: 'white', }}
                                        placeholderTextColor={colors.black_80}
                                        valid={true}
                                        labelText={'Họ và tên'}
                                        styleLabel={{ paddingVertical: 5, fontWeight: 'bold' }}
                                        prefix={null}
                                        value={hoten}
                                        onChangeText={(val) => {
                                            this.setState({ hoten: val })
                                        }}
                                    />
                                    <TouchableOpacity onPress={this._dropDownGiayTo}>
                                        <View pointerEvents={'none'}>
                                            <InputRNCom
                                                styleContainer={{}}
                                                styleBodyInput={{
                                                    borderColor: colors.colorGrayIcon,
                                                    borderWidth: 0.5,
                                                    minHeight: 40,
                                                    alignItems: 'center', paddingVertical: 0
                                                }}
                                                labelText={'Số giấy tờ'}
                                                styleLabel={{ fontWeight: 'bold', fontSize: reText(14), }}
                                                // sufixlabel={<View>
                                                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                // </View>}
                                                placeholder={"Chọn lĩnh vực"}
                                                styleInput={{ color: colors.black }}
                                                styleError={{ backgroundColor: 'white', }}
                                                styleHelp={{ backgroundColor: 'white', }}
                                                placeholderTextColor={colors.black_30k}
                                                editable={false}
                                                valid={true}
                                                prefix={null}
                                                value={selectGiayTo.TenGiayTo}
                                                // onChangeText={this._dropDownGiayTo}
                                                sufix={
                                                    <View style={{
                                                        height: 30, width: 30,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Image
                                                            // defaultSource={Images.icDropDown}
                                                            source={Images.icDropDown}
                                                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                    </View>
                                                }

                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <InputRNCom
                                        styleContainer={{ marginBottom: 5 }}
                                        styleBodyInput={{
                                            borderColor: colors.blueGrey_20,
                                            minHeight: 40, alignSelf: 'center', paddingLeft: 15,
                                        }}
                                        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                                        editable={true}
                                        placeholder={"Nhập số giấy tờ"}
                                        styleInput={{ paddingLeft: 0 }}
                                        styleError={{ backgroundColor: 'white', }}
                                        styleHelp={{ backgroundColor: 'white', }}
                                        placeholderTextColor={colors.black_80}
                                        valid={true}
                                        prefix={null}
                                        value={sogiayto}
                                        onChangeText={(val) => {
                                            this.setState({ sogiayto: val })
                                        }}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>Địa chỉ đăng ký</Text>
                                    <TouchableOpacity onPress={this._dropDownHuyenTPDK}>
                                        <View pointerEvents={'none'}>
                                            <InputRNCom
                                                styleContainer={{}}
                                                styleBodyInput={{
                                                    borderColor: colors.colorGrayIcon,
                                                    borderWidth: 0.5,
                                                    minHeight: 40,
                                                    alignItems: 'center', paddingVertical: 0,
                                                }}
                                                // labelText={'Huyện/Thị/TP'}
                                                styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: -15 }}
                                                // sufixlabel={<View>
                                                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                // </View>}
                                                placeholder={"Chọn huyện/thành phố"}
                                                styleInput={{ color: colors.black }}
                                                styleError={{ backgroundColor: 'white', }}
                                                styleHelp={{ backgroundColor: 'white', }}
                                                placeholderTextColor={colors.black_30k}
                                                editable={false}
                                                valid={true}
                                                prefix={null}
                                                value={SelectHuyenTPDK ? SelectHuyenTPDK?.TenDonVi : ''}
                                                // onChangeText={this._dropDownGiayTo}
                                                sufix={
                                                    <View style={{
                                                        height: 30, width: 30,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Image
                                                            // defaultSource={Images.icDropDown}
                                                            source={Images.icDropDown}
                                                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                    </View>
                                                }

                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this._dropDownPhuongXaDK}>
                                        <View pointerEvents={'none'}>
                                            <InputRNCom
                                                styleContainer={{}}
                                                styleBodyInput={{
                                                    borderColor: colors.colorGrayIcon,
                                                    borderWidth: 0.5,
                                                    minHeight: 40,
                                                    alignItems: 'center', paddingVertical: 0
                                                }}
                                                // labelText={'Địa chỉ'}
                                                styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: -15 }}
                                                // sufixlabel={<View>
                                                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                // </View>}
                                                placeholder={"Chọn phường/xã"}
                                                styleInput={{ color: colors.black }}
                                                styleError={{ backgroundColor: 'white', }}
                                                styleHelp={{ backgroundColor: 'white', }}
                                                placeholderTextColor={colors.black_30k}
                                                editable={false}
                                                valid={true}
                                                prefix={null}
                                                value={SelectPhuongXaDK ? SelectPhuongXaDK?.Ten : ''}
                                                // onChangeText={this._dropDownGiayTo}
                                                sufix={
                                                    <View style={{
                                                        height: 30, width: 30,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Image
                                                            // defaultSource={Images.icDropDown}
                                                            source={Images.icDropDown}
                                                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                    </View>
                                                }

                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <InputRNCom
                                        styleContainer={{ paddingVertical: 5, marginBottom: 5 }}
                                        styleBodyInput={{
                                            borderColor: colors.blueGrey_20,
                                            minHeight: 40, alignSelf: 'center', paddingLeft: 15
                                        }}
                                        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                                        editable={true}
                                        placeholder={"Số nhà/tên đường"}
                                        styleInput={{ paddingLeft: 0 }}
                                        styleError={{ backgroundColor: 'white', }}
                                        styleHelp={{ backgroundColor: 'white', }}
                                        placeholderTextColor={colors.black_80}
                                        valid={true}
                                        // labelText={'Họ và tên'}
                                        styleLabel={{ marginTop: -20 }}
                                        prefix={null}
                                        value={DiaChiDangKy}
                                        onChangeText={(val) => {
                                            this.setState({ DiaChiDangKy: val })
                                        }}
                                    />
                                    <Text style={{ fontSize: reText(14), fontStyle: 'italic', paddingVertical: 10 }}>{DiaChiDangKy ? DiaChiDangKy + ', ' : ''}{SelectPhuongXaDK ? SelectPhuongXaDK?.Ten + ',' : ''} {SelectHuyenTPDK ? SelectHuyenTPDK?.TenDonVi : ''}</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>Hình thức nộp</Text>
                                    <View style={{ marginTop: 10 }}>
                                        {/* <TouchableOpacity onPress={() => this.changeService(true)} style={{ flexDirection: 'row', alignSelf: 'flex-start', padding: 8 }}>
                                            <Image style={nstyles.nIcon16} source={isDichVu ? Images.icRadioCheck : Images.icRadioUnCheck} resizeMode='contain' />
                                            <Text style={{ paddingHorizontal: 5, fontSize: reText(14) }}>Dịch vụ công</Text>
                                        </TouchableOpacity> */}
                                        <TouchableOpacity onPress={() => this.changeService(!this.state.isDichVu)} style={{ flexDirection: 'row', alignSelf: 'flex-start', padding: 8 }}>
                                            <Image style={nstyles.nIcon16} source={isDichVu ? Images.icUnCheck : Images.icCheck} resizeMode='contain' />
                                            <Text style={{ paddingHorizontal: 5, fontSize: reText(14) }}>Dịch vụ tiếp nhận và chuyển phát kết quả</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        !isDichVu ?
                                            <View style={{}}>
                                                <TouchableOpacity onPress={this._dropDownHuyenTP}>
                                                    <View pointerEvents={'none'}>
                                                        <InputRNCom
                                                            styleContainer={{}}
                                                            styleBodyInput={{
                                                                borderColor: colors.colorGrayIcon,
                                                                borderWidth: 0.5,
                                                                minHeight: 40,
                                                                alignItems: 'center', paddingVertical: 0,
                                                            }}
                                                            labelText={'Địa chỉ lấy hồ sơ'}
                                                            styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: 10 }}
                                                            // sufixlabel={<View>
                                                            //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                            // </View>}
                                                            placeholder={"Chọn huyện/thành phố"}
                                                            styleInput={{ color: colors.black }}
                                                            styleError={{ backgroundColor: 'white', }}
                                                            styleHelp={{ backgroundColor: 'white', }}
                                                            placeholderTextColor={colors.black_30k}
                                                            editable={false}
                                                            valid={true}
                                                            prefix={null}
                                                            value={selectHuyenTP ? selectHuyenTP?.TenDonVi : ''}
                                                            // onChangeText={this._dropDownGiayTo}
                                                            sufix={
                                                                <View style={{
                                                                    height: 30, width: 30,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    <Image
                                                                        // defaultSource={Images.icDropDown}
                                                                        source={Images.icDropDown}
                                                                        style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                                </View>
                                                            }

                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={this._dropDownPhuongXa}>
                                                    <View pointerEvents={'none'}>
                                                        <InputRNCom
                                                            styleContainer={{}}
                                                            styleBodyInput={{
                                                                borderColor: colors.colorGrayIcon,
                                                                borderWidth: 0.5,
                                                                minHeight: 40,
                                                                alignItems: 'center', paddingVertical: 0
                                                            }}
                                                            // labelText={'Địa chỉ'}
                                                            styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: -15 }}
                                                            // sufixlabel={<View>
                                                            //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                            // </View>}
                                                            placeholder={"Chọn phường/xã"}
                                                            styleInput={{ color: colors.black }}
                                                            styleError={{ backgroundColor: 'white', }}
                                                            styleHelp={{ backgroundColor: 'white', }}
                                                            placeholderTextColor={colors.black_30k}
                                                            editable={false}
                                                            valid={true}
                                                            prefix={null}
                                                            value={selectPhuongXa ? selectPhuongXa.Ten : ''}
                                                            // onChangeText={this._dropDownGiayTo}
                                                            sufix={
                                                                <View style={{
                                                                    height: 30, width: 30,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    <Image
                                                                        // defaultSource={Images.icDropDown}
                                                                        source={Images.icDropDown}
                                                                        style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                                </View>
                                                            }

                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                                <InputRNCom
                                                    styleContainer={{ paddingVertical: 5, marginBottom: 5 }}
                                                    styleBodyInput={{
                                                        borderColor: colors.blueGrey_20,
                                                        minHeight: 40, alignSelf: 'center', paddingLeft: 15
                                                    }}
                                                    styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                                                    editable={true}
                                                    placeholder={"Số nhà/tên đường"}
                                                    styleInput={{ paddingLeft: 0 }}
                                                    styleError={{ backgroundColor: 'white', }}
                                                    styleHelp={{ backgroundColor: 'white', }}
                                                    placeholderTextColor={colors.black_80}
                                                    valid={true}
                                                    // labelText={'Họ và tên'}
                                                    styleLabel={{ marginTop: -20 }}
                                                    prefix={null}
                                                    value={DiaChi}
                                                    onChangeText={(val) => {
                                                        this.setState({ DiaChi: val })
                                                    }}
                                                />
                                                <Text style={{ fontSize: reText(14), fontStyle: 'italic', paddingVertical: 5 }}>{selectPhuongXa ? selectPhuongXa.Ten + ',' : ''} {selectHuyenTP ? selectHuyenTP?.TenDonVi : ''}</Text>
                                                <TouchableOpacity onPress={this._dropDownHuyenTP_Recive}>
                                                    <View pointerEvents={'none'}>
                                                        <InputRNCom
                                                            styleContainer={{}}
                                                            styleBodyInput={{
                                                                borderColor: colors.colorGrayIcon,
                                                                borderWidth: 0.5,
                                                                minHeight: 40,
                                                                alignItems: 'center', paddingVertical: 0,
                                                            }}
                                                            labelText={'Địa chỉ nhận hồ sơ'}
                                                            styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: 10 }}
                                                            // sufixlabel={<View>
                                                            //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                            // </View>}
                                                            placeholder={"Chọn huyện/thành phố"}
                                                            styleInput={{ color: colors.black }}
                                                            styleError={{ backgroundColor: 'white', }}
                                                            styleHelp={{ backgroundColor: 'white', }}
                                                            placeholderTextColor={colors.black_30k}
                                                            editable={false}
                                                            valid={true}
                                                            prefix={null}
                                                            value={selectHuyenTP_Recive ? selectHuyenTP_Recive.TenDonVi : ''}
                                                            // onChangeText={this._dropDownGiayTo}
                                                            sufix={
                                                                <View style={{
                                                                    height: 30, width: 30,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    <Image
                                                                        // defaultSource={Images.icDropDown}
                                                                        source={Images.icDropDown}
                                                                        style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                                </View>
                                                            }

                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={this._dropDownPhuongXa_Recive}>
                                                    <View pointerEvents={'none'}>
                                                        <InputRNCom
                                                            styleContainer={{}}
                                                            styleBodyInput={{
                                                                borderColor: colors.colorGrayIcon,
                                                                borderWidth: 0.5,
                                                                minHeight: 40,
                                                                alignItems: 'center', paddingVertical: 0
                                                            }}
                                                            // labelText={'Địa chỉ'}
                                                            styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: -15 }}
                                                            // sufixlabel={<View>
                                                            //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                            // </View>}
                                                            placeholder={"Chọn phường/xã"}
                                                            styleInput={{ color: colors.black }}
                                                            styleError={{ backgroundColor: 'white', }}
                                                            styleHelp={{ backgroundColor: 'white', }}
                                                            placeholderTextColor={colors.black_30k}
                                                            editable={false}
                                                            valid={true}
                                                            prefix={null}
                                                            value={selectPhuongXa_Recive ? selectPhuongXa_Recive.Ten : ''}
                                                            // onChangeText={this._dropDownGiayTo}
                                                            sufix={
                                                                <View style={{
                                                                    height: 30, width: 30,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}>
                                                                    <Image
                                                                        // defaultSource={Images.icDropDown}
                                                                        source={Images.icDropDown}
                                                                        style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                                </View>
                                                            }

                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                                <InputRNCom
                                                    styleContainer={{ paddingVertical: 5, marginBottom: 5 }}
                                                    styleBodyInput={{
                                                        borderColor: colors.blueGrey_20,
                                                        minHeight: 40, alignSelf: 'center', paddingLeft: 15
                                                    }}
                                                    styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                                                    editable={true}
                                                    placeholder={"Số nhà/tên đường"}
                                                    styleInput={{ paddingLeft: 0 }}
                                                    styleError={{ backgroundColor: 'white', }}
                                                    styleHelp={{ backgroundColor: 'white', }}
                                                    placeholderTextColor={colors.black_80}
                                                    valid={true}
                                                    // labelText={'Họ và tên'}
                                                    styleLabel={{ marginTop: -20 }}
                                                    prefix={null}
                                                    value={DiaChi_Recive}
                                                    onChangeText={(val) => {
                                                        this.setState({ DiaChi_Recive: val })
                                                    }}
                                                />
                                                <Text style={{ fontSize: reText(14), fontStyle: 'italic', paddingVertical: 5 }}>{selectPhuongXa_Recive ? selectPhuongXa_Recive.Ten + ',' : ''} {selectHuyenTP_Recive ? selectHuyenTP_Recive?.TenDonVi : ''}</Text>
                                                <TouchableOpacity onPress={this.handlePayment} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                                    <Image source={isPayment ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon16]} resizeMode='contain' />
                                                    <Text style={{ paddingLeft: 10, textAlign: 'justify' }}>{'Đăng ký nhận thu phí tại nhà (Nhân viên Bưu điện sẽ đến địa chỉ đăng ký để thu phí)'}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_GiaCuoc')}
                                                    style={{
                                                        marginHorizontal: 3,
                                                        marginTop: 10,
                                                        padding: 10,
                                                        borderWidth: 0.5,
                                                        borderRadius: 5,
                                                        borderColor: colors.brownGreyThree,
                                                        backgroundColor: 'rgba(97,97,97,0.1)',
                                                    }}>
                                                    <Text style={{ paddingLeft: 10, textAlign: 'justify', fontStyle: 'italic' }}>{'▶︎ Giá cước tham khảo'}</Text>
                                                </TouchableOpacity>

                                                {/* <InputRNCom
                                        styleContainer={{ paddingVertical: 5, marginBottom: 5 }}
                                        styleBodyInput={{
                                            borderColor: colors.blueGrey_20,
                                            minHeight: 40, alignSelf: 'center', paddingLeft: 15
                                        }}
                                        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                                        editable={true}
                                        placeholder={"Nhập ghi chú..."}
                                        styleInput={{ paddingLeft: 0 }}
                                        styleError={{ backgroundColor: 'white', }}
                                        styleHelp={{ backgroundColor: 'white', }}
                                        placeholderTextColor={colors.black_80}
                                        valid={true}
                                        labelText={'Ghi chú'}
                                        styleLabel={{ fontWeight: 'bold', fontSize: reText(14) }}
                                        prefix={null}
                                        value={GhiChu}
                                        onChangeText={(val) => {
                                            this.setState({ GhiChu: val })
                                        }}
                                    /> */}
                                            </View> : null
                                    }
                                </View>


                                {/* {FIle dinh kem} */}
                                <View pointerEvents={isGui ? 'none' : 'auto'} style={{ backgroundColor: colors.white, padding: 10, marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), marginBottom: 10, color: colors.orangCB }}>{'Danh sách hồ sơ kèm theo'}</Text>
                                    {
                                        HoSoDinhKem.length > 0 ?
                                            <>
                                                {
                                                    HoSoDinhKem.map((item, index) => {
                                                        return (
                                                            <Animatable.View animation={index % 2 == 0 ? 'slideInLeft' : 'slideInRight'} key={index}
                                                                style={{ marginBottom: 10 }}>
                                                                <View style={{ flexDirection: 'row', paddingRight: 15, backgroundColor: colors.white, }}>
                                                                    <Text style={{ marginRight: 5, fontSize: reText(14), fontWeight: 'bold' }}>{index + 1}.</Text>
                                                                    <View>
                                                                        <Text style={{ marginRight: 5, fontSize: reText(14), fontWeight: 'bold', textAlign: 'justify' }}>{item.TenHoSoKemTheo}</Text>
                                                                        {
                                                                            item.FileName && item.FilePath ?
                                                                                <TouchableOpacity onPress={() => this._handleDownloadForm(item)} activeOpacity={0.5} style={{ paddingVertical: 10, alignSelf: 'flex-start' }}>
                                                                                    <Text style={{ color: colors.colorBlueBT }}>{'Tải về biểu mẫu'}</Text>
                                                                                </TouchableOpacity>
                                                                                : null
                                                                        }
                                                                    </View>
                                                                </View>
                                                                {!isDichVu ? null :
                                                                    <View style={{ height: 130, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: colors.BackgroundHome }}>
                                                                        {
                                                                            item.ListFile.length > 0 ?
                                                                                <FlatList
                                                                                    showsHorizontalScrollIndicator={false}
                                                                                    horizontal
                                                                                    style={{ marginTop: 5, flex: 1 }}
                                                                                    data={item.ListFile}
                                                                                    renderItem={this.renderImage}
                                                                                    keyExtractor={(item, index) => index.toString()}
                                                                                /> : null
                                                                        }
                                                                        {
                                                                            item.ListFile.length > 0 ?
                                                                                <TouchableOpacity onPress={() => this.onDeleteFileHoSo(item)} style={{ padding: 10 }}>
                                                                                    <Text style={{ fontSize: reText(14), textDecorationLine: 'underline', color: colors.colorBlueBT }}>{'Xóa bộ hồ sơ'}</Text>
                                                                                </TouchableOpacity> : <TouchableOpacity onPress={() => this.choseFile_HoSo(item.HoSoKemTheoID)} style={{ padding: 10 }}>
                                                                                    <Text style={{ fontSize: reText(14), textDecorationLine: 'underline', color: colors.colorBlueBT }}>{'Đính kèm hồ sơ tại đây'}</Text>
                                                                                </TouchableOpacity>
                                                                        }
                                                                    </View>
                                                                }
                                                            </Animatable.View>
                                                        )
                                                    })
                                                }
                                            </>
                                            : null
                                    }

                                </View>
                                {
                                    isDichVu ?

                                        <View style={{ backgroundColor: colors.white, padding: 10, marginTop: 10 }}>
                                            <TouchableOpacity onPress={this.handleRecive} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                                <Image source={isRecive ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon16]} resizeMode='contain' />
                                                <Text style={{ paddingLeft: 10, textAlign: 'justify', lineHeight: 20 }}>{'Đăng ký trả kết quả tại nhà (Nhân viên Bưu điện sẽ đến địa chỉ bên dưới để trả kết quả)'}</Text>
                                            </TouchableOpacity>
                                            {
                                                isRecive ?
                                                    <Fragment>
                                                        <TouchableOpacity onPress={this._dropDownHuyenTP_Recive}>
                                                            <View pointerEvents={'none'}>
                                                                <InputRNCom
                                                                    styleContainer={{}}
                                                                    styleBodyInput={{
                                                                        borderColor: colors.colorGrayIcon,
                                                                        borderWidth: 0.5,
                                                                        minHeight: 40,
                                                                        alignItems: 'center', paddingVertical: 0,
                                                                    }}
                                                                    labelText={'Địa chỉ nhận hồ sơ'}
                                                                    styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: 10 }}
                                                                    // sufixlabel={<View>
                                                                    //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                                    // </View>}
                                                                    placeholder={"Chọn huyện/thành phố"}
                                                                    styleInput={{ color: colors.black }}
                                                                    styleError={{ backgroundColor: 'white', }}
                                                                    styleHelp={{ backgroundColor: 'white', }}
                                                                    placeholderTextColor={colors.black_30k}
                                                                    editable={false}
                                                                    valid={true}
                                                                    prefix={null}
                                                                    value={selectHuyenTP_Recive ? selectHuyenTP_Recive?.TenDonVi : ''}
                                                                    // onChangeText={this._dropDownGiayTo}
                                                                    sufix={
                                                                        <View style={{
                                                                            height: 30, width: 30,
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}>
                                                                            <Image
                                                                                // defaultSource={Images.icDropDown}
                                                                                source={Images.icDropDown}
                                                                                style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                                        </View>
                                                                    }

                                                                />
                                                            </View>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={this._dropDownPhuongXa_Recive}>
                                                            <View pointerEvents={'none'}>
                                                                <InputRNCom
                                                                    styleContainer={{}}
                                                                    styleBodyInput={{
                                                                        borderColor: colors.colorGrayIcon,
                                                                        borderWidth: 0.5,
                                                                        minHeight: 40,
                                                                        alignItems: 'center', paddingVertical: 0
                                                                    }}
                                                                    // labelText={'Địa chỉ'}
                                                                    styleLabel={{ fontWeight: 'bold', fontSize: reText(14), marginTop: -15 }}
                                                                    // sufixlabel={<View>
                                                                    //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                                                                    // </View>}
                                                                    placeholder={"Chọn phường/xã"}
                                                                    styleInput={{ color: colors.black }}
                                                                    styleError={{ backgroundColor: 'white', }}
                                                                    styleHelp={{ backgroundColor: 'white', }}
                                                                    placeholderTextColor={colors.black_30k}
                                                                    editable={false}
                                                                    valid={true}
                                                                    prefix={null}
                                                                    value={selectPhuongXa_Recive ? selectPhuongXa_Recive.Ten : ''}
                                                                    // onChangeText={this._dropDownGiayTo}
                                                                    sufix={
                                                                        <View style={{
                                                                            height: 30, width: 30,
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}>
                                                                            <Image
                                                                                // defaultSource={Images.icDropDown}
                                                                                source={Images.icDropDown}
                                                                                style={{ width: 15, height: 15 }} resizeMode='contain' />
                                                                        </View>
                                                                    }

                                                                />
                                                            </View>
                                                        </TouchableOpacity>
                                                        <InputRNCom
                                                            styleContainer={{ paddingVertical: 5, marginBottom: 5 }}
                                                            styleBodyInput={{
                                                                borderColor: colors.blueGrey_20,
                                                                minHeight: 40, alignSelf: 'center', paddingLeft: 15
                                                            }}
                                                            styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
                                                            editable={true}
                                                            placeholder={"Số nhà/tên đường"}
                                                            styleInput={{ paddingLeft: 0 }}
                                                            styleError={{ backgroundColor: 'white', }}
                                                            styleHelp={{ backgroundColor: 'white', }}
                                                            placeholderTextColor={colors.black_80}
                                                            valid={true}
                                                            // labelText={'Họ và tên'}
                                                            styleLabel={{ marginTop: -20 }}
                                                            prefix={null}
                                                            value={DiaChi_Recive}
                                                            onChangeText={(val) => {
                                                                this.setState({ DiaChi_Recive: val })
                                                            }}
                                                        />
                                                        <Text style={{ fontSize: reText(14), fontStyle: 'italic', paddingVertical: 5 }}>{selectPhuongXa_Recive ? selectPhuongXa_Recive.Ten + ',' : ''} {selectHuyenTP_Recive ? selectHuyenTP_Recive?.TenDonVi : ''}</Text>
                                                        <TouchableOpacity onPress={this.handlePayment} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                                            <Image source={isPayment ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon16]} resizeMode='contain' />
                                                            <Text style={{ paddingLeft: 10, textAlign: 'justify' }}>{'Đăng ký nhận thu phí tại nhà (Nhân viên Bưu điện sẽ đến địa chỉ đăng ký để thu phí)'}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_GiaCuoc')}
                                                            style={{
                                                                marginHorizontal: 3,
                                                                marginTop: 10,
                                                                padding: 10,
                                                                borderWidth: 0.5,
                                                                borderRadius: 5,
                                                                borderColor: colors.brownGreyThree,
                                                                backgroundColor: 'rgba(97,97,97,0.1)',
                                                            }}>
                                                            <Text style={{ paddingLeft: 10, textAlign: 'justify', fontStyle: 'italic' }}>{'▶︎ Giá cước tham khảo'}</Text>
                                                        </TouchableOpacity>
                                                    </Fragment>
                                                    : null
                                            }
                                        </View>
                                        : null
                                }
                                {/* {Yêu cầu} */}
                                <View style={{ backgroundColor: colors.white, padding: 10, marginVertical: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), color: colors.orangCB }}>{'Yêu cầu'}</Text>
                                    <Text style={{ fontSize: reText(14), textAlign: 'justify', paddingVertical: 5 }}>I. Tập tin đính kèm phải quét từ bản chính</Text>
                                    <Text style={{ fontSize: reText(14), textAlign: 'justify', paddingVertical: 5 }}>II. Khi đến nhận kết quả hồ sơ tại Trung tâm
                                        Hành chính công, Ông/Bà nhớ mang theo:</Text>
                                    <Text style={{ fontSize: reText(12), textAlign: 'justify', paddingVertical: 5, marginLeft: 10, fontWeight: 'bold' }}>1. Giấy tờ tùy thân</Text>
                                    <Text style={{ fontSize: reText(12), textAlign: 'justify', paddingVertical: 5, marginLeft: 10, fontWeight: 'bold' }}>2. Bản chính các giấy tờ gửi qua mạng</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        {/* <TouchableOpacity onPress={isGui ? () => this.handleEditHoSo() : () => this.handleSaveSend()} activeOpacity={0.7}
                                            style={{ backgroundColor: colors.orangCB, padding: 10, alignItems: 'center', flex: 1, marginVertical: 10, borderRadius: 6 }}>
                                            <Text style={{ fontWeight: 'bold', color: colors.white }}>{isGui ? 'Sửa' : 'Lưu'}</Text>
                                        </TouchableOpacity>
                                        {
                                            isGui ?
                                                <TouchableOpacity onPress={this.handleSaveSend} activeOpacity={0.5} style={{ backgroundColor: colors.colorTextSelect, padding: 10, alignItems: 'center', flex: 1, marginVertical: 10, borderRadius: 6, marginLeft: 5 }}>
                                                    <Text style={{ fontWeight: 'bold', color: colors.white }}>{'Gửi hồ sơ'}</Text>
                                                </TouchableOpacity> : null
                                        } */}
                                        {/* <TouchableOpacity onPress={this.SaveThuTuc} activeOpacity={0.5} style={{ backgroundColor: colors.orangCB, padding: 10, alignItems: 'center', flex: 1, marginVertical: 10, borderRadius: 6, marginLeft: 5 }}>
                                            <Text style={{ fontWeight: 'bold', color: colors.white }}>{this.isBoSung == true ? 'Gửi bổ sung hồ sơ' : 'Gửis hồ sơ'}</Text>
                                        </TouchableOpacity> */}
                                        <ButtonCom
                                            text={this.isBoSung == true ? 'Gửi bổ sung hồ sơ' : 'Gửi hồ sơ'}
                                            onPress={this.SaveThuTuc}
                                            style={{ borderRadius: 5, flex: 1, }}
                                            txtStyle={{ fontSize: reText(14) }}
                                        />
                                    </View>

                                </View>
                            </Fragment> :
                            <Fragment>
                                <View style={{ backgroundColor: colors.white, padding: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), paddingVertical: 5 }}>Đơn vị:
                                        <Text style={{ fontWeight: '400', fontSize: reText(14), }}> {dataChiTiet?.TenDonVi}</Text>
                                    </Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>Tên hồ sơ:
                                        <Text style={{ fontWeight: '400' }}> {dataChiTiet?.TenThuTuc}</Text>
                                    </Text>
                                </View>
                                {/* {FIle dinh kem} */}
                                <View pointerEvents={isGui ? 'none' : 'auto'} style={{ backgroundColor: colors.white, padding: 10, marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), marginBottom: 10, color: colors.orangCB }}>{'Danh sách hồ sơ kèm theo'}</Text>
                                    {
                                        HoSoDinhKem && HoSoDinhKem.length > 0 ?
                                            <>
                                                {
                                                    HoSoDinhKem && HoSoDinhKem.map((item, index) => {
                                                        return (
                                                            <Animatable.View animation={index % 2 == 0 ? 'slideInLeft' : 'slideInRight'} key={index}
                                                                style={{ marginBottom: 10 }}>
                                                                <View style={{ flexDirection: 'row', paddingRight: 15, backgroundColor: colors.white, }}>
                                                                    <Text style={{ marginRight: 5, fontSize: reText(14), fontWeight: 'bold' }}>{index + 1}.</Text>
                                                                    <View>
                                                                        <Text style={{ marginRight: 5, fontSize: reText(14), fontWeight: 'bold', textAlign: 'justify' }}>{item.TenHoSoKemTheo}</Text>
                                                                        {
                                                                            item.FileName && item.FilePath ?
                                                                                <TouchableOpacity onPress={() => this._handleDownloadForm(item)} activeOpacity={0.5} style={{ paddingVertical: 10, alignSelf: 'flex-start' }}>
                                                                                    <Text style={{ color: colors.colorBlueBT }}>{'Tải về biểu mẫu'}</Text>
                                                                                </TouchableOpacity>
                                                                                : null
                                                                        }
                                                                    </View>
                                                                </View>
                                                            </Animatable.View>
                                                        )
                                                    })
                                                }
                                            </>
                                            : null
                                    }

                                </View>
                                <View style={{ backgroundColor: colors.white, padding: 10, marginVertical: 10 }}>
                                    <ButtonCom
                                        text={"Nộp hồ sơ"}
                                        onPress={this.handleNopHoSo}
                                        style={{ borderRadius: 5 }}
                                        txtStyle={{ fontSize: reText(14) }}
                                    />
                                </View>
                            </Fragment>
                    }

                </ScrollView>
                <IsLoading />
                {
                    loadingUpfile ?
                        <View style={{
                            justifyContent: 'center', alignItems: 'center',
                            position: 'absolute',
                            left: 0,
                            elevation: 99,
                            right: 0, bottom: 0, top: 0,
                            zIndex: 100,
                        }}>
                            <View style={{
                                opacity: 0.5, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                                backgroundColor: 'black'
                            }} />
                            <View style={{
                                justifyContent: 'center', alignItems: 'center', padding: 10,
                                // backgroundColor: 'white',
                                borderRadius: 10,
                                shadowColor: "#000000",
                                shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: {
                                    height: 2,
                                    width: 0
                                }, elevation: 3
                            }}>
                                <ActivityIndicator size="large" color={colors.white} />
                                <Text style={{ paddingVertical: 5, color: 'white', fontWeight: 'bold' }} >{this.state.statusLoading}</Text>
                            </View>
                        </View>
                        : null
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ChiTietThuTuc, mapStateToProps, true);
