import React, { Component } from 'react';
import {
    TouchableOpacity, View,
    Image, StyleSheet, Text
} from 'react-native';
import Utils from '../../../../../app/Utils';
import { reSize, reText } from '../../../../../styles/size';
import { colors } from '../../../../../styles';
import { nstyles } from '../../../../../styles/styles';

export const BtnViTri = (props) => {

    var {
        onPress = () => { Utils.nlog('onPress') },
        source = Images.icHere,
        text = 'Hiện tại',
    } = props;

    var {
        stViewBtn,
        stText
    } = styles;
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.5}>
            <View style={stViewBtn}>
                <Image
                    source={source}
                    resizeMode={'contain'}
                    style={{
                        width: reSize(15), height: reSize(15),
                        tintColor: colors.colorBlueP
                    }} />
                <Text style={[stText, { color: colors.colorBlueP }]}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    stText: {
        marginLeft: 8,
        fontSize: reText(15),
        color: colors.colorGrayText
    },
    stViewBtn: {
        ...nstyles.nrow,
        ...nstyles.nmiddle,
        borderColor: colors.colorBlueP,
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 4,
    }
})