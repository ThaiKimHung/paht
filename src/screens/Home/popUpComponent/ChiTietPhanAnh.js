import React, { Component, Fragment } from 'react';
import {
    View,
    ImageBackground,
    Image,
    Text,
    TouchableOpacity, TouchableHighlight,
    StyleSheet,
    Linking,
    TextInput,
    FlatList,
    Animated,
    ScrollView,
    BackHandler
} from 'react-native';
import { nstyles, colors, sizes } from '../../../../styles';
import { Images } from '../../../images';
import styles from '../styles';
import Utils from '../../../../app/Utils';
import { reSize, reText } from '../../../../styles/size';
import { appConfig } from '../../../../app/Config';
import apis from '../../../apis';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ListEmpty, IsLoading, HeaderCus } from '../../../../components';
import moment from 'moment';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import ModalLoading from '../../user/ModalLoading';
import HtmlViewCom from '../../../../components/HtmlView';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Keyboard } from 'react-native';
import { ListHinhAnhCom } from '../../Gui_PhanAnh/components/ListHinhAnh';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { Width } from '../../../../styles/styles';
import ImagePickerNew from '../../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import analytics from '@react-native-firebase/analytics';
import KeyAnalytics from '../../../../app/KeyAnalytics';
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus';
import FastImage from 'react-native-fast-image';
import { store } from '../../../../srcRedux/store';
import { ConfigOnline } from '../../../../app/ConfigOnline';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';


const DanhGia = [
    { key: 1, text: 'Hài lòng', img: Images.icHaiLong, img1: Images.icHaiLong1, count: '' },
    { key: 2, text: 'Chấp nhận', img: Images.icChapNhan, img1: Images.icChapNhan1, count: '' },
    { key: 0, text: 'Không hài lòng', img: Images.icKoHaiLong, img1: Images.icKoHaiLong1, count: '' },


];

