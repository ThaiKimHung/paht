import React, { Component, createRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, Image, BackHandler, Platform, PermissionsAndroid, Linking, AppState
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
import { Height, heightStatusBar, nheight, nwidth, paddingTopMul } from '../../../styles/styles';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { HeaderCus } from '../../../components';
import { reSize, reText } from '../../../styles/size';
import Geolocation from 'react-native-geolocation-service';

const LATITUDE = appConfig.defaultRegion.latitude;
const LONGITUDE = appConfig.defaultRegion.longitude;
let LATITUDE_DELTA = () => 200 / nstyles.nheight();
let LONGITUDE_DELTA = () => LATITUDE_DELTA() * nstyles.nwidth() / nstyles.nheight();

class MapHomeTuiAnSinh extends Component {
    // dataitem: data,
    // getListCongDong: this._getListCongDong,
    // nthis=this
    constructor(props) {
        super(props);
        this.mark = false
        this.count = 1
        this.map = createRef()
        // this.getListCongDong = Utils.ngetParam(this, "getListCongDong", []),
        this.state = {
            cnt: 0,
            dataMark: [],// Utils.ngetParam(this, "dataitem", []),
            region: {
                ...appConfig.defaultRegion,
                latitudeDelta: LATITUDE_DELTA(),
                longitudeDelta: LONGITUDE_DELTA()
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
    async componentDidMount() {
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
        this.getCurrentPosition()
        let res = await apis.ApiPhanAnh.GetDanhSachTuiAnSinh('', '', '', '', '', true);
        // let box = Utils.regionToBoundingBox(region, BanKinh)
        // let res = await apis.ApiApp.ViewMapFE(box.minlat, box.maxlat, box.minlog, box.maxlog);
        Utils.nlog('data phan anh map', res)
        let { data = [] } = res
        if (res.status == 1 && res.data) {
            this.setState({ dataMark: data })
        } else {
            this.setState({ data: [] })
        }
    }

    getCurrentPosition = async (enableThemDiaDiem, tuDongViTri = true, isEndFirstRequest = 0) => {
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();

        if (Platform.OS == 'android') {
            this.granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Tự động lấy vị trí',
                message: 'Để tự động lấy vị trí thì bạn cần cấp quyền truy cập vị tri cho ứng dụng.',
                buttonNegative: 'Để sau',
                buttonPositive: 'Cấp quyền'
            })
            if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        Utils.nlog('geolocation-android', JSON.stringify(position));
                        var { coords = {} } = position;
                        var { latitude, longitude } = coords;
                        const regionUser = {
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: LATITUDE_DELTA(),
                            longitudeDelta: LONGITUDE_DELTA(),
                        }
                        this.setState({
                            region: regionUser
                        }, async () => {
                            await this.map.animateToCoordinate({ ...regionUser }, 500)
                        })
                    },
                    error => Utils.nlog('getCurrentPosition error: ', JSON.stringify(error)),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        } else {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.isgetFirstLocationOK = true;
                    Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt', appConfig.TenAppHome + ' cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    Utils.nlog('app-settings:', err);
                                });
                            });
                    } else {
                        this.granted = 'granted';
                        const regionUser = {
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: LATITUDE_DELTA(),
                            longitudeDelta: LONGITUDE_DELTA(),
                        }
                        this.setState({
                            region: regionUser
                        }, async () => {
                            await this.map.animateToCoordinate({ ...regionUser }, 500)
                        })
                    }
                },
                (error) => {
                    let { code } = error;
                    if (AppState.currentState == 'active')
                        this.isgetFirstLocationOK = true;
                    if (code == 1) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt',
                            'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    nlog('app-settings:', err);
                                });
                            });
                    }
                    Utils.nlog('getCurrentPosition error: ', JSON.stringify(error))
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );

            //--Tự động lấy vi trí lần đầu hỏi IOS, Android check làm sau
            if (isEndFirstRequest == 1 && tuDongViTri) {
                setTimeout(() => {
                    if (!this.isgetFirstLocationOK) {
                        this.getCurrentPosition(true, tuDongViTri, 1);
                    }
                }, 2000);
            }
            //--End auto check first--
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
        await this.map.animateToCoordinate({
            latitude: e.nativeEvent.coordinate.latitude + 0.005,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: LATITUDE_DELTA(),
            longitudeDelta: LONGITUDE_DELTA(),
        }, 500)
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
    _renderMarker = (item, index) => {

        var { dataItem } = this.state
        var { IdPA } = item
        var coordinate = {
            latitude: item.ToaDoX,
            longitude: item.ToaDoY,
        }
        Utils.nlog('data', item, coordinate)
        // let iconMaker = ROOTGlobal[nGlobalKeys.dataLV_CM].find((item2) => item2.IdLinhVuc == item.IdLinhVuc);
        let iconMaker = item?.IconMap ? appConfig.domain + item.IconMap : '';
        iconMaker = iconMaker ? iconMaker : undefined;
        return (
            <Marker
                key={index}
                onPress={(e) => this._setRejon(e, item)}
                coordinate={{
                    latitude: item.ToaDoX,
                    longitude: item.ToaDoY,
                }}
                calloutOffset={{ x: -1, y: 10 }}
                calloutAnchor={{ x: 0.5, y: 0.4 }}
            >
                <Image source={iconMaker ? { uri: iconMaker } : (IdPA == dataItem.IdPA ? Images.icLocationRed : Images.icLocationBlue)}
                    resizeMode='contain' style={nstyles.nstyles.nIcon35} />
            </Marker>
        )
    }
    _Refresh = async () => {
        await this.map.animateToCoordinate({ ...appConfig.defaultRegion }, 500)
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
        Utils.goscreen(this, 'Modal_ChiTietTuiAnSinh', { IdPA: dataItem.IdPA, TenChuyenMuc: dataItem.ChuyenMuc || dataItem.LinhVuc })
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
            <View style={styles.container}>

                <MapView
                    style={StyleSheet.absoluteFillObject}
                    provider={PROVIDER_GOOGLE}
                    onPress={this._onPressMap}
                    onRegionChange={this.onRegionChange}
                    data={this.state.dataMark}
                    initialRegion={this.state.region}
                    showsUserLocation={true}
                    ref={(r) => { this.map = r }}
                >
                    {this.state.dataMark.length > 0 && this.state.dataMark.map(this._renderMarker)}
                    {/* <Marker
                        coordinate={{ latitude: 10.7965286574, longitude: 106.6319791326 }}
                        calloutOffset={{ x: -1, y: 10 }}
                        calloutAnchor={{ x: 0.5, y: 0.4 }}
                    >
                        <Image source={Images.icLocationBlue}
                            resizeMode='contain' style={nstyles.nstyles.nIcon35} />
                    </Marker> */}
                </MapView>
                <View style={[styles.header]}>
                    <HeaderCus
                        Sleft={{ tintColor: 'white' }}
                        onPressLeft={() => Utils.goback(this)}
                        iconLeft={Images.icBack}
                        title={'Bản đồ túi an sinh'}
                        styleTitle={{ color: colors.white }}
                        iconRight={Images.icReLoad}
                        Sright={{ tintColor: 'white' }}
                        onPressRight={() => this._Refresh()}
                    />
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
                            isAnSinhXaHoi={true}
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

MapHomeTuiAnSinh.propTypes = {
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    }
});

export default MapHomeTuiAnSinh;