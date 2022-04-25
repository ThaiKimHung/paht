import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableNativeFeedback, Alert, Button } from 'react-native'
import { sizes, colors, nstyles } from '../../../../styles'
import { Images } from '../../../images'
import { Height } from '../../../../styles/styles'

const ItemDrop = props => {
    const { _onPress = () => { },
        stContainer = {},
        stText = {},
        textTitle = '',
        textValue = '',
        icon = null,
        stTouch = {},
        refin,
        onPressItem = () => { Alert("vao tout") },
    } = props
    return (
        <View style={[{ flex: 1 }, stContainer]} >
            <Text style={[{
                fontSize: sizes.sizes.sText12,
                lineHeight: sizes.reSize(15),
            }]}>{textTitle}</Text>
            <TouchableOpacity onPress={_onPress}
                style={[{
                    backgroundColor: colors.colorGrayTwo,
                    borderWidth: 1, borderRadius: 2, padding: 11, borderColor: colors.brownGreyTwo,
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5
                }, stTouch]}>
                <Text ref={refin} numberOfLines={1} style={[{ fontSize: sizes.sizes.sText14, flex: 1 }, stText]}>{textValue}</Text>
                <Image source={icon ? icon : Images.icDropDown} style={[nstyles.nIcon14, { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
            </TouchableOpacity>
        </View>
    )

}
const stTytle = StyleSheet.create({
    viewCheckBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -150,
        backgroundColor: 'white',
        top: 55,
        ...nstyles.nstyles.shadow,
        borderRadius: 2,
    },
})

export default ItemDrop
