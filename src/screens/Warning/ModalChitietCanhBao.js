import React, { Component, Fragment } from 'react';
import {
    View, Text, Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Linking,
    FlatList,
    Animated,
    Platform,
    BackHandler
} from 'react-native';
import { Images } from '../../images';
import { nstyles, sizes, colors } from '../../../styles';
import Utils from '../../../app/Utils';
import apis from '../../apis';
import moment from 'moment';
import { appConfig } from '../../../app/Config';
import { IsLoading, ListEmpty } from '../../../components';
import WebViewCom from '../../../components/WebViewCom';
import styles from '../Home/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HtmlViewCom from '../../../components/HtmlView';
import { reText } from '../../../styles/size';
import { heightStatusBar, paddingTopMul, Width } from '../../../styles/styles';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import LinearGradient from 'react-native-linear-gradient';
import VideoCus from '../../../components/Video/VideoCus';
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus';
import UtilsApp from '../../../app/UtilsApp';

class ModalChitietCanhBao extends Component {
    constructor(props) {
        super(props);
        this.Id = Utils.ngetParam(this, "item", '-1');
        this.tuongtac = false;
        this.IdSource = Utils.getGlobal(nGlobalKeys.IdSource, '')
        this.isShareTinTuc = Utils.getGlobal(nGlobalKeys.isShareTinTuc, true)
        this.TenCM = Utils.ngetParam(this, "TenCM", '');
        this._callback = Utils.ngetParam(this, "_callback", () => { })
        this.interval = null;
        this.count = true;
        this.state = {
            data: {},
            refreshing: true,
            height: 80,
            dataItem: Utils.ngetParam(this, "data", {}),
            IdRow: '',
            toggleNhapNoiDung: false,
            marginTop: new Animated.Value(100),
            message: 'Gửi thành công, vui lòng chờ admin duyệt phản hồi',
            dataComment: [],
            NumComment: 0,
            indexImageChose: 0
        };
        this.refLoading = React.createRef(null);
    }
    componentDidMount() {
        this._getInFoCanhBao();
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    componentWillUnmount() {
        if (this.interval)
            clearInterval(this.interval);
        BackHandler.removeEventListener('hardwareBackPress', this.backAction)
    }


    backAction = () => {
        this._goback();
        return true
    }

    _getInFoCanhBao = async () => {
        const { auth = {} } = this.props
        // Utils.nlog("id canh bao " + this.Id)
        this.refLoading.current.show();
        const res = await apis.ApiCanhBao.InfoCanhBao(this.Id, auth.tokenCD != '');
        Utils.nlog("gia tri info canh bao res", res);
        this.refLoading.current.hide();
        if (res?.status == 1 && res?.data) {
            this.tuongtac = res?.data?.TuongTac;
            let NumCommentTemp = res?.data?.lstTuongtac?.length;
            res.data.lstTuongtac.map(item => NumCommentTemp += item.lstChildTT.length);
            this.setState({ data: res.data, refreshing: false, dataComment: res?.data?.lstTuongtac, NumComment: NumCommentTemp })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", res?.error ? res?.error?.message : "Đường truyền không ổn định. Vui lòng thử lại", "Xác nhận");
            this.setState({ refreshing: false })
        };
        if (this.tuongtac)
            this._setInterVal();
    }
    // _onWebViewMessage = (event: WebViewMessageEvent) => {
    //     this.setState({ height: Number(event.nativeEvent.data) });
    // }

    _setInterVal = () => {
        this.interval = setInterval(() => {
            if (this.count) {
                this.count = false;
                this._handleDataCMT();
            };
        }, 7000);
    }

    _handleDataCMT = async () => {
        const { auth = {} } = this.props
        const res = await apis.ApiCanhBao.InfoCanhBao(this.Id, auth.tokenCD != '');
        Utils.nlog('res data', res)
        if (res?.status == 1 && res?.data) {
            this.setState({ dataComment: res.data.lstTuongtac }, () => { this.count = true });
        } else {
            // Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Đường truyền không ổn định. Vui lòng thử lại", "Xác nhận");
        };

    }

    _RenderFile = (item, index) => {
        return (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(appConfig.domain + item.Path)}
                style={[nstyles.nstyles.nrow, {
                    backgroundColor: colors.colorGrayBGCB, marginVertical: 2.5,
                    alignItems: 'center', paddingVertical: 3
                }]}>
                <Image source={Images.icAttached} style={nstyles.nstyles.nIcon20} resizeMode='contain' />
                <View style={{ paddingHorizontal: 10 }}>
                    <Text
                        numberOfLines={2}
                        style={{ fontSize: sizes.sText14, paddingRight: 10, }}>
                        {item.FileName}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }
    _showVideo = (url) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: url });
    }
    changImage = async (index, arrImage) => {
        await this.setState({ indexImageChose: index })
        // this._showAllImages(arrImage, index)
        Utils.nlog('Gia trissss>>>>>>>>>>>>>', index, this.state.indexImageChose)
    }
    _renderItemImage = (item, index, arrImage) => {
        let isVideo = item.url.includes('.mp4')
        // Utils.nlog('Gia tri isVideo =>>>>>>', isVideo)
        return (
            <View key={index} >
                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { this.changImage(index) }}>
                    {
                        isVideo ?
                            <VideoCus
                                source={{ uri: item.url }}
                                style={{ width: nstyles.Width(30), height: nstyles.Width(30), borderRadius: 5, }}
                                resizeMode='cover'
                                paused={true}
                            />
                            : <Image
                                // defaultSource={Images.icPhotoBlack}
                                source={{ uri: item.url }}
                                style={{ height: nstyles.Width(30), width: nstyles.Width(30), marginBottom: 8 }}
                                resizeMode='cover'
                            />
                    }
                    {
                        isVideo ?
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.icVideoBlack} style={[nstyles.nstyles.nIcon30, { padding: 5, borderRadius: 8 }]} />
                            </View> : null
                    }

                </TouchableOpacity>
            </View>
        );
    };

    //commnet

    renderInputRep = (val) => {
        if (val)
            return <View style={[nstyles.nstyles.nrow, { alignItems: 'center', borderBottomColor: colors.black_50, borderBottomWidth: 1 }]}>
                <TextInput
                    // ref={ref => {this[idInput.toString()] = ref; this[idInput.toString()].focus()}}
                    style={[nstyles.nstyles.ntextinput, { flex: 1, marginTop: 10, marginLeft: 12 }]}
                    underlineColorAndroid='transparent'
                    placeholder='Nhập nội dung...'
                    onChangeText={text => this.noidung = text}
                    autoFocus
                    returnKeyType='done'
                // onSubmitEditing={this._submitComent}
                />
                <TouchableOpacity style={{ paddingLeft: 10 }} onPress={this._submitComent}>
                    <Image source={Images.icSentMes} style={[nstyles.nstyles.nIcon20, { tintColor: colors.softBlue }]} resizeMode='contain' />
                </TouchableOpacity>
            </View>
        return null;
    }
    _renderReplyComment = (item1) => {
        const uri = item1.Avata || undefined;
        if (item1.HienThi)
            return (
                <Fragment key={item1.IdRow}>
                    <View style={stModalCTCB.containerComment}>
                        <Image source={{ uri }} style={stModalCTCB.avata}
                            //  defaultSource={Images.icUser} 
                            resizeMode='cover' />
                        <View style={{ maxWidth: '91%' }}>
                            <Text style={[styles.text14, { color: colors.black_50 }]}>{item1.CreatorName}</Text>
                            <Text style={styles.text13}>{item1.NoiDung}</Text>
                        </View>
                    </View>
                    <Text style={[styles.text12, { color: colors.black_50, marginTop: 5, marginLeft: 20 }]}>{moment(item1.CreatedDate).format('DD/MM/YYYY HH:mm')}</Text>
                </Fragment >
            )
        else return null;
    }
    _renderComent = ({ item, index }) => {
        const urlImg = item.Avata || undefined;
        return <View style={{ marginTop: 10 }}>
            <View style={stModalCTCB.viewInfo}>
                <Image source={{ uri: urlImg }} style={stModalCTCB.avata}
                    //  defaultSource={Images.icUser} 
                    resizeMode='cover' />
                <View style={{ maxWidth: '96%', flex: 1 }}>
                    <Text style={[styles.text14, { color: colors.black_50 }]}>{item.CreatorName}</Text>
                    <Text style={[styles.text13, { paddingRight: 10, flex: 1, textAlign: 'justify' }]}>{item.NoiDung}</Text>
                </View>
            </View>
            <View style={[nstyles.nstyles.nrow, { alignItems: 'center', marginTop: 5 }]}>
                <Text style={[styles.text12, { color: colors.black_50 }]}>{moment(item.CreatedDate).format('DD/MM/YYYY HH:mm')}</Text>
                <TouchableOpacity
                    onPress={this._replyComent(item.IdRow)}
                    style={{ paddingHorizontal: 10 }}>
                    <Text style={styles.text12}>Trả lời</Text>
                </TouchableOpacity>
            </View>
            { // phản hồi cmt
                item.lstChildTT.map(this._renderReplyComment)
            }
            {
                this.renderInputRep(item.IdRow == this.state.IdRow)
            }
        </View >
    }
    _startAnimation = (value) => {
        Animated.timing(this.state.marginTop, {
            toValue: value,
            duration: 100
        }).start();
    };
    _submitComent = async () => {
        const IdRow = this.state.toggleNhapNoiDung ? 0 : this.state.IdRow;
        if (this.noidung) {
            nthisIsLoading.show();
            const res = await apis.ApiCanhBao.TuongTacNguoiDan(this.noidung, this.Id, IdRow);
            nthisIsLoading.hide();
            Utils.nlog('gui tuong tac', res)
            if (res < 0) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
            else {
                if (this.state.IdRow) { // trường hợp trả lời comment
                    if (!res.status) {
                        // Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đóng');
                        this.colorMes = false;
                        this.setState({ message: res.error.message, IdRow: '' }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                        });
                    } else {
                        this.colorMes = true;
                        this._startAnimation(0);
                        setTimeout(() => {
                            this._startAnimation(50);
                        }, 5000);
                        // this._handleDataCMT();
                        this.setState({ IdRow: '' });
                    };
                } else {//trường hợp viết comment mới
                    if (!res.status) {
                        this.colorMes = false;
                        this.setState({ message: res.error.message, IdRow: '' }, () => {
                            this._startAnimation(0);
                            setTimeout(() => {
                                this._startAnimation(50);
                            }, 5000);
                        });
                    } else {
                        this.colorMes = true;
                        this._startAnimation(0);
                        setTimeout(() => {
                            this._startAnimation(50);
                        }, 5000);
                        this.setState({ toggleNhapNoiDung: false });
                    };
                };
                this.noidung = '';
            };
        } else {
            if (IdRow) {
                this.setState({ IdRow: '' });
            } else this.setState({ toggleNhapNoiDung: false });
        };
    }
    // _likeComent = (IdRow) => async () => {
    //     const res = await apis.TuongTac.LikeTuongTacCB(IdRow);
    //     this._getListComent();
    // }
    _replyComent = (IdRow) => () => {
        const { auth = {} } = this.props
        if (!this.tuongtac) Utils.showMsgBoxOK(this, 'Thông báo', 'Cảnh báo không được phép tương tác', 'Xác nhận');
        else {
            if (auth.tokenCD == '') Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
            else {
                if (this.state.toggleNhapNoiDung)
                    this.setState({ IdRow, toggleNhapNoiDung: false });
                else this.setState({ IdRow });
            };
        };
    }
    _writeComent = () => {
        const { auth = {} } = this.props
        if (!this.tuongtac) Utils.showMsgBoxOK(this, 'Thông báo', 'Cảnh báo không được phép tương tác', 'Xác nhận');
        else {
            if (auth.tokenCD == '') Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần đăng nhập để thực hiện tính năng này', 'Xác nhận');
            else this.setState({ toggleNhapNoiDung: true });
        };
    }
    _keyExtracComent = (item) => item.IdRow.toString();
    _goback = () => {
        Utils.goback(this);
        this._callback()
    }
    onShare = (idPA = 0, title = Utils.getGlobal(nGlobalKeys.TieuDe) + ' ' + Utils.getGlobal(nGlobalKeys.TenHuyen)) => () => {
        Utils.onShare(title, appConfig.linkWeb + 'vi/chi-tiet-tin-' + idPA.toString());
    }
    _lisEmpty = () => {
        return <ListEmpty
            style={stModalCTCB.textEmpty}
            textempty='Không có tương tác' />
    }

    render() {
        var { data, dataItem, indexImageChose } = this.state
        let listImg = [], listFiles = [];
        if (!data.ListFile)
            data.ListFile = [];
        for (let i = 0; i < data.ListFile.length; i++) {
            const itemTemp = data.ListFile[i];
            itemTemp.Path = itemTemp.Path.toLowerCase();
            if (itemTemp.Type == 1 && (itemTemp.Path.includes('.png') || itemTemp.Path.includes('.jpg')
                || itemTemp.Path.includes('.jpeg') || itemTemp.Path.includes('.gif') || itemTemp.Path.includes('.mp4'))) {
                if (!itemTemp?.IsAnhDaiDien) listImg.push(itemTemp);
            } else
                listFiles.push(itemTemp);
        };

        listImg = listImg.map((item) => {
            return { ...item, url: appConfig.domain + item.Path, uri: '' }
        });
        const time = moment(data.TuNgay).format("DD/MM/YYYY HH:mm").slice(11, 16)


        // Utils.nlog('Gia tri Ngay - Gio', days, time, timeHT, songay, sophut, sogio, formatNgay(thu), this.TenCM, data)
        let isVideo = listImg[indexImageChose]?.url.includes('.mp4')
        Utils.nlog('Gia tais lst Iamge =>>>>>>>>>SSSSS', listImg[0]?.url, isVideo, this.isShareTinTuc)
        return (
            <View style={{ flex: 1, backgroundColor: colors.white, width: '100%' }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={this.props.theme.colorLinear.color}
                >
                    <View style={[nstyles.nstyles.nhead, {
                        backgroundColor: colors.nocolor, paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : 0,
                        height: Platform.OS == 'android' ? nstyles.heightHed() + heightStatusBar() / 2 : nstyles.heightHed()
                    }]}>

                        <View style={nstyles.nstyles.nHcontent}>
                            <View style={{ width: Width(20) }}>
                                <TouchableOpacity style={{ padding: 10 }} onPress={this._goback}>
                                    <Image source={Images.icBack} style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>
                            <View style={nstyles.nstyles.nHmid}>
                                <Text style={{ fontSize: reText(17), fontWeight: 'bold', color: colors.white, textAlign: 'center' }}>{UtilsApp.getScreenTitle("ManHinh_Warning", 'Chi tiết')}</Text>
                            </View>
                            {
                                this.isShareTinTuc == true ? <TouchableOpacity onPress={this.onShare(dataItem.Id)} style={[nstyles.nstyles.nrow, { alignItems: 'center', width: Width(20), justifyContent: 'flex-end' }]}>
                                    <Image source={Images.icShare} style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='contain' />
                                </TouchableOpacity> :
                                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', width: Width(20), justifyContent: 'flex-end' }]}>
                                        <Image source={Images.icShowPass} style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='contain' />
                                        <Text style={{ fontSize: sizes.sText12, fontWeight: 'bold', paddingHorizontal: 10, color: colors.white }} numberOfLines={1}>{data.LuotXemCD}</Text>
                                    </View>
                            }

                        </View>

                    </View>
                </LinearGradient>
                <View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                        <Text style={[stModalCTCB.txtNoiDung, { color: colors.colorTextSelect, fontStyle: 'italic', maxWidth: Width(45) }]} numberOfLines={2}>{`${this.TenCM ? this.TenCM : ''}`}</Text>
                        <Text style={[stModalCTCB.txtNoiDung, { marginLeft: 5 }]} numberOfLines={2}>
                            {/* {`${Utils.formatDateApp(data.TuNgay, "ddd, DD/MM/YYYY")}, ` + `${time} (GMT+7)`} */}
                            {moment(data.TuNgay).lang('vi').format('dddd, DD/MM/YYYY, HH:mm')} (GMT+7)
                        </Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), paddingHorizontal: 10 }}>{data.TieuDe}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: this.isShareTinTuc == true ? 'space-between' : 'flex-end' }}>
                        {
                            this.isShareTinTuc == true ? <View style={[nstyles.nstyles.nrow, { alignItems: 'center', width: Width(20) }]}>
                                <Image source={Images.icShowPass} style={[nstyles.nstyles.nIcon20, { tintColor: colors.redStar }]} resizeMode='contain' />
                                <Text style={{ fontSize: sizes.sText12, fontWeight: 'bold', paddingHorizontal: 10 }} numberOfLines={1}>{data.LuotXemCD}</Text>
                            </View> : null
                        }
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={stModalCTCB.txtTieuDe}>{`Đơn vị: `}</Text>
                            <Text style={[stModalCTCB.txtNoiDung, { fontStyle: 'italic' }]}>{dataItem.DonVi}</Text>
                        </View>

                    </View>
                    <View style={{ height: 2, backgroundColor: colors.softBlue, }} />
                </View>


                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ paddingBottom: nstyles.paddingTopMul() }}
                    ref={refs => this.tintucContenRef = refs}
                    style={{ width: '100%' }}>
                    <View style={{ width: '100%', paddingVertical: 10 }} >
                        <View style={{ paddingHorizontal: 10 }}>
                            <AutoHeightWebViewCus style={{ width: '100%' }} scrollEnabled={false} onLoadEndCus={() => { this.tintucContenRef.scrollToPosition(0, 0) }} source={{ html: data.NoiDung ? data.NoiDung : '<div></div>' }} textLoading={'Đang tải nội dung'} />
                        </View>
                        {
                            listImg && listImg.length >= 1 ?
                                <View style={{ marginHorizontal: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => { this._showAllImages(listImg, indexImageChose) }}
                                        style={{ width: '100%' }}>
                                        {
                                            isVideo ?
                                                <VideoCus
                                                    source={{ uri: listImg[indexImageChose]?.url }}
                                                    style={{ height: nstyles.Width(60), marginBottom: 8 }}
                                                    resizeMode="cover"
                                                    paused={true}
                                                />
                                                : <Image source={{ uri: listImg[indexImageChose]?.url }}
                                                    style={{ height: nstyles.Width(80), marginBottom: 8 }}
                                                    resizeMode="contain" />
                                        }
                                    </TouchableOpacity>
                                    {
                                        isVideo ?
                                            <TouchableOpacity onPress={() => this._showVideo(listImg[indexImageChose]?.url)}
                                                style={{
                                                    backgroundColor: "transparent", justifyContent: 'center', alignItems: 'center',
                                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
                                                }}>
                                                <Image source={Images.icVideoBlack} style={[nstyles.nstyles.nIcon40]} />
                                            </TouchableOpacity>
                                            : null
                                    }
                                </View> : null

                        }
                        {
                            listImg && listImg.length >= 2 ? <FlatList
                                data={listImg}
                                horizontal
                                style={{ marginHorizontal: 10 }}
                                renderItem={({ item, index }) => this._renderItemImage(item, index, listImg)}
                                keyExtractor={(item, index) => `${index}`}
                                showsHorizontalScrollIndicator={false}
                            /> : null
                        }

                        {
                            listFiles && listFiles.length ?
                                <View style={[{ padding: 10, width: '100%', }]}>
                                    <Text style={stModalCTCB.txtTieuDe}>
                                        {'File đính kèm:'}
                                    </Text>
                                    <View>
                                        {listFiles.map(this._RenderFile)}
                                    </View>
                                </View>
                                : null
                        }
                        {
                            //tạm thòi nếu id source là CA thì cho hiện cái tương tác lên
                            this.tuongtac ? <View style={{ paddingHorizontal: 10 }}>
                                <Text style={stModalCTCB.titleCmt}>Ý kiến, bình luận <Text style={{ fontWeight: 'normal' }}>({this.state.NumComment})</Text></Text>
                                <FlatList
                                    scrollEnabled={false}
                                    keyboardShouldPersistTaps='always'
                                    data={this.state.dataComment}
                                    renderItem={this._renderComent}
                                    keyExtractor={this._keyExtracComent}
                                    ListEmptyComponent={this._lisEmpty}
                                    extraData={this.state.IdRow || this.state.dataComment}
                                /></View> : null
                        }

                    </View>
                    {
                        //tạm thòi nếu id source là CA thì cho hiện cái tương tác lên
                        this.tuongtac ? <>
                            { // VIết coment
                                this.state.toggleNhapNoiDung ?
                                    <View style={stModalCTCB.viewNoiDung}>
                                        <TextInput
                                            style={[nstyles.nstyles.ntextinput, { flex: 1, marginTop: 10 }]}
                                            underlineColorAndroid='transparent'
                                            placeholder='Nhập nội dung...'
                                            onChangeText={text => this.noidung = text}
                                            returnKeyType='done'
                                            // onSubmitEditing={this._submitComent}
                                            autoFocus
                                        />
                                        <TouchableOpacity onPress={this._submitComent}>
                                            {

                                                <Image source={Images.icSentMes} style={[nstyles.nstyles.nIcon20, { tintColor: colors.softBlue }]} resizeMode='contain' />

                                            }
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    this.state.IdRow ? null :
                                        <TouchableOpacity
                                            style={{ paddingLeft: 10 }}
                                            onPress={this._writeComent}
                                            style={[nstyles.nstyles.nmiddle, stModalCTCB.btnNhapND]}>
                                            <Text style={styles.text13}>Nhập nội dung...</Text>
                                        </TouchableOpacity>
                            }
                        </> : null
                    }
                </KeyboardAwareScrollView>
                <IsLoading ref={this.refLoading} />
                <Animated.View style={[stModalCTCB.successView, { marginTop: this.state.marginTop }]}>
                    <Text style={{ textAlign: 'center', color: this.colorMes ? colors.softBlue : 'red' }}>{this.state.message}</Text>
                </Animated.View>
            </View >
        );
    }
}
const stModalCTCB = StyleSheet.create({
    txtTieuDe: {
        fontSize: sizes.reSize(12),
        color: colors.colorBrownGrey,
        paddingVertical: 5
    },
    txtNoiDung: {
        fontSize: sizes.reSize(13),
        color: colors.black_80,
        paddingVertical: 2.5
    },
    titleCmt: {
        fontWeight: '600', marginTop: 5,
        fontSize: sizes.reText(14),
        padding: 6, color: colors.redDark,
        backgroundColor: colors.colorGrayBgr
    },
    textEmpty: {
        color: colors.black_50,
        textAlign: 'center',
        marginTop: 20,
        fontSize: sizes.reText(12)
    },
    viewInfo: {
        ...nstyles.nstyles.nrow,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 5,
        // paddingHorizontal:10
    },
    avata: {
        ...nstyles.nstyles.nAva26,
        marginRight: 10
    },
    containerComment: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 10,
        marginLeft: 20,
        ...nstyles.nstyles.nrow
    },
    successView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: nstyles.nheight() - 50,
        backgroundColor: 'white',
        paddingHorizontal: 13,
    },
    btnNhapND: {
        borderColor: colors.black_16,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        alignSelf: 'center',
        marginTop: 30
    },
    viewNoiDung: {
        ...nstyles.nstyles.nrow,
        alignItems: 'center',
        borderBottomColor: colors.black_50,
        borderBottomWidth: 0.5,
        marginHorizontal: nstyles.khoangcach
    },
    containerCanhBao: {
        width: '50%',
        ...nstyles.nstyles.nrow,
        backgroundColor: colors.yellowLight,
        paddingHorizontal: 10,
        alignItems: 'center',
        paddingVertical: 5
    }

})
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ModalChitietCanhBao, mapStateToProps, true);
