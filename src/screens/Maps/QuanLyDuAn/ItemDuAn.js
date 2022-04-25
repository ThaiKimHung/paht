import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import { Images } from '../../../images'
import { getCurrentPosition } from '../BanDoTienIch/FuntionHandler'
import openMap from 'react-native-open-maps';


const ItemDuAn = (props) => {
    const { data, onPress, styleItem, colorStatus } = props
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
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}
            style={[stItemDuAn.container, styleItem]}>
            <View style={[stItemDuAn.status, { backgroundColor: data?.MaMauTinhTrang || colors.grayLight }]}>
                <Text style={stItemDuAn.stMaDuAn}>Mã dự án: {data?.MaDA}</Text>
                <Text style={stItemDuAn.stTinhTrang}>{data?.TenTinhTrang}</Text>
            </View>
            <View style={{ flex: 1, padding: 5 }}>
                <Text style={{ fontWeight: 'bold', textAlign: 'justify', fontSize: reText(15) }}>{data?.TenDuAn}</Text>
                <Text style={{ fontSize: reText(13), textAlign: 'justify', marginTop: 5 }}>Chủ đầu tư: {data?.TenChuDauTu}</Text>
                <Text style={{ fontSize: reText(13), textAlign: 'justify', marginTop: 5 }}>Nguồn vốn: {data?.TenNguonVon}</Text>
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                    <Image source={Images.icMap} style={nstyles.nIcon18} resizeMode='contain' />
                    <Text style={{ fontSize: reText(12), flex: 1, paddingLeft: 5, textAlign: 'justify' }}>{data?.DiaDiem}</Text>
                </View>
                <View style={{ borderTopWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between', borderTopColor: colors.grayLight, marginTop: 5, alignItems: 'center' }}>
                     <TouchableOpacity
                        style={{ justifyContent: 'center', padding: 5, flex: 1, alignItems: 'center' }}
                        onPress={() => Utils.goscreen({ props }, 'Modal_DSCameraDuAn')} >
                        <Image source={Images.icCameraNew} style={[nstyles.nIcon20,{tintColor: '#0089FF' }]} resizeMode='contain' />
                        <Text style={{ fontSize: reText(12), textAlign: 'justify', marginTop: 2 }}>Camera</Text>
                    </TouchableOpacity>
                    <View style={stItemDuAn.drawLine} />
                    <TouchableOpacity
                        style={{ justifyContent: 'center', padding: 5, flex: 1, alignItems: 'center' }}
                        onPress={() => openMapDirection()} >
                        <Image source={Images.icRowMap} style={nstyles.nIcon20} resizeMode='contain' />
                        <Text style={{ fontSize: reText(12), textAlign: 'justify', marginTop: 2 }}>Chỉ đường</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}
const stItemDuAn = StyleSheet.create({
    container: {
        // padding: 8,
        backgroundColor: colors.white,
        marginTop: 15,
        ...nstyles.shadown, borderRadius: 10
    },
    status: { borderTopLeftRadius: 10, padding: 4, borderTopRightRadius: 10, flexDirection: 'row' },
    stMaDuAn: { fontSize: reText(12), paddingLeft: 5, textAlign: 'justify', color: colors.white, fontWeight: 'bold', flex: 1 },
    stTinhTrang: { fontSize: reText(12), paddingLeft: 5, textAlign: 'right', color: colors.white, fontWeight: 'bold' },
    drawLine: { width: 1, backgroundColor: colors.black_20, height: '100%' },

})

export default ItemDuAn
