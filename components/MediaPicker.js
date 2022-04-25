import React, { Component, PureComponent } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    Alert, TouchableOpacity, Dimensions, PermissionsAndroid,
    FlatList, RefreshControl, ScrollView, Linking, BackHandler, Modal, Animated, Easing, StatusBar
} from 'react-native';

import CameraRoll from "@react-native-community/cameraroll";
import { heightHed, heightStatusBar, nstyles, nwidth, paddingTopMul, nheight, Height } from '../styles/styles';
import Utils from '../app/Utils';
import HeaderCom from './HeaderCom';
import { colors } from '../styles';
import { ImgComp } from './ImagesComponent';
import { ButtonCom, HeaderCus } from '.';
import ImageCus from './ImageCus'
import { reText } from '../styles/size';

const stMediaPicker = StyleSheet.create({

});

export default class MediaPicker extends Component {
    constructor(props) {
        super(props);
        this.options = { //DEFAULT OPTIONS
            assetType: 'All',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: () => { }, // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        this.options = {
            ...this.options,
            ...this.props.navigation.state.params //--this.options media
        };
        console.log('options', this.options)
        this.isend = true;
        //----
        this.state = {
            //data globle
            isLoading: false,
            //data local
            missingPermission: false,
            permissionLib: false,
            photos: [],
            countChoose: 0,
            permissionIOS: true,
            indexNow: -1,
            sl: 51,
            opacityMain: 1,

            LstAlbum: [],
            AlbumCurrent: { count: 0, title: "All" },
            ViewScale: new Animated.Value(0),
            statusDropAlbum: 'close'
        }
        if (Platform.OS == 'android') {
            this.androidRequestPermissionAndLoadMedia();
        }
    }

