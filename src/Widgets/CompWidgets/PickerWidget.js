import { View, Text, StyleSheet, ImageBackground, Image, Animated, TouchableOpacity } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react'
import { DropWidget, InputWidget } from '../CompWidgets'
import { colorsWidget, colors } from '../../../styles/color';
import { ApiRaoVat } from '../apis';
import Utils from '../../../app/Utils';
import { ImgWidget } from '../Assets';
import { nstyles } from '../../../styles/styles';
import TextApp from '../../../components/TextApp';
import { reText } from '../../../styles/size';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageCus from '../../../components/ImageCus';
import { Images } from '../../images';
import VideoCus from '../../../components/Video/VideoCus'

const PickerWidget = forwardRef((props, ref) => {
    const WIDTH_SIZE = props?.widthSize || 240
    const HEIGHT_SIZE = props?.heightSize || 240
    const timeLoop = props?.timeLoop || 4000
    const [data, setData] = useState(props?.dataFile || [])
    const [currentPage, setCurrentPage] = useState(1)
    const flatListRef = React.useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const onBottomTabPress = React.useCallback(index => {
        flatListRef.current.getNode()?.scrollToOffset({
            offset: index * WIDTH_SIZE
        })
    })

    const [indexInterval, setIndexInterval] = useState(0);

    useEffect(() => {
        if (props?.autoLoop && data.length > 1)
            onBottomTabPress(indexInterval)
    }, [indexInterval])

    useEffect(() => {
        if (props?.autoLoop && data.length > 1) {
            const timer = setInterval(() => {
                if (indexInterval < data.length - 1) {
                    setIndexInterval(indexInterval + 1);
                } else {
                    setIndexInterval(0);
                }
            }, timeLoop);
            // clearing interval
            return () => clearInterval(timer);
        }
    });

    useEffect(() => {
        if (props?.trackingFile) {
            props?.trackingFile(data)
        }
    }, [data])

    useImperativeHandle(ref, () => ({
        getData: () => {
            return data
        },
        setData: data => setData(data)
    }));

    const TabsDot = ({ onBottomTabPress }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {data?.map((item, index) => {
                    return (
                        <TouchableOpacity onPress={() => onBottomTabPress(index)} style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: index + 1 == currentPage ? colorsWidget.main : colorsWidget.grayDropdown,
                            marginHorizontal: 5
                        }} />
                    )
                })}
            </View>
        )
    }

    const onMomentumScrollEnd = (e) => {
        const pageNumber = Math.min(
            Math.max(
                Math.floor(e.nativeEvent.contentOffset.x / WIDTH_SIZE + 0.5) + 1,
                0
            ),
            data.length
        );
        setCurrentPage(pageNumber)
    };

    const onPressShow = (item) => {
        if (item?.typeFile == 'image') {
            const arrImg = data?.filter(e => e.typeFile == 'image')
            const findIndex = arrImg.findIndex(e => e.uri == item.uri);
            Utils.goscreen(props.nthis, 'Modal_ShowListImage', { ListImages: arrImg, index: findIndex });
        } else {
            Utils.navigate('Modal_PlayMedia', { source: encodeURI(item.uri) });
        }
    }

    const onDeleteFile = (item, index) => {
        if (data.length > 1) {
            let dataFileNew = data.map(e => {
                return e
            })
            dataFileNew.splice(index, 1);
            setData(dataFileNew);
        } else {
            setData([]);
        }
    }

    function isValidURL(url) {
        var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (RegExp.test(url)) {
            return true;
        } else {
            return false;
        }
    }

    function renderContent() {
        return (
            <View>
                <ImageBackground source={props?.isSeen ? {} : ImgWidget.icBkgPicker} style={[stPickerWidget.container]}>
                    <Animated.FlatList
                        ref={flatListRef}
                        horizontal
                        pagingEnabled
                        snapToAlignment={'center'}
                        snapToInterval={WIDTH_SIZE}
                        decelerationRate={'fast'}
                        showsHorizontalScrollIndicator={false}
                        data={data}
                        keyExtractor={(item, index) => `picker-${index}`}
                        onScroll={
                            Animated.event([
                                { nativeEvent: { contentOffset: { x: scrollX } } }
                            ], {
                                useNativeDriver: false,
                            })}
                        renderItem={({ item, index }) => {
                            let uri = item?.uri
                            if (item?.uri?.includes('ph://')) {
                                const appleId = item?.uri.substring(5, 41);
                                const fileNameLength = item?.filename.length;
                                const ext = item?.filename?.substring(fileNameLength - 3);
                                uri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
                            }
                            return (
                                <>
                                    <TouchableOpacity activeOpacity={0.5} onPress={() => onPressShow(item)} style={stPickerWidget.coverImage}>

                                        {
                                            item.typeFile == 'video' &&
                                            <View style={stPickerWidget.playVideo}>
                                                <Image style={[nstyles.nIcon40, { tintColor: colorsWidget.main }]} source={Images.icPlayVideo} />
                                            </View>
                                        }
                                        {
                                            item.typeFile == 'video' && isValidURL(item?.uri) ?
                                                <VideoCus source={{ uri: encodeURI(item?.uri) }}   // Can be a URL or a local file.
                                                    style={{
                                                        height: HEIGHT_SIZE - 4,
                                                        width: WIDTH_SIZE - 4, borderRadius: 10
                                                    }}
                                                    resizeMode='cover'
                                                    paused={true} /> :
                                                <ImageCus source={{ uri: item?.uri }}
                                                    style={{
                                                        height: HEIGHT_SIZE - 4,
                                                        width: WIDTH_SIZE - 4,
                                                        borderRadius: 10
                                                    }} resizeMode='cover'>
                                                </ImageCus>
                                        }
                                    </TouchableOpacity>
                                    {
                                        !props?.isSeen && <TouchableOpacity onPress={() => onDeleteFile(item, index)} style={{ position: 'absolute', zIndex: 10, top: 10, right: 10 }}>
                                            <Image style={[nstyles.nIcon24, { tintColor: colorsWidget.main }]} source={Images.icClose} />
                                        </TouchableOpacity>
                                    }
                                </>
                            )
                        }}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                    />
                    <View style={stPickerWidget.tabDot}>
                        <TabsDot onBottomTabPress={onBottomTabPress} />
                    </View>
                </ImageBackground>
                {
                    !props?.isSeen && <TouchableOpacity activeOpacity={0.5} onPress={onPicker} style={stPickerWidget.coverLabel}>
                        <TextApp style={stPickerWidget.label}>{'Tải ảnh/video lên'}</TextApp>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    async function responsePicker(res) {
        try {
            let arrDataFile = []
            res?.forEach(item => {
                const isCheckImage = Utils.checkIsImage(item?.filename) || Utils.checkIsImage(item?.name) || Utils.checkIsImage(item?.uri)
                const checkVideo = Utils.checkIsVideo(item.filename) || Utils.checkIsVideo(item?.name) || Utils.checkIsVideo(item?.uri)
                if (isCheckImage || !checkVideo) {
                    arrDataFile.push({
                        ...item,
                        typeFile: 'image'
                    })
                } else {
                    arrDataFile.push({
                        ...item,
                        typeFile: 'video'
                    })
                }
            });
            console.log('DATA PICKER', arrDataFile);
            setData([...new Map([...data, ...arrDataFile].map(item =>
                [item['uri'], item])).values()])
        } catch (error) {
            console.log('err picker', error)
        }
    }

    function onPicker() {
        let options = {
            assetType: 'All',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: (data) => responsePicker(data), // callback giá trị trả về khi có chọn item
            limitCheck: 6 - data.length, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.navigate('Modal_MediaPicker', options);
    }

    function renderPicker() {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={onPicker}>
                <ImageBackground source={ImgWidget.icBkgPicker} style={[stPickerWidget.container]}>
                    <View style={stPickerWidget.iconPick}>
                        <Image source={ImgWidget.icPicker} resizeMode='contain' style={nstyles.nIcon38} />
                        <TextApp style={stPickerWidget.labelPicker}>{'Tải ảnh/video lên'}</TextApp>
                    </View>

                </ImageBackground>
                <View style={stPickerWidget.coverLabel}>
                    <TextApp style={stPickerWidget.label}>{'Tải ảnh/video lên'}</TextApp>
                </View>
            </TouchableOpacity>
        )
    }

    const stPickerWidget = StyleSheet.create({
        container: {
            height: HEIGHT_SIZE,
            width: WIDTH_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 10
        },
        iconPick: {
            alignItems: 'center',
        },
        labelPicker: {
            marginTop: 5,
            fontSize: reText(12),
        },
        label: {
            color: colorsWidget.main,
        },
        coverLabel: {
            padding: 5,
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 12,
            backgroundColor: colorsWidget.mainOpacity,
            paddingHorizontal: 12
        },
        coverImage: {
            height: HEIGHT_SIZE,
            width: WIDTH_SIZE,
            borderRadius: 10,
            padding: 2
        },
        playVideo:
        {
            position: 'absolute',
            height: HEIGHT_SIZE,
            width: WIDTH_SIZE,
            zIndex: 3,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        },
        tabDot: {
            position: 'absolute',
            zIndex: 3,
            left: 0,
            right: 0,
            bottom: 10,
            alignItems: 'center',
            justifyContent: 'center'
        }
    })

    return (
        <>
            {data && data?.length > 0 ?
                <>
                    {renderContent()}
                </> :
                renderPicker()
            }
        </>
    )

})



export default PickerWidget