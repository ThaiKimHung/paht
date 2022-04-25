import React, { useState } from 'react';
import {
    Modal, TouchableOpacity,
    View, Image, StyleSheet,
    FlatList, Text, Linking
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';
import Utils from '../../../../app/Utils';
import { Images } from '../../../images';
import { reSize } from '../../../../styles/size';
import { Width, nstyles } from '../../../../styles/styles';
import { colors } from '../../../../styles';
import { ScrollView } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import VideoCus from '../../../../components/Video/VideoCus';


export const ListHinhAnhCom = (props) => {
    const {
        buttonDelete = true,
        buttonCamera = true,
        link = false,
        ListHinhAnh = [],
        onPressDelete = () => { Utils.nlog('onPressDelete') },
        requestCameraPermission = () => { Utils.nlog('requestCameraPermission') }
    } = props;
    const arrHinhViewZoom = ListHinhAnh.filter(e => e.Type != 2);
    const arrFile = ListHinhAnh.filter(e => e.Type == 2);
    const _XoaHinhTrongDS = (indexdel) => {
        let arrHinh = ListHinhAnh.slice();
        let hinhdelete = arrHinh[indexdel];
        let arrHinhZoom = arrHinhViewZoom.slice();
        arrHinh = arrHinh.filter((item, index) => index != indexdel);
        arrHinhZoom = arrHinhZoom.filter((item, index) => index != indexdel);
        onPressDelete(arrHinh, hinhdelete)
    }
    // Utils.nlog('=========', ListHinhAnh)
    return (
        <View>
            <ScrollView
                horizontal={true}
            >
                {buttonCamera ? <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => requestCameraPermission()}
                >
                    <View style={{
                        borderWidth: 1,
                        borderColor: colors.colorGrayIcon,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: Width(20),
                        height: Width(20),
                        margin: 10,
                    }}>
                        <Image
                            source={Images.icCmr}
                            style={{}}
                            resizeMode={'contain'} />
                    </View>
                </TouchableOpacity> : null}
                {arrHinhViewZoom.map((item, index) => {
                    let checkVideo = Utils.checkIsVideo(item.Link)
                    return (
                        <View key={index} style={{ flexDirection: 'column' }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={async () => {
                                    if (item.IsVideo) {
                                        Utils.goscreen(props.nthis, 'Modal_PlayMedia', { source: link ? item.Link : item.uri });
                                    } else
                                        Utils.goscreen(props.nthis, 'Modal_ShowListImage', { ListImages: arrHinhViewZoom.map(item => { return { uri: item.Link, url: item.Link } }), index: index, objKeyURL: 'Link' });
                                }}
                                style={{
                                    borderWidth: 1,
                                    borderColor: colors.colorGrayIcon,
                                    borderRadius: 5,
                                    width: Width(20),
                                    height: Width(20),
                                    marginRight: 10,
                                    marginVertical: 10,
                                }}>
                                {
                                    item.IsVideo ?
                                        <Video
                                            source={{ uri: link ? item.Link : item.uri }}
                                            style={{
                                                width: Width(20),
                                                height: Width(20), borderRadius: 5,
                                            }}
                                            resizeMode='cover'
                                            paused={true}
                                        />
                                        : <Image style={{
                                            width: Width(20),
                                            height: Width(20), borderRadius: 5,
                                        }}
                                            source={{ uri: link ? item.Link : item.uri }}
                                            resizeMode='cover' />
                                }
                                {
                                    checkVideo ?
                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={Images.icVideoBlack} style={[nstyles.nIcon24, { backgroundColor: colors.black_50, padding: 5, borderRadius: 8 }]} />
                                        </View> : null
                                }

                                {buttonDelete ? <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                    onPress={() => _XoaHinhTrongDS(index)}
                                >
                                    <Image
                                        style={{ width: reSize(20), height: reSize(20), tintColor: colors.white }}
                                        source={Images.icClose} />
                                </TouchableOpacity> : null}
                            </TouchableOpacity>

                        </View>

                    )
                })}
            </ScrollView>
            {
                arrFile.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => Linking.openURL(item.Link)} style={{ flexDirection: 'row', flex: 1, paddingVertical: 5, alignItems: 'center' }}>
                            <Image source={Images.icAttached} style={[]} />
                            <Text style={{ marginLeft: 5 }}>{item.TenFile}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>

    )

}
