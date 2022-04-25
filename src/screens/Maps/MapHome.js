import React, { Component, createRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, Image, BackHandler, Platform,
} from 'react-native';
import MapView, {
    Marker,
    ProviderPropType,
    PROVIDER_GOOGLE,
    Circle,
    PROVIDER_DEFAULT
} from 'react-native-maps';
import ItemDanhSach from '../Home/components/ItemDanhSach'
import { nstyles, sizes, colors } from '../../../styles';
import { Images } from '../../images';
import Utils from '../../../app/Utils';
import apis from '../../apis';
import { appConfig } from '../../../app/Config';
import { Height, heightStatusBar, nheight, nwidth, paddingTopMul, StyleGlobal } from '../../../styles/styles';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { HeaderCus } from '../../../components';
import ClusteredMapView from './ThuatToan/ClusteredMapView';
import { reSize, reText } from '../../../styles/size';

const LATITUDE = appConfig.defaultRegion.latitude;
const LONGITUDE = appConfig.defaultRegion.longitude;
let LATITUDE_DELTA = () => 200 / nstyles.nheight();
let LONGITUDE_DELTA = () => LATITUDE_DELTA() * nstyles.nwidth() / nstyles.nheight();

class MapHome extends Component {
    // dataitem: data,
    // getListCongDong: this._getListCongDong,
    // nthis=this
    constructor(props) {
        super(props);
        this.mark = false
        this.count = 1
        this.map = createRef()
        //this.getListCongDong = Utils.ngetParam(this, "getListCongDong", []),
        this.state = {
            cnt: 0,
            dataMark: [],// Utils.ngetParam(this, "dataitem", []),
            region: {
                ...appConfig.defaultRegion
            },
            data: { name: 1 },
            isShow: false,
            idMarkSelect: '',
            dataItem: {},
            current: {
                ...appConfig.defaultRegion
            },
            BanKinh: 10

        };
    }
    componentDidMount() {
        this._getListCongDong()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }


    _getListCongDong = async (more = true) => {
        var { size = 10, BanKinh, region } = this.state
        // let res = await apis.ApiPhanAnh.GetDanhSachPAFilter(true);
        let box = Utils.regionToBoundingBox(region, BanKinh)
        let res = await apis.ApiApp.ViewMapFE(box.minlat, box.maxlat, box.minlog, box.maxlog);
        Utils.nlog('data phan anh map', res)
        let { data = [] } = res
        if (res.status == 1 && res.data) {
            data = data.filter(item => {
                if (item.ToaDoX != 0 && item.ToaDoY != 0) return true;
                else return false;
            });
            this.setState({
                region: {
                    latitude: data[0] ? data[0].ToaDoX + 0.005 : LATITUDE,
                    longitude: data[0] ? data[0].ToaDoY : LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA(),
                    longitudeDelta: LONGITUDE_DELTA(),
                },
                current: {
                    latitude: data[0] ? data[0].ToaDoX + 0.005 : LATITUDE,
                    longitude: data[0] ? data[0].ToaDoY : LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA(),
                    longitudeDelta: LONGITUDE_DELTA(),
                }
            });
            data = data.map(item => {
                return {
                    ...item,
                    location: {
                        latitude: item.ToaDoX,
                        longitude: item.ToaDoY
                    },
                }
            })
            this.setState({ dataMark: data })
        } else {
            this.setState({ data: [] })
        }
    }
    show() {
        this.marker1.showCallout();
    }

    hide() {
        this.marker1.hideCallout();
    }

    _ChiTietPhanAnh = () => {
        Utils.goscreen(this, 'Modal_ChiTietPhanAnh');
    }


    _setRejon = async (e, item) => {
        this.count += 1
        var { data } = this.state
        data.name = this.count
        this.mark = true
        Utils.nlog("gia tri e", e)
        // Utils.nlog("gia tri e", e.nativeEvent)
        this.setState({
            region: {
                latitude: e.nativeEvent.coordinate.latitude + 0.005,
                longitude: e.nativeEvent.coordinate.longitude,
                latitudeDelta: LATITUDE_DELTA(),
                longitudeDelta: LONGITUDE_DELTA(),
            },
            isShow: true,
            data: data,
            dataItem: item
        })
    }
    _onPressMap = (e) => {
        this.setState({ isShow: false, })
        Utils.nlog("Vao map", this.mark)
        if (this.mark == false) {
            this.setState({ isShow: false, })
        } else {
            this.setState({ isShow: true })
        }
        this.mark = false
    }
    onRegionChange = (region) => {
        LATITUDE_DELTA = () => region.latitudeDelta;
        LONGITUDE_DELTA = () => region.longitudeDelta;
        this.setState({
            current: {
                ...region,
                latitudeDelta: LATITUDE_DELTA(),
                longitudeDelta: LONGITUDE_DELTA()
            }
        })
    };
    ColorMucDo = (IdChuyenMuc) => {
        switch (IdChuyenMuc) {
            case 59:
                return colors.greenFE
            case 60:
                return colors.yellowLight
            case 61:
                return colors.yellowishOrange
            case 62:
                return colors.redStar
            default:
                return null
        }
    }
    _renderMarker = (item, index) => {
        var { dataItem, dataMark } = this.state
        var { IdPA, IdChuyenMuc } = item
        var coordinate = {
            latitude: item.ToaDoX,
            longitude: item.ToaDoY,
        };
        // let iconMaker = ROOTGlobal[nGlobalKeys.dataLV_CM].find((item2) => item2.IdLinhVuc == item.IdLinhVuc);
        // dataMark.map(item => { return { IdChuyenMuc: item.IdChuyenMuc } })

        // Utils.nlog("Gia tri data iTme", this.ColorMucDo(IdChuyenMuc))
        let iconMaker = appConfig.domain + item.IconMap;
        iconMaker = iconMaker ? iconMaker : undefined;
        return (
            <Marker
                key={index}
                onPress={(e) => this._setRejon(e, item)}
                coordinate={coordinate}
                calloutOffset={{ x: -1, y: 10 }}
                calloutAnchor={{ x: 0.5, y: 0.4 }}
            // style={{ width: 100, height: 100 }}
            >
                <Image source={iconMaker ? { uri: iconMaker } : (IdPA == dataItem.IdPA ? Images.icLocationRed : Images.icLocationBlue)}
                    resizeMode='contain' style={[nstyles.nstyles.nIcon35, { tintColor: this.ColorMucDo(IdChuyenMuc), }]} />
            </Marker>
        )
    }
    _Refresh = async () => {
        await this.map.current.mapview.animateToCoordinate({ ...appConfig.defaultRegion }, 500)
        await this.setState({ isShow: false, region: { ...appConfig.defaultRegion }, current: { ...appConfig.defaultRegion } }, () => {
            this._getListCongDong(true)
        })
    }
    _onPanDrag = (e) => {
        Utils.nlog("vao keo map")
        this.setState({ isShow: false, })
    }
    _showAllImages = (arrImage = [], index = 0) => {
        if (arrImage.length != 0) {
            Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
        }
    }
    _goScreen = (dataItem) => {
        Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: dataItem.IdPA, TenChuyenMuc: dataItem.ChuyenMuc || dataItem.LinhVuc })
    }

    renderCluster = (cluster, onPress) => {
        const pointCount = cluster.pointCount,
            coordinate = cluster.coordinate,
            clusterId = cluster.clusterId
        // use pointCount to calculate cluster size scaling
        // and apply it to "style" prop below

        // eventually get clustered points by using
        // underlying SuperCluster instance
        // Methods ref: https://github.com/mapbox/supercluster
        // const clusteringEngine = this.map.getClusteringEngine(),
        //     clusteredPoints = clusteringEngine.getLeaves(clusterId, 100)

        return (
            <Marker key={clusterId} coordinate={coordinate} onPress={onPress}>
                <View style={{
                    backgroundColor: colors.redStar, width: reSize(25), height: reSize(25), borderWidth: 1, borderColor: colors.white,
                    padding: 2, borderRadius: reSize(25) / 2, alignItems: 'center', justifyContent: 'center'
                }}>
                    <Text style={[{ color: colors.white, fontSize: reText(10), fontWeight: 'bold' }]}>
                        {pointCount > 99 ? '99+' : pointCount}
                    </Text>
                </View>
            </Marker>
        )
    }

    renderMarker = (data) => <Marker key={data.id || Math.random()} coordinate={data.location} image={Images.icLocation} />

    _ChangeRegionComplete = async (region) => {
        this.setState({
            region: {
                latitude: region.latitude + 0.005,
                longitude: region.longitude,
                latitudeDelta: LATITUDE_DELTA(),
                longitudeDelta: LONGITUDE_DELTA(),
            },
        });
        let box = Utils.regionToBoundingBox(region, this.state.BanKinh)
        let res = await apis.ApiApp.ViewMapFE(box.minlat, box.maxlat, box.minlog, box.maxlog);
        Utils.nlog('data phan anh map region', res)
        let { data = [] } = res
        if (res.status == 1 && res.data) {
            data = data.filter(item => {
                if (item.ToaDoX != 0 && item.ToaDoY != 0) return true;
                else return false;
            });
            data = data.map(item => {
                return {
                    ...item,
                    location: {
                        latitude: item.ToaDoX,
                        longitude: item.ToaDoY
                    },
                }
            })
            this.setState({ dataMark: data })
        } else {
            this.setState({ data: [], dataMark: [] })
        }
    }


    changeBanKinh = (bankinh) => {
        this.setState({ BanKinh: bankinh }, () => { this._getListCongDong() })
    }

    render() {

        const { isShow = false, dataItem = {}, current, BanKinh } = this.state;
        var { ListHinhAnh = [], } = dataItem;
        var arrImg = []
        ListHinhAnh.forEach(dataItem => {
            arrImg.push({ url: appConfig.domain + dataItem.Path })
        });
        return (
            <View style={[styles.container], { flex: 1 }}>
                <View style={[styles.header], { width: StyleGlobal.isLansacpeFirst ? '100%' : null }}>
                    <HeaderCus
                        Sleft={{ tintColor: 'white' }}
                        onPressLeft={() => Utils.goback(this)}
                        iconLeft={Images.icBack}
                        title={'Bản đồ phản ánh'}
                        styleTitle={{ color: colors.white }}
                        iconRight={Images.icReLoad}
                        Sright={{ tintColor: 'white' }}
                        onPressRight={() => this._Refresh()}
                    />
                </View>
                <ClusteredMapView
                    style={{ flex: 1, width: StyleGlobal.isLansacpeFirst ? '100%' : null }}
                    // maxZoomLevel={15}
                    // minZoomLevel={10}
                    provider={PROVIDER_DEFAULT}
                    onPress={this._onPressMap}
                    onRegionChange={this.onRegionChange}
                    data={this.state.dataMark.length > 0 ? this.state.dataMark : []}
                    initialRegion={this.state.region}
                    ref={this.map}
                    renderMarker={this._renderMarker}
                    renderCluster={this.renderCluster}
                    onRegionChangeComplete={this._ChangeRegionComplete}
                >
                    <Circle lineJoin={'round'} center={this.state.region} radius={BanKinh * 1000} strokeColor={'green'} fillColor={'rgba(10, 149, 98, 0.1)'} zIndex={1000} />
                    <Marker
                        coordinate={current}
                        calloutOffset={{ x: -1, y: 10 }}
                        calloutAnchor={{ x: 0.5, y: 0.4 }}
                    // style={{ width: 100, height: 100 }}
                    >
                        {/* <Image source={Images.icLocationRed} resizeMode='contain' style={nstyles.nstyles.nIcon35} /> */}
                    </Marker>
                </ClusteredMapView>
                <View style={[nstyles.nstyles.shadow, {
                    position: 'absolute',
                    bottom: heightStatusBar(), left: 10,
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: colors.white, borderRadius: 3,
                    paddingLeft: 10
                }]}>
                    <Text>{'Bán kính (Km):'}</Text>
                    {[10, 20, 30].map((item, index) => {
                        return (
                            <TouchableOpacity onPress={() => this.changeBanKinh(item)}>
                                <View style={{ padding: 10, backgroundColor: colors.white, borderRadius: 3, paddingHorizontal: 13 }}>
                                    <Text style={{ fontWeight: BanKinh == item ? 'bold' : 'normal', color: BanKinh == item ? colors.redStar : colors.black }}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {
                    isShow == true ? <View style={[{
                        position: 'absolute',
                        // height: sizes.reSize(320),
                        top: nstyles.Height(50) - (nstyles.paddingTopMul() + Height(35)),
                        backgroundColor: 'transparent',
                        // borderWidth: 1,
                        zIndex: 1000,
                        elevation: 100,
                        left: 0,
                        right: 0
                    }]} >
                        <ItemDanhSach
                            nthis={this}
                            // type={ListHinhAnh.length > 0 ? 1 : 2}
                            dataItem={dataItem}
                            showImages={() => this._showAllImages(arrImg, 0)}
                            goscreen={() => this._goScreen(dataItem)}
                        />
                    </View> : <View />
                }
            </View >
        );
    }
}

MapHome.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    customView: {
        width: nstyles.Width(80),
    },
    plainView: {
        width: 60,
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
    header: {
        width: nstyles.Width(100),
        justifyContent: 'space-between',
        ...nstyles.nstyles.nrow,
        zIndex: 1000,
        alignItems: 'center',
    }
});

export default MapHome;