import React, { Component } from 'react';
import {
    StyleSheet, Text, TouchableOpacity, Platform, View, Image
} from 'react-native';
import { colors } from '../../styles/color';
import { sizes, reText } from '../../styles/size';
import { nColors, nstyles } from '../../styles/styles';
import LinearGradient from 'react-native-linear-gradient'
import Utils from '../../app/Utils';

/*
    - style:
      + ...style Dùng cho contain button
      + color, fontSize, fontWeight dùng cho Text.
    - shadow (bool):
      + true: button có đổ bóng
      + false: button không có đổ bóng
*/

const ButtonCom = (props) => {

    let {
        icon = null,
        sizeIcon = 45,
        onPress,
        text = 'Button',
        shadow = true,
        disabled = false,
        Linear = false,
        txtStyle = {},
        style = {},
        styleTouchable = {},
        colorChange = colors.colorLinearButton,
        subText = '',
        theme,
        iconLeft = null,
    } = props;
    let { backgroundColor = colors.white } = style;
    let shadowStyle = {}
    if (shadow == true) {
        shadowStyle = stButtonCom.containShadow;
    }
    // Utils.nlog("GIA TRI BACK GROUND", backgroundColor)
    return (
        <TouchableOpacity
            {...props}
            activeOpacity={0.6}
            disabled={disabled}
            style={[{ ...styleTouchable, ...style, ...shadowStyle },
            { paddingVertical: 0, paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }]}
            onPress={onPress}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={Linear ? colorChange : theme.colorLinear.color}
                style={[stButtonCom.containerBtn, style,
                { marginVertical: 0, marginHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>
                {iconLeft != null ? < Image source={iconLeft} style={{ width: 20, height: 20, tintColor: colors.white, marginRight: 3 }} /> : null}
                <Text style={[nstyles.ntext, { color: colors.white, fontSize: reText(14), lineHeight: reText(20), fontWeight: 'bold' }, txtStyle]}>
                    {text}
                </Text>
                {subText == '' ? null : <Text style={{ fontSize: reText(10), marginTop: 4, color: colors.whiteTwo }}>{subText}</Text>}
                {
                    !icon ? null :
                        <View style={[{
                            position: 'absolute', top: 0, right: 0, bottom: 0, width: 50,
                            backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'
                        }]}>
                            <Image source={icon} style={{ width: sizeIcon, height: sizeIcon }} resizeMode='stretch' />
                        </View>
                }
            </LinearGradient>
        </TouchableOpacity>
    );
}
const stButtonCom = StyleSheet.create({
    containerBtn: {
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 24
    },
    containShadow: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: Platform.OS == "android" ? 6 : 0
    }
});

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(ButtonCom, mapStateToProps, true)
