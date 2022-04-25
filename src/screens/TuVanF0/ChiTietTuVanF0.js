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
import { nstyles, colors, sizes } from '../../../styles';
import { Images } from '../../images';
import styles from '../Home/styles';
import Utils from '../../../app/Utils';
import { reSize, reText } from '../../../styles/size';
import { appConfig } from '../../../app/Config';
import apis from '../../apis';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ListEmpty, IsLoading, HeaderCus, ButtonCom } from '../../../components';
import moment from 'moment';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import ModalLoading from '../user/ModalLoading';
import HtmlViewCom from '../../../components/HtmlView';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Keyboard } from 'react-native';
import { ListHinhAnhCom } from '../Gui_PhanAnh/components/ListHinhAnh';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { Height, Width } from '../../../styles/styles';
import ImagePickerNew from '../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import analytics from '@react-native-firebase/analytics';
import KeyAnalytics from '../../../app/KeyAnalytics';
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus';


const DanhGia = [
    { key: 1, text: 'Hài lòng', img: Images.icHaiLong, img1: Images.icHaiLong1, count: '' },
    { key: 2, text: 'Chấp nhận', img: Images.icChapNhan, img1: Images.icChapNhan1, count: '' },
    { key: 0, text: 'Không hài lòng', img: Images.icKoHaiLong, img1: Images.icKoHaiLong1, count: '' },


];

