


import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity, Image, Platform,
} from 'react-native';
import MapView, {
    Marker,

    ProviderPropType,
    PROVIDER_GOOGLE,
} from 'react-native-maps';

import { nstyles, sizes, colors } from '../../../styles';
import { Images } from '../../images';
import Utils from '../../../app/Utils';
import { Width } from '../../../styles/styles';
import openMap from 'react-native-open-maps';
import * as Animatable from 'react-native-animatable';

const ASPECT_RATIO = nstyles.nwidth() / nstyles.nheight();
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class MapChiTietPA extends Component {
    constructor(props) {
        super(props);
        this.mark = false
        this.count = 1
        this.dataItem = Utils.ngetParam(this, "dataItem", {})
        this.state = {
            cnt: 0,
            region: {
                latitude: this.dataItem.ToaDoX || this.dataItem.Lat,
                longitude: this.dataItem.ToaDoY || this.dataItem.Lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            data: { name: 1 },
            isShow: false,
            idMarkSelect: '',
            dataItem: {}
        };
    }

    _setRejon = async (e, item) => {
        Utils.nlog("gia tri e", e.nativeEvent)
        // Utils.nlog("gia tri e", e.nativeEvent)
        await this.setState({
            isShow: true,
        })
    }
    render() {
        const { region, isShow = false } = this.state;
        var coordinate = {
            latitude: region.latitude,
            longitude: region.longitude,
        };
        const { nrow } = nstyles.nstyles;
        return (
            <View style={[{ backgroundColor: colors.backgroundModal, flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={() => Utils.goback(this)} />
                <MapView
                    onMarkerPress={this._setRejon}
                    onPress={() => this.setState({ isShow: false })}
                    provider={PROVIDER_GOOGLE}
                    style={{
                        position: 'absolute', top: 60, bottom: 60,
                        left: 30, right: 30, zIndex: 10, backgroundColor: colors.white
                    }}
                    region={this.state.region}
                    zoomTapEnabled={true}
                >
                    <Marker
                        coordinate={coordinate}
                        calloutOffset={{ x: -1, y: 10 }}
                        calloutAnchor={{ x: 0.5, y: 0.4 }}
                        image={Images.icLocationRed}
                        title={this.dataItem.TieuDe}
                    >
                    </Marker>
                </MapView>
                <View style={[{
                    position: 'absolute',
                    left: 30, right: 30,
                    top: 60,
                    backgroundColor: colors.white,
                    zIndex: 120,
                }]} >
                    <View style={[nrow, { paddingHorizontal: nstyles.khoangcach, alignItems: 'center', flex: 1 }]}>
                        <TouchableOpacity style={[nstyles.nstyles.nIcon40, { justifyContent: 'center' }]} onPress={() => Utils.goback(this)}>
                            <Image source={Images.icBack} style={[nstyles.nstyles.nIcon20, { tintColor: 'black' }]} resizeMode='contain' />
                        </TouchableOpacity>
                        <Text
                            numberOfLines={2}
                            style={{
                                fontSize: sizes.reText(17), color: colors.black_80,
                                fontWeight: '600', marginLeft: 10, textAlign: 'center', flex: 1,
                            }}>{this.dataItem.TieuDe}</Text>
                        <View style={nstyles.nstyles.nIcon40} />
                    </View>
                </View>
                {
                    isShow == true ? <Animatable.View
                        animation={'fadeInRight'}
                        style={{ bottom: 60, right: 30, zIndex: 100, position: 'absolute' }}>
                        <View style={[nrow, { width: Width(40), backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 30 }]}>
                            <TouchableOpacity
                                style={{ width: 60, height: 60, justifyContent: 'center', }}
                                onPress={() => openMap({
                                    start: "My Location",
                                    zoom: 300,
                                    travelType: 'drive',
                                    end: `${this.dataItem.DiaDiem}`,
                                    provider: Platform.OS == 'android' ? 'google' : 'apple'
                                })} >
                                <Image source={Images.icRowMap} style={nstyles.nstyles.nIcon20} resizeMode='contain' />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: 60, height: 60, justifyContent: 'center', }}
                                onPress={() => openMap({
                                    query: `${this.dataItem.DiaDiem}`,
                                    zoom: 300,
                                    provider: Platform.OS == 'android' ? 'google' : 'apple'
                                })} >
                                <Image source={Images.icGoogleMap} style={nstyles.nstyles.nIcon20} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                    </Animatable.View> : <View />
                }
            </View>
        );
    }
}

MapChiTietPA.propTypes = {
    provider: ProviderPropType,
};

export default MapChiTietPA;