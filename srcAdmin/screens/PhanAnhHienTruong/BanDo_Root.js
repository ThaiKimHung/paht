import React, { Component } from 'react';
import {
    Image, View, Text,
    TouchableOpacity, StyleSheet,
    Animated,
    Keyboard
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import HeaderCom from '../../../components/HeaderCom';
import { nstyles, colors, sizes } from '../../../styles'
import Utils from '../../../app/Utils';
import { Images } from '../../images';
import apis from '../../apis';
import { ConfigScreenDH } from '../../routers/screen';

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

let LATITUDE_DELTA = 0.00922;
let LONGITUDE_DELTA = () => LATITUDE_DELTA * nstyles.nwidth() / nstyles.nheight();

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

const Latitude = 10.764929, Longitude = 106.697514;
export default class BanDo_Root extends Component {

    constructor(props) {
        super(props);
        this.callbackDataMaps = Utils.ngetParam(this, 'callbackDataMaps');
        nthisBanDo_Root = this;
        var region = {
            latitude: Utils.ngetParam(this, 'latitude', Latitude),
            longitude: Utils.ngetParam(this, 'longitude', Longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA(),
        }

        this.state = {
            region: region,
            diaDiem: Utils.ngetParam(this, 'diadiem', Latitude),
            marginRight: new Animated.Value(-nstyles.khoangcach - 40)
        };
        this.checkAutoComplete = true;
    }

    _rightButton = () => {
        return <Animated.View style={{ marginRight: this.state.marginRight, justifyContent: 'center' }}>
            <TouchableOpacity activeOpacity={0.5} onPress={this._cancel}
                style={{ paddingHorizontal: 15 }}>
                <Text style={[{ color: colors.softBlue, fontWeight: '700', fontSize: sizes.reText(14) }]}>Huỷ</Text>
            </TouchableOpacity>
        </Animated.View>
    }

    _startAnimation = (value) => {
        Animated.timing(this.state.marginRight, {
            toValue: value,
            duration: 100
        }).start();
    };

    _keyboardDidShow = () => {
        this._startAnimation(0);
    }

    _keyboardDidHide = () => {
        this._startAnimation(-nstyles.khoangcach - 40);
    }

    _cancel = () => {
        Keyboard.dismiss();
        this.setState({ textSearch: '' });
    }

    // _selectAdd = (data, details = null) => {
    //     const { lat, lng } = details.geometry.location;
    //     const region = {
    //         latitude: lat,
    //         longitude: lng,
    //         latitudeDelta: LATITUDE_DELTA,
    //         longitudeDelta: LONGITUDE_DELTA(),
    //     };
    //     this.setState({
    //         region,
    //         diaDiem: data.description
    //     });

    //     // lấy lat long tại đây sau khi chọn địa chỉ
    //     Keyboard.dismiss();
    //     Utils.nlog('details', details, data.description, data)
    // }

    onPressFindLocation = async (region) => {
        let {
            latitude,
            longitude
        } = region
        let res = await apis.ApiApp.getAddressGG(latitude, longitude);
        if (res && res.full_address) {
            this.setState({ diaDiem: res.full_address });
        } else {
            this.setState({ diaDiem: res.latitude + ', ' + res.longitude });
        }
    }

    onRegionChangeComplete = (region) => {
        Utils.nlog('region', region)
        var region2 = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA(),
        }
        this.setState({ region: region2 })

        if (this.checkAutoComplete) {
            this.onPressFindLocation(region);
        }
    };

    _searchAddress = () => {
        this.checkAutoComplete = false;
        Utils.goscreen(this, ConfigScreenDH.Modal_AutocompleteMap, { callback: this.callbackAutocompleteMap });
    }
    callbackAutocompleteMap = (data, details = null) => {
        Utils.nlog("vao thay ddoior address", data, details)
        const { lat, lng } = details.geometry.location;
        const region2 = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA(),
        };
        var Camera = {
            center: {
                latitude: lat,
                longitude: lng,
            },
            //    pitch: number,
            //    heading: number,
            //    altitude: number,
            //    zoom: number
        }
        Utils.nlog("gia tri camerea", Camera)
        this.Map.setCamera(Camera)
        // this.Map.animateToRegion(region2, 300)
        Utils.nlog("gia tri rejon", region2)
        this.setState({
            region: region2,
            diaDiem: data.description
        }, () => {
            setTimeout(() => {
                this.checkAutoComplete = true;
            }, 200);
        });
        Utils.nlog('details', details, data.description, data)
    };
    componentDidMount() {
        var region = {
            latitude: Utils.ngetParam(this, 'latitude', Latitude),
            longitude: Utils.ngetParam(this, 'longitude', Longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA(),
        }
        this.setState({ region })
        var Camera = {
            center: {
                latitude: region.latitude,
                longitude: region.longitude,
            },
            //    pitch: number,
            //    heading: number,
            //    altitude: number,
            //    zoom: number
        }
        Utils.nlog("gia tri camerea", Camera)
        Utils.nlog("gia tri rẹjon did mount", region);
        this.Map.setCamera(Camera)
        // this.keyboardDidShowListener = Keyboard.addListener(
        //     'keyboardDidShow',
        //     this._keyboardDidShow,
        // );
        // this.keyboardDidHideListener = Keyboard.addListener(
        //     'keyboardDidHide',
        //     this._keyboardDidHide,
        // );
        // setTimeout(() => {
        //     this.setState({})
        // }, 2000);
    }

    componentWillUnmount() {
        // this.keyboardDidShowListener.remove();
        // this.keyboardDidHideListener.remove();
    }

    render() {
        let {
            region,
            diaDiem
        } = this.state;

        let {
            latitude,
            longitude
        } = region;

        let txtDiaDiem = diaDiem ? diaDiem : `(${latitude},${longitude})`
        Utils.nlog("gia tri render", this.state.region);
        return (
            <View style={nstyles.nstyles.ncontainer}>
                {/* Header  */}
                <HeaderCom
                    onPressLeft={() => Utils.goback(this)}
                    onPressRight={this._searchAddress}
                    hiddenIconRight={false}
                    iconRight={Images.icSearch}
                    customStyleIconRight={{ tintColor: colors.white }}
                    nthis={this} shadown={false} titleText={'Bản đồ'} />
                <View style={nstyles.nstyles.nbody}>
                    <MapView style={styles.map}
                        // mapPadding={{ top: nstyles.Height(80), right: 0, bottom: 0, left: 0 }}
                        ref={ref => this.Map = ref}
                        // provider={PROVIDER_GOOGLE}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                        initialRegion={this.state.region}
                    // region={this.state.region}
                    >
                        {/* <Marker
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                            title={"Vị trí gửi"}
                        /> */}
                    </MapView>
                    <View style={{ position: 'absolute', bottom: nstyles.Height(49), left: nstyles.Width(50) - 20, right: nstyles.Width(50) - 20 }}>
                        <Image source={Images.icLocation}
                            style={[nstyles.nstyles.nIcon40, { tintColor: 'red' }]}
                            resizeMode='contain' />
                    </View>

                    <View style={{
                        position: 'absolute', left: 0, right: 0,
                        bottom: 0, backgroundColor: colors.white,
                        paddingVertical: 20, borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, paddingHorizontal: 13
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.callbackDataMaps(this.state.region, this.state.diaDiem);
                                Utils.goback(this);
                            }}
                            activeOpacity={0.5}>
                            <View style={nstyles.nstyles.nrow}>
                                <Image source={Images.icLocation}
                                    style={[nstyles.nstyles.nIcon40, { tintColor: 'red' }]}
                                    resizeMode='contain' />
                                <View style={{ flex: 1, marginLeft: 4 }}>
                                    <Text style={[{
                                        color: colors.colorGrayText,
                                        fontSize: sizes.reText(14),
                                    }]}>
                                        {'Vị trí đánh dấu'}
                                    </Text>
                                    <Text style={{
                                        marginTop: 4,
                                        color: colors.black, fontWeight: 'bold',
                                        fontSize: sizes.reText(14),
                                    }}>
                                        {txtDiaDiem}
                                    </Text>
                                    <Text style={[{
                                        textAlign: 'right',
                                        marginTop: 50,
                                        color: colors.black, fontSize: sizes.reText(14),
                                        paddingHorizontal: 15
                                    }]}>
                                        {'Chạm để chọn'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

