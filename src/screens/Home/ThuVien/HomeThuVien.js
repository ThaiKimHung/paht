import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import { color } from 'react-native-reanimated'
import Utils from '../../../../app/Utils'
import { HeaderCus, WebViewCus } from '../../../../components'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles, paddingBotX, Width } from '../../../../styles/styles'
import { Images } from '../../../images'
import { BlurView } from '@react-native-community/blur'
import HomeThanhToan from '../../dichVuCong/thanhtoan/HomeThanhToan'
import { IsLoading } from '../../../../components'
import { getListThuVien } from '../../../apis/apiThuVien'
import { appConfig } from '../../../../app/Config'
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';

class HomeThuVien extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrVideo: [],
            arrImage: [],
            arrSound: [],
            keys: 'Type',
            vals: 1,//Type: 1 (link yotube), 2: Audio (link có sẵn) 3: Uploas file 4: hinh ảnh Nếu ko truyền hệ thống mặc định 1,2,3
            page: 1,
            record: 6,
        }
    }
    componentDidMount() {
        nthisIsLoading.show()
        this.loadListData().then(res => {
            if (res)
                nthisIsLoading.hide()
        })
    }
    loadListData = async () => {
        const { keys, vals, page, record } = this.state
        let video = await getListThuVien(keys, "1,3", page, record)
        let mp3 = await getListThuVien(keys, 2, page, record)
        // let video2 = await getListThuVien(keys, 3, page, record)
        let image = await getListThuVien(keys, 4, page, record)

        Utils.nlog("data ThuVien: ",video, image, mp3);


        if (video?.status == 1 && image?.status == 1 && mp3?.status == 1) {
            this.setState({ arrVideo: video.data, arrImage: image.data, arrSound: mp3.data })
        }
        else {
            if (video?.status == 1) {
                this.setState({ arrVideo: video.data });
            }
            if (image?.status == 1) {
                this.setState({ arrImage: image.data });
            }
            if (mp3?.status == 1) {
                this.setState({ arrSound: mp3.data })
            }
        }
        return true
    }



    playMedia = (Type, url, item) => {
        url = Utils.replaceAll(url, " ", "%20");
        switch (Type) {
            //http://media.daithainguyen.vn//Upload/Audio/Nam2011/canhac/Thanh%20pho%20toi%20yeu%20(Tu%20Anh)%20Thanh%20Tuan-Luu%20Xa.mp3
            case 2:
                Utils.goscreen(this, 'Modal_SoundPlay', { source: Utils.replaceAll(item.LinkYoutube, " ", "%20"), imagebg: appConfig.domain.slice(0, -1) + item.AvatarPath })
                break;
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

    renderItem = (item, index, isVideo = false) => { // Render Video, và Hình Ảnh
        const { arrVideo, arrImage } = this.state;

        let urlAvatar = item.AvatarPath && item.AvatarPath != "" ? item.AvatarPath : item.Type == 1 ? "" : item.Path;
        urlAvatar = isVideo == true ? urlAvatar : item.Path;
        urlAvatar = urlAvatar.includes("http") && urlAvatar.includes("://") || urlAvatar == "" ? urlAvatar : appConfig.domain.slice(0, -1) + urlAvatar;

        let urlSource = item.Type == 1 ? item.LinkYoutube : item.Path;
        urlSource = urlSource.includes("http") && urlSource.includes("://") ? urlSource : appConfig.domain.slice(0, -1) + urlSource;

        let lengthArr = isVideo == true ? arrVideo.length : arrImage?.length;
        if (item.Type == 1 && urlAvatar == "") {
            item.LinkYoutube = item.LinkYoutube.split("&t=")[0];
        }
        return (
            index < 5 ?
                <View key={index} style={{ marginRight: 8, width: Width(40) }}>
                    <TouchableOpacity activeOpacity={0.9} style={[{
                        width: Width(40), height: Width(40) / 1.6,
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
                        {
                            index == 4 && lengthArr > 5 ?
                                <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#00000090', position: 'absolute', justifyContent: 'center', alignItems: 'center', right: 0, left: 0, bottom: 0, top: 0 }}
                                    onPress={() => Utils.goscreen(this, 'sc_ListVieoImage', { ScreenType: isVideo == true ? 'Video' : 'Image' })}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Xem tất cả</Text>
                                </TouchableOpacity> : null
                        }
                    </TouchableOpacity>
                    <Text style={{ fontSize: reText(14), width: '100%', marginVertical: 5 }} numberOfLines={2}>
                        {item.TieuDe}
                    </Text>
                    <Text style={styles.textTime}>{item.CreateDate}</Text>
                </View>
                : null
        )
    }

    render() {
        const { arrVideo, arrImage, arrSound } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={'Thư viện'}
                    styleTitle={{ color: colors.white }}
                    // iconRight={Images.icSearch}
                    Sright={{ tintColor: 'white' }}
                />
                <ScrollView style={{ flex: 1, width: '100%' }}>
                    <View style={{ marginBottom: 10 + paddingBotX, marginHorizontal: 12 }}>
                        {
                            (arrVideo?.length ? 1 : 0) + (arrImage?.length ? 1 : 0) + (arrSound?.length ? 1 : 0) <= 1 ? null :
                                <View style={[styles.groupview, { flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center' }]}>
                                    {
                                        arrVideo?.length == 0 ? null :
                                            <TouchableOpacity style={styles.topIcon} onPress={() => Utils.goscreen(this, 'sc_ListVieoImage', { ScreenType: 'Video' })}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image source={Images.icBGTV} style={nstyles.nIcon50}></Image>
                                                    <Image source={Images.icVideo} style={{ position: 'absolute', width: 30, height: 26 }}></Image>
                                                </View>
                                                <Text style={styles.topText}>Video</Text>
                                            </TouchableOpacity>
                                    }
                                    {
                                        arrImage?.length == 0 ? null :
                                            <TouchableOpacity style={styles.topIcon} onPress={() => Utils.goscreen(this, 'sc_ListVieoImage', { ScreenType: 'Image' })}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image source={Images.icBGTV} style={[nstyles.nIcon50, { tintColor: colors.orange }]}></Image>
                                                    <Image source={Images.icImage} style={{ position: 'absolute', width: 30, height: 26 }}></Image>
                                                </View>
                                                <Text style={styles.topText}>Hình ảnh</Text>
                                            </TouchableOpacity>
                                    }
                                    {
                                        arrSound?.length == 0 ? null :
                                            <TouchableOpacity style={styles.topIcon} onPress={() => Utils.goscreen(this, 'sc_ListSound')}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image source={Images.icBGTV} style={nstyles.nIcon50, { tintColor: colors.blueLight }}></Image>
                                                    <Image source={Images.icSound} style={{ position: 'absolute', width: 30, height: 26 }}></Image>
                                                </View>
                                                <Text style={styles.topText}>Âm thanh</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                        }
                        {arrVideo?.length > 0 ?
                            <View style={[styles.groupview, { alignContent: 'center' }]}>
                                <Text style={styles.textGrp}>Video</Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}>
                                    {arrVideo.map((item, index) => this.renderItem(item, index, true))}
                                </ScrollView>
                            </View> : null}
                        {arrImage?.length > 0 ?
                            <View style={[styles.groupview, { alignContent: 'center' }]}>
                                <Text style={styles.textGrp}>Hình ảnh</Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}>
                                    {arrImage?.map(this.renderItem)}
                                </ScrollView>
                            </View> : null
                        }
                        {arrSound?.length > 0 ?
                            <View style={[styles.groupview, { alignContent: 'center', width: '100%' }]}>
                                <Text style={styles.textGrp}>Âm thanh</Text>
                                {/* <Video source={{ uri: arrSound[0] ? arrSound[0].LinkYoutube : null }}></Video> */}
                                {arrSound?.map((item, index) =>
                                    index < 6 ?
                                        (
                                            index == 5 ?
                                                <View key={index} style={{ justifyContent: 'center', alignItems: 'center', width: Width(95), marginBottom: Platform.OS ? 30 : 0 }}>
                                                    <TouchableOpacity style={{ backgroundColor: colors.colorRed, width: Width(40), height: 40, justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => Utils.goscreen(this, 'sc_ListSound')}>
                                                        <Text style={{ color: 'white' }}>Xem tất cả âm thanh</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                : <TouchableOpacity key={index} style={{ flexDirection: 'row', marginVertical: 10, width: '100%' }}
                                                    onPress={() => this.playMedia(item.Type, "", item)}>
                                                    <Image source={Images.icMP3} style={nstyles.nIcon30}></Image>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: reText(14), width: '100%' }} numberOfLines={2}>
                                                            {item.TieuDe}
                                                        </Text>
                                                        <Text style={styles.textTime}>{item.CreateDate}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                        )
                                        : null
                                )}
                            </View> : null}
                    </View>
                </ScrollView>
                <IsLoading></IsLoading>
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
export default Utils.connectRedux(HomeThuVien, mapStateToProps, true);