class ChiTietPhanAnh extends Component {
    constructor(props) {
        super(props);
        this.IdPA = Utils.ngetParam(this, "IdPA", '');
        this.TenChuyenMuc = Utils.ngetParam(this, "TenChuyenMuc", '');
        this.SoLuongTuongTac = Utils.ngetParam(this, 'SoLuongTuongTac', 0)
        this.noidung = '';
        this.IdParent = '';
        this.login = Utils.getGlobal(nGlobalKeys.loginToken);
        this.isMuti_DanhGia = Utils.getGlobal(nGlobalKeys.MutiDanhGia, true);
        this.isGuiDGKhongHaiLong = Utils.getGlobal(nGlobalKeys.isGuiDGKhongHaiLong, false);
        this.IDUserCD = store.getState().auth?.userCD?.UserID;
        this.colorMes = true;
        this.isComment = this.isMuti_DanhGia || !this.isMuti_DanhGia && this.login != "";
        this.state = {
            detailPhanAnh: [],
            listDonViXuLy: [],
            modalVisible: false,
            tuongtac: false, // check phản ánh có dc bật tương tác để đánh giá và cmt hay không.
            DanhGiaTL: [],
            toggleNhapNoiDung: true,
            dataComent: [],
            IdRow: '',
            isLoading: true,
            webViewHeight: 40,
            marginTop: new Animated.Value(50),
            message: 'Gửi thành công, vui lòng chờ admin duyệt phản hồi',
            options: false,
            pickImage: false,
            ListFileDinhKem: [],
            ListFileDinhKemNew: [],
            ListFileDinhKemDelete: [],
            status: 0,
            lstDSXPHC: [],
            NoiDungDanhGia: '',
            IsCheckNotHaiLong: -1,
        }
        this.InterVal;
        ROOTGlobal.dataGlobal._loadDataChiTietPa = (val) => this.setNewData(val)
    }
    setNewData = (IdPA) => {
        this.IdPA = IdPA;

        this.setState({
            detailPhanAnh: [],
            listDonViXuLy: [],
            modalVisible: false,
            tuongtac: false, // check phản ánh có dc bật tương tác để đánh giá và cmt hay không.
            DanhGiaTL: [],
            toggleNhapNoiDung: false,
            dataComent: [],
            IdRow: '',
            isLoading: true,
            webViewHeight: 40,
            marginTop: new Animated.Value(50),
            message: 'Gửi thành công, vui lòng chờ admin duyệt phản hồi',
            options: false,
            pickImage: false,
            ListFileDinhKem: [],
            ListFileDinhKemNew: [],
            ListFileDinhKemDelete: [],
            status: 0,
            NoiDungDanhGia: '',
            IsCheckNotHaiLong: -1,

        }, () => {
            this._getDetailPhanAnh();
            this._getListComent();
        })
    }
    componentDidMount() {
        this._getDetailPhanAnh();
        this._getListComent();
        // this.InterVal = setInterval(() => {
        //     this._getListComent();
        // }, 6000);
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            if (this.InterVal)
                clearInterval(this.InterVal);
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _getDetailPhanAnh = async () => {
        const res = await apis.ApiPhanAnh.GetDetail_PhanAnh(this.IdPA);
        if (res == -1 || res == -3) {
            this.setState({ isLoading: false });
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        } else
            if (res.status == 1 && res.data) {
                //-- Liên tục cập nhật commet
                await this._getListComent();
                Utils.nlog("ChiTiet PA XXXX:", res);

                //--
                const key = res.data.Status;
                if (key == 100 || key == 6) {
                    this.setState({ tuongtac: true, detailPhanAnh: res.data, DanhGiaTL: [res.data.DanhGia], isLoading: false, lstDSXPHC: res.data.DanhSachMaXPHC });
                } else {
                    this.setState({ detailPhanAnh: res.data, isLoading: false });
                };
            } else {
                Utils.nlog("ChiTiet PA XXXX:", res);
                this.setState({ isLoading: false });
                Utils.showMsgBoxOK(this, 'Thông báo', res.error ? res.error.message : 'Không tải được dữ liệu !', 'Xác nhận')

            };
    }

    _danhGiaHaiLong = (value, NoiDung = '') => async () => {
        await analytics().logEvent(KeyAnalytics.onpress_danhgia, {
            "data": value,
        })
        Utils.nlog('Gia tri vale', value)
        if (NoiDung == "" && this.isGuiDGKhongHaiLong && value == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần nhập nội dung phản hồi', 'Xác nhận');
            return;
        }
        const res = await apis.TuongTac.DanhGiaHaiLong(value, this.IdPA, NoiDung);
        if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        else
            if (res.status == 1) {
                this.setState({ DanhGiaTL: [value], IsCheckNotHaiLong: -1, NoiDungDanhGia: '' }, this._getDetailPhanAnh);
                Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Xác nhận')
            } else {
                if (this.login == '') {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
                } else
                    Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Xác nhận');
            };


    }

    _renderDanhGia = (item, index) => {
        const { detailPhanAnh, DanhGiaTL } = this.state
        // alert(DanhGiaTL)
        let res = detailPhanAnh?.DuLieuDanhGia ? detailPhanAnh.DuLieuDanhGia : null
        let isUser_DanhGia = -1;
        if (!this.isMuti_DanhGia || !res) {
            isUser_DanhGia = DanhGiaTL[0]; //TH này dùng cho option đánh giá 1 người
        } else {
            isUser_DanhGia = res.CdDanhGia;
        }

        // let isDaDanhGia = this.state.DanhGiaTL.includes(item.key) && this.login != "" && !this.isMuti_DanhGia ||
        const CountDG = () => {
            switch (item.key) {
                case 1:
                    if (DanhGiaTL[0] == 1 && res?.length == 0) return item.count = 1
                    return item.count = res?.CountHaiLong ? res.CountHaiLong : 0
                case 2:
                    if (DanhGiaTL[0] == 2 && res?.length == 0) return item.count = 1
                    return item.count = res?.CountChapNhan ? res.CountChapNhan : 0
                // return item.count = res?.CountChapNhan  ? res.CountChapNhan + 1 : 0
                case 0:
                    if (DanhGiaTL[0] == 0 && res?.length == 0) return item.count = 1
                    return item.count = res?.CountKhongHaiLong ? res.CountKhongHaiLong : 0
                // return item.count = res?.CountKhongHaiLong  ? res.CountKhongHaiLong + 1 : 0
                default:
                    break;
            }
        }
        CountDG();

        let isItemChoose = isUser_DanhGia == item.key && (this.login != "" || !this.isMuti_DanhGia);
        let isItemTextChoose = isItemChoose || this.isMuti_DanhGia && item.count != 0;

        return (
            <TouchableOpacity
                key={index} style={[{ flex: 1, alignItems: 'center' }]}
                onPress={item.key == 0 && this.isGuiDGKhongHaiLong ? this._CheckDanhGia : detailPhanAnh.Status == 6 || detailPhanAnh.Status == 100 ? this._danhGiaHaiLong(item.key) : () => { Utils.showMsgBoxOK(this, "Thông báo", "Chưa có kết quả xử lý \n nên bạn không được đánh giá kết quả ", "Xác nhận") }}>
                <Image source={isItemChoose ? item.img : item.img1} style={{}} resizeMode='contain' />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={[styles.text13, { textAlign: 'center', color: isItemTextChoose ? colors.colorRed : 'black', marginTop: 10 }]}>
                        {item.text}
                        <Text style={[styles.text13, { textAlign: 'center', marginTop: 10, marginLeft: 5, fontWeight: 'bold' }]} >
                            {isItemTextChoose && this.isMuti_DanhGia ? ` (${CountDG()})` : ''}
                        </Text>
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };

    _goBack = () => {
        clearInterval(this.InterVal)
        Utils.goback(this);
    };

    _showListHinhAnhXL = (arrImage = [], index = 0) => {
        if (arrImage.length != 0) {
            Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
        }
    }

    _showDanhSachFile = (arrLink = []) => {
        // this.setState({ modalVisible: true })
        Utils.goscreen(this, 'Modal_FileAttached', { data: arrLink })
    }

    _keyExtrac = (item, index) => index.toString();

    _renderListFile_HA = () => {

    }

    onOpenFile = (uri = '') => () => {
        let temp = uri.toLowerCase();
        if (temp.includes(".avi") || temp.includes(".mp4") || temp.includes(".mov") || temp.includes(".wmv") || temp.includes(".flv"))
            Utils.goscreen(this, 'Modal_PlayMedia', { source: uri });
        else
            Linking.openURL(uri);
    }

    _renderLichSuXuLy = (item, index) => {
        const { nrow } = nstyles.nstyles;
        const { LstDonViXuLy = [], ListHinhAnhXL = [] } = item;
        //--xử lý Lish Hình ảnh, File, Video
        let arrImg = [], arrLinkFile = [];
        ListHinhAnhXL.forEach(item => {
            const url = item.Link;
            let checkImage = Utils.checkIsImage(appConfig.domain + url);
            if (checkImage) {
                arrImg.push({
                    url: appConfig.domain + url
                })
            } else {
                arrLinkFile.push({ ...item, url: appConfig.domain + url, name: item.TenFile })
            }
        });
        const ngay = moment(item.NgayXuLy, "DD/MM/YYYY hh:mm").format("DD");
        const thang = moment(item.NgayXuLy, "DD/MM/YYYY hh:mm").format("MM");
        const nam = moment(item.NgayXuLy, "DD/MM/YYYY hh:mm").format("YYYY");
        const gio = moment(item.NgayXuLy, "DD/MM/YYYY hh:mm").format("HH:mm");
        const thoigian = gio + " " + ngay + " tháng " + thang + " ," + nam;
        return (
            <Fragment>
                <Text style={[styles.text14, { textAlign: 'center', fontWeight: 'bold', marginTop: 15 }]}>
                    {ConfigOnline.XULYPA_THEONHIEU_DV == 1 && item.TenDonVi ? item.TenDonVi : null}
                    {LstDonViXuLy.map((itemDV, indexDV) => <Text key={indexDV}>{itemDV.TenDonVi}{indexDV == LstDonViXuLy.length - 1 ? '' : ', '}</Text>)}
                </Text>
                <View style={[nrow, { alignItems: 'center', marginVertical: 10 }]}>
                    <Image source={Images.icDongHo} resizeMode='contain' />
                    <Text style={[styles.text12, { marginLeft: 5, color: colors.black_50 }]}>{thoigian}</Text>
                </View>

                <View style={{}}>
                    <HtmlViewCom html={item.NoiDungXL} style={{ height: '100%' }} />
                </View>
                <View style={{ height: 0.5, backgroundColor: colors.black_20, marginTop: 30 }}></View>

                {
                    arrLinkFile.length > 0 ?
                        <Fragment>
                            <View style={[nrow, { alignItems: 'center', marginTop: 10 }]}>
                                <View style={{ height: 4, width: 18, backgroundColor: colors.blue, alignSelf: 'center', marginVertical: 10 }} />
                                <Text style={[styles.text14, { marginLeft: 5, color: colors.black_60, fontWeight: '600' }]}>Tập tin đính kèm</Text>
                            </View>
                            <View style={[nrow]}>
                                <TouchableHighlight
                                    onPress={this.onOpenFile(arrLinkFile[0].url)}
                                    underlayColor={colors.backgroudFileActive}
                                    style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlue, backgroundColor: colors.backgroundFile, width: '80%' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={Images.icAttached} style={{ width: nstyles.Width(2), height: nstyles.Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                        <Text style={{ color: colors.colorBlueLight, width: nstyles.Width(55) }} numberOfLines={1}>{arrLinkFile[0].name}</Text>
                                    </View>
                                </TouchableHighlight>

                                {arrLinkFile.length > 1 ?
                                    <TouchableHighlight
                                        onPress={() => this._showDanhSachFile(arrLinkFile)}
                                        underlayColor={colors.backgroudFileActive}
                                        style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlue, backgroundColor: colors.backgroundFile, width: '18%', marginLeft: nstyles.Width(1) }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={Images.icAttached} style={{ width: nstyles.Width(2), height: nstyles.Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                            <Text style={{ color: colors.colorBlueLight, width: nstyles.Width(50) }}
                                                numberOfLines={1}>{'+'}{arrLinkFile.length - 1}</Text>
                                        </View>
                                    </TouchableHighlight> : null}
                            </View>
                            <View style={{ height: 5 }} />
                        </Fragment>
                        : null
                }
                {/* Hien thi hinh anh */}
                {
                    this.renderImgList(arrImg)
                }
            </Fragment >
        )
    }

    _writeComent = (isOpenMedia = false) => {
        if (this.login == '') Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
        else {
            if (isOpenMedia == true) {
                this.setState({ toggleNhapNoiDung: true, IdRow: '', options: true }, () => {
                    Keyboard.dismiss();
                    setTimeout(() => {
                        this.srollView.scrollToEnd(true);
                    }, 500);
                });
            } else
                this.setState({ toggleNhapNoiDung: true, IdRow: '' }, () => {
                    setTimeout(() => {
                        this.inputTuongTac.focus();
                    }, 200);
                });
        }
    }

    _replyComent = (IdRow) => {
        if (this.login == '') Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
        else {
            this.noidung = ''
            this.setState({ IdRow, toggleNhapNoiDung: false, IdRowEdit: '' }, () => setTimeout(() => {
                this.inputTuongTac.focus();
            }, 200));
        };
    }

    _submitComent = async () => {
        await analytics().logEvent(KeyAnalytics.onpress_cmt, {
            "data": this.IdPA
        })
        if (this.login == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận')
            return;
        }
        const IdRow = this.state.toggleNhapNoiDung ? 0 : this.state.IdRow;
        if (this.noidung) {
            nthisIsLoading.show();
            const listFileAdd = await this._handleListFileNew()
            if (this.state.IdRowEdit) {// trường hợp cập nhật edit cmt
                const res = await apis.TuongTac.CapNhatTuongTacCongDan(this.IdPA, this.state.IdRowEdit, this.noidung, listFileAdd);
                Utils.nlog('edit comment', res)
                nthisIsLoading.hide();
                if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
                else {
                    if (res) {
                        this.noidung = '';
                        this.setState({ IdRowEdit: '' });
                        await this._getListComent();
                    } else {
                        Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật tương tác thất bại, vui lòng thử lại', 'Xác nhận');
                    };
                };
            } else { // trường hợp Thêm mới
                //IdPA, NoiDung, IsCongDan, Status, IdParent, listFileAdd
                const res = await apis.TuongTac.TuongTacCanBoCongDan(this.IdPA, this.noidung, true, this.state.detailPhanAnh.Status, IdRow, listFileAdd);
                nthisIsLoading.hide();
                Utils.nlog('gui tuong tac', res)
                if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
                else {
                    if (this.state.IdRow) { // trường hợp trả lời comment
                        if (res.status == 0) {
                            // Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đóng');
                            Keyboard.dismiss()
                            this.colorMes = false;
                            this.setState({ message: res.error.message, IdRow: '' }, () => {
                                this._startAnimation(0);
                                setTimeout(() => {
                                    this._startAnimation(50);
                                }, 5000);
                            });
                        } else {
                            Keyboard.dismiss()
                            this.colorMes = true;
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                            this.setState({ IdRow: '' });
                        }
                    } else {//trường hợp viết comment mới
                        if (res.status == 0) {
                            Keyboard.dismiss()
                            this.colorMes = false;
                            this.setState({ message: res.error.message, IdRow: '', toggleNhapNoiDung: false }, () => {
                                this._startAnimation(0);
                                setTimeout(() => {
                                    this._startAnimation(50);
                                }, 5000);
                            });
                        } else {
                            Keyboard.dismiss()
                            this.colorMes = true;
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                            this.setState({ toggleNhapNoiDung: false, ListFileDinhKem: [] }, this._getListComent);
                        };
                    };
                    this.setState({
                        ListFileDinhKem: [], options: false,
                        pickImage: false,
                        ListFileDinhKem: [],
                        ListFileDinhKemNew: [],
                        ListFileDinhKemDelete: [],
                    }, () => { this.noidung = '' })
                };
            }
        } else {
            nthisIsLoading.hide();
            if (IdRow || IdRowEdit) {
                this.setState({ IdRow: '', IdRowEdit: '' });
            } else this.setState({ toggleNhapNoiDung: false, ListFileDinhKem: [] });
        };
    }

    onDelTuongTac = (IdRow) => () => {
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có chắc muốn xoá tương tác này không?", "Xoá", "Xem lại", async () => {
            nthisIsLoading.show();
            const res = await apis.TuongTac.XoaTuongTacCongDan(IdRow);
            nthisIsLoading.hide();
            if (res) {
                this._getListComent()
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Xoá tương tác thất bại, vui lòng thử lại', 'Xác nhận');
            }
        })
    }

    onEditTuongTac = (item, index) => async () => {
        if (this.state.IdRowEdit && this.state.IdRowEdit == item.IdRow) {
            this.noidung = '';
            this.setState({ IdRowEdit: '' });
        } else {
            this.noidung = item.NoiDung;
            //--Tạm thời chưa làm sửa Files
            // let arrFilesOld = Utils.cloneData(item.DSFileDinhKem);
            // for (let i = 0; i < arrFilesOld.length; i++) {
            //     const element = arrFilesOld[i];
            //     arrFilesOld[i].uri = element.Link;
            //     arrFilesOld[i].type = element.Type;
            // }
            this.setState({ IdRowEdit: item.IdRow, options: false }); //ListFileDinhKem: arrFilesOld
        };
    }


    _likeComent = (IdRow) => async () => {
        const { dataComent } = this.state;
        const res = await apis.TuongTac.LikeTuongTacCB(IdRow);
        // let newdata = []
        // // if (isChild) {
        // //     let dataTmp = dataComent.filter(i => i.IdRow == item.IdParent)
        // //     Utils.nlog('Gia ttri dataTmp', dataTmp[0]?.PhanHoi)
        // //     newdata = dataTmp[0]?.PhanHoi.map((i => {
        // //         if (i.IdRow == IdRow) {
        // //             Utils.nlog('Gia tri data New IIII', i)
        // //             return { ...i, isCheck: true }
        // //         }
        // //         else {
        // //             return { ...i };
        // //         }
        // //     }))
        // //     let tmp = dataTmp.
        // //     Utils.nlog('Gia tri tmp', tmp)
        // // }
        // // else {
        // newdata = dataComent.map((i => {
        //     if (i.IdRow == IdRow) {
        //         this.setState({ isLike: true })
        //         return { ...i, isCheck: true, }
        //     }
        //     else {
        //         return { ...i };
        //     }
        // }))
        // }
        this._getListComent();
        // Utils.nlog('Gia tri data New', newdata)
        // this.setState({ dataComentIsLike: newdata })
    }

    _getListComent = async () => {
        const res = await apis.TuongTac.DanhSachTuongTac(this.IdPA);
        this.SoLuongTuongTac = res.data && res.data.length ? res.data.length : 0
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
                let dataComent = res.data.filter(item => item.IdParent == 0);
                dataComent = dataComent.reverse();
                // Utils.nlog("DanhSachTuongTac -res:", dataComent, res);
                this.setState({ dataComent });

            } else {
                this.setState({ dataComent: [] });
            }
    }

    onShare = (idPA = 0, title = Utils.getGlobal(nGlobalKeys.TieuDe) + ' ' + Utils.getGlobal(nGlobalKeys.TenHuyen)) => () => {
        Utils.onShare(title, appConfig.linkWeb + 'vi/chi-tiet-phan-anh?id=' + idPA.toString());
    }

    renderInputRep = (val, isEdit = false) => {
        var { options, ListFileDinhKem = [], pickImage, status } = this.state
        if (val)
            return <>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5, flex: 1, marginLeft: this.state.IdRow == '' || isEdit ? 0 : 30 }]}>
                    {
                        isEdit ? null : // Hiện tại CMT KO cho EDIT FILES
                            <TouchableOpacity onPress={() => {
                                if (options) {
                                    this.setState({ options: false })
                                } else {
                                    this.setState({ options: true }, () => setTimeout(() => {
                                        if (this.state.IdRow == '')
                                            this.srollView.scrollToEnd(true);
                                    }, 500))
                                }
                            }} style={{ paddingRight: 10 }}>
                                <Image source={Images.icTabChuyenMuc} style={{ width: 25, height: 25 }} />
                            </TouchableOpacity>
                    }

