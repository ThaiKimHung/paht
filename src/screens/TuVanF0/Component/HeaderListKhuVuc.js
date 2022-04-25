import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { nGlobalKeys } from '../../../../app/keys/globalKey'
import Utils from '../../../../app/Utils'
import ImageCus from '../../../../components/ImageCus'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import { Images } from '../../../images'

const HeaderListKhuVuc = props => {
    const LogoAppHome = Utils.getGlobal(nGlobalKeys.LogoAppHome, '')
    const { onChange, dataList = [], keyView = '', keyID = '', valueIdTongHop = -1 } = props
    const [itemSelected, setItemSelected] = useState(props?.itemSelected || '')
    const { colorLinear } = useSelector(state => state.theme)
    const [showNext, setShowNext] = useState(1)

    useEffect(() => {
        if (props?.itemSelected != itemSelected) {
            setItemSelected(props?.itemSelected)
        }
    }, [props?.itemSelected])

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => onChange(item)} key={index} activeOpacity={0.5} style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
                <Text style={{
                    color: item[keyID] == itemSelected?.[keyID] ? colorLinear.color[0] : colors.black_40,
                    fontSize: reText(14),
                    fontWeight: item[keyID] == itemSelected?.[keyID] ? 'bold' : 'normal'
                }}>{item[keyView]}
                </Text>
            </TouchableOpacity>
        )
    }
    // HÀM XỬ LÝ ẨN HIỆN MŨI TÊN CHUYÊN MỤC
    const _handleScroll = (event) => {
        // console.log('event.nativeEvent.contentOffset', event.nativeEvent)
        let { contentSize, contentOffset, layoutMeasurement } = event.nativeEvent
        const delta = contentOffset.x + layoutMeasurement.width - contentSize.width
        //1: hien next: ,-1:hien back, 0: hien 2 nut
        if (contentOffset.x <= 0) {
            //an back
            setShowNext(1)
            return;
        }
        if ((delta < 5 && delta > 0) || (delta < 0 && delta > -5) || delta == 0) {
            //an next
            setShowNext(-1)
            return;
        }
        setShowNext(0)
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingVertical: 5 }}>
            <TouchableOpacity onPress={() => onChange({ [keyID]: valueIdTongHop, [keyView]: 'Tổng hợp' })} activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <ImageCus defaultSourceCus={Images.icNewss} source={LogoAppHome ? { uri: LogoAppHome } : Images.icNewss} style={nstyles.nIcon20} resizeMode='cover' />
                <Text style={{
                    color: itemSelected?.[keyID] == valueIdTongHop || !itemSelected ? colorLinear.color[0] : colors.black_40,
                    fontSize: reText(14), paddingLeft: 5,
                    fontWeight: itemSelected?.[keyID] == valueIdTongHop || !itemSelected ? 'bold' : 'normal'
                }}>
                    {'Tổng hợp'}
                </Text>
            </TouchableOpacity>
            <View style={stHeaderListKhuVuc.rawLine}></View>
            {
                (showNext == -1 || showNext == 0) &&
                <View style={{ width: 20, alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 5, borderBottomRightRadius: 5, opacity: 0.5 }}>
                    <Text style={{ color: colors.colorTextSelect, fontWeight: 'bold', fontSize: reText(18) }}>{'«'}</Text>
                </View>
            }
            <ScrollView showsHorizontalScrollIndicator={false} scrollEventThrottle={10} horizontal onScroll={_handleScroll} style={{}}>
                {dataList && dataList?.length > 0 && dataList.map(renderItem)}
            </ScrollView>
            {
                (showNext == 1 || showNext == 0) &&
                <View style={{ width: 20, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, opacity: 0.5 }}>
                    <Text style={{ color: colors.colorTextSelect, fontWeight: 'bold', fontSize: reText(18) }}>{'»'}</Text>
                </View>
            }
        </View >
    )
}

const stHeaderListKhuVuc = StyleSheet.create({
    btnTongHop: {

    },
    rawLine: {
        width: 1, height: '100%',
        backgroundColor: colors.black_20, marginHorizontal: 5, alignSelf: 'center'
    }
})

export default HeaderListKhuVuc
