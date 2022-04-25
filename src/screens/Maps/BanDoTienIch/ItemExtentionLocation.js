import React, { useState, useEffect } from 'react'
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import ImageCus from '../../../../components/ImageCus'
import { colors } from '../../../../styles'
import { nstyles } from '../../../../styles/styles'
import { Images } from '../../../images'
import openMap from 'react-native-open-maps';
import { appConfig } from '../../../../app/Config'
import { getCurrentPosition } from './FuntionHandler'

const ItemExtentionLocation = (props) => {
    const { data = '', onPress = () => { }, keyComp } = props
    // console.log('KeyComp', keyComp)
    let AnhDaiDien = ''
    if (data?.AnhDaiDien) {
        AnhDaiDien = data?.AnhDaiDien
    } if (data?.Icon) {
        AnhDaiDien = appConfig.domain + data?.Icon
    } else {
        AnhDaiDien = data?.AnhDaiDienLoaiTienIch
    }

    const openMapDirection = () => {
        getCurrentPosition({ props }, (latlng) => {
            console.log('[LOG] lat long callback', latlng)
            openMap({
                start: `${latlng?.latitude},${latlng?.longitude}`,
                zoom: 16,
                travelType: 'drive',
                end: `${data?.Lat},${data?.Long}`,//`${data?.DiaDiem}`,
                provider: Platform.OS == 'android' ? 'google' : 'apple',
            })
        })
    }


    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress} key={keyComp} style={stItemExtentionLocation.detailsMarker}>
            <ImageCus defaultSourceCus={Images.icExtension} source={{ uri: AnhDaiDien }} resizeMode='contain' style={[nstyles.nIcon40, { marginRight: 10 }]} />
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{data?.TenTienIch ? data?.TenTienIch : '-'}</Text>
                <Text style={{ marginVertical: 5 }}><Text style={{ fontWeight: 'bold' }}>Số điện thoại:</Text> {data?.SDT ? data.SDT : '-'}</Text>
                <Text style={{ paddingRight: 5, textAlign: 'justify' }}><Text style={{ fontWeight: 'bold' }}>Địa chỉ:</Text> {data?.DiaDiem ? data?.DiaDiem : '-'}</Text>
            </View>
            <View style={stItemExtentionLocation.drawLine} />
            <TouchableOpacity
                style={{ justifyContent: 'center', padding: 10 }}
                onPress={() => openMapDirection()} >
                <Image source={Images.icRowMap} style={nstyles.nIcon30} resizeMode='contain' />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default ItemExtentionLocation

const stItemExtentionLocation = StyleSheet.create({
    detailsMarker: {
        flexDirection: 'row', backgroundColor: colors.white, padding: 10,
        borderRadius: 10, margin: 5, ...nstyles.shadow
    },
    drawLine: { width: 1, backgroundColor: colors.black_20, height: '100%' },
})