                    <View style={{ backgroundColor: colors.black_11, flex: 1 }}>
                        <TextInput
                            ref={ref => this.inputTuongTac = ref}
                            style={[nstyles.nstyles.ntextinput, {
                                fontSize: reText(13), paddingHorizontal: 5,
                                paddingVertical: Platform.OS == 'android' ? 5 : 10,
                                maxHeight: 90
                            }]}
                            underlineColorAndroid='transparent'
                            placeholder={this.state.IdRow == '' ? 'Nhập bình luận...' : 'Nhập phản hồi...'}
                            onChangeText={text => this.noidung = text}
                            multiline
                        // onSubmitEditing={this._submitComent}
                        // autoFocus
                        >{this.noidung}</TextInput>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.colorBlueP, paddingVertical: 10, paddingHorizontal: 12,
                            justifyContent: 'center', alignItems: 'center', borderRadius: 3, marginLeft: 2
                        }}
                        onPress={this._submitComent}>
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>{isEdit ? "Sửa" : "Gửi"}</Text>
                    </TouchableOpacity>
                </View>
                {options ?
                    <Animatable.View animation={"fadeInUp"} style={{ borderRadius: 20 }}>
                        <ImagePickerNew
                            data={this.state.IdRowEdit ? ListFileDinhKem : []}
                            dataNew={!this.state.IdRowEdit ? ListFileDinhKem : []}
                            NumberMax={3}
                            isEdit={!this.isRead}
                            keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                            onDeleteFileOld={(data) => {
                                let dataNew = [].concat(this.state.ListFileDinhKemDelete).concat(data)
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
            </>
        return null;
    }

    _renderReplyComment = (item1, index1) => {
        let isCNNghiemThu = Utils.getGlobal(nGlobalKeys.ChucNangNghiemThu, {}).edit_delTuongTac;
        let isEditDel = item1.IsCongDan && isCNNghiemThu && item1.Creator == this.IDUserCD;
        let isEditSelect = item1.IdRow == this.state.IdRowEdit;
        const { dataComent } = this.state
        if (item1.HienThi)
            return (
                <Fragment key={item1.IdRow}>
                    <View style={stChiTietPA.containerComment}>
                        <Text style={[styles.text14, { color: colors.black_50 }]}>{item1.IsCongDan ? 'Công dân' + (isEditDel ? " (Tôi)" : "") : item1.TenCBorCD}</Text>
                        {
                            isEditSelect ? null : <Text style={styles.text13}>{item1.NoiDung}</Text>
                        }
                    </View>
                    {
                        isEditDel && isEditSelect ? this.renderInputRep(true, true) : null
                    }
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
                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5, marginLeft: 20 }]}>
                        <Text style={[styles.text12, { color: colors.black_50 }]}>{moment(item1.NgayGui, 'DD/MM/YYYY hh:mm').format('HH:mm DD/MM/YYYY ')}</Text>
                        <TouchableOpacity
                            onPress={this._likeComent(item1.IdRow)}
                            style={{ paddingHorizontal: 20, paddingRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={Images.icThich} style={{ tintColor: item1?.IsLike ? colors.softBlue : colors.black_50 }} />
                            <Text style={[styles.text12, { color: item1?.IsLike ? colors.softBlue : colors.black_50 }]}>{`Thích ${item1.Like == 0 ? '' : `(${item1.Like})`}`}</Text>
                        </TouchableOpacity>
                        {
                            isEditDel ?
                                <View style={{ borderWidth: 1, borderColor: colors.black_50, borderRadius: 4, flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={this.onEditTuongTac(item1, index1)}
                                        style={{ paddingHorizontal: 10, paddingVertical: 4, borderColor: colors.black_50, borderRightWidth: 1 }}>
                                        <Text style={[styles.text12, { color: colors.black_50 }]}>{isEditSelect ? 'Huỷ' : 'Sửa'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.onDelTuongTac(item1.IdRow)}
                                        style={{ paddingHorizontal: 10, paddingVertical: 4 }}>
                                        <Text style={[styles.text12, { color: colors.black_50 }]}>Xoá</Text>
                                    </TouchableOpacity>
                                </View>
                                : null
                        }
                    </View>
                    <View style={{ marginLeft: 15 }}>
                        {item1.PhanHoi.map(this._renderReplyComment)}
                    </View>
                </Fragment>
            )
        else return null;
    }

    _renderComent = ({ item, index }) => {
        let isCNNghiemThu = Utils.getGlobal(nGlobalKeys.ChucNangNghiemThu, {}).edit_delTuongTac;
        let isEditDel = item.IsCongDan && isCNNghiemThu && item.Creator == this.IDUserCD;
        let isEditSelect = item.IdRow == this.state.IdRowEdit;
        const { dataComent } = this.state
        // Utils.nlog('DANH GIA HAI LONG', item)
        if (item.IdParent == 0)
            return <View style={{ marginTop: 10 }} key={item.IdRow}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, alignSelf: 'flex-start', padding: 5, marginTop: 5 }}>
                    <Text style={[styles.text12, { fontWeight: '700' }]}>{item.IsCongDan ? 'Công dân' + (isEditDel ? " (Tôi)" : "") : item.TenCBorCD}</Text>
                    {
                        isEditSelect ? null : <Text style={styles.text13}>{item.NoiDung}</Text>
                    }
                </View>
                {
                    isEditDel && isEditSelect ? this.renderInputRep(true, true) : null
                }
                <View>
                    {item && item.DSFileDinhKem.length > 0 ?
                        <ListHinhAnhCom
                            buttonDelete={false}
                            buttonCamera={false}
                            link={true}
                            nthis={this}
                            ListHinhAnh={item.DSFileDinhKem} />
                        : null}
                </View>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5 }]}>
                    <Text style={[styles.text12, { color: colors.black_50 }]}>{moment(item.NgayGui, 'DD/MM/YYYY hh:mm').format('HH:mm DD/MM/YYYY')}</Text>
                    <TouchableOpacity
                        onPress={this._likeComent(item.IdRow)}
                        style={{ paddingHorizontal: 8, paddingVertical: 4, paddingLeft: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Images.icThich} style={{ tintColor: item?.IsLike ? colors.softBlue : null }} />
                        <Text style={[styles.text12, { color: item?.IsLike ? colors.softBlue : colors.black_50 }]}>{`Thích ${item.Like == 0 ? '' : `(${item.Like})`}`}</Text>
                    </TouchableOpacity>
                    {
                        !this.isComment ? null :
                            <TouchableOpacity
                                onPress={() => this._replyComent(item.IdRow)}
                                style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                                <Text style={[styles.text12, { color: colors.black_50 }]}>Phản hồi</Text>
                            </TouchableOpacity>
                    }
                    {
                        isEditDel ?
                            <View style={{ borderWidth: 1, borderColor: colors.black_50, borderRadius: 4, flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={this.onEditTuongTac(item, index)}
                                    style={{ paddingHorizontal: 10, paddingVertical: 4, borderColor: colors.black_50, borderRightWidth: 1 }}>
                                    <Text style={[styles.text12, { color: colors.black_50 }]}>{item.IdRow == this.state.IdRowEdit ? 'Huỷ' : 'Sửa'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onDelTuongTac(item.IdRow)}
                                    style={{ paddingHorizontal: 10, paddingVertical: 4 }}>
                                    <Text style={[styles.text12, { color: colors.black_50 }]}>Xoá</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                    }
                </View>
                { // phản hồi cmt
                    item.PhanHoi.map(this._renderReplyComment)
                }
                {
                    this.isComment && !this.state.IdRowEdit ? this.renderInputRep(item.IdRow == this.state.IdRow) : null
                }
            </View>
        else return null;
    }

    _keyExtracComent = (item) => item.IdRow.toString();
    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }

    _onWebViewMessage = (event: WebViewMessageEvent) => {
        this.setState({ webViewHeight: Number(event.nativeEvent.data) });
    }

    _openMap = (data) => () => {
        Utils.goscreen(this, "Modal_MapChiTietPA", { dataItem: data })
    }

    _startAnimation = (value) => {
        Animated.timing(this.state.marginTop, {
            toValue: value,
            duration: 100
        }).start();
    };

    renderImgList = (arrImg = [], urlVideoTitle = '') => {
        return (
            arrImg.length > 0 ?
                <TouchableOpacity onPress={() => this._showListHinhAnhXL(arrImg, 0)}>
                    <FastImage
                        source={{
                            uri: arrImg[0].url,
                            // headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.high,
                        }}//do đã kiểm tra ở ngoài trước khi render nên k cần kt lại
                        // defaultSource={Images.image}
                        style={{ width: '100%', height: nstyles.Width(50), }}
                    />
                    {
                        arrImg.length - 1 == 0 ? null :
                            <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: colors.black_50, padding: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: reText(15), paddingTop: 2 }}>+{arrImg.length - 1}</Text>
                            </View>
                    }
                </TouchableOpacity> : urlVideoTitle == '' ? null :
                    <View
                        style={{
                            justifyContent: 'center', alignItems: 'center'
                        }}
                    >
                        <Video source={{ uri: urlVideoTitle }}   // Can be a URL or a local file.
                            style={{
                                width: '100%', height: nstyles.Width(50), backgroundColor: colors.black,
                            }}
                            resizeMode='cover'
                            paused={true} />
                        <TouchableOpacity style={{ position: 'absolute' }}
                            onPress={() => Utils.goscreen(this, 'Modal_PlayMedia', { source: urlVideoTitle })}>
                            <Image style={{ tintColor: colors.white, width: 60, height: 60 }}
                                source={Images.icVideoBlack} />
                        </TouchableOpacity>
                    </View>

        )
    }

    //Xử lý các file thêm mới
    _handleListFileNew = async () => {
        const { ListFileDinhKemNew } = this.state;
        let arrFileNew = [], arrFileDelete = []
        if (ListFileDinhKemNew.length > 0) {
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                const element = ListFileDinhKemNew[index];
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



    handleAction = (item) => {
        switch (item.id) {
            case 1:
                this.setState({
                    pickImage: true,
                    options: false,

                }, () => {
                    this.refs.refAware.scrollToEnd()
                })
                break;
            default:
                break;
        }
    }

    onEdit = async () => {
        let {
            IdPA,
            NoiDung,
            DiaDiem,
            ToaDoX,
            ToaDoY,
            ListHinhAnh,
            MucDo,
            NameNoLogin = '',
            PhoneNoLogin = '',
            ChuyenMuc,
            IdChuyenMuc,
            CongKhai,
            IdLinhVuc,
            IdBoPhan,
            LinhVuc,
            TenPhuongXa
        } = this.state.detailPhanAnh;
        console.log('LOG item phan anh', this.state.detailPhanAnh)
        let tmpHinhAnh = [];
        for (let i = 0; i < ListHinhAnh.length; i++) {
            // Utils.nlog("dataLisstImage", ListHinhAnh[i])
            let item = ListHinhAnh[i];
            if (item.Type == 1) {
                let link = appConfig.domain + item.Path;
                if (link.split(".").pop().toLocaleUpperCase() == 'MP4' || link.split(".").pop().toLocaleUpperCase() == 'MOV') {
                    tmpHinhAnh.push({
                        ...item,
                        url: link,
                        uri: link,
                        // imagePart: { uri: link },
                        isOld: true,
                        video: true
                    })
                } else {
                    tmpHinhAnh.push({
                        ...item,
                        url: link,
                        uri: link,
                        // imagePart: { uri: link },
                        isOld: true
                    })
                }
            }
            else {
                let link = appConfig.domain + item.Path;
                tmpHinhAnh.push({
                    ...item,
                    url: link,
                    uri: link,
                    isOld: true,
                })
            }
        }

        let data = {
            IdPA: IdPA,
            diaDiem: DiaDiem,
            noiDungGui: NoiDung,
            ListHinhAnh: tmpHinhAnh,
            latlng: {
                latitude: ToaDoX,
                longitude: ToaDoY
            },
            MucDo,
            NameNoLogin,
            PhoneNoLogin,
            ChuyenMuc,
            IdChuyenMuc,
            CongKhai,
            IdLinhVuc,
            IdBoPhan,
            LinhVuc,
            TenPhuongXa
        }

        Utils.goscreen(this, 'Modal_TaoPhanAnh', { data: data, isEdit: 1 });
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataPA
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }


    _CheckDanhGia = () => {
        Utils.nlog('Vao Gui danh gia')
        this.setState({ IsCheckNotHaiLong: 0 })
    }

    renderEditButton = () => {
        const { detailPhanAnh } = this.state
        const { userCD, tokenCD = '' } = this.props.auth
        if (tokenCD.length > 0 && userCD.UserID == detailPhanAnh.NguoiGopY && detailPhanAnh.Status == 1) {
            return (
                <ButtonCus
                    textTitle={'Chỉnh sửa'}
                    onPressB={this.onEdit}
                    stContainerR={{ margin: 5 }}
                />
            )
        }
        return null
    }

    render() {
        const { tuongtac, isLoading, message, lstDSXPHC, IsCheckNotHaiLong, NoiDungDanhGia, dataComent, isLike } = this.state;
        const { nrow, nmiddle } = nstyles.nstyles;
        var data = this.state.detailPhanAnh;
        var { ListHinhAnh = [], LichSuXuLy = [], LstDonViXuLy = [], LichSuXuLyNhieuDonVi = [] } = this.state.detailPhanAnh;
        const ngayXL = data.HanXuLy ? moment(data.HanXuLy, 'DD/MM/YYYY').format('DD') : '-'
        const thangXL = data.HanXuLy ? moment(data.HanXuLy, 'DD/MM/YYYY').format('MM') : '-'
        const namXL = data.HanXuLy ? moment(data.HanXuLy, 'DD/MM/YYYY').format('YYYY') : '-'
        // const hanXL = data.HanXuLy ? moment(data.HanXuLy, 'DD/MM/YYYY').format('DD/MM/YYYY') : '---';
        const hanXL = ngayXL && thangXL && namXL ? ngayXL + " tháng " + thangXL + " ," + namXL : '---';
        // var listDonVi = [], listHinhAnh = [], test = []
        // LichSuXuLy.forEach((item) => {
        //     listDonVi = listDonVi.concat(item.LstDonViXuLy)
        //     listHinhAnh = listHinhAnh.concat(item.ListHinhAnhXL)
        // })
        let TieuDe = Utils.getGlobal(nGlobalKeys.TieuDe, '').toLowerCase()
        //--xử lý Lish Hình ảnh, File, Video
        let arrImg = [], arrLinkFile = [], urlVideoTitle = '';
        ListHinhAnh.forEach(item => {
            const url = item.Path;
            let checkImage = Utils.checkIsImage(item.Path);
            let checkVideo = Utils.checkIsVideo(item.Path);
            if (checkImage) {
                arrImg.push({
                    url: appConfig.domain + url
                })
            } else {
                arrLinkFile.push({ url: appConfig.domain + url, name: item.TenFile })
            }
            if (urlVideoTitle == '' && checkVideo) {
                urlVideoTitle = appConfig.domain + url;
            }
            // Utils.nlog("gia tri image chi tiết----------------", ListHinhAnh, arrLinkFile);
        });
        var { options, ListFileDinhKem = [], pickImage, status } = this.state
        Utils.nlog('Gia tri lst Danh sach dataComent', dataComent)
        // Utils.nlog('Gia Tri Key - Noi Dung', this.state.IsCheckNotHaiLong, NoiDungDanhGia)
        //----
        return (
            <View style={[nstyles.nstyles.ncontainerX, {
                backgroundColor: colors.white,
            }]}>
                {/* <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={colors.colorLinearButton}
                >
                    <View style={{
                        backgroundColor: colors.nocolor,
                        paddingTop: nstyles.paddingTopMul()
                    }}>
                        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 8, flexDirection: 'row' }}>
                            <View style={[nstyles.nstyles.nIcon35, { justifyContent: 'center', alignItems: 'center' }]}>
                                <TouchableOpacity
                                    style={{ padding: 10 }}
                                    onPress={this._goBack}>
                                    <Image
                                        source={Images.icBack}
                                        style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: reText(16), fontWeight: 'bold', flex: 1, color: colors.white, textAlign: 'center' }}>Chi tiết {TieuDe}</Text>
                            <View style={[nstyles.nstyles.nIcon35]}>
                            </View>
                        </View>
                    </View>
                </LinearGradient> */}
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => this._goBack()}
                    iconLeft={Images.icBack}
                    title={`Chi tiết ${TieuDe}`}
                    styleTitle={{ color: colors.white }}
                />

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 10, paddingHorizontal: 10, }}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ref={ref => this.srollView = ref}
                >
                    {/* Hien thi hinh anh */}
                    {/* <View> */}
                    {
                        this.renderImgList(arrImg, urlVideoTitle)
                    }
                    {/* </View> */}
                    {this.TenChuyenMuc ?
                        <View style={{
                            position: 'absolute', top: 0, left: 0,
                            borderRadius: 5, zIndex: 1000, padding: 10,
                        }}>
                            <Text numberOfLines={1} style={{
                                fontSize: reText(12), color: colors.white,
                                fontWeight: 'bold', backgroundColor: "#29658F",
                                padding: 5, borderRadius: 5, maxWidth: Width(70)
                            }}>
                                {this.TenChuyenMuc}
                            </Text>
                        </View> : null}
                    <View style={{
                        position: 'absolute', top: 0, right: 0,
                        borderRadius: 10, padding: 10
                    }}>
                        <Text style={[styles.text12, {
                            fontWeight: 'bold', backgroundColor: colors.black_20, padding: 5,
                            color: colors.white, borderRadius: 5
                        }]}>
                            {this.state.detailPhanAnh.TinhTrang}
                            {/* {
                                arrImg.length - 1 <= 0 ? null : this.state.detailPhanAnh.TinhTrang == "Mới" ?
                                    <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: reText(15) }}>{` \n +${arrImg.length - 1}`}</Text> : null
                            } */}
                        </Text>
                    </View>
                    <View style={{ marginTop: arrImg && arrImg.length == 0 ? 40 : null }}>
                        <Text numberOfLines={2} style={[styles.text16, { fontWeight: 'bold', marginTop: 10 }]}>{data.TieuDe}</Text>
                    </View>
                    <View style={{}}>
                        <Text numberOfLines={2} style={[styles.text12, { marginTop: 10, textAlign: 'right', fontWeight: 'bold' }]}>{data?.TenDVHienTai ? `Đơn vị: ${data?.TenDVHienTai} ` : ''}</Text>
                    </View>

                    <View style={{ paddingVertical: 10 }}>
                        {data.DiaDiem ? <View style={[nrow, { alignItems: 'center' }]}>
                            <Image source={Images.icDiaDiem} style={{ width: 15, height: 15 }} resizeMode='contain' />
                            <TouchableOpacity onPress={this._openMap(data)}>
                                <Text numberOfLines={2} style={[styles.text13, { color: colors.colorBlueP, marginLeft: 5, marginRight: 10 }]}>{data.DiaDiem}</Text>
                            </TouchableOpacity>
                        </View> : null}

                        <View style={{ marginTop: 5 }}>
                            {/* <HtmlViewCom html={data.NoiDung ? data.NoiDung : '<div> </div>'} style={{ height: '100%' }} /> */}
                            <AutoHeightWebViewCus style={{ width: '100%' }} scrollEnabled={false}
                                source={{ html: data.NoiDung ? data.NoiDung : '<div> </div>' }} textLoading={'Đang tải nội dung...'} />
                        </View>
                        {
                            this.renderEditButton()
                        }
                        {arrLinkFile.length > 0 ?
                            <Fragment>
                                <View style={[nrow, { alignItems: 'center', marginTop: 10 }]}>
                                    <View style={{ height: 4, width: 18, backgroundColor: colors.colorBlueP, alignSelf: 'center', marginVertical: 10 }} />
                                    <Text style={[styles.text14, { marginLeft: 5, color: colors.black_60, fontWeight: '600' }]}>Tập tin đính kèm</Text>
                                </View>
                                <View style={[nrow]}>
                                    <TouchableHighlight
                                        onPress={this.onOpenFile(arrLinkFile[0].url)}
                                        underlayColor={colors.backgroudFileActive}
                                        style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlueP, backgroundColor: colors.backgroundFile, width: '80%' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={Images.icAttached} style={{ width: nstyles.Width(2), height: nstyles.Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                            <Text style={{ color: colors.colorBlueLight, width: nstyles.Width(55) }} numberOfLines={1}>{arrLinkFile[0].name}</Text>
                                        </View>
                                    </TouchableHighlight>
                                    {arrLinkFile.length > 1 ?
                                        <TouchableHighlight
                                            onPress={() => this._showDanhSachFile(arrLinkFile)}
                                            underlayColor={colors.backgroudFileActive}
                                            style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlue, backgroundColor: colors.backgroundFile, width: '18%', marginLeft: nstyles.Width(1) }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={Images.icAttached} style={{ width: nstyles.Width(2), height: nstyles.Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                                <Text style={{ color: colors.colorBlueLight, width: nstyles.Width(50) }} numberOfLines={1}>{'+'}{arrLinkFile.length - 1}</Text>
                                            </View>
                                        </TouchableHighlight> : null}
                                </View>
                                <View style={{ height: 5 }} />
                            </Fragment>
                            : null
                        }
                        <View style={{ height: 0.5, backgroundColor: colors.colorGrayIcon, marginTop: 20 }}></View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.text12, { color: colors.colorRed, marginTop: 5 }]}>Hạn xử lý: </Text>
                                <Text style={[styles.text12, { color: colors.colorRed, marginTop: 5 }]}>{hanXL}</Text>
                            </View>
                        </View>
                    </View>
                    {
                        lstDSXPHC && lstDSXPHC.length ?
                            <>
                                <Text style={{ fontSize: reText(16), fontWeight: 'bold', color: colors.colorTextSelect }} >{`Danh sách xử phạt hành chính liên quan:`}</Text>
                                <FlatList
                                    data={lstDSXPHC}
                                    horizontal
                                    style={{ marginTop: 5 }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                style={{ backgroundColor: colors.colorTextSelect, marginRight: 10, borderRadius: 2 }}
                                                onPress={() => Utils.goscreen(this, 'Modal_XuPhatHC', { IdXuPhat: item.ID })} key={`${item.ID}`} >
                                                <Text style={{ padding: 10, textAlign: "center", color: colors.white }}>{item.MaDon}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => item.ID.toString()}
                                />
                            </>
                            : null
                    }


                    <View style={{
                        backgroundColor: '#FEF2F2', padding: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#EA6B6F', borderRadius: 5, marginTop: 10
                    }}>
                        {/* Render lịch sử xử lý */}
                        <FlatList
                            data={ConfigOnline.XULYPA_THEONHIEU_DV == 1 && LichSuXuLyNhieuDonVi?.length != 0 ? LichSuXuLyNhieuDonVi : LichSuXuLy}
                            renderItem={({ item, index }) => this._renderLichSuXuLy(item, index)}
                            keyExtractor={this._keyExtrac}
                        />
                        {tuongtac ? <View style={{ marginTop: 20, paddingBottom: 20 }}>
                            <Text style={[styles.text14, { fontWeight: '600', marginBottom: 10 }]}>Đánh giá kết quả</Text>
                            <View style={[nrow, { alignItem: 'center', marginTop: 10 }]}>
                                {DanhGia.map(this._renderDanhGia)}

                            </View>
                            {IsCheckNotHaiLong == 0 && this.isGuiDGKhongHaiLong ?
                                <TextInput
                                    style={[nstyles.nstyles.ntextinput, {
                                        fontSize: reText(13), paddingHorizontal: 5,
                                        paddingVertical: Platform.OS == 'android' ? 5 : 10,
                                        borderBottomWidth: 0.5, marginTop: 10, borderColor: colors.colorGrayLight
                                    }]}
                                    // underlineColorAndroid='transparent'
                                    placeholderTextColor={colors.redStar}
                                    placeholder={'Nhập lý do không hài lòng...'}
                                    onChangeText={text => this.setState({ NoiDungDanhGia: text })}
                                    returnKeyType='send'
                                    onSubmitEditing={this._danhGiaHaiLong(0, NoiDungDanhGia)}
                                    autoFocus
                                />
                                : null}
                        </View> : null}
                    </View>
                    {/* Bình luận đánh giá */}
                    <View style={{ paddingVertical: 10 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center', paddingVertical: 10
                        }}>
                            <Text style={[styles.text14, { fontWeight: '600', marginTop: 5 }]}>Bình luận đánh giá</Text>
                            <ImageBackground source={Images.icTinNhan} style={[nmiddle, {
                                width: sizes.reSize(28),
                                height: sizes.reSize(23), marginLeft: 10

                            }]} resizeMode='contain'>
                                <Text style={{ marginBottom: 5, fontSize: sizes.reText(10), color: this.SoLuongTuongTac == 0 ? null : colors.redStar, alignSelf: 'center' }}>{this.SoLuongTuongTac}</Text>
                            </ImageBackground>
                        </View>

                        <FlatList
                            keyboardShouldPersistTaps='always'
                            data={dataComent}
                            renderItem={this._renderComent}
                            keyExtractor={this._keyExtracComent}
                            ListEmptyComponent={<ListEmpty
                                style={[styles.text12, { color: colors.black_50, textAlign: 'center', marginTop: 20 }]}
                                textempty='Không có tương tác' />}
                            extraData={this.state.IdRow}
                        />
                        { // VIết coment
                            this.state.IdRowEdit ? null : (
                                this.isComment ?
                                    this.state.toggleNhapNoiDung ? this.renderInputRep(true) :
                                        <View style={[nrow, { alignItems: 'center', marginTop: 5 }]}>
                                            <TouchableOpacity onPress={() => {
                                                this._writeComent(true)
                                            }} style={{ paddingRight: 10 }}>
                                                <Image source={Images.icTabChuyenMuc} style={{ width: 25, height: 25 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={this._writeComent}
                                                style={{ width: "90%", backgroundColor: colors.black_11, paddingVertical: 10, paddingHorizontal: 5, borderRadius: 3 }}>
                                                <Text style={[{ fontSize: reText(13), color: colors.black_30 }]}>Nhập nội dung...</Text>
                                            </TouchableOpacity>
                                        </View>
                                    :
                                    this.state.IdRow || !this.isComment ? null :
                                        <View style={[nrow, { alignItems: 'center', marginTop: 5 }]}>
                                            <TouchableOpacity onPress={() => {
                                                this._writeComent(true)
                                            }} style={{ paddingRight: 10 }}>
                                                <Image source={Images.icTabChuyenMuc} style={{ width: 25, height: 25 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={this._writeComent}
                                                style={{ width: "90%", backgroundColor: colors.black_11, paddingVertical: 10, paddingHorizontal: 5, borderRadius: 3 }}>
                                                <Text style={[{ fontSize: reText(13), color: colors.black_30 }]}>Nhập nội dung...</Text>
                                            </TouchableOpacity>
                                        </View>
                            )
                        }
                    </View>

                </KeyboardAwareScrollView >
                <View style={[nrow, {
                    shadowOffset: { width: 0, height: 1 },
                    padding: 10, borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
                    flexDirection: 'row-reverse',
                }]}>
                    <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, backgroundColor: 'white', paddingHorizontal: 13, marginTop: this.state.marginTop }}>
                        <Text style={{ textAlign: 'center', color: this.colorMes ? colors.softBlue : 'red' }}>{message}</Text>
                    </Animated.View>
                </View>

                {/* {options ?
                    <Animatable.View animation={"fadeInUp"} style={{ borderRadius: 20 }}>
                        <ImagePickerNew
                            data={this.isEdit == 1 ? ListFileDinhKem : []}
                            dataNew={this.isEdit == -1 ? ListFileDinhKem : []}
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
                    </Animatable.View> : null} */}



                {
                    isLoading == true ? <ModalLoading enLoading={this._enLoading} /> : <View />
                }
                <IsLoading />
            </View >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(ChiTietPhanAnh, mapStateToProps, true);

const stChiTietPA = StyleSheet.create({
    tag: {
        position: 'absolute',
        backgroundColor: colors.colorBlueLight,
        padding: 10,
        paddingVertical: 5,
        marginLeft: 20,
        marginTop: nstyles.paddingTopMul() + 8
    },
    imageContain: {
        width: '100%',
        height: '100%',
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6,
        justifyContent: 'flex-end'
    },
    btnNhapND: {
        borderColor: colors.black_16,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 30
    },
    containerComment: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 10,
        marginLeft: 20
    }
})