    UNSAFE_componentWillMount = async () => {
        if (Platform.OS == 'ios') {
            this.loadMedia();
        }
        else {
            // this.androidRequestPermissionAndLoadMedia();
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        if (this.state.statusDropAlbum == 'open' && Platform.OS === 'android') {
            this.toggleAlbum()
            return true
        } else {
            this.options.response({ iscancel: true }); Utils.goback(this);
            return true
        }
    }

    componentWillUnmount = async () => {
        try {
            this.isend = true;
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    toggleAlbum = () => {
        Animated.timing(this.state.ViewScale, {
            toValue: this.state.statusDropAlbum == 'open' ? 0 : 1,
            duration: 200,           // <-- animation duration
            easing: Easing.linear,   // <-- or any easing function
            useNativeDriver: false   // <-- need to set false to prevent yellow box warning
        }).start(() => {
            this.setState({ statusDropAlbum: this.state.statusDropAlbum == 'open' ? 'close' : 'open' }, () => {
                this.isend = true;
                this.setState({ countChoose: 0 }, () => {
                    this.loadMedia(51)
                })
            })
        });
    }


    loadMedia = async (ssl = 0) => {
        if (Platform.OS == 'android') {
            let FlagAssetType = 'All'
            if (['Photos', 'Videos'].includes(this.options.assetType)) {
                FlagAssetType = this.options.assetType
            }
            const album = await CameraRoll.getAlbums({ assetType: FlagAssetType })
            // console.log('album', album);
            if (album.length > 0) {
                this.setState({ LstAlbum: album }, () => {
                    let arrAlbum = [...this.state.LstAlbum]
                    arrAlbum.forEach(async (e, i) => {
                        const temThumbnail = await CameraRoll.getPhotos({
                            groupName: e.title,
                            assetType: this.options.assetType,
                            first: 1,
                        })
                        arrAlbum[i] = { ...e, thumbnail: temThumbnail.edges[0].node.image.uri }
                    });
                    // console.log("arrAlbum Thumbnail", arrAlbum)
                    this.setState({ LstAlbum: arrAlbum })
                    if (this.state.AlbumCurrent.title == 'All' && arrAlbum.length > 0) {
                        this.setState({ AlbumCurrent: arrAlbum[0] })
                    }
                })

            }
        }
        if (!this.isend) {
            return;
        }
        let sl = this.state.sl;
        sl += ssl;
        let paramsCamera = {
            first: sl,
            assetType: this.options.assetType, //--set type - all, photos, videos,
            include: ["filename", "imageSize"]
        };
        // Phúc code mới--------------------------------------------------
        if (this.state.AlbumCurrent != 'All' && Platform.OS == 'android') {
            paramsCamera = {
                ...paramsCamera,
                groupName: this.state.AlbumCurrent.title
            }
        } else {
            // Code cũ
            paramsCamera.groupTypes = this.options.groupTypes;
        }
        //----------------------------------------------------------------

        CameraRoll.getPhotos(paramsCamera)
            .then(r => {
                var mlid = [];
                // console.log('XXXXXXX:', r.edges);
                if (this.options.showTakeCamera && mlid.length == 0 && r.edges.length == 0) {
                    mlid.push({
                        uri: 'BTN_TakePhoto_x',
                    });
                }
                r.edges.map((item, index) => {
                    if (this.options.showTakeCamera && mlid.length == 0) {
                        mlid.push({
                            uri: 'BTN_TakePhoto_x',
                        });
                    }

                    mlid.push({
                        ...item,
                        uri: item.node.image.uri,
                        timePlay: item.node.type && item.node.type.split('/')[0] == 'video' ? 10 : 0,//item.node.image.playableDuration ? item.node.image.playableDuration : 0,  // =0: img, >0: videos
                        height: item.node.image.height,
                        width: item.node.image.width,
                        filename: item.node.image.filename,
                        ischoose: false
                    });
                });
                //-----
                this.isend = r.page_info.has_next_page;
                this.setState({ photos: mlid, sl: sl, permissionLib: true });

            }, (reason) => {
                Utils.nlog('no permission');
                if (reason.toString().includes('User denied access') && Platform.OS == 'ios')
                    this.setState({ permissionIOS: false });
            })
            .catch((err) => {
                Utils.nlog('no ok');
                //Error Loading Images
            });
    };

    hasAndroidPermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    androidRequestReadStoragePermission() {
        return new Promise((resolve, reject) => {
            if (
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE) ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
                return resolve();
            }
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
                .then(result => {
                    if (result === PermissionsAndroid.RESULTS.GRANTED) {
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(err => {
                    reject();
                    alert(err);
                });
        });
    }

    androidRequestPermissionAndLoadMedia = async () => {
        let checkPer = await this.hasAndroidPermission();
        if (checkPer) {
            this.setState({ missingPermission: false });
            this.loadMedia();
        } else
            this.setState({ missingPermission: true })
    }

    chooseItem = (index) => {
        let i = this.state.indexNow;
        let mtemp = this.state.photos;
        let icount = this.state.countChoose;
        //--gioi han sl chon
        if (this.options.multi && this.options.limitCheck > -1 && this.state.countChoose >= this.options.limitCheck && !mtemp[index].ischoose) {
            return;
        }
        //-----
        if (mtemp[index].ischoose)
            icount--; else icount++;
        if (i != -1)
            mtemp[i] = { ...mtemp[i], ischoose: false };
        mtemp[index] = { ...mtemp[index], ischoose: !mtemp[index].ischoose };

        this.setState({ photos: mtemp, countChoose: icount });
        this.setState({ photos: mtemp, countChoose: icount, indexNow: this.options.multi ? -1 : index });
    }

    prevMedia = (suri) => {
        // const imagesURL = [
        //     {
        //         url: 'https://img2.infonet.vn/w490/Uploaded/2020/pjauldz/2018_06_19/5.jpg',
        //     },
        // ];
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: suri }], index: 0 });
    }

    onPlayVideo = (suri) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: suri });
    }

    done = () => {
        let tdata = this.state.photos.slice();
        tdata = tdata.filter(item => item.ischoose);
        if (tdata.length == 0)
            this.options.response({ iscancel: true });
        else this.options.response(tdata);
        Utils.goback(this);
    }

    onResponse = (item, isok) => {
        if (isok) {
            Utils.goback(this);
            this.options.response([item]);
        } else {
            this.setState({ opacityMain: 1 });
        }
    }

    _openCamrera = () => {
        Utils.goscreen(this, 'ModalCamVideoCus', {
            onResponse: this.onResponse, showLeft: false,
            OptionsCam: this.options && this.options.assetType != 'All' ? this.options.assetType == 'Photos' || this.options.isAvatar ? 1 : 2 : 0,
            typeCamera: this.options?.typeCamera || 0
        });
        this.setState({ opacityMain: 0 });
    }

    renderItem = ({ item, index }) => {
        if (index == 0 && this.options.showTakeCamera) return (
            <TouchableOpacity activeOpacity={0.9}
                style={[nstyles.nmiddle, {
                    backgroundColor: colors.black_60,
                    width: (nwidth() - 30) / 3, height: (nwidth() - 30) / 3, marginRight: 5, marginTop: 5,
                    borderColor: '#E8E8E9', borderWidth: 0.5
                }]} onPress={this._openCamrera}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        tintColor: colors.white
                    }}
                    resizeMode='contain'
                    source={ImgComp.icCameraBlack}
                />
            </TouchableOpacity>
        )
        else return <ItemImage item={item} index={index} onPlayVideo={this.onPlayVideo}
            chooseItem={this.chooseItem} prevMedia={this.prevMedia} />
    }

    DropDownAlbum = () => {
        const colorTitleDrop = this.state.ViewScale.interpolate({
            inputRange: [0, 1],
            outputRange: ['white', 'black']
        });
        const rotateDrop = this.state.ViewScale.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });
        if (Platform.OS == 'android')
            return (
                <TouchableOpacity onPress={() => { this.toggleAlbum() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: reText(16), color: colors.white }}>{this.state.AlbumCurrent.title}</Animated.Text>
                    <Animated.Image
                        source={ImgComp.icDropDown}
                        style={[nstyles.nIcon14, {
                            tintColor: colors.white,
                            marginHorizontal: 5,
                            transform: [{ rotate: rotateDrop }]

                        }]}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )
    }

    render() {
        const height = (Platform.OS == 'android' ? heightHed() + heightStatusBar() : heightHed());
        const heigtListAlbum = this.state.ViewScale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Dimensions.get('screen').height],
        });
        return (
            <>
                <View style={[nstyles.ncontainerX, { opacity: this.state.opacityMain }]}>
                    {/* Header  */}
                    <HeaderCus
                        onPressLeft={() => { this.options.response({ iscancel: true }); Utils.goback(this); }}
                        iconLeft={ImgComp.icCloseWhite}
                        title={Platform.OS == 'android' ? '' : this.options.assetType == 'Videos' ? 'Thư viện video' : 'Thư viện hình ảnh'}
                        styleTitle={{ color: colors.white }}
                        iconRight={this.state.permissionLib ? null : ImgComp.icSetTingBlack}
                        Sright={{ tintColor: colors.white }}
                        onPressRight={() => { Linking.openSettings() }}
                        componentTitle={this.DropDownAlbum()}
                    />

                    {/* BODY */}
                    <View style={nstyles.nbody}>
                        { //--hiện thị hỏi quyền khi IOS ko có quyền truy cập ảnh
                            this.state.permissionIOS ?
                                <View style={{ flex: 1 }}>
                                    {
                                        this.options.limitCheck > 0 && this.options.multi && this.state.countChoose == this.options.limitCheck ?
                                            <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                                                <Text style={[nstyles.ntext, { color: colors.redGov, fontSize: 14, fontWeight: 'bold' }]}>
                                                    Số lượng tối đa được chọn: {this.options.limitCheck}
                                                </Text>
                                            </View> : null
                                    }
                                    <FlatList
                                        data={this.state.photos}
                                        style={{ flex: 1, backgroundColor: colors.white, padding: 10, paddingRight: 5, paddingTop: 5, marginBottom: 60 }}
                                        ref={(ref) => { this.listCmts = ref; }}
                                        keyboardShouldPersistTaps='handled'
                                        keyboardDismissMode='interactive'
                                        onEndReachedThreshold={0.3}
                                        onEndReached={() => {
                                            if (this.state.photos.length != 0) {
                                                this.loadMedia(30);
                                            }
                                        }}
                                        ListHeaderComponent={
                                            this.state.permissionLib ? null :
                                                <TouchableOpacity
                                                    onPress={() => { Linking.openSettings() }}
                                                    activeOpacity={0.9}
                                                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ textAlign: 'center', marginHorizontal: 30, marginBottom: 5 }}>Cho phép ứng dụng truy cập vào ảnh và video của bạn để có thể gửi phản ánh.</Text>
                                                    <Text style={{ fontWeight: 'bold', color: colors.blue }}>Đi đến cài đặt</Text>
                                                </TouchableOpacity>}
                                        renderItem={this.renderItem}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={3}
                                        keyExtractor={(item, index) => item.uri}
                                    />

                                    <View style={[nstyles.nrow, {
                                        position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-between', padding: 10,
                                        alignItems: 'center'
                                    }]}>
                                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }} />
                                        {/* {
                                        this.options.multi ?
                                            <Text style={[nstyles.ntext, { color: colors.black, fontWeight: "400" }]}>Đã chọn: {this.state.countChoose}</Text> : <Text />
                                    } */}
                                        {/* <TouchableOpacity style={[nstyles.nbtn_Bgr, { backgroundColor: '#43C9AA', borderRadius: 4, paddingHorizontal: 18 }]} activeOpacity={0.9}
                                        onPress={() => { this.done() }}>
                                        <Text style={nstyles.ntextbtn_Bgr}>Chọn</Text>
                                    </TouchableOpacity> */}
                                        <ButtonCom
                                            onPress={() => { this.done() }}
                                            text={this.options.multi ? 'Chọn ( ' + this.state.countChoose + ' )' : 'Chọn'}
                                            style={{ borderRadius: 5, flex: 1, }}
                                        />
                                    </View>
                                </View>
                                :
                                <TouchableOpacity style={[nstyles.nbtn_Bgr, {
                                    borderRadius: 5, paddingHorizontal: 18, alignSelf: 'center',
                                    paddingVertical: 5, backgroundColor: "#157EFB", marginTop: 20
                                }]} onPress={() => {
                                    Linking.openURL('app-settings:').catch((err) => {
                                        Utils.nlog(err);
                                    });
                                }}>
                                    <Text style={[nstyles.ntextbtn_Bgr, { fontSize: 14 }]}>Đi đến cài đặt</Text>
                                </TouchableOpacity>
                        }
                    </View>

                    {/* <View style={{height:200,width:'100%',backgroundColor:'red'}}>
                    <PlayMedia />
                </View> */}

                </View>
                {Platform.OS == 'android' && <Animated.View style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: colors.white,
                        top: height,
                        zIndex: 9999,
                        maxHeight: heigtListAlbum
                    }
                ]}>
                    <Animated.ScrollView style={{}}>
                        {this.state.LstAlbum.map((item, index) => {
                            return (
                                <TouchableOpacity key={index}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between', padding: 10,
                                        borderBottomWidth: 1, borderBottomColor: colors.grayLight
                                    }}
                                    onPress={() => {
                                        this.setState({ AlbumCurrent: item, statusDropAlbum: 'open' }, () => {
                                            this.toggleAlbum()
                                        })
                                    }}
                                >
                                    {/* <ImageCus source={{ uri: item.thumbnail }} style={{ width: 60, height: 60 }} resizeMode={'cover'} /> */}
                                    <Text style={{ fontSize: reText(16), flex: 1 }}>{item?.title} {`(${item.count})`}</Text>
                                    {this.state.AlbumCurrent.title == item.title &&
                                        <ImageCus source={ImgComp.icCheck} tintColor={colors.greenFE} style={[nstyles.nIcon20, { tintColor: colors.greenFE, alignSelf: 'center' }]} />
                                    }
                                </TouchableOpacity>
                            )
                        })}
                    </Animated.ScrollView>
                </Animated.View>}
            </>
        );
    }
}

