

import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from '../styles'

import { ImagesChat } from '../Images';

const TextInputSearch = React.forwardRef((props, ref) => {
    // const [onfocus, setonfocus] = useState(false);
    const { style, containerStyle, onChangeText, value, isFocus = false, onClear, ...propstype } = props;
    const _onCleardata = () => {
        ref.current.clear()
        onClear();
    }
    return (
        <View style={[configstyle.container, { containerStyle }]}>
            <View style={[configstyle.icLeft, {}]} >
                <Image source={ImagesChat.icSearch}
                    resizeMode={'cover'}
                    style={[configstyle.icIconLeft, { tintColor: colors.black_50 }]}></Image>
            </View>
            <TextInput
                ref={ref}
                style={[configstyle.input, style]} {...propstype}
                onChangeText={onChangeText} />
            {
                value != '' ?
                    <TouchableOpacity
                        onPress={_onCleardata}
                        style={{ height: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <Image source={ImagesChat.icCloseBlack} style={[{ width: 20, height: 20 }]}>
                        </Image>
                    </TouchableOpacity>
                    : null
            }
        </View>
    )
});

const configstyle = StyleSheet.create({
    input: {
        flex: 1,
        padding: 0,
        fontSize: 16,
        lineHeight: 20,
        color: 'black',
        backgroundColor: 'white',
    },
    icLeft: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
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
        borderColor: colors.black_20,
        borderWidth: 1,
        backgroundColor: 'white', alignItems: 'center'
    }

})
export default TextInputSearch