class ChiTietTuVanF0 extends Component {
    constructor(props) {
        super(props);
        this.IdPA = Utils.ngetParam(this, "IdPA", '');
        this.TenChuyenMuc = Utils.ngetParam(this, "TenChuyenMuc", '');
        this.SoLuongTuongTac = Utils.ngetParam(this, 'SoLuongTuongTac', 0)
        this.noidung = '';
        this.NoiDungGiupDo = ''
        this.IdParent = '';
        this.login = Utils.getGlobal(nGlobalKeys.loginToken);
        this.isMuti_DanhGia = Utils.getGlobal(nGlobalKeys.MutiDanhGia, true);
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
            //State an sinh
            ListFileDinhKemGiupDo: [],
            ListFileDinhKemNewGiupDo: [],
            ListFileDinhKemDeleteGiupDo: [],
        }
        this.refPickGiupDo = React.createRef(null)
        this.InterVal;
        ROOTGlobal.dataGlobal._loadDataChiTietTuVanF0 = (val) => this.setNewData(val)
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
        }, () => {
            this._getDetailPhanAnh();
            this._getListComent();
        })
    }
    componentDidMount() {
        this._getDetailPhanAnh();
        this._getListComent();
        this.InterVal = setInterval(() => {
            this._getListComent();
        }, 6000);
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
        Utils.nlog("[LOG] ChiTiet PA XXXX:", res);
        if (res == -1 || res == -3) {
            this.setState({ isLoading: false });
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        } else
            if (res.status == 1 && res.data) {
                //-- Liên tục cập nhật commet
                await this._getListComent();
                //--
                const key = res.data.Status;
                if (key == 100 || key == 6) {
                    this.setState({ tuongtac: true, detailPhanAnh: res.data, DanhGiaTL: [res.data.DanhGia], isLoading: false, lstDSXPHC: res.data.DanhSachMaXPHC });
                } else {
                    this.setState({ detailPhanAnh: res.data, isLoading: false });
                };
            } else {
                this.setState({ isLoading: false });
                Utils.showMsgBoxOK(this, 'Thông báo', res.error ? res.error.message : 'Không tải được dữ liệu !', 'Xác nhận')

            };
    }

    _danhGiaHaiLong = (value) => async () => {
        await analytics().logEvent(KeyAnalytics.onpress_danhgia, {
            "data": value,
        })
        const res = await apis.TuongTac.DanhGiaHaiLong(value, this.IdPA);
        if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        else
            if (res.status == 1) {
                this.setState({ DanhGiaTL: [value] }, this._getDetailPhanAnh);
            } else {
                if (this.login == '') {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
                } else
                    Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Xác nhận');
            };
        Utils.nlog(res)
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
                onPress={detailPhanAnh.Status == 6 || detailPhanAnh.Status == 100 ? this._danhGiaHaiLong(item.key) : () => { Utils.showMsgBoxOK(this, "Thông báo", "Chưa có kết quả xử lý \n nên bạn không được đánh giá kết quả ", "Xác nhận") }}>
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

                <Text style={[styles.text14, { textAlign: 'center', fontWeight: 'bold', marginTop: 10 }]}>
                    {LstDonViXuLy.map((item, index) => <Text key={index}>{item.TenDonVi}{index == LstDonViXuLy.length - 1 ? '' : ', '}</Text>)}
                </Text>
                <View style={[nrow, { alignItems: 'center', marginVertical: 10 }]}>
                    <Image source={Images.icDongHo} resizeMode='contain' />
                    <Text style={[styles.text12, { marginLeft: 5, color: colors.black_50 }]}>{thoigian}</Text>
                </View>

                < View style={{}}>
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
            this.setState({ IdRow, toggleNhapNoiDung: false }, () => setTimeout(() => {
                this.inputTuongTac.focus();
            }, 200));
        };
    }

    _submitComent = async () => {
        await analytics().logEvent(KeyAnalytics.onpress_cmt, {
            "data": this.IdPA
        })
        const { userCD } = this.props.auth
        const { detailPhanAnh } = this.state
        if (this.login == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận')
            return;
        }

        //Người khác
        const IdRow = this.state.toggleNhapNoiDung ? 0 : this.state.IdRow;
        if (this.noidung) {
            nthisIsLoading.show();
            const listFileAdd = await this._handleListFileNew()
            //IdPA, NoiDung, IsCongDan, Status, IdParent, listFileAdd
            Utils.nlog('[LOG] res vao tuong ta noidungc', this.noidung)
            Utils.nlog('[LOG] res vao tuong tac file', listFileAdd)
            const res = await apis.TuongTac.TuongTacCanBoCongDan_TuVanF0(this.IdPA, this.noidung, true, this.state.detailPhanAnh.Status, IdRow, listFileAdd);
            nthisIsLoading.hide();
            Utils.nlog('gui tuong tac', res)
            if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
            else {
                if (this.state.IdRow) { // trường hợp trả lời comment
                    if (res.status == 0) {
                        // Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đóng');
                        Keyboard.dismiss()
                        this.colorMes = false;
                        this.setState({ message: res?.error?.message || 'Có lỗi trong quá trình gửit tương tác.', IdRow: '' }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                        });
                    } else {
                        Keyboard.dismiss()
                        this.colorMes = true;
                        this.setState({ message: res?.error?.message || 'Gửi thành công, vui lòng chờ admin duyệt phản hồi', IdRow: '' }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                        });
                    }
                } else {//trường hợp viết comment mới
                    if (res.status == 0) {
                        Keyboard.dismiss()
                        this.colorMes = false;
                        this.setState({ message: res?.error?.message || 'Có lỗi trong quá trình gửi tương tác', IdRow: '', toggleNhapNoiDung: false }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                        });
                    } else {
                        Keyboard.dismiss()
                        this.colorMes = true;
                        this.setState({ message: res?.error?.message || 'Gửi thành công, vui lòng chờ admin duyệt phản hồi', IdRow: '' }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                            this.setState({ toggleNhapNoiDung: false, ListFileDinhKem: [] }, this._getListComent);
                        });

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
        } else {
            nthisIsLoading.hide();
            if (IdRow) {
                this.setState({ IdRow: '' });
            } else this.setState({ toggleNhapNoiDung: false, ListFileDinhKem: [] });
        };
    }

    onHelp = async () => {
        if (this.login == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận')
            return;
        }
        if (!this.NoiDungGiupDo) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng nhập nội dung giúp đỡ', 'Xác nhận')
            return;
        }
        if (this.NoiDungGiupDo) {
            nthisIsLoading.show();
            let listFileAdd = await this._handleListFileNewGiupDo()
            //IdPA, NoiDung, IsCongDan, Status, IdParent, listFileAdd
            let strBody = {
                "idRow": 0,//Id ticket giúp đỡ k cacn truyen
                "idParent": 0,//phản hồi cho ticket giúp đỡ nào k can truyen
                "IdPA": this.IdPA,
                "noiDung": this.NoiDungGiupDo,
                "IsCongDan": true,
                "status": 1,
                "UploadFile": listFileAdd,
            }
            Utils.nlog('[LOG] res body', strBody)
            const res = await apis.TuongTac.GiupDoYeuCau(strBody);
            nthisIsLoading.hide();
            Utils.nlog('[LOG] gui giup do', res)
            if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
            else {
                this.refInputGiupDo.clear()
                this.refPickGiupDo.current.refreshData()
                this.setState({
                    ListFileDinhKemGiupDo: [],
                    ListFileDinhKemNewGiupDo: [],
                    ListFileDinhKemDeleteGiupDo: []

                }, () => { this.NoiDungGiupDo = '' })
                if (res.status == 0) {
                    Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message || 'Gửi giúp đỡ thất bại.', 'Xác nhận', () => {
                        this._getDetailPhanAnh()
                    })

                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message || 'Gửi giúp đỡ thành công.', 'Xác nhận', () => {
                        this._getDetailPhanAnh()
                    })
                };
            };
        }
    }

    _likeComent = (IdRow) => async () => {
        const res = await apis.TuongTac.LikeTuongTacCB(IdRow);

        this._getListComent();
    }

    _getListComent = async () => {

        const res = await apis.TuongTac.DanhSachTuongTac_TuVanF0(this.IdPA);
        Utils.nlog("[LOG] res tuong tac:", res);
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
                Utils.nlog("[LOG] dataComent:", dataComent);
                this.setState({ dataComent });

            } else {
                this.setState({ dataComent: [] });
            }
    }

    onShare = (idPA = 0, title = Utils.getGlobal(nGlobalKeys.TieuDe) + ' ' + Utils.getGlobal(nGlobalKeys.TenHuyen)) => () => {
        Utils.onShare(title, appConfig.linkWeb + 'vi/chi-tiet-phan-anh?id=' + idPA.toString());
    }

    renderInputRep = (val) => {
        const { userCD } = this.props.auth
        var { options, ListFileDinhKem = [], pickImage, status, detailPhanAnh } = this.state
        if (val && detailPhanAnh?.Status != 6)
            return <>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5, flex: 1, marginLeft: this.state.IdRow == '' ? 0 : 30 }]}>
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

                    <View style={{ backgroundColor: colors.black_11, flex: 1 }}>
                        <TextInput
                            ref={ref => this.inputTuongTac = ref}
                            style={[nstyles.nstyles.ntextinput, {
                                fontSize: reText(13), paddingHorizontal: 5,
                                paddingVertical: Platform.OS == 'android' ? 5 : 10,
                            }]}
                            underlineColorAndroid='transparent'
                            placeholder={this.state.IdRow == '' ? 'Nhập bình luận...' : 'Nhập phản hồi...'}
                            onChangeText={text => this.noidung = text}
                            returnKeyType='done'
                        // onSubmitEditing={this._submitComent}
                        // autoFocus
                        />
                    </View>
                    <TouchableOpacity
                        style={{ backgroundColor: colors.colorBlueP, paddingVertical: 10, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 3, marginLeft: 2 }}
                        onPress={this._submitComent}>
                        <Text style={{ color: colors.white }}>Gửi</Text>
                    </TouchableOpacity>
                </View>
                {options ?
                    <Animatable.View animation={"fadeInUp"} style={{ borderRadius: 20, marginLeft: this.state.IdRow == '' ? 0 : 20 }}>
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
                    </Animatable.View> : null}
            </>
        return null;
    }

    _renderReplyComment = (item1) => {
        if (item1.HienThi)
            return (
                <Fragment key={item1.IdRow}>
                    <View style={stChiTietPA.containerComment}>
                        <Text style={[styles.text14, { color: colors.black_50 }]}>{item1.IsCongDan ? 'Công dân' : item1.TenCBorCD}</Text>
                        <Text style={styles.text13}>{item1.NoiDung}</Text>
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
                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5, marginLeft: 20 }]}>
                        <Text style={[styles.text12, { color: colors.black_50 }]}>{moment(item1.NgayGui, 'DD/MM/YYYY hh:mm').format('HH:mm DD/MM/YYYY ')}</Text>
                        <TouchableOpacity
                            onPress={this._likeComent(item1.IdRow)}
                            style={{ paddingHorizontal: 20, paddingRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={Images.icThich} />
                            <Text style={[styles.text12, { color: colors.black_50 }]}>{`Thích ${item1.Like == 0 ? '' : `(${item1.Like})`}`}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 15 }}>
                        {item1.PhanHoi.map(this._renderReplyComment)}
                    </View>
                </Fragment>
            )
        else return null;
    }

    _renderComent = ({ item, index }) => {
        Utils.nlog('DANH GIA HAI LONG', item)
        if (item.IdParent == 0)
            return <View style={{ marginTop: 10 }} key={item.IdRow}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, alignSelf: 'flex-start', padding: 5, marginTop: 5 }}>
                    <Text style={[styles.text12, { fontWeight: '700' }]}>{item.IsCongDan ? 'Công dân' : item.TenCBorCD}</Text>
                    <Text style={styles.text13}>{item.NoiDung}</Text>
                </View>
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
                        style={{ paddingHorizontal: 20, paddingRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Images.icThich} />
                        <Text style={[styles.text12, { color: colors.black_50 }]}>{`Thích ${item.Like == 0 ? '' : `(${item.Like})`}`}</Text>
                    </TouchableOpacity>
                    {
                        !this.isComment ? null :
                            <TouchableOpacity
                                onPress={() => this._replyComent(item.IdRow)}
                                style={{ paddingHorizontal: 10 }}>
                                <Text style={[styles.text12, { color: colors.black_50 }]}>Phản hồi</Text>
                            </TouchableOpacity>
                    }
                </View>
                { // phản hồi cmt
                    item.PhanHoi.map(this._renderReplyComment)
                }
                {
                    this.isComment ? this.renderInputRep(item.IdRow == this.state.IdRow) : null
                }
            </View>
        else return null;
    }
    _keyExtracComent = (item) => item.IdRow.toString();
    _enLoading = () => {
        this.setState({ isLoading: !this.state.isLoading })
    }

    _onWebViewMessage = (event) => {
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
                    <Image source={{ uri: arrImg[0].url }} style={{ width: '100%', height: nstyles.Width(50), }} />
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

    //Xử lý các file thêm mới giúp đỡ
    _handleListFileNewGiupDo = async () => {
        const { ListFileDinhKemNewGiupDo } = this.state;
        let arrFileNew = [], arrFileDelete = []
        if (ListFileDinhKemNewGiupDo.length > 0) {
            for (let index = 0; index < ListFileDinhKemNewGiupDo.length; index++) {
                const element = ListFileDinhKemNewGiupDo[index];
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



    render() {
        const { userCD } = this.props.auth
        const { tuongtac, isLoading, message, lstDSXPHC, detailPhanAnh, ListFileDinhKemGiupDo, ListFileDinhKemNewGiupDo, ListFileDinhKemDeleteGiupDo } = this.state;
        const { nrow, nmiddle } = nstyles.nstyles;
        var data = this.state.detailPhanAnh;
        var { ListHinhAnh = [], LichSuXuLy = [], LstDonViXuLy = [] } = this.state.detailPhanAnh;
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
        const ngay = moment(data.NgayGui, "DD/MM/YYYY hh:mm").format("DD");
        const thang = moment(data.NgayGui, "DD/MM/YYYY hh:mm").format("MM");
        const gio = moment(data.NgayGui, "DD/MM/YYYY hh:mm").format("HH:mm");
        const nam = moment(data.NgayGui, "DD/MM/YYYY hh:mm").format("YYYY");;
        const thoigian = ngay + " tháng " + thang + " lúc " + gio + ", " + nam
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
        Utils.nlog('Gia tri lst Danh sach XPHC ====>>>>>>>>>>>>', lstDSXPHC)
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
                    title={`Chi tiết tư vấn F0`}
                    styleTitle={{ color: colors.white }}
                />

                <KeyboardAwareScrollView
                    // keyboardShouldPersistTaps='always'
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
                    <View style={{
                        position: 'absolute', top: 0, left: 0,
                        borderRadius: 5, zIndex: 1000, padding: 10,
                    }}>
                        <Text numberOfLines={1} style={{
                            fontSize: reText(12), color: colors.white,
                            fontWeight: 'bold', backgroundColor: "#29658F",
                            padding: 5, borderRadius: 5, maxWidth: Width(70)
                        }}>
                            {data?.TenPhuongXa ? data?.TenPhuongXa : '-'}
                        </Text>
                    </View>
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

                    <View style={{ marginTop: arrImg && arrImg.length == 0 ? 40 : 10 }}>
                        <Text style={[styles.text16, { fontWeight: 'bold', marginTop: 10, textAlign: 'justify' }]}>{data?.TieuDe?.toString().trim()}</Text>
                    </View>
                    <Text style={{ fontStyle: 'italic', color: colors.black_40, marginTop: 5 }}>{data?.NgayGui ? thoigian : '-'}</Text>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between', paddingVertical: 5
                    }}>
                        <Text style={{ flex: 1, paddingRight: 15 }} numberOfLines={1}>{data?.FullName ? data?.FullName : '-'}</Text>
                        <Text style={{}}>Liên hệ: {data?.PhoneNumber ? data?.PhoneNumber : '-'}</Text>
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
                        {/* {
                            detailPhanAnh?.Status != 6 && detailPhanAnh?.Status != 99 && userCD?.UserID != detailPhanAnh?.NguoiGopY && userCD?.UserID && detailPhanAnh?.NguoiGopY &&
                            <View style={{ backgroundColor: '#F500003A', padding: 5, borderRadius: 5, marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: colors.redStar, fontSize: reText(15) }}>{`Số người đã giúp đỡ: ${detailPhanAnh?.SoLuong ? detailPhanAnh?.SoLuong : 0}`}</Text>
                                <TextInput
                                    multiline={true}
                                    style={{
                                        maxHeight: Height(10), minHeight: Height(10), textAlignVertical: 'top',
                                        padding: 8, borderRadius: 5, marginTop: 10, backgroundColor: colors.white
                                    }}
                                    placeholder={'Nhập nội dung giúp đỡ...'}
                                    onChangeText={text => this.NoiDungGiupDo = text}
                                    ref={ref => this.refInputGiupDo = ref}
                                />
                                <View style={{ width: '100%' }}>
                                    <ImagePickerNew
                                        styleContainer={{ paddingHorizontal: 0 }}
                                        styleMenu={{ backgroundColor: 'white' }}
                                        data={this.isEdit == 1 ? ListFileDinhKemGiupDo : []}
                                        dataNew={this.isEdit == -1 ? ListFileDinhKemGiupDo : []}
                                        ref={this.refPickGiupDo}
                                        NumberMax={8}
                                        isEdit={true}
                                        keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                                        onDeleteFileOld={(data) => {
                                            let dataNew = [].concat(ListFileDinhKemDeleteGiupDo).concat(data)
                                            this.setState({ ListFileDinhKemDeleteGiupDo: dataNew })
                                        }}
                                        onAddFileNew={(data) => {
                                            Utils.nlog("Data list image mớ giup do", data)
                                            this.setState({ ListFileDinhKemNewGiupDo: data })
                                        }}
                                        onUpdateDataOld={(data) => {
                                            this.setState({ ListFileDinhKemGiupDo: data })
                                        }}
                                        isPickOne={true}
                                    />
                                </View>
                                <ButtonCom
                                    onPress={() => { this.onHelp() }}
                                    Linear={true}
                                    colorChange={[colors.redStar, colors.redStar]}
                                    shadow={false}
                                    txtStyle={{ color: colors.white, fontSize: reText(13) }}
                                    style={{
                                        margin: Height(1), borderRadius: 5,
                                        alignSelf: 'center',
                                        width: Width(40)
                                    }}
                                    text={'Giúp đỡ'}
                                />
                            </View>
                        } */}
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
                            data={LichSuXuLy}
                            renderItem={({ item, index }) => this._renderLichSuXuLy(item, index)}
                            keyExtractor={this._keyExtrac}
                        />
                        {tuongtac ? <View style={{ marginTop: 20, paddingBottom: 20 }}>
                            <Text style={[styles.text14, { fontWeight: '600', marginBottom: 10 }]}>Đánh giá kết quả</Text>
                            <View style={[nrow, { alignItem: 'center', marginTop: 10 }]}>
                                {DanhGia.map(this._renderDanhGia)}
                            </View>
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
                            data={this.state.dataComent}
                            renderItem={this._renderComent}
                            keyExtractor={this._keyExtracComent}
                            ListEmptyComponent={<ListEmpty
                                style={[styles.text12, { color: colors.black_50, textAlign: 'center', marginTop: 20 }]}
                                textempty='Không có tương tác' />}
                            extraData={this.state.IdRow}
                        />
                        { // VIết coment
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
    theme: state.theme,
    auth: state.auth
});
export default Utils.connectRedux(ChiTietTuVanF0, mapStateToProps)

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