class ItemImage extends PureComponent {

    render() {
        const { item, index, prevMedia, onPlayVideo, chooseItem } = this.props;
        // Utils.nlog("----------time paly", item)
        return (
            item.height == -1 ? null :
                <TouchableOpacity activeOpacity={0.9}
                    style={{
                        width: (nwidth() - 30) / 3, height: (nwidth() - 30) / 3, marginRight: 5, marginTop: 5,
                        borderColor: '#E8E8E9', borderWidth: 0.5
                    }} onPress={() => { prevMedia(item.uri) }}>
                    <Image
                        style={{
                            width: (nwidth() - 30) / 3,
                            height: (nwidth() - 30) / 3,
                        }}
                        resizeMode='cover'
                        source={{ uri: item.uri }}
                    />
                    {/* nút play video */}
                    {
                        item.timePlay > 0 ?
                            <TouchableOpacity style={{
                                position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center',
                                alignItems: 'center'
                            }} activeOpacity={0.9}
                                onPress={() => onPlayVideo(item.uri)}>
                                <Image
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                    source={ImgComp.mediaPlayButton}
                                />
                            </TouchableOpacity> : null
                    }
                    {/* nút chọn media */}
                    <TouchableOpacity style={[nstyles.shadown_nobgr, {
                        position: 'absolute', top: 5, right: 5,
                        backgroundColor: colors.black_16, borderRadius: 6
                    }]} activeOpacity={0.9}
                        onPress={() => { chooseItem(index) }}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            resizeMode='cover'
                            source={item.ischoose ? ImgComp.icChooseItemGreen : ImgComp.icCheckboxWhite}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
        );
    }
}
