


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

// import { Width } from '../../styles/styles';
import openMap from 'react-native-open-maps';
import * as Animatable from 'react-native-animatable';
import Utils from '../../../../app/Utils';

//nstyles
import { Images } from '../../../images';
import { nstyles, colors, sizes } from '../../../../styles';
import { Width } from '../../../../styles/styles';

const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = () => LATITUDE_DELTA * nstyles.nwidth() / nstyles.nheight();

class MapChiTietPA extends Component {
    constructor(props) {
        super(props);
        this.mark = false
        this.count = 1
        this.dataItem = Utils.ngetParam(this, "dataItem", {})
        this.state = {
            cnt: 0,
            region: {
                latitude: this.dataItem.ToaDoX,
                longitude: this.dataItem.ToaDoY,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA(),
            },
            data: { name: 1 },
            isShow: false,
            idMarkSelect: '',
            dataItem: {}
        };
    }
    componentDidMount() {
        Utils.nlog("danh ach data", this.dataItem)
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
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.black_60,
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
                    backgroundColor: colors.colorHeaderApp,
                    zIndex: 120,
                }]} >
                    <View style={[nrow, { paddingHorizontal: nstyles.khoangcach, alignItems: 'center', flex: 1 }]}>
                        <TouchableOpacity style={[nstyles.nstyles.nIcon40, { justifyContent: 'center' }]} onPress={() => Utils.goback(this)}>
                            <Image source={Images.icBack} style={[nstyles.nstyles.nIcon20]} resizeMode='contain' />
                        </TouchableOpacity>
                        <Text
                            numberOfLines={2}
                            style={{
                                fontSize: sizes.reText(17), color: colors.white,
                                fontWeight: '600', marginLeft: 10, textAlign: 'center', flex: 1
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

