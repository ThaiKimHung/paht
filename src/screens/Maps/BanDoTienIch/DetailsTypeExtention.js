import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useSelector } from 'react-redux'
import Utils from '../../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../../components'
import ImageCus from '../../../../components/ImageCus'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import { Images } from '../../../images'

const DetailsTypeExtention = (props) => {
    const { isLandscape } = useSelector(state => state.theme)
    const { DanhSachLoaiTienIch = [], TenNhom = '' } = Utils.ngetParam({ props }, 'Extention', {})

    console.log('danh sach loai tien ich', DanhSachLoaiTienIch)
    const onDetailsMap = (item) => {
        Utils.goscreen({ props }, 'DetailsExtensionMap', { TypeExtention: item })
    }

    const renderListExtention = () => {
        return DanhSachLoaiTienIch.map((item, index) => {
            return (
                <TouchableOpacity key={index} onPress={() => { onDetailsMap(item) }} style={stDetailsTypeExtention.item}>
                    <ImageCus defaultSourceCus={Images.icExtension} source={{ uri: item?.AnhDaiDien }} style={nstyles.nIcon30} resizeMode='contain' />
                    <Text style={{ flex: 1, paddingLeft: 10 }}>{item?.TenLoai}</Text>
                </TouchableOpacity>
            )
        })
    }

    return (
        <View style={stDetailsTypeExtention.container}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback(this)}
                iconLeft={Images.icBack}
                title={TenNhom || 'Danh sách chi tiết'}
                styleTitle={{ color: colors.white }}
            />
            <View style={stDetailsTypeExtention.body}>
                <ScrollView contentContainerStyle={{ padding: 10 }}>
                    {DanhSachLoaiTienIch.length > 0 ?
                        renderListExtention()
                        : null}
                </ScrollView>
            </View>
        </View>
    )
}

export default DetailsTypeExtention

const stDetailsTypeExtention = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome
    },
    body: { flex: 1 },
    item: {
        ...nstyles.shadow,
        padding: 10, backgroundColor: colors.white,
        marginTop: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center'
    }
})
