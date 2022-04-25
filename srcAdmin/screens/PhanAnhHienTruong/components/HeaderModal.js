import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { nstyles } from '../../../../styles/styles'
import { sizes, colors } from '../../../../styles'
import { Images } from '../../../images'
import Utils from '../../../../app/Utils'

const HeaderModal = props => {
    const {
        _onPress = () => { },
        stContainer = {},
        stIcon = {},
        stTitle = {},
        icon = undefined,
        title = {}
    } = props
    const { nrow, nmiddle } = nstyles
    return (
        <View style={[nrow, { padding: 15 }, stContainer]}>
            <TouchableOpacity onPress={_onPress} >
                <Image source={icon ? icon : Images.icBack}
                    style={[nstyles.nIcon20, { tintColor: colors.peacockBlue }, stIcon]} resizeMode='contain' />
            </TouchableOpacity>
            <Text style={[{
                fontSize: sizes.sizes.sText20, lineHeight: sizes.sizes.sText24,
                color: colors.peacockBlue, textAlign: 'center', alignSelf: 'center', flex: 1, marginRight: 20,
            }, stTitle]}>
                {title}
            </Text>
        </View>
    )
}

export default HeaderModal
