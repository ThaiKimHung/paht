import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { color } from 'react-native-reanimated'
import Utils from '../../../../app/Utils'
import { HeaderCus, IsLoading, WebViewCus } from '../../../../components'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles, paddingBotX, Width } from '../../../../styles/styles'
import { Images } from '../../../images'
import { BlurView } from '@react-native-community/blur'
import { getListThuVien } from '../../../apis/apiThuVien'
import { appConfig } from '../../../../app/Config'
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';

class ListVieoImage extends Component {
    constructor(props) {
        super(props)
        this.ScreenType = Utils.ngetParam(this, 'ScreenType')
        this.state = {
            arrVideo: [],
            keys: 'Type',
            vals: 1,//Type: 1 (link yotube), 2: Audio (link có sẵn) 3: Uploas file 4: hinh ảnh Nếu ko truyền hệ thống mặc định 1,2,3
            page: 1,
            record: 10,
            AllPage: 1,
            refreshing: false
        }
    }
    componentDidMount() {
        nthisIsLoading.show()
        this.loadListData().then(res => {
            if (res)
                nthisIsLoading.hide()
        })
    }
    loadListData = async (npage = this.state.page) => {
        let { keys, vals, page, record, arrVideo } = this.state
        vals = this.ScreenType == 'Video' ? "1,3" : 4
        let res = await getListThuVien(keys, vals, npage, record);
        Utils.nlog("loadListData:", vals, res);
        let temp = arrVideo
        if (res.status == 1) {
            if (npage != 1)
                temp = temp.concat(res.data)
            else
                temp = res.data
            this.setState({ arrVideo: temp, page: res.page.Page, AllPage: res.page.AllPage })
        }
        else
            Utils.showMsgBoxOK(this, 'Thông báo', res.error ? res.error.massage : 'Lỗi truy xuất dữ liệu', 'Xác nhận')
        return true
    }
    onRefresh = () => {
        this.loadListData()
    }
    onLoadmore = () => {
        var { page, AllPage } = this.state
        if (page < AllPage) {
            this.loadListData(page + 1)
        }
    }

    playMedia = (Type, url, item) => {
        switch (Type) {
            case 3:
                Utils.goscreen(this, "Modal_PlayMedia", { source: url });
                break;
            case 4:
                Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: url }] });
                break;
            default:
                Utils.goscreen(this, 'Modal_ListViewVideoPlay', { Item: item, ListItem: this.state.arrVideo.filter(item => item.Type == 1), title: "Thư viện video" });
                break;
        }
    }

    renderItem = ({ item, index }) => { // Render Video, và Hình Ảnh
        let isVideo = this.ScreenType == "Video";
        let urlAvatar = item.AvatarPath && item.AvatarPath != "" ? item.AvatarPath : item.Type == 1 ? "" : item.Path;
        urlAvatar = isVideo ? urlAvatar : item.Path;
        urlAvatar = urlAvatar.includes("http") && urlAvatar.includes("://") || urlAvatar == "" ? urlAvatar : appConfig.domain.slice(0, -1) + urlAvatar;

        let urlSource = item.Type == 1 ? item.LinkYoutube : item.Path;
        urlSource = urlSource.includes("http") && urlSource.includes("://") ? urlSource : appConfig.domain.slice(0, -1) + urlSource;

        if (item.Type == 1 && urlAvatar == "") {
            item.LinkYoutube = item.LinkYoutube.split("&t=")[0];
        }
        return (
            <View style={{ width: Width(50) - 10, marginBottom: 10, paddingHorizontal: 5 }}>
                <TouchableOpacity activeOpacity={0.9} style={[{
                    width: '100%', height: (Width(50) - 30) / 1.6,
                    justifyContent: 'center', alignItems: 'center'
                }]}
                    onPress={() => this.playMedia(item.Type, urlSource, item)}>
                    {
                        item.Type == 1 && urlAvatar == "" ?
                            <View pointerEvents="none" style={{ width: '100%', height: '100%' }}>
                                {
                                    Platform.OS == 'android' ?
                                        <WebViewCus
                                            scrollEnabled={false}
                                            javaScriptEnabled={true}
                                            domStorageEnabled={true}
                                            source={{ uri: `https://www.youtube.com/embed/${Utils.GetIDyoutobe(item.LinkYoutube)}` }}
                                        /> :
                                        <YouTube style={{ width: '100%', height: '100%' }}
                                            apiKey="AIzaSyA8cUgcN9mnM7ZIOz5wAAX0l61NWpYQdv0"
                                            videoId={Utils.GetIDyoutobe(item.LinkYoutube)}
                                            // play={true}
                                            origin="https://www.youtube.com"
                                            controls={1} />
                                }
                            </View>
                            :
                            (
                                Utils.checkIsVideo(urlAvatar) ?
                                    <Video style={{ height: '100%', width: '100%', backgroundColor: colors.black }} source={{ uri: urlAvatar }} paused={true} resizeMode={'cover'} /> :
                                    <Image source={{ uri: urlAvatar }} style={{ height: '100%', width: '100%', backgroundColor: colors.black }} resizeMode={'cover'} />
                            )
                    }
                    {
                        item.Type == 3 || item.Type == 1 && urlAvatar != "" ?
                            <View style={{ position: 'absolute' }}>
                                <Image style={{ width: 64, height: 54 }}
                                    source={Images.icPlayYoutube} resizeMode='contain' />
                            </View> : null
                    }
                </TouchableOpacity>
                <Text style={{ fontSize: reText(14), width: '100%', marginVertical: 5 }} numberOfLines={2}>
                    {item.TieuDe}
                </Text>
                <Text style={styles.textTime}>{item.CreateDate}</Text>
            </View>
        )
    }

    render() {
        const { arrVideo, refreshing } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={this.ScreenType == 'Video' ? 'Thư viện video' : 'Thư viện hình ảnh'}
                    styleTitle={{ color: colors.white }}
                // iconRight={Images.icSearch}
                // Sright={{ tintColor: 'white' }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white, alignItems: 'center', paddingTop: 15, paddingBottom: paddingBotX }}>
                    <FlatList
                        data={arrVideo}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `${index}`}
                        showsHorizontalScrollIndicator={false}
                        ref={(ref) => this.FlatList = ref}
                        numColumns={2}
                        onRefresh={this.onRefresh}
                        refreshing={refreshing}
                        onEndReached={() => {
                            if (!this.onEndReachedCalledDuringMomentum) {
                                this.onLoadmore()
                                this.onEndReachedCalledDuringMomentum = true;
                            }
                        }}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                        onEndReachedThreshold={0.4}
                    />
                    <IsLoading></IsLoading>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    groupview: {
        paddingVertical: 10,
    },
    topIcon: {
        alignItems: 'center',
    },
    topText: {
        fontSize: reText(14),
        marginTop: 5
    },
    textGrp: {
        fontSize: reText(16),
        marginVertical: 8,
        fontWeight: 'bold'
    },
    textTime: {
        fontSize: reText(12),
        color: colors.brownGreyFour
    },
    groupVideo: {
        alignItems: 'center',
        paddingVertical: 10,
        marginRight: 10,
        width: 187
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ListVieoImage, mapStateToProps, true);
