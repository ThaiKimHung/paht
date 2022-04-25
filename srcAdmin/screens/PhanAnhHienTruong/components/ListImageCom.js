import React, { useState } from 'react';
import {
    Modal, TouchableOpacity,
    View, Image, StyleSheet, Text, Platform,
    FlatList
} from 'react-native'
import Utils from '../../../../app/Utils';
import { Images } from '../../../images';
import { reSize } from '../../../../styles/size';
import { Width, nstyles } from '../../../../styles/styles';
import { colors } from '../../../../styles';
import { ScrollView } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import VideoCus from '../../../../components/Video/VideoCus';
import { ConfigScreenDH } from '../../../routers/screen';


export const ListImageCom = (props) => {
    const {
        ListHinhAnh = [],
        onPressDelete = () => { Utils.nlog('onPressDelete') },
        onPressDeleteitem = () => { },
        requestCameraPermission = () => { Utils.nlog('requestCameraPermission') },
        isView = false,
    } = props;
    let arrHinhViewZoom = ListHinhAnh;
    arrHinhViewZoom = arrHinhViewZoom.map(item => {
        return { ...item, url: item.uri }
    })
    // const [indexHinhViewZoom, setIndexHinh] = useState(0);
    // const [showFullImage, enableFullImage] = useState(false);
    // const [showCloseImage, enableCloseImage] = useState(false);

    //IsVideo

    const _XoaHinhTrongDS = (indexdel) => {
        let arrHinh = ListHinhAnh.slice();
        var imageXoa = ListHinhAnh.find((item, index) => index == indexdel);
        // Utils.nlog("vao xoá hinnh ", imageXoa);
        // onPressDelete(imageXoa)
        onPressDeleteitem(imageXoa)
        let arrHinhZoom = arrHinhViewZoom.slice();
        arrHinh = arrHinh.filter((item, index) => index != indexdel);
        arrHinhZoom = arrHinhZoom.filter((item, index) => index != indexdel);
        onPressDelete(arrHinh)
    }
    const {
        // onChange = () => {},
        isUpload = true,
    } = props;
    // Utils.nlog("gia tri lishinh", ListHinhAnh)
    return (
        <ScrollView
            horizontal={true}
            style={{ marginVertical: 10, height: Width(25) }}>
            {isUpload == true ? <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => requestCameraPermission()}>
                <View style={{
                    borderWidth: 1,
                    borderColor: colors.colorGrayIcon,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Width(25),
                    height: Width(25),
                    marginRight: 10,

                }}>
                    <Image
                        source={Images.icCameraBlack}
                        style={{ width: reSize(24), height: reSize(24) }}
                        resizeMode={'contain'} />
                </View>
            </TouchableOpacity> : null
            }
            {
                ListHinhAnh.map((item, index) => {
                    if (item.timePlay && item.timePlay > 0) {
                        Utils.nlog("index -----------------: 2    ", index, item)
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={() => {
                                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_PlayMedia, { source: item.uri });

                                }}
                                style={{
                                    borderWidth: 1,
                                    borderColor: colors.colorGrayIcon,
                                    borderRadius: 5,
                                    width: Width(25),
                                    height: Width(25),
                                    marginRight: 10,
                                }}>

                                <Image style={{
                                    width: Width(25),
                                    height: Width(25), borderRadius: 5,
                                }}
                                    source={{ uri: item.uri }}
                                    resizeMode='cover' />
                                {/* <Text>hihi</Text> */}
                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={Images.icVideoBlack} style={[nstyles.nIcon24, { backgroundColor: colors.black_50, padding: 5, borderRadius: 8 }]} resizeMode={'contain'} />
                                </View>
                                {isUpload == true ? <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                    onPress={() => { isView == true ? _XoaHinhTrongDS(index) : () => { } }}>
                                    <Image
                                        style={{ width: reSize(24), height: reSize(24), tintColor: 'red' }}
                                        source={Images.icClose} />
                                </TouchableOpacity> : null}
                            </TouchableOpacity>
                        )
                    } else {
                        let type = 0;
                        let checkImage = Utils.checkIsImage(item.uri);
                        let checkVideo = Utils.checkIsVideo(item.uri);
                        Utils.nlog("giá trị image hay video là ---------------- : ", checkImage + " -video- " + checkVideo, item.uri)
                        if (checkVideo == true) {

                            type = 1;
                        }
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (type == 0) {
                                        Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ShowListImage, { ListImages: arrHinhViewZoom, index: index });
                                        // setIndexHinh(index);
                                        // enableFullImage(true);
                                    } else {
                                        Utils.goscreen(props.nthis, ConfigScreenDH.Modal_PlayMedia, { source: item.uri });
                                    }
                                }}
                                style={{
                                    borderWidth: 1,
                                    borderColor: colors.colorGrayIcon,
                                    borderRadius: 5,
                                    width: Width(25),
                                    height: Width(25),
                                    marginRight: 10,
                                }}>
                                {type == 1 ?
                                    <VideoCus
                                        source={{ uri: item.uri }}
                                        style={{
                                            width: Width(25),
                                            height: Width(25), borderRadius: 5,
                                        }}
                                        resizeMode='cover'
                                        paused={true}
                                    />
                                    // null
                                    : <Image style={{
                                        width: Width(25),
                                        height: Width(25), borderRadius: 5,
                                    }}
                                        source={{ uri: item.uri }}
                                        resizeMode='cover' />
                                }
                                {/* <Image style={{
                                    width: Width(25),
                                    height: Width(25), borderRadius: 5,
                                }}
                                    source={{ uri: item.uri }}
                                    resizeMode='cover' /> */}
                                {
                                    type == 0 ? null :
                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={Images.icVideoBlack} style={[nstyles.nIcon24, { backgroundColor: colors.black_50, padding: 5, borderRadius: 8 }]} resizeMode={'contain'} />
                                        </View>
                                }
                                {isUpload == true ? <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                    onPress={() => { isView == true ? _XoaHinhTrongDS(index) : () => { } }}>
                                    <Image
                                        style={{ width: reSize(24), height: reSize(24), tintColor: 'red' }}
                                        source={Images.icClose} />
                                </TouchableOpacity> : null
                                }
                            </TouchableOpacity>
                        )
                    }

                }
                )}
            {/* <Modal
                animationType="slide"
                onRequestClose={() => {
                    enableFullImage(false);
                    enableCloseImage(false);
                }}
                visible={showFullImage}>
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <ImageViewer
                        // style={{ flex: 1 }}
                        imageUrls={arrHinhViewZoom}
                        enableSwipeDown={true}
                        index={indexHinhViewZoom}
                        onChange={index => setIndexHinh(index)}
                        onSwipeDown={() => enableFullImage(false)}
                        onClick={() => enableCloseImage(!showCloseImage)}
                    />
                    {showCloseImage ?
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'black', opacity: 0.5, borderRadius: 10, margin: 10 }}
                            activeOpacity={0.5}
                            onPress={() => {
                                enableFullImage(false);
                                enableCloseImage(false);
                            }}>
                            <Image
                                style={{ width: reSize(30), height: reSize(30), margin: 15, tintColor: 'gray' }}
                                source={Images.icClose} />
                        </TouchableOpacity> : null}
                </View>
            </Modal> */}
        </ScrollView>
    )

}