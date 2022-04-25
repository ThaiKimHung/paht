import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { Width } from '../../styles/styles'
import { sizes } from '../../styles/size'
const ButtonCus = props => {
    const {
        stContainerR = {},
        stTouch = {},
        textTitle = '',
        stText = {},
        onPressB = () => { },
        disabled = false
    } = props
    return (
        <TouchableOpacity disabled={disabled} onPress={onPressB} style={[{
            paddingVertical: 12,
            backgroundColor: colors.colorGolden, borderRadius: 30,
            borderWidth: 1, borderColor: colors.white, alignItems: 'center', marginTop: 20, alignSelf: 'center', paddingHorizontal: 10, minWidth: Width(35)
        }, stContainerR]}>
            <Text numberOfLines={1} style={[{ color: colors.white, fontSize: sizes.sText14, fontWeight: 'bold', }, stText]}>{`${textTitle}`}</Text>
        </TouchableOpacity>

    )
}
export default ButtonCus
