import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import ClusteredMapView from '../ThuatToan/ClusteredMapView';
import { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'
import { reSize, reText } from '../../../../styles/size';
import { colors } from '../../../../styles';
import { nheight, nstyles, nwidth } from '../../../../styles/styles';
import { Images } from '../../../images';
import { appConfig } from '../../../../app/Config';
import Utils from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import { IsLoading } from '../../../../components';
import ItemExtentionLocation from './ItemExtentionLocation';

let LATITUDE_DELTA = () => 200 / nheight();
let LONGITUDE_DELTA = () => LATITUDE_DELTA() * nwidth() / nheight();

const MapExtentions = (props) => {
    const [dataMap, setDataMap] = useState([])
    const [selectedMarker, setSelectedMarker] = useState('')
    const [initRegion, setInitRegion] = useState({
        ...appConfig.defaultRegion,
        latitudeDelta: LATITUDE_DELTA(),
        longitudeDelta: LONGITUDE_DELTA()
    })
    const refLoading = React.useRef(null)

    const map = React.useRef(null)

    useEffect(() => {
        console.log('props change effect', props.dataMap)
        setDataMap(props.dataMap)
    }, [props.dataMap])

    const onLoadMapped = () => {
        if (dataMap.length > 0) {
            refLoading.current.show()
            let region = {
                latitude: dataMap[0].Lat,
                longitude: dataMap[0].Long,
                latitudeDelta: LATITUDE_DELTA(),
                longitudeDelta: LONGITUDE_DELTA(),
            }
            Utils.nlog('region', region)
            map.current.mapview.animateToRegion({ ...region }, 500)
            refLoading.current.hide()
        }
    }

    const _setRejon = async (e, item) => {
        Utils.nlog("gia tri item", item)
        let region = {
            latitude: item.Lat,
            longitude: item.Long,
            latitudeDelta: 0.0000001,
            longitudeDelta: 0.0000001,
        }
        Utils.nlog('region', region)
        setSelectedMarker(item)
        map.current.mapview.animateToRegion({ ...region }, 500)
    }

    const _onPressMap = async ({ coordinate, position }) => {

    }

    const _renderMarker = (item, index) => {
        Utils.nlog('selectedMarker item', selectedMarker)
        Utils.nlog('selectedMarker item', item)

        var coordinate = {
            latitude: item.Lat,
            longitude: item.Long,
        };
        return (
            <Marker
                key={index}
                onPress={(e) => _setRejon(e, item)}
                coordinate={coordinate}
                calloutOffset={{ x: -1, y: 10 }}
                calloutAnchor={{ x: 0.5, y: 0.4 }}
            // style={{ width: 100, height: 100 }}
            >
                <Image source={selectedMarker[props?.keyIdMarker ? props.keyIdMarker : 'IdTienIch'] == item[props?.keyIdMarker ? props.keyIdMarker : 'IdTienIch'] ? Images.icLocationRed : Images.icLocationBlue} resizeMode='contain' style={[nstyles.nIcon24]} />
            </Marker>
        )
    }

    const renderCluster = (cluster, onPress) => {
        console.log('ClusteredMapView Cluser ID', cluster)
        const pointCount = cluster.pointCount,
            coordinate = cluster.coordinate,
            clusterId = cluster.clusterId

        return (
            <Marker key={clusterId} coordinate={coordinate} onPress={onPress}>
                <View style={stMapExtentions.cluster}>
                    <Text style={[{ color: colors.white, fontSize: reText(10), fontWeight: 'bold' }]}>
                        {pointCount > 99 ? '99+' : pointCount}
                    </Text>
                </View>
            </Marker>
        )
    }

    console.log('props change', dataMap)

    return (
        <View style={{ flex: 1 }}>
            <ClusteredMapView
                onMapReady={() => onLoadMapped()}
                style={{ flex: 1 }}
                ref={map}
                initialRegion={initRegion}
                style={StyleSheet.absoluteFill}
                showsUserLocation={true}
                // provider={PROVIDER_GOOGLE}
                data={dataMap}
                renderMarker={_renderMarker}
                renderCluster={renderCluster}
                onRegionChangeComplete={() => { }}
                zoomEnabled={true}
                onPress={_onPressMap}

            />
            <View style={stMapExtentions.selectedMark}>
                {
                    selectedMarker != '' ? <ItemExtentionLocation
                        onPress={() => { Utils.goscreen({ props }, 'DetailsLocations', { data: selectedMarker }) }}
                        data={selectedMarker}
                        AnhDaiDien={props.AnhDaiDien} /> : null
                }
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

const stMapExtentions = StyleSheet.create({
    cluster: {
        backgroundColor: colors.redStar, width: reSize(25), height: reSize(25), borderWidth: 1, borderColor: colors.white,
        padding: 2, borderRadius: reSize(25) / 2, alignItems: 'center', justifyContent: 'center'
    },
    header: { position: 'absolute', top: 0, left: 0, right: 0 },
    selectedMark: {
        position: 'absolute', top: 60, left: 0, right: 0
    }
})

export default MapExtentions
