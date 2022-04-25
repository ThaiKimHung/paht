import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Platform, BackHandler } from 'react-native';
import { nstyles, colors, sizes } from '../../../../styles';
import Utils from '../../../../app/Utils';
import { Images } from '../../../images';
import apis from '../../../apis';
import { HeaderCus, ListEmpty } from '../../../../components';
import YouTubePlay from './YouTubePlay';
import VideoSound from './VideoSound';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import WebViewCus from '../../../../components/WebViewCus';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { appConfig } from '../../../../app/Config';
import Video from 'react-native-video';
import { Height } from '../../../../styles/styles';
import UtilsApp from '../../../../app/UtilsApp';
import { reSize, reText } from '../../../../styles/size';
import ImageCus from '../../../../components/ImageCus';

const stimeShow = 4;
let timeShow = stimeShow;
class HomeTuyenTruyen extends Component {
    constructor(props) {
        super(props);
        nthistuyentruyen = this
        this.LogoAppHome = Utils.getGlobal(nGlobalKeys.LogoAppHome, '')
        this.state = {
            data: [],
            textempty: 'Đang tải ...',
            refreshing: true,
            played: true,
            listVideo: []

        };
        ROOTGlobal.dataGlobal._onLoadTuyenTruyen = nthistuyentruyen._onRefresh
    }
    _getThongTinTT = async () => {
        const res = await apis.ApiTuyenT.TuyenTruyenFrontend();

        Utils.nlog("gia tri res api truyen truyền", res)
        if (res.status == 1) {
            if (res.data) {
                var { data = [] } = res;
                var listVideo = data.filter(item => item.Type == 1);

                // data

                this.setState({ data: res.data, refreshing: false, listVideo })
            } else {
                this.setState({ data: [], textempty: 'Không có dữ liệu', refreshing: false })
            }
        } else {
            this.setState({ data: [], textempty: 'Không có dữ liệu', refreshing: false })
            Utils.showMsgBoxOK(this, "Thông báo", "Lấy thông tin clip tuyên truyền thất bại")
        }
    }
    componentDidMount() {
        this._getThongTinTT();
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }
    //load more
    // loadMore = async () => {
    //     const { page, size, } = this.state;
    //     Utils.nlog('page', page)
    //     const pageNumber = page + 1;
    //     if (page < this.pageAll) {
    //         let res = await apis.ApiCanhBao.GetList_CanhBaoApp(false, pageNumber, size);
    //         Utils.nlog('data list canh bao 2', res)

    //         if (res.status == 1 && res.data) {
    //             const data = [...this.state.data, ...res.data];
    //             this.setState({ data, page: pageNumber, });
    //         };
    //     };
    // };
    //
    _goScreeen = (item) => {
        const { data, listVideo } = this.state;
        Utils.goscreen(this, "Modal_ListViewVideoPlay", {
            Item: item,
            ListItem: listVideo.filter(item => item.Type != 3)
        });
    }
    _onVideo = (uri, type) => {
        Utils.goscreen(this, type == 2 ? 'Modal_SoundPlay' : 'Modal_PlayMedia', { source: uri });
    }
    _renderItem = ({ item, index }) => {
        let idvdeo = Utils.GetIDyoutobe(item.LinkYoutube)
        let urlVideo = item && item.Path ? appConfig.domain + item.Path : '';
        let urlMP3 = item && item.LinkYoutube ? item.LinkYoutube : '';
        return (
            <View
                key={index.toString()}
                style={[nstyles.nstyles.shadown,
                {
                    marginTop: this.props.isQuanTam ? 0 : 5,
                    // paddingVertical: 20,
                    paddingHorizontal: 10,
                    borderRadius: 5, width: '100%', marginBottom: 5,
                    backgroundColor: 'white',
                }]}
            >
                {item.Type == 2 ? null :
                    <View style={[nstyles.nstyles.nrow, { width: '100%', alignItems: 'center' }]}>
                        <ImageCus defaultSourceCus={Images.iconApp} source={this.LogoAppHome ? { uri: this.LogoAppHome } : Images.iconApp} style={[nstyles.nstyles.nIcon40, { marginVertical: 5 }]} resizeMode='cover' />
                        <View style={{ paddingHorizontal: 10, flex: 1 }}>
                            <Text
                                style={{ fontWeight: 'bold', fontSize: sizes.sText12, width: '100%' }}>
                                {`${item.TieuDe}`}
                            </Text>
                        </View>
                    </View>
                }
                {
                    (item.Type == 1 ? (Platform.OS == 'android' ?
                        <View style={{ height: 200, width: '100%' }}>
                            <WebViewCus
                                style={{ marginLeft: -3, marginTop: 5 }}
                                scrollEnabled={false}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                source={{ uri: `https://www.youtube.com/embed/${idvdeo}` }}
                            />
                        </View> : <YouTubePlay idVideo={idvdeo} />)
                        :
                        item.Type == 3 ?
                            <View
                                style={{
                                    justifyContent: 'center', alignItems: 'center', flex: 1,
                                    height: Height(30)
                                }}>
                                <Video source={{ uri: urlVideo }}   // Can be a URL or a local file.
                                    style={{ width: '100%', height: '100%', backgroundColor: colors.black }}
                                    resizeMode='contain'
                                    paused={true} />
                                <View style={{ position: 'absolute' }}>
                                    <Image style={{ width: reSize(70), height: reSize(62) }}
                                        source={Images.icPlayYoutube} resizeMode='contain' />
                                </View>
                            </View>
                            :
                            <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 10 }} >
                                <Image source={Images.icMP3} style={nstyles.nstyles.nIcon30} />
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <Text style={{ fontSize: reText(14), width: '100%', fontWeight: 'bold', fontStyle: 'italic' }} numberOfLines={2}>
                                        {item.TieuDe}
                                    </Text>
                                    <Text style={{ color: colors.colorGrayText, fontSize: reText(12) }}>{item.CreateDate}</Text>
                                </View>
                            </View>
                    )
                }
                {
                    item.Type ? <TouchableOpacity onPress={() => item.Type == 1 ? this._goScreeen(item) : item.Type == 2 ? this._onVideo(urlMP3, item.Type) : this._onVideo(urlVideo, item.Type)}
                        style={{
                            backgroundColor: "transparent",
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
                        }}>
                    </TouchableOpacity> : null
                }

            </View >
        )
    }
    _keyExtrac = (item, index) => item.Id.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...', data: [] }, this._getThongTinTT);
        // this.setState({ refreshing: true, page: 0, textempty: 'Đang tải...' }, () => this._getData(this.state.hocSinhData.IDKhachHang));
    }
    render() {
        Utils.nlog("gia tri list video,", this.state.data)
        return (

            <View style={[nstyles.nstyles.ncontainer, nstyles.paddingTopMul()]}>
                {
                    this.props.isQuanTam ? null :
                        <HeaderCus
                            Sleft={{ tintColor: 'white' }}
                            onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                            iconLeft={Images.icBack}
                            title={UtilsApp.getScreenTitle("ManHinh_TuyenTruyen", 'Clip tuyên truyền')}
                            styleTitle={{ color: colors.white }}
                            iconRight={Images.icHomeMenu}
                            onPressRight={() => Utils.goscreen(this, 'ManHinh_Home')}
                        />
                }
                <FlatList
                    scrollEventThrottle={10}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: this.props.isQuanTam ? 0 : 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                    renderItem={this._renderItem}
                    data={this.state.data}
                    ListEmptyComponent={<ListEmpty textempty={this.state.textempty} isImage={!this.state.refreshing} />}
                    keyExtractor={this._keyExtrac}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    onEndReachedThreshold={0.3}
                />
            </View>
        );
    }
}
var styles = StyleSheet.create({
    backgroundVideo: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
        width: 300,
        height: 300
    },
});
export default HomeTuyenTruyen;
