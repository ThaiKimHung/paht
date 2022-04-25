import React, { Component, useState, useRef, useMemo } from 'react';
import { View, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import ImageViewer from 'react-native-image-zoom-viewer';
import DocumentPicker from 'react-native-document-picker';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { nstyles, sizes, colors } from '../styles';
import { IsLoading } from '../../components';
import Utils from '../../app/Utils';
import { ImagesChat } from '../Images';
import ImageZoom from './ImageZoom';
import apiChat from '../api/apis';
import { nheight, nwidth } from '../../styles/styles';
const COLOR_ICON = colors.peacockBlue
const StackImageShow = (props) => {
    const FLATLIST = useRef(null);
    const SWIPER = useRef(null);
    const [dataImage, setDataImage] = useState(Utils.ngetParam({ props }, "data", []));
    const [keyType, setkeyType] = useState(Utils.ngetParam({ props }, "key", [DocumentPicker.types.images]))
    const [indexSelect, setindexSelect] = useState(0);
    //function
    const _sendFile = async (File) => {
        Utils.goback({ props })
        props.SendFileOfGroup([...File]);
    }
    const optionIos = (data, item) => {
        setDataImage([...dataImage].concat(data));
        // Utils.nlog("gia tri item option--------", item, data)
    }
    const _openFile = async (item) => {
        if (keyType.id < 3 && Platform.OS == 'ios') {
            Utils.goscreen({ props }, "Modal_MediaPickerChat", {
                assetType: keyType.id == 1 ? 'Photos' : 'Videos',
                response: (data) => optionIos(data, item)
            });
            return;
        }
        try {
            let item = await Utils.ngetParam({ props }, "key", [DocumentPicker.types.images])
            // Utils.nlog("lod onPress file", item)
            let results = await DocumentPicker.pickMultiple({
                type: item.key
            });
            results = results.map(item => {
                return { ...item, url: item.uri };
            });
            setDataImage([...dataImage].concat(results));
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }
    const _selectImage = (index) => {
        SWIPER.current.scrollToIndex({ index });
        //scrollToIndex
        setindexSelect(index);
    };
    const _renderItemImage = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ zIndex: 1 }}
                onPress={() => _selectImage(index)}
            >
                <Image
                    // defaultSource={ImagesChat.icPhotoBlack}
                    source={item?.url ? { uri: item.url } : ImagesChat.icPhotoBlack}
                    style={{
                        height: sizes.sizes.nImgSize80,
                        borderWidth: index == indexSelect ? 1 : 0,
                        borderColor: COLOR_ICON,
                        width: sizes.sizes.nImgSize80, marginRight: 2
                    }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    };
    const _renderFooterFlatlist = () => {
        return (
            <TouchableOpacity
                onPress={_openFile}
                style={{
                    height: 80, width: 50,
                    justifyContent: 'center', alignItems: 'center'
                }}>
                <Image
                    resizeMode='cover'
                    source={ImagesChat.icAddAction} style={[nstyles.nstyles.nIcon40, { padding: 5 }]}>
                </Image>
            </TouchableOpacity>
        )
    }
    // Utils.nlog("gia tri data", dataImage);
    const _onchangeImage = ({ index }) => {
        setindexSelect(index);
        FLATLIST.current.scrollToIndex({ index });
    };
    return (
        <View style={{
            flex: 1, backgroundColor: colors.white,
            paddingBottom: 30,
            paddingTop: nstyles.paddingTopMul(),
        }}>
            <View
                style={[{
                    padding: 5,
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }]}>
                <TouchableOpacity
                    onPress={() => Utils.goback({ props })}
                    style={{
                        width: 50,
                        padding: 5,
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                    <Image
                        resizeMode='contain'
                        source={ImagesChat.icBack} style={[{ width: 25, height: 25, tintColor: COLOR_ICON }]}>
                    </Image>
                </TouchableOpacity>
                <View style={{ flex: 1, marginRight: 50, }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: COLOR_ICON, alignSelf: 'center' }}>
                        {`${indexSelect + 1}/${dataImage.length}`}
                    </Text>
                </View>
                {/* <TouchableOpacity
                    // onPress={_loadDataSearch}
                    style={{
                        paddingHorizontal: 10
                    }}>
                    <Image resizeMode="contain" source={ImagesChat.icCross} style={[nstyles.nstyles.nIcon26, { tintColor: COLOR_ICON }]}>
                    </Image>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                    onPress={_openFile}
                    style={{
                        width: 50,
                        padding: 5,
                        // backgroundColor: COLOR_ICON,
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                    <Image
                        resizeMode='cover'
                        source={ImagesChat.addFile}
                        style={[nstyles.nstyles.nIcon26, { tintColor: COLOR_ICON }]}>
                    </Image>
                </TouchableOpacity> */}
            </View>

            <SwiperFlatList
                onChangeIndex={_onchangeImage}
                ref={SWIPER}
            // autoplay
            // autoplayDelay={2}
            // autoplayLoop
            // index={2}
            // showPagination
            >
                {
                    dataImage.map((item, index) => {
                        return (<View key={index} style={[styles.child, { backgroundColor: 'black' }]}>
                            <Image
                                resizeMode='contain'
                                source={{ uri: item.uri }} style={[{ width: '100%', height: '100%' }]}>
                            </Image>

                        </View>)
                    })
                }

            </SwiperFlatList>



            <View style={{
                position: 'absolute', bottom: nstyles.paddingTopMul(), left: 0,
                right: 0, height: 80, zIndex: 200
            }}>
                <FlatList
                    data={dataImage}
                    renderItem={_renderItemImage}
                    keyExtractor={(item, index) => `${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={_renderFooterFlatlist}
                    ref={FLATLIST}
                />
            </View>

            {/* <TouchableOpacity
                onPress={() => _sendFile(dataImage)}
                style={{
                    position: 'absolute',
                    bottom: 120, right: 0,
                    padding: 10,
                    backgroundColor: COLOR_ICON,
                    marginHorizontal: 10,
                    borderRadius: 30,

                }}>

                <Image source={ImagesChat.icSendMsg} style={[{ width: 20, height: 20, tintColor: 'white', }]}>
                </Image>
            </TouchableOpacity> */}
            <TouchableOpacity
                onPress={() => _sendFile(dataImage)}
                activeOpacity={0.5}
                style={{
                    position: 'absolute',
                    bottom: 100, right: 20,
                    // paddingHorizontal: 20,
                    backgroundColor: '#276289',
                    padding: 13,
                    borderRadius: 50,
                    alignItems: 'center',
                    shadowColor: 'black',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 2,// do itemdanhsach shadow k hiện rõ trên android
                }}>
                {/* <Text style={{ textAlign: 'center' }}>Search</Text> */}
                <Image source={ImagesChat.icSendMsg} style={[{ width: 24, height: 24, tintColor: colors.white }]} resizeMode={'contain'} />
            </TouchableOpacity>

        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    child: {
        height: nheight() * 1,
        width: nwidth(),
        justifyContent: 'center'
    },
    text: {
        fontSize: nwidth() * 0.5,
        textAlign: 'center'
    }
});
const mapStateToProps = state => ({
    dataInFo: state.ReducerGroupChat.InFoGroup,
    // SetMessage: state.SetMessage,
});
export default Utils.connectRedux(StackImageShow, mapStateToProps, true)




