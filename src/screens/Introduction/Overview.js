import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TouchableHighlight, FlatList, Linking } from 'react-native';
import { isLandscape } from 'react-native-device-info';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Video from 'react-native-video';
import { appConfig } from '../../../app/Config';
import Utils from '../../../app/Utils';
import { ListEmpty } from '../../../components';
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus';
import HtmlViewCom from '../../../components/HtmlView';
import ImageCus from '../../../components/ImageCus';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nheight, nstyles, nwidth, Width } from '../../../styles/styles';
import { Images } from '../../images';
import styles from '../Home/styles';

let LATITUDE_DELTA = 0.2;
let LONGITUDE_DELTA = () => LATITUDE_DELTA * nwidth() / nheight();
const Latitude = appConfig.defaultRegion.latitude, Longitude = appConfig.defaultRegion.longitude;

class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: this.props.route,
            latlng: {
                latitude: Latitude,
                longitude: Longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA(),
            },
            ListImage: [],
            data: ''
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data != prevState.data) {
            return {
                data: nextProps.data,
            }
        } else {
            return null
        }
    }

    _showListHinhAnhXL = (arrImage = [], index = 0) => {
        if (arrImage.length != 0) {
            Utils.goscreen(this.props.nthis, 'Modal_ShowListImage', { ListImages: arrImage, index });
        }
    }

    _renderItem = ({ item, index }, arrImg) => {
        return (
            <View style={{ flex: 1, margin: (index - 1) % 3 == 0 ? 0 : 5, marginVertical: 5 }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => this._showListHinhAnhXL(arrImg, index)} style={{}}>
                    <ImageCus defaultSourceCus={Images.icNoImage} source={{ uri: item.url }} style={stOverview.imageTP} resizeMode={'cover'} />
                </TouchableOpacity>
            </View>

        )

    }
    _KeyExtrac = (item, index) => index.toString()

    renderImgList = (arrImg = [], urlVideoTitle = '') => {
        return (
            <FlatList
                numColumns={3}
                data={arrImg}
                renderItem={({ item, index }) => this._renderItem({ item, index }, arrImg)}
                keyExtractor={this._KeyExtrac}
                ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} isImage={true} />}
            />
        )
    }

    onOpenFile = (uri = '') => () => {
        let temp = uri.toLowerCase();
        if (temp.includes(".avi") || temp.includes(".mp4") || temp.includes(".mov") || temp.includes(".wmv") || temp.includes(".flv"))
            Utils.goscreen(this.props.nthis, 'Modal_PlayMedia', { source: uri });
        else
            Linking.openURL(uri);
    }

    _showDanhSachFile = (arrLink = []) => {
        // this.setState({ modalVisible: true })
        Utils.goscreen(this.props.nthis, 'Modal_FileAttached', { data: arrLink })
    }

    render() {
        const { latlng, data } = this.state
        let arrImg = [], arrLinkFile = [], urlVideoTitle = ''
        const { FileDinhKem = [] } = data
        if (FileDinhKem?.length > 0) {
            FileDinhKem.forEach(item => {
                const url = appConfig.domain + item.Path;
                let checkImage = Utils.checkIsImage(url);
                let checkVideo = Utils.checkIsVideo(url);
                if (checkImage) {
                    arrImg.push({
                        url: url
                    })
                } else {
                    arrLinkFile.push({ ...item, url: url, name: item.TenFile })
                }
                if (urlVideoTitle == '' && checkVideo) {
                    urlVideoTitle = url;
                }
            });
        }

        return (
            <ScrollView style={stOverview.container} contentContainerStyle={{ paddingBottom: 40 }}>
                {
                    data ? <>
                        {/* <View pointerEvents={'none'} style={[stOverview.ContainerMap, { width: Width(100), height: Width(this.props.theme.isLandscape ? 50 : 70), }]}>
                            <MapView style={stOverview.map}
                                // mapPadding={{ top: nstyles.Height(80), right: 0, bottom: 0, left: 0 }}
                                provider={PROVIDER_GOOGLE}
                                // showsMyLocationButton={true}
                                ref={ref => this.Map = ref}
                                showsUserLocation={true}
                                initialRegion={{
                                    ...latlng,
                                    latitude: data?.ToaDoX ? data?.ToaDoX : latlng.latitude,
                                    longitude: data?.ToaDoY ? data?.ToaDoY : latlng.longitude
                                }}
                                region={{
                                    ...latlng,
                                    latitude: data?.ToaDoX ? data?.ToaDoX : latlng.latitude,
                                    longitude: data?.ToaDoY ? data?.ToaDoY : latlng.longitude
                                }}
                                mapType={'hybrid'}
                                onLayout={() => { this.mark.showCallout(); }}
                            >
                                <Marker
                                    ref={ref => { this.mark = ref; }}
                                    coordinate={{
                                        latitude: data?.ToaDoX ? data?.ToaDoX : latlng.latitude,
                                        longitude: data?.ToaDoY ? data?.ToaDoY : latlng.longitude
                                    }}
                                    title={data?.TenPhuongXa ? data?.TenPhuongXa : ''}

                                />
                            </MapView>
                        </View> */}
                        <View style={stOverview.listImage}>
                            <AutoHeightWebViewCus
                                textLoading={'Đang tải...'}
                                source={{ html: data?.NoiDungTongQuan ? data?.NoiDungTongQuan : '<div></div>' }}
                            />
                            {/* <View style={{  }}>
                                <HtmlViewCom
                                    html={data?.NoiDungTongQuan ? data?.NoiDungTongQuan : '<div></div>'}
                                    style={{ height: '100%' }}
                                />
                            </View> */}
                            <View style={{ ...StyleSheet.absoluteFillObject }} />
                            <Text style={stOverview.txtHinhAnh}>{'Hình ảnh, video'}</Text>
                            {/* {Map list hinh anh tai day} */}
                            {
                                this.renderImgList(arrImg, urlVideoTitle)
                            }
                            {arrLinkFile.length > 0 ?
                                <>
                                    <View style={[nstyles.nrow, { alignItems: 'center', marginTop: 10 }]}>
                                        <View style={{ height: 4, width: 18, backgroundColor: colors.colorBlueP, alignSelf: 'center', marginVertical: 10 }} />
                                        <Text style={[styles.text14, { marginLeft: 5, color: colors.black_60, fontWeight: '600' }]}>Tập tin đính kèm</Text>
                                    </View>
                                    <View style={[nstyles.nrow]}>
                                        <TouchableHighlight
                                            onPress={this.onOpenFile(arrLinkFile[0].url)}
                                            underlayColor={colors.backgroudFileActive}
                                            style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlueP, backgroundColor: colors.backgroundFile, width: '80%' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={Images.icAttached} style={{ width: Width(2), height: Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                                <Text style={{ color: colors.colorBlueLight, width: Width(55) }} numberOfLines={1}>{arrLinkFile[0].name}</Text>
                                            </View>
                                        </TouchableHighlight>
                                        {arrLinkFile.length > 1 ?
                                            <TouchableHighlight
                                                onPress={() => this._showDanhSachFile(arrLinkFile)}
                                                underlayColor={colors.backgroudFileActive}
                                                style={{ marginTop: 5, padding: 8, borderWidth: 1, borderRadius: 15, borderColor: colors.colorBlue, backgroundColor: colors.backgroundFile, width: '18%', marginLeft: Width(1) }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image source={Images.icAttached} style={{ width: Width(2), height: Width(4), marginHorizontal: 5, alignSelf: 'center' }} resizeMode='stretch' />
                                                    <Text style={{ color: colors.colorBlueLight, width: Width(50) }} numberOfLines={1}>{'+'}{arrLinkFile.length - 1}</Text>
                                                </View>
                                            </TouchableHighlight> : null}
                                    </View>
                                    <View style={{ height: 5 }} />
                                </>
                                : null
                            }
                        </View>
                    </> : <ListEmpty textempty={'Không có dữ liệu'} isImage={true} />
                }
            </ScrollView>
        );
    }
}

const stOverview = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    ContainerMap: {
        alignSelf: 'center',
        borderWidth: 0.5,
        borderColor: colors.grayLight,
        marginBottom: 10
    },
    map: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    listImage: {
        paddingHorizontal: 13
    },
    txtHinhAnh: {
        fontWeight: 'bold',
        marginBottom: 10
    },
    imageTP: { width: '100%', height: 100, borderWidth: 0.5, borderRadius: 5, borderColor: colors.grayLight },
})


const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(Overview, mapStateToProps, true)
