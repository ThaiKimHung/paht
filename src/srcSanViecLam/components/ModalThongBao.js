import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native'
import Utils from '../../../app/Utils';
import ImageCus from '../../../components/ImageCus'
import TextApp from '../../../components/TextApp'
import { colors } from '../../../styles'
import { colorsSVL } from '../../../styles/color'
import { reText } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'
import { ImagesSVL } from '../images'
import ButtonSVL from './ButtonSVL';

const ModalThongBao = (props) => {
    const opacity = new Animated.Value(0)
    const title = Utils.ngetParam({ props: props }, 'title', 'titile')
    const titleButton = Utils.ngetParam({ props: props }, 'titleButton', 'đóng')
    const onThaoTac = Utils.ngetParam({ props: props }, 'onThaoTac', () => { })
    useEffect(() => {
        _startAnimation(0.4)
    }, [])

    const _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 200
            }).start();
        }, 320);
    };

    const _goback = () => {

        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                onThaoTac();
            });
        }, 100);
    }

    return (
        <View style={stModalThongBao.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ImageCus source={ImagesSVL.icCongratulation} style={{ width: 120, height: 140, marginBottom: 15 }} resizeMode='contain' />
                <TextApp style={stModalThongBao.txtTiTle}>
                    {title}
                </TextApp>
            </View>

            <ButtonSVL
                onPress={_goback}
                text={titleButton}
                colorText={colorsSVL.white}
                style={{ marginHorizontal: 12, borderRadius: 18, marginTop: 40 }}
            />
        </View>
    )
}

const stModalThongBao = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 15,
    },
    txtTiTle: {
        fontSize: reText(16),
        textAlign: 'center'
    },
})

export default ModalThongBao
