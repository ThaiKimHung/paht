

import React from 'react'
import { View, Text, TextInput, StyleSheet, Image } from 'react-native'
import { colors } from './styles'
import { ImagesChat } from './Images'

const TextInputChat = (props) => {
    const { style, containerStyle, onChangeText, ...propstype } = props
    return (
        <View style={[configstyle.container, { containerStyle }]}>
            <View style={[configstyle.icLeft, {}]} >
                <Image source={ImagesChat.icSearch} style={[configstyle.icIconLeft, { tintColor: 'rgba(177,177,177,1)', }]}></Image>
            </View>
            <TextInput
                style={[configstyle.input, style]} {...propstype}
                onChangeText={onChangeText} />
        </View>
    )
}
const configstyle = StyleSheet.create({
    input: {
        flex: 1,
        padding: 0,
        fontSize: 16,
        lineHeight: 22,
        color: 'black',
        backgroundColor: 'transparent',
    },
    icLeft: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    icIconLeft: {
        tintColor: 'black',
        width: 20,
        height: 20

    },
    container: {
        flexDirection: 'row',
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 10,
        // borderColor: colors.black_20,
        // borderWidth: 1,
        backgroundColor: 'rgba(229,229,229,0.5)',
    }

})
export default TextInputChat
