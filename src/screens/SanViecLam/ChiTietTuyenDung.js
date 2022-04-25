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
import Utils, { icon_typeToast } from '../../../app/Utils';
import { reSize, reText } from '../../../styles/size';
import { appConfig } from '../../../app/Config';
import apis from '../../apis';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ListEmpty, IsLoading, HeaderCus, ButtonCom } from '../../../components';
import moment from 'moment';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import ModalLoading from '../user/ModalLoading';
import Video from 'react-native-video';
import { Keyboard } from 'react-native';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import analytics from '@react-native-firebase/analytics';
import KeyAnalytics from '../../../app/KeyAnalytics';
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus';

class ChiTietTuyenDung extends Component {
    constructor(props) {
        super(props);
        this.Id = Utils.ngetParam(this, "Id", '');
        this.SoLuongTuongTac = Utils.ngetParam(this, 'SoLuongTuongTac', 0)
        this.noidung = '';
        this.login = Utils.getGlobal(nGlobalKeys.loginToken);
        this.colorMes = true;
        this.state = {
            dataTuyenDung: [],
            modalVisible: false,
            tuongtac: false, // check phản ánh có dc bật tương tác để đánh giá và cmt hay không.
            toggleNhapNoiDung: true,
            dataComent: [],
            Id: '',
            isLoading: true,
            webViewHeight: 40,
            marginTop: new Animated.Value(50),
            message: 'Gửi tương tác thành công',
            options: false,
            status: 0,
        }
        this.InterVal;
        ROOTGlobal.dataGlobal._loadDataChiTietTuyenDung = (val) => this.setNewData(val)
    }
    setNewData = (Id) => {
        this.Id = Id;

        this.setState({
            dataTuyenDung: [],
            modalVisible: false,
            tuongtac: false, // check phản ánh có dc bật tương tác để đánh giá và cmt hay không.
            toggleNhapNoiDung: false,
            dataComent: [],
            Id: '',
            isLoading: true,
            webViewHeight: 40,
            marginTop: new Animated.Value(50),
            message: 'Gửi tương tác thành công',
            status: 0,
        }, () => {
            this._getDetailTuyenDung();
            this._getListComent();
        })
    }
    componentDidMount() {
        this._getDetailTuyenDung();
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

    _getDetailTuyenDung = async () => {
        const res = await apis.ApiSanLamViec.GetTinTuyenDungById(this.Id);
        Utils.nlog("[LOG] ChiTiet Tin Tuyen Dung:", res);
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
                    this.setState({ tuongtac: true, dataTuyenDung: res.data, isLoading: false });
                } else {
                    this.setState({ dataTuyenDung: res.data, isLoading: false });
                };
            } else {
                this.setState({ isLoading: false });
                Utils.showMsgBoxOK(this, 'Thông báo', res.error ? res.error.message : 'Không tải được dữ liệu !', 'Xác nhận')

            };
    }

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

    onOpenFile = (uri = '') => () => {
        let temp = uri.toLowerCase();
        if (temp.includes(".avi") || temp.includes(".mp4") || temp.includes(".mov") || temp.includes(".wmv") || temp.includes(".flv"))
            Utils.goscreen(this, 'Modal_PlayMedia', { source: uri });
        else
            Linking.openURL(uri);
    }

    _writeComent = (isOpenMedia = false) => {
        if (this.login == '') Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
        else {
            if (isOpenMedia == true) {
                this.setState({ toggleNhapNoiDung: true, Id: '', options: true }, () => {
                    Keyboard.dismiss();
                    setTimeout(() => {
                        this.srollView.scrollToEnd(true);
                    }, 500);
                });
            } else
                this.setState({ toggleNhapNoiDung: true, Id: '' }, () => {
                    setTimeout(() => {
                        this.inputTuongTac.focus();
                    }, 200);
                });
        }
    }

    _replyComent = (Id) => {
        if (this.login == '') Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
        else {
            this.setState({ Id, toggleNhapNoiDung: false }, () => setTimeout(() => {
                this.inputTuongTac.focus();
            }, 200));
        };
    }

    _submitComent = async () => {
        if (this.login == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận')
            return;
        }
        if (!this.noidung) {
            return Utils.showToastMsg('Thông báo', 'Nội dung tương tác không được rỗng.', icon_typeToast.warning, 2000)
        }
        if (this.noidung) {
            nthisIsLoading.show();
            let bodyComment = {
                "IdTinTuc": this.Id,
                "IdParent": this.state.toggleNhapNoiDung ? 0 : this.state.Id,
                "TuongTac": this.noidung
            }
            console.log('[LOG] body', bodyComment)
            const res = await apis.ApiSanLamViec.Create_TinTucCongDan_TuongTac(bodyComment);
            nthisIsLoading.hide();
            Utils.nlog('gui tuong tac', res)
            if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
            else {
                if (this.state.Id) { // trường hợp trả lời comment
                    if (res.status == 0) {
                        // Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đóng');
                        Keyboard.dismiss()
                        this.colorMes = false;
                        this.setState({ message: res?.error?.message || 'Có lỗi trong quá trình gửi tương tác.', Id: '', toggleNhapNoiDung: true }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                        });
                    } else {
                        Keyboard.dismiss()
                        this.colorMes = true;
                        this.setState({ message: res?.error?.message || 'Gửi phản hồi thành công', Id: '', toggleNhapNoiDung: true }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                            this._getListComent()
                        });
                    }
                } else {//trường hợp viết comment mới
                    if (res.status == 0) {
                        Keyboard.dismiss()
                        this.colorMes = false;
                        this.setState({ message: res?.error?.message || 'Có lỗi trong quá trình gửi tương tác', Id: '', toggleNhapNoiDung: false }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                        });
                    } else {
                        Keyboard.dismiss()
                        this.colorMes = true;
                        this.setState({ message: res?.error?.message || 'Gửi tương tác thành công', Id: '' }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                            this.setState({ toggleNhapNoiDung: false }, this._getListComent);
                        });

                    };
                };
                this.setState({
                }, () => { this.noidung = '' })
            };
        } else {
            nthisIsLoading.hide();
            if (Id) {
                this.setState({ Id: '' });
            } else this.setState({ toggleNhapNoiDung: false });
        };
    }

    _getListComent = async () => {
        const res = await apis.ApiSanLamViec.GetList_TinTucCongDan_TuongTac(this.Id);
        Utils.nlog("[LOG] res tuong tac:", res);
        this.SoLuongTuongTac = res.data && res.data.length ? res.data.length : 0
        if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        else
            if (res.status == 1 && res.data) {
                let dataComent = res.data.filter(item => !item?.IdParent);
                dataComent = dataComent.reverse();
                Utils.nlog("[LOG] dataComent:", dataComent);
                this.setState({ dataComent });

            } else {
                this.setState({ dataComent: [] });
            }
    }

    renderInputRep = (val) => {
        const { userCD } = this.props.auth
        var { dataTuyenDung } = this.state
        if (val)
            return <>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5, flex: 1, marginLeft: this.state.Id == '' ? 0 : 30 }]}>
                    <View style={{ backgroundColor: colors.black_11, flex: 1 }}>
                        <TextInput
                            ref={ref => this.inputTuongTac = ref}
                            style={[nstyles.nstyles.ntextinput, {
                                fontSize: reText(13), paddingHorizontal: 5,
                                paddingVertical: Platform.OS == 'android' ? 5 : 10,
                            }]}
                            underlineColorAndroid='transparent'
                            placeholder={this.state.Id == '' ? 'Nhập bình luận...' : 'Nhập phản hồi...'}
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

            </>
        return null;
    }

    _renderReplyComment = (item1) => {
        const { userCD } = this.props.auth
        return (
            <Fragment key={item1.Id}>
                <View style={stChiTietPA.containerComment}>
                    <Text style={[styles.text14, { color: colors.black_50 }]}>{item1?.TenNguoiTao}</Text>
                    <Text style={styles.text13}>{item1?.TuongTac}</Text>
                </View>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5, marginLeft: 20 }]}>
                    <Text style={[styles.text12, { color: colors.black_50 }]}>{item1?.NgayTao ? moment(item1?.NgayTao, 'DD/MM/YYYY hh:mm').format('HH:mm DD/MM/YYYY') : ''}</Text>
                    {
                        userCD?.UserID == item1?.NguoiTao &&
                        <TouchableOpacity
                            onPress={() => this._onDeleteTuongTac(item1.Id)}
                            style={{ paddingHorizontal: 10 }}>
                            <Text style={[styles.text12, { color: colors.black_50 }]}>Xoá</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={{ marginLeft: 15 }}>
                    {item1?.PhanHoi?.map(this._renderReplyComment)}
                </View>
            </Fragment>
        )
    }

    _onDeleteTuongTac = (Id) => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xoá tương tác?', 'Xoá', 'Xem lại', async () => {
            nthisIsLoading.show()
            let res = await apis.ApiSanLamViec.Delete_TinTucCongDan_TuongTac(Id)
            nthisIsLoading.hide()
            if (res.status == 1) {
                Utils.showToastMsg('Thông báo', 'Xoá tương tác thành công.', icon_typeToast.success, 2000, icon_typeToast.success);
                this._getListComent()
            } else {
                Utils.showToastMsg('Thông báo', 'Xoá tương tác thất bại. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info);
            }
        })
    }

    _renderComent = ({ item, index }) => {
        Utils.nlog('DANH GIA HAI LONG', item)
        const { userCD } = this.props.auth
        return <View style={{ marginTop: 10 }} key={item.Id}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, alignSelf: 'flex-start', padding: 5, marginTop: 5 }}>
                <Text style={[styles.text12, { fontWeight: '700' }]}>{item?.TenNguoiTao}</Text>
                <Text style={styles.text13}>{item?.TuongTac}</Text>
            </View>
            <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5 }]}>
                <Text style={[styles.text12, { color: colors.black_50 }]}>{item?.NgayTao ? moment(item?.NgayTao, 'DD/MM/YYYY hh:mm').format('HH:mm DD/MM/YYYY') : ''}</Text>
                {
                    userCD?.UserID == item?.NguoiTao &&
                    <TouchableOpacity
                        onPress={() => this._onDeleteTuongTac(item.Id)}
                        style={{ paddingHorizontal: 10 }}>
                        <Text style={[styles.text12, { color: colors.black_50 }]}>Xoá</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity
                    onPress={() => this._replyComent(item.Id)}
                    style={{ paddingHorizontal: 10 }}>
                    <Text style={[styles.text12, { color: colors.black_50 }]}>Phản hồi ({item?.PhanHoi?.length || 0})</Text>
                </TouchableOpacity>
            </View>
            { // phản hồi cmt
                item?.PhanHoi?.map(this._renderReplyComment)
            }
            {
                this.renderInputRep(item.Id == this.state.Id)
            }
        </View>
    }
    _keyExtracComent = (item) => item.Id.toString();
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
                    <Image source={{ uri: arrImg[0].url }} style={{ width: '100%', height: reSize(80), borderRadius: 10 }} />
                    {
                        arrImg.length - 1 == 0 ? null :
                            <View style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: colors.black_50, padding: 5 }}>
                                <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: reText(12), paddingTop: 2 }}>+{arrImg.length - 1}</Text>
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
                                width: '100%', height: reSize(80), backgroundColor: colors.black, borderRadius: 10
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



    handleAction = (item) => {
        switch (item.id) {
            case 1:
                this.refs.refAware.scrollToEnd()
                break;
            default:
                break;
        }
    }

    _NgungTuyen = () => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn huỷ và ngừng tuyển dụng đối với bài đăng này không ?', 'Đồng ý', 'Xem lại', async () => {
            let res = await apis.ApiSanLamViec.HetHan_TinTucCongDan(this.Id)
            if (res.status == 1) {
                Utils.showToastMsg('Thông báo', 'Cập nhật tin tuyển dụng thành công', icon_typeToast.success, 2000, icon_typeToast.success);
                this._getDetailTuyenDung()
            } else {
                Utils.showToastMsg('Thông báo', 'Cập nhật tin tuyển dụng thất bại. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info);
            }
        })
    }

    _AnHienBaiDang = () => {
        const { dataTuyenDung } = this.state
        Utils.showMsgBoxYesNo(this, 'Thông báo', `Bạn có chắc muốn ${dataTuyenDung?.IsHienThi ? 'ẨN' : 'HIỂN THỊ'} đối với bài đăng này không?`, `${dataTuyenDung?.IsHienThi ? 'Ẩn' : 'Hiển thị'}`, 'Xem lại', async () => {
            let res = await apis.ApiSanLamViec.View_TinTucCongDan(dataTuyenDung?.Id, dataTuyenDung?.IsHienThi)
            if (res.status == 1) {
                ROOTGlobal.dataGlobal._onRefreshCongDongTuyenDung()
                Utils.showToastMsg('Thông báo', `${dataTuyenDung?.IsHienThi ? 'Ẩn' : 'Hiển thị'}` + ' tin tuyển dụng thành công', icon_typeToast.success, 2000, icon_typeToast.success);
                this._getDetailTuyenDung()
            } else {
                Utils.showToastMsg('Thông báo', `${dataTuyenDung?.IsHienThi ? 'Ẩn' : 'Hiển thị'}` + ' tin tuyển dụng thất bại. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info);
            }
        })
    }



    render() {
        const { userCD } = this.props.auth
        const { tuongtac, isLoading, message, dataTuyenDung } = this.state;
        const { nrow, nmiddle } = nstyles.nstyles;
        var data = this.state.dataTuyenDung;
        var { ListFile = [] } = this.state.dataTuyenDung;
        //--xử lý Lish Hình ảnh, File, Video
        let arrImg = [], arrLinkFile = [], urlVideoTitle = '';
        ListFile.forEach(item => {
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
            // Utils.nlog("gia tri image chi tiết----------------", ListFile, arrLinkFile);
        });
        var { status } = this.state
        //----
        return (
            <View style={[nstyles.nstyles.ncontainerX, {
                backgroundColor: colors.white,
            }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => this._goBack()}
                    iconLeft={Images.icBack}
                    title={`Chi tiết tuyển dụng`}
                    styleTitle={{ color: colors.white }}
                />

                <KeyboardAwareScrollView
                    // keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ref={ref => this.srollView = ref}
                >
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ width: reSize(80), height: reSize(80) }}>
                                {
                                    arrImg.length > 0 || urlVideoTitle != '' ? this.renderImgList(arrImg, urlVideoTitle)
                                        : <Image
                                            source={Images.imgViettelTuyenDung}//do đã kiểm tra ở ngoài trước khi render nên k cần kt lại
                                            style={{ height: reSize(80), width: reSize(80), borderRadius: 5 }}
                                        />
                                }
                            </View>
                            <View style={{ flex: 1, height: '100%', paddingLeft: 10 }}>
                                <Text numberOfLines={3} style={[styles.text16, { fontWeight: 'bold', textAlign: 'justify', fontSize: reText(20) }]}>{data?.TieuDe?.toString().trim()}</Text>
                            </View>
                        </View>
                        {data.DiaDiem ? <View style={[nrow, { alignItems: 'center', marginTop: 10 }]}>
                            <Image source={Images.icDiaDiem} style={{ width: 15, height: 15 }} resizeMode='contain' />
                            <TouchableOpacity onPress={this._openMap(data)}>
                                <Text numberOfLines={2} style={[styles.text13, { color: colors.colorBlueP, marginLeft: 5, marginRight: 10 }]}>{data.DiaDiem}</Text>
                            </TouchableOpacity>
                        </View> : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={[nrow, { justifyContent: 'flex-end', alignItems: 'center' }]}>
                                {
                                    data?.IsHetHan || data.IsDuyet == 1 ? <View style={{
                                        backgroundColor: '#F7E0E0', borderRadius: 5,
                                        borderColor: '#F7E0E0', padding: 4, marginTop: 5
                                    }}>
                                        <Text numberOfLines={1} style={[{ color: '#F51C1C', fontWeight: 'bold', fontSize: reText(10) }]}>{data?.IsDuyet == 1 ? 'Không duyệt' : 'Hết hạn nộp hồ sơ'}</Text>
                                    </View>
                                        :
                                        <Text style={{ color: colors.black_40, marginTop: 5, fontSize: reText(12) }}>Hạn nộp hồ sơ: {data?.DenNgay ? data?.DenNgay : 'Đang cập nhật'}</Text>
                                }
                            </View>
                            <Text style={{ color: colors.black_40, marginTop: 5, fontSize: reText(12) }}>Lượt xem: {data?.LuotXem ? data?.LuotXem : '0'}</Text>
                        </View>
                    </View>
                    <View style={{ height: 5, backgroundColor: colors.BackgroundHome, marginTop: 20 }} />
                    <View style={{ paddingHorizontal: 10 }}>
                        {
                            userCD?.UserID == data?.NguoiTao && data?.IsDuyet == 2 ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <TouchableOpacity onPress={this._NgungTuyen} activeOpacity={0.5} style={{ flex: 1, alignItems: 'center', padding: 8, backgroundColor: '#F7E0E0', borderRadius: 5 }}>
                                        <Text style={{ color: '#F51C1C', fontWeight: 'bold' }}>{'Huỷ'}</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 5, backgroundColor: colors.nocolor }} />
                                    <TouchableOpacity onPress={this._AnHienBaiDang} activeOpacity={0.5} style={{ flex: 1, alignItems: 'center', padding: 8, backgroundColor: colors.BackgroundHome, borderRadius: 5 }}>
                                        <Text style={{ color: colors.brownGreyThree }}>{data?.IsHienThi ? 'Ẩn bài' : 'Hiện bài'}</Text>
                                    </TouchableOpacity>
                                </View> : data?.IsDuyet == 1 &&
                                <View style={{ padding: 10, backgroundColor: '#F7E0E0', borderRadius: 5, marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{'Lý do không duyệt:'}</Text>
                                    <Text style={{ color: '#F51C1C', fontWeight: 'bold', fontStyle: 'italic', marginTop: 5 }}>
                                        {data?.LyDo}
                                    </Text>
                                </View>
                        }
                        <View style={{ marginTop: 5 }}>
                            <Text style={[styles.text14, { fontWeight: 'bold', marginTop: 5 }]}>Thông tin tuyển dụng</Text>
                            <AutoHeightWebViewCus style={{ width: '100%' }} scrollEnabled={false}
                                source={{ html: data.NoiDung ? data.NoiDung : '<div> </div>' }} textLoading={'Đang tải nội dung...'} />
                        </View>
                        {arrLinkFile.length > 0 ?
                            <Fragment>
                                <View style={[nrow, { alignItems: 'center', marginTop: 10 }]}>
                                    <View style={{ height: 4, width: 18, backgroundColor: colors.colorBlueP, alignSelf: 'center', marginVertical: 10 }} />
                                    <Text style={[styles.text14, { marginLeft: 5, color: colors.black_60, fontWeight: '600' }]}>File đính kèm</Text>
                                </View>
                                <View style={[nrow]}>
                                    <TouchableOpacity
                                        onPress={this.onOpenFile(arrLinkFile[0].url)}
                                        underlayColor={colors.backgroudFileActive}
                                        style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlueP, backgroundColor: colors.backgroundFile, width: '80%' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={Images.icFileTD} style={{ width: nstyles.Width(4), height: nstyles.Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                            <Text style={{ color: colors.colorBlueLight, width: nstyles.Width(55) }} numberOfLines={1}>{arrLinkFile[0].name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {arrLinkFile.length > 1 ?
                                        <TouchableOpacity
                                            onPress={() => this._showDanhSachFile(arrLinkFile)}
                                            underlayColor={colors.backgroudFileActive}
                                            style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlue, backgroundColor: colors.backgroundFile, width: '18%', marginLeft: nstyles.Width(1) }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={Images.icFileTD} style={{ width: nstyles.Width(4), height: nstyles.Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                                <Text style={{ color: colors.colorBlueLight, width: nstyles.Width(50) }} numberOfLines={1}>{'+'}{arrLinkFile.length - 1}</Text>
                                            </View>
                                        </TouchableOpacity> : null}
                                </View>
                                <View style={{ height: 5 }} />
                            </Fragment>
                            : null
                        }
                    </View>
                    <View style={{ height: 5, backgroundColor: colors.BackgroundHome, marginTop: 20 }} />
                    {/* Bình luận đánh giá */}
                    <View style={{ padding: 10 }}>
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
                                style={[styles.text12, { color: colors.black_50, textAlign: 'center', }]}
                                textempty='Không có tương tác'
                                styleContainer={{ marginTop: 0 }} 
                                />}
                            extraData={this.state.Id}
                        />
                        { // VIết coment
                            this.state.toggleNhapNoiDung ? this.renderInputRep(true) :
                                <View style={[nrow, { alignItems: 'center', marginTop: 5, marginTop: 5 }]}>
                                    <TouchableOpacity
                                        onPress={this._writeComent}
                                        style={{ width: "100%", backgroundColor: colors.black_11, paddingVertical: 10, paddingHorizontal: 5, borderRadius: 3 }}>
                                        <Text style={[{ fontSize: reText(13), color: colors.black_30 }]}>Nhập bình luận mới...</Text>
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
export default Utils.connectRedux(ChiTietTuyenDung, mapStateToProps)

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