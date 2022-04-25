import React, { Component, } from 'react'
import { Text, View, StyleSheet } from 'react-native'
// const LONGITUDE = 106.6228077;
// const LATITUDE = 10.8123274;
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { reSize } from '../../../styles/size';
import { nheight, nwidth } from '../../../styles/styles';
import { Images } from '../../images';


const MapShow = (props) => {
    const { long, lat, titleText, description, styleMap } = props;
    const LATITUDE_DELTA = 0.00922;
    let LONGITUDE_DELTA = () => LATITUDE_DELTA * nwidth() / nheight();
    const Location = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA()
    }
    return (
        <View>
            <View style={[styles.container, { styleMap }]}>
                <MapView
                    style={styles.map}
                    initialRegion={Location}
                    region={Location}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    provider={PROVIDER_GOOGLE}
                >
                    <Marker
                        coordinate={{
                            latitude: lat,
                            longitude: long,
                        }}
                        image={Images.icLocationRed}
                        title={titleText}
                        description={description}
                        calloutOffset={{ x: -1, y: -10 }}
                        calloutAnchor={{ x: 0.5, y: -0.4 }}
                    />
                </MapView>
            </View>
        </View>
    )

}

export default MapShow
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        height: reSize(400),
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

});