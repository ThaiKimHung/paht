import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, NativeModules, Platform, Alert, PermissionsAndroid, Linking, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GoogleMap, { Polygon, Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import URL, { decodeResponse } from '../../Containers/Config';
import setup from '../../Containers/setup';
import Type from '../../Redux/Type';
import MakerInfo from '../ThuaDat/MakerInfo';
import { onShowMediumPanel } from '../../Containers/PanelInfo';
import TopMenuBar from './TopMenuBar';
import ThuaDat from '../ThuaDat/LopHienTrang';
import LopQuyHoach from '../QuyHoach/LopQuyHoach';
import { onLoadInfoByThuaDat } from '../../Containers/Search';
import { onLoadPolygonByDistance, onShapePress } from '../../Containers/HienTrang';
import PanelQuyHoach from '../QuyHoach/PanelQuyHoach';
import { store } from '../../../../srcRedux/store';

const SplashScreen = NativeModules.SplashScreen;


class MapView extends React.PureComponent {

    componentDidMount(): void {
        this._unsubscribe = this.props.navigation.addListener('focus', this._actionOnScreenFocus);
        this._actionOnScreenFocus();
    }

    componentWillUnmount(): void {
        this._unsubscribe();
    }

    _actionOnScreenFocus = () => {
        AsyncStorage.getItem(URL.token)
            .then(data => {
                SplashScreen.hide();
                if (data) {
                    let userInfo = decodeResponse(data);
                    userInfo = JSON.parse(userInfo);
                    let { currentCoordinate } = store.getState()['mapView'];
                    store.dispatch({ type: Type.SET_USER_INFO, userInfo });
                    store.dispatch({ type: Type.SET_TOKEN, token: data });
                    onLoadPolygonByDistance(currentCoordinate);
                }
            });
    };

    // onCheckUpdateNative = ()=>
    // {
    //
    //     let onAlertUpdate = ()=>
    //     {
    //         Alert.alert(
    //             'Cập nhật',
    //             'Đã có phiên bản mới. Xin vui lòng cập nhật ứng dụng',
    //             [
    //                 {text: 'Đồng ý', onPress: () => this.onLinkToUpdateStore()}
    //             ],
    //             {cancelable: false},
    //         );
    //     },
    //         versionKey = '20200616';
    //
    //     if (Platform.OS === 'android')
    //         SplashScreen.getData()
    //             .then(e=>{
    //                 if (e.version !== versionKey)
    //                     onAlertUpdate();
    //             })
    //     else
    //         SplashScreen.findEvents((error, events) => {
    //             if (error) {
    //                 Alert.alert(error)
    //             } else if (events !== versionKey) {
    //                 onAlertUpdate();
    //             }
    //         });
    // };

    onLinkToUpdateStore = () => {
        let linkWebUser = 'https://play.google.com/store/apps/details?id=com.vienthongtayninh.tnhb2a';
        if (Platform.OS === 'ios') {
            linkWebUser = 'itms-services://vienthongtayninh.vn/?action=download-manifest&url=https://ytetayninh.vn/app/ios/tnhb2a/manifest.plist';
        }
        Linking.canOpenURL(linkWebUser)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Không thể mở');
                } else {
                    return Linking.openURL(linkWebUser);
                }
            })
            .catch(err => console.log(err));
    };

    onUserLocationChange = ({ nativeEvent: { coordinate } }) => {
        this.props.dispatch({ type: Type.MAP_VIEW.SET_USER_COORDINATE, value: coordinate });
    };

    // action gọi khi thao tác kéo map hoàn tất
    _onRegionChangeComplete = (coordinate) => {
        // this.GoogleMap.getMapBoundaries()
        //     .then(e=>{
        //         console.log(e);
        //     })
        let { isMapMoving } = store.getState()['mapView'],
            { showByZoom } = store.getState()['hienTrang'],
            { showingMode } = store.getState()['panelInfo'];
        if (showingMode === 'on' && !isMapMoving) {
            onShowMediumPanel();
        }
        this.props.dispatch({ type: Type.MAP_VIEW.SET_CURRENT_COORDINATE, value: coordinate });
        let zoom = Math.round(Math.log(360 / coordinate.longitudeDelta) / Math.LN2);
        if (zoom > 15) {
            onLoadPolygonByDistance(coordinate);
            if (!showByZoom) {
                this.props.dispatch({ type: Type.HIEN_TRANG.SHOW_BY_ZOOM, value: true });
            }
        } else {
            this.props.dispatch({ type: Type.HIEN_TRANG.SHOW_BY_ZOOM, value: false });
        }
    };

    onNavigateToNote = (data) => {

        let payload = {
            MADVHC: data.MADVHC,
            SOTHUA: data.SOTHUA,
            SOTO: data.SOTO,
        };
        this.props.navigation.navigate('Note', {
            thuatDat: data,
            reloadGhiChu: () => {

            },
        });
    };

    onNavigateToManageNote = () => {
        this.props.navigation.navigate('ManageNote', {
            onShowInfo: data => {
                onLoadInfoByThuaDat(data);
            },
        });
    };

    _onMapLoadReady = () => {
        this.props.dispatch({ type: Type.MAP_VIEW.SET_REF_MAP, value: this.GoogleMap });
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(granted => {
                // just to ensure that permissions were granted
            });
        }
    };

    _onMapPress = ({ nativeEvent: { coordinate } }) => {
        onShapePress(coordinate);
    };

    render() {
        return (
            <View style={styles.container}>
                <GoogleMap
                    ref={e => this.GoogleMap = e}
                    style={{ ...StyleSheet.absoluteFill }}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={setup.startCoordinate}
                    mapType={this.props.mapType}
                    showsUserLocation={true}
                    onUserLocationChange={this.onUserLocationChange}
                    customMapStyle={[{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]}
                    loadingEnabled={true}
                    followsUserLocation={true}
                    moveOnMarkerPress={false}
                    showsBuildings={false}
                    showsIndoors={false}
                    showsTraffic={false}
                    onRegionChangeComplete={this._onRegionChangeComplete}
                    onMapReady={this._onMapLoadReady}
                    onPress={this._onMapPress}
                >
                    <ThuaDat />
                    <LopQuyHoach />
                </GoogleMap>
                <TopMenuBar />
                <MakerInfo />
                <PanelQuyHoach />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    mapType: state.mapView.type,
});

export default connect(mapStateToProps)(MapView);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

