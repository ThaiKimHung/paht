import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { nstyles, colors } from '../../../../styles'
import styles from '../styles'
const DropDown = props => {
    var {
        onTouchEn,
        data = [],
        onPressItem,
        Ten,
        px,
        py,
        indexX = 1,
        isOn = 1
    } = props
    _renderItem = (item, index) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => onPressItem(item, index)}
            >
                <Text style={{ padding: 10, color: indexX == index ? colors.peacockBlue : colors.black_80 }}>{item[`${Ten}`]}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View
            onTouchEnd={onTouchEn}
            style={{
                position: 'absolute', zIndex: 5,
                backgroundColor: 'transparent', top: 0,
                left: 0, right: 0, bottom: 0,
            }}>
            <View
                style={[nstyles.nstyles.shadow, {
                    position: 'absolute', zIndex: 5,
                    backgroundColor: colors.white, top: py - 5,
                    left: px - 10, right: isOn == 1 ? 15 : nstyles.Width(50), bottom: nstyles.Height(100) - (py + 200),
                    borderRadius: 2,
                }]}>
                <ScrollView>
                    {data.map(this._renderItem)}
                </ScrollView>
            </View>
        </View>
    )

}

export default DropDown
