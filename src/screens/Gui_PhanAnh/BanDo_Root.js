import React, { Component } from 'react';
import {
    Image, View, Text,
    TouchableOpacity, StyleSheet,
    Animated,
    Keyboard
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import HeaderCom from '../../../components/HeaderCom';
import { nstyles, colors, sizes } from '../../../styles'
import { Images } from '../../images';
import Utils from '../../../app/Utils';
import apis from '../../apis';
import { appConfig } from '../../../app/Config';
import { HeaderCus } from '../../../components';

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

let LATITUDE_DELTA = 0.00922;
let LONGITUDE_DELTA = () => LATITUDE_DELTA * nstyles.nwidth() / nstyles.nheight();

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

const Latitude = appConfig.defaultRegion.latitude, Longitude = appConfig.defaultRegion.longitude;
export default class BanDo_Root extends Component {

    constructor(props) {
        super(props);

        const _latitude = Utils.ngetParam(this, 'latitude');
        const _longitude = Utils.ngetParam(this, 'longitude');
        this.callbackDataMaps = Utils.ngetParam(this, 'callbackDataMaps');
        nthisBanDo_Root = this;
        this.state = {
            region: {
                latitude: _latitude ? _latitude : Latitude,
                longitude: _longitude ? _longitude : Longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA(),
            },
            diaDiem: '',
            marginRight: new Animated.Value(-nstyles.khoangcach - 40)
        };
        this.checkAutoComplete = true;
    }

    _rightButton = () => {
        return <Animated.View style={{ marginRight: this.state.marginRight, justifyContent: 'center' }}>
            <TouchableOpacity activeOpacity={0.5} onPress={this._cancel}
                style={{ paddingHorizontal: 15 }}>
                <Text style={[{ color: colors.softBlue, fontWeight: '700', fontSize: sizes.reText(14) }]}>Hu???</Text>
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

    //     // l???y lat long t???i ????y sau khi ch???n ?????a ch???
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
        Utils.goscreen(this, 'Modal_AutocompleteMap', { callback: this.callbackAutocompleteMap });
    }

    callbackAutocompleteMap = (data, details = null) => {
        const { lat, lng } = details.geometry.location;
        const region = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA(),
        };
        let Camera = {
            center: {
                latitude: lat,
                longitude: lng,
            },
            //    pitch: number,
            //    heading: number,
            //    altitude: number,
            //    zoom: number
        }
        this.Map.setCamera(Camera)
        this.setState({
            region: region,
            diaDiem: data.description
        }, () => {
            setTimeout(() => {
                this.checkAutoComplete = true;
            }, 200);
        });
        Utils.nlog('details', details, data.description, data)
    };



    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
        setTimeout(() => {
            this.setState({})
        }, 2000);
    }

    chonViTri = () => {
        this.callbackDataMaps(this.state.diaDiem, {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude
        });
        Utils.goback(this);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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
        return (
            <View style={nstyles.nstyles.ncontainer}>
                {/* Header  */}
                <HeaderCus
                    iconLeft={Images.icBack}
                    iconRight={Images.icSearch}
                    Sright={{ tintColor: 'white' }}
                    title={'B???n ?????'}
                    styleTitle={{ color: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    onPressRight={this._searchAddress}
                />
                {/* Body */}
                <View style={nstyles.nstyles.nbody}>
                    <MapView style={styles.map}
                        // mapPadding={{ top: nstyles.Height(80), right: 0, bottom: 0, left: 0 }}
                        provider={PROVIDER_GOOGLE}
                        showsMyLocationButton={true}
                        ref={ref => this.Map = ref}
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
                            title={"V??? tr?? g???i"}
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
                            onPress={this.chonViTri}
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
                                        {'V??? tr?? ????nh d???u'}
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
                                        {'Ch???m ????? ch???n'}
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

