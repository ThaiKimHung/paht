import React, { Component } from 'react';
import {
    StyleSheet, Text, TouchableOpacity, Image,
    View, Platform
} from 'react-native';
import { colors } from '../../styles/color';
import { sizes } from '../../styles/size';
import { nwidth, nstyles, stUser } from '../../styles/styles';

/*
    - shadow (bool):
      + true: button có đổ bóng
      + false: button không có đổ bóng
*/

const ButtonWithImage = (props) => {
    const { onPress, text, image } = props;
    return (
        <TouchableOpacity
            style={[nstyles.nrow, stUser.containerInput, { flex: 1, paddingVertical: 10, alignItems: 'center' }]}
            onPress={onPress}>
            <Image
                source={image}
                resizeMode="contain"
                style={sizes.nImgSize24} />
            <Text
                style={{
                    color: colors.black_facebook, fontSize: sizes.sText14,
                    marginLeft: 8, fontWeight: '600'
                }}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}


export default ButtonWithImage